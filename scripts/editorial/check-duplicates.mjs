import fs from 'node:fs/promises';
import path from 'node:path';

const rootDirectory = process.cwd();
const indexPath = path.join(
  rootDirectory,
  'editorial/content-index.json'
);
const reportPath = path.join(
  rootDirectory,
  'editorial/duplicate-report.json'
);

const stopWords = new Set([
  'a',
  'ad',
  'ai',
  'al',
  'alla',
  'alle',
  'allo',
  'anche',
  'che',
  'chi',
  'come',
  'con',
  'da',
  'dal',
  'dalla',
  'delle',
  'di',
  'e',
  'gli',
  'i',
  'il',
  'in',
  'la',
  'le',
  'lo',
  'nel',
  'nella',
  'o',
  'per',
  'piu',
  'su',
  'sul',
  'tra',
  'un',
  'una',
]);

function normalizeText(value = '') {
  if (value == null) {
    return '';
  }

  return String(value)
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .replace(/https?:\/\/(?:www\.)?lswebagency\.com/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function tokenize(value = '') {
  return new Set(
    normalizeText(value)
      .split(/[\s-]+/)
      .filter(
        (token) =>
          token.length > 2 &&
          !stopWords.has(token)
      )
  );
}

function normalizeUrl(value) {
  if (!value) {
    return null;
  }

  try {
    const parsed = new URL(
      value,
      'https://www.lswebagency.com'
    );

    return (
      parsed.pathname
        .replace(/\/+/g, '/')
        .replace(/\/$/, '') || '/'
    );
  } catch {
    return String(value)
      .split(/[?#]/)[0]
      .replace(/^https?:\/\/(?:www\.)?lswebagency\.com/i, '')
      .replace(/\/+/g, '/')
      .replace(/\/$/, '') || '/';
  }
}

function similarity(firstValue, secondValue) {
  const firstTokens = tokenize(firstValue);
  const secondTokens = tokenize(secondValue);

  if (!firstTokens.size || !secondTokens.size) {
    return {
      score: 0,
      sharedTokens: [],
    };
  }

  const sharedTokens = [...firstTokens].filter((token) =>
    secondTokens.has(token)
  );

  const union = new Set([
    ...firstTokens,
    ...secondTokens,
  ]);

  return {
    score: sharedTokens.length / union.size,
    sharedTokens,
  };
}

function groupBy(records, getKey) {
  const groups = new Map();

  for (const record of records) {
    const key = getKey(record);

    if (!key) {
      continue;
    }

    const existing = groups.get(key) || [];
    existing.push(record);
    groups.set(key, existing);
  }

  return [...groups.entries()]
    .filter(([, items]) => items.length > 1)
    .map(([value, items]) => ({
      value,
      files: items.map((item) => item.filePath),
      titles: items.map((item) => item.title),
      urls: items.map((item) => item.publicUrl),
    }));
}

const rawIndex = await fs.readFile(indexPath, 'utf8');
const index = JSON.parse(rawIndex);
const records = index.records;

const exactDuplicates = {
  slug: groupBy(records, (record) =>
    normalizeUrl(record.slug)
  ),

  publicUrl: groupBy(records, (record) =>
    normalizeUrl(record.publicUrl)
  ),

  canonical: groupBy(records, (record) =>
    normalizeUrl(record.canonical)
  ),

  focusKeyword: groupBy(records, (record) =>
    normalizeText(record.focusKeyword)
  ),

  title: groupBy(records, (record) =>
    normalizeText(record.title)
  ),

  fileName: groupBy(records, (record) =>
    normalizeText(record.fileName)
  ),
};

const possibleTitleConflicts = [];

for (let firstIndex = 0; firstIndex < records.length; firstIndex += 1) {
  for (
    let secondIndex = firstIndex + 1;
    secondIndex < records.length;
    secondIndex += 1
  ) {
    const first = records[firstIndex];
    const second = records[secondIndex];

    if (!first.title || !second.title) {
      continue;
    }

    if (
      normalizeText(first.title) ===
      normalizeText(second.title)
    ) {
      continue;
    }

    const comparison = similarity(
      first.title,
      second.title
    );

    const containment =
      normalizeText(first.title).includes(
        normalizeText(second.title)
      ) ||
      normalizeText(second.title).includes(
        normalizeText(first.title)
      );

    const isPossibleConflict =
      comparison.sharedTokens.length >= 3 &&
      (comparison.score >= 0.58 || containment);

    if (!isPossibleConflict) {
      continue;
    }

    possibleTitleConflicts.push({
      score: Number(comparison.score.toFixed(3)),
      sharedTokens: comparison.sharedTokens,
      first: {
        title: first.title,
        filePath: first.filePath,
        publicUrl: first.publicUrl,
        sourceType: first.sourceType,
      },
      second: {
        title: second.title,
        filePath: second.filePath,
        publicUrl: second.publicUrl,
        sourceType: second.sourceType,
      },
    });
  }
}

possibleTitleConflicts.sort(
  (first, second) => second.score - first.score
);

const metadataWarnings = records.flatMap((record) => {
  const warnings = [];

  if (
    record.sourceType !== 'service-page' &&
    !record.focusKeyword
  ) {
    warnings.push('MISSING_FOCUS_KEYWORD');
  }

  if (
    record.sourceType !== 'service-page' &&
    !record.imageAlt
  ) {
    warnings.push('MISSING_IMAGE_ALT');
  }

  if (
    record.publicationState ===
      'outside-active-collection' &&
    String(record.robots || '').includes('index')
  ) {
    warnings.push(
      'INDEXABLE_CONTENT_OUTSIDE_ACTIVE_COLLECTION'
    );
  }

  if (!warnings.length) {
    return [];
  }

  return [
    {
      filePath: record.filePath,
      title: record.title,
      publicUrl: record.publicUrl,
      warnings,
    },
  ];
});

const exactConflictCount = Object.values(
  exactDuplicates
).reduce(
  (total, groups) => total + groups.length,
  0
);

const report = {
  sourceIndexGeneratedAt: index.generatedAt,
  totals: {
    records: records.length,
    exactConflictGroups: exactConflictCount,
    possibleTitleConflicts:
      possibleTitleConflicts.length,
    metadataWarnings: metadataWarnings.length,
  },
  exactDuplicates,
  possibleTitleConflicts,
  metadataWarnings,
};

let previousReport = null;

try {
  previousReport = JSON.parse(
    await fs.readFile(reportPath, 'utf8')
  );
} catch (error) {
  if (error?.code !== 'ENOENT') {
    console.warn(
      'Il precedente report non è leggibile e verrà rigenerato.'
    );
  }
}

const comparablePreviousReport = previousReport
  ? Object.fromEntries(
      Object.entries(previousReport).filter(
        ([key]) => key !== 'generatedAt'
      )
    )
  : null;

const comparableNextReport = report;

const hasReportChanged =
  !previousReport ||
  JSON.stringify(comparablePreviousReport) !==
    JSON.stringify(comparableNextReport);

if (hasReportChanged) {
  await fs.writeFile(
    reportPath,
    `${JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        ...report,
      },
      null,
      2
    )}\n`,
    'utf8'
  );
}

console.log(
  hasReportChanged
    ? 'Controllo duplicati completato.'
    : 'Report duplicati invariato.'
);
console.table(report.totals);
console.log(`Report: ${path.relative(rootDirectory, reportPath)}`);

if (exactConflictCount > 0) {
  console.log(
    '\nSono presenti conflitti esatti da esaminare.'
  );
}

if (possibleTitleConflicts.length > 0) {
  console.log(
    '\nSono presenti titoli potenzialmente sovrapposti.'
  );
}
