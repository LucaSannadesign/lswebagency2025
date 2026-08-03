import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const rootDirectory = process.cwd();

const calendarPath = path.join(
  rootDirectory,
  'editorial/calendar.yml'
);

const indexPath = path.join(
  rootDirectory,
  'editorial/content-index.json'
);

const duplicateReportPath = path.join(
  rootDirectory,
  'editorial/duplicate-report.json'
);

const reportPath = path.join(
  rootDirectory,
  'editorial/calendar-conflict-report.json'
);

const trackedModes = [
  'NEW_ARTICLE',
  'UPDATE_EXISTING',
  'CONSOLIDATE',
  'SOCIAL_ONLY',
];

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
    return (
      String(value)
        .split(/[?#]/)[0]
        .replace(/^https?:\/\/(?:www\.)?lswebagency\.com/i, '')
        .replace(/\/+/g, '/')
        .replace(/\/$/, '') || '/'
    );
  }
}

function normalizeFilePath(value) {
  if (!value) {
    return null;
  }

  return String(value)
    .trim()
    .replace(/^\.\//, '')
    .replace(/\/+/g, '/');
}

function tokenize(value = '') {
  return new Set(
    normalizeText(value)
      .split(/[\s-]+/)
      .filter(
        (token) =>
          token.length > 2 && !stopWords.has(token)
      )
  );
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

  const sharedTokens = [...firstTokens]
    .filter((token) => secondTokens.has(token))
    .sort();

  const union = new Set([
    ...firstTokens,
    ...secondTokens,
  ]);

  return {
    score: sharedTokens.length / union.size,
    sharedTokens,
  };
}

function toExistingContentList(value) {
  if (Array.isArray(value)) {
    return value.filter(
      (entry) => entry && typeof entry === 'object'
    );
  }

  if (value && typeof value === 'object') {
    return [value];
  }

  return [];
}

async function fileExistsOnDisk(relativePath) {
  if (!relativePath) {
    return false;
  }

  try {
    await fs.access(path.join(rootDirectory, relativePath));
    return true;
  } catch {
    return false;
  }
}

async function readJsonIfPresent(filePath, label) {
  try {
    return JSON.parse(await fs.readFile(filePath, 'utf8'));
  } catch (error) {
    if (error?.code !== 'ENOENT') {
      console.warn(
        `${label} non è leggibile e verrà ignorato.`
      );
    }

    return null;
  }
}

const rawCalendar = await fs.readFile(calendarPath, 'utf8');
const calendar = yaml.load(rawCalendar);

if (!calendar || typeof calendar !== 'object') {
  throw new Error(
    'Il calendario YAML non contiene un oggetto valido.'
  );
}

const rawIndex = await fs.readFile(indexPath, 'utf8');
const index = JSON.parse(rawIndex);
const records = Array.isArray(index.records)
  ? index.records
  : [];

const duplicateReport = await readJsonIfPresent(
  duplicateReportPath,
  'Il report duplicati'
);

const weeks = Array.isArray(calendar.weeks)
  ? calendar.weeks
  : [];

const contentDirectory =
  calendar.articleDefaults?.contentDirectory ||
  'src/content/data/post';

const recordsByFile = new Map();
const recordsByUrl = new Map();
const recordsByFocusKeyword = new Map();
const recordsByTitle = new Map();

function pushToMap(map, key, value) {
  if (!key) {
    return;
  }

  const existing = map.get(key) || [];
  existing.push(value);
  map.set(key, existing);
}

for (const record of records) {
  const filePath = normalizeFilePath(record.filePath);

  if (filePath) {
    recordsByFile.set(filePath, record);
  }

  for (const candidateUrl of [
    record.publicUrl,
    record.slug,
    record.canonical,
  ]) {
    pushToMap(recordsByUrl, normalizeUrl(candidateUrl), record);
  }

  pushToMap(
    recordsByFocusKeyword,
    normalizeText(record.focusKeyword),
    record
  );

  pushToMap(
    recordsByTitle,
    normalizeText(record.title),
    record
  );
}

function findRecordsByUrl(url) {
  const key = normalizeUrl(url);

  if (!key) {
    return [];
  }

  const found = recordsByUrl.get(key) || [];
  const unique = new Map();

  for (const record of found) {
    unique.set(record.filePath, record);
  }

  return [...unique.values()].sort((first, second) =>
    first.filePath.localeCompare(second.filePath, 'it')
  );
}

const duplicateGroupsByFile = new Map();

for (const [groupType, groups] of Object.entries(
  duplicateReport?.exactDuplicates || {}
)) {
  if (!Array.isArray(groups)) {
    continue;
  }

  for (const group of groups) {
    for (const filePath of group.files || []) {
      pushToMap(
        duplicateGroupsByFile,
        normalizeFilePath(filePath),
        {
          groupType,
          value: group.value,
          files: [...(group.files || [])].sort(),
        }
      );
    }
  }
}

const errors = [];
const warnings = [];

function addIssue({
  severity,
  code,
  weekId,
  mode,
  message,
  filePath = null,
  url = null,
  focusKeyword = null,
  title = null,
  conflictsWith = [],
}) {
  const issue = {
    code,
    calendarId: weekId,
    mode,
    message,
    filePath: filePath || null,
    url: url || null,
    focusKeyword: focusKeyword || null,
    title: title || null,
    conflictsWith,
  };

  if (severity === 'error') {
    errors.push(issue);
  } else {
    warnings.push(issue);
  }

  return issue;
}

function describeRecord(record) {
  return {
    filePath: record.filePath,
    title: record.title || null,
    publicUrl: record.publicUrl || null,
    sourceType: record.sourceType || null,
  };
}

// Riferimenti dichiarati dal calendario, usati per intercettare
// file, slug e URL ripetuti fra voci diverse.
const calendarFileUsage = new Map();
const calendarUrlUsage = new Map();
const calendarFocusKeywordUsage = new Map();
const calendarTitleUsage = new Map();

for (const week of weeks) {
  const weekId = week?.id || null;

  if (week?.mode === 'NEW_ARTICLE' && week.article) {
    pushToMap(
      calendarFileUsage,
      normalizeFilePath(week.article.targetFile),
      { weekId, mode: week.mode, role: 'targetFile' }
    );

    pushToMap(
      calendarUrlUsage,
      normalizeUrl(week.article.targetSlug),
      { weekId, mode: week.mode, role: 'targetSlug' }
    );

    pushToMap(
      calendarFocusKeywordUsage,
      normalizeText(week.article.focusKeyword),
      { weekId, mode: week.mode, role: 'focusKeyword' }
    );

    pushToMap(
      calendarTitleUsage,
      normalizeText(week.article.title),
      { weekId, mode: week.mode, role: 'title' }
    );
  }

  for (const entry of toExistingContentList(
    week?.existingContent
  )) {
    pushToMap(
      calendarFileUsage,
      normalizeFilePath(entry.filePath),
      { weekId, mode: week?.mode, role: 'existingContent' }
    );

    pushToMap(calendarUrlUsage, normalizeUrl(entry.url), {
      weekId,
      mode: week?.mode,
      role: 'existingContent',
    });
  }
}

function otherCalendarUsages(map, key, weekId) {
  if (!key) {
    return [];
  }

  return (map.get(key) || []).filter(
    (usage) => usage.weekId !== weekId
  );
}

const checks = {
  NEW_ARTICLE: [],
  UPDATE_EXISTING: [],
  CONSOLIDATE: [],
  SOCIAL_ONLY: [],
};

async function checkNewArticle(week) {
  const weekId = week.id || null;
  const article = week.article;

  const detail = {
    calendarId: weekId,
    mode: 'NEW_ARTICLE',
    title: article?.title || null,
    targetFile: article?.targetFile || null,
    targetSlug: article?.targetSlug || null,
    focusKeyword: article?.focusKeyword || null,
    targetFileExistsOnDisk: false,
    targetFileInIndex: false,
    targetSlugInIndex: false,
    focusKeywordInIndex: false,
    titleInIndex: false,
    errors: 0,
    warnings: 0,
  };

  if (!article) {
    addIssue({
      severity: 'error',
      code: 'NEW_ARTICLE_MISSING_ARTICLE',
      weekId,
      mode: 'NEW_ARTICLE',
      message:
        'La voce NEW_ARTICLE non dichiara il blocco article.',
    });

    checks.NEW_ARTICLE.push(detail);
    return;
  }

  const targetFile = normalizeFilePath(article.targetFile);
  const targetSlug = normalizeUrl(article.targetSlug);
  const focusKeyword = normalizeText(article.focusKeyword);
  const normalizedTitle = normalizeText(article.title);

  // 1. Il file di destinazione non deve già esistere.
  detail.targetFileExistsOnDisk =
    await fileExistsOnDisk(targetFile);
  detail.targetFileInIndex = recordsByFile.has(targetFile);

  if (detail.targetFileExistsOnDisk) {
    addIssue({
      severity: 'error',
      code: 'NEW_ARTICLE_TARGET_FILE_EXISTS',
      weekId,
      mode: 'NEW_ARTICLE',
      message: `Il file di destinazione ${targetFile} esiste già nel repository.`,
      filePath: targetFile,
    });
  }

  if (detail.targetFileInIndex) {
    addIssue({
      severity: 'error',
      code: 'NEW_ARTICLE_TARGET_FILE_INDEXED',
      weekId,
      mode: 'NEW_ARTICLE',
      message: `Il file di destinazione ${targetFile} è già presente nell'inventario.`,
      filePath: targetFile,
      conflictsWith: [
        describeRecord(recordsByFile.get(targetFile)),
      ],
    });
  }

  // 2. Lo slug o URL non deve essere già indicizzato.
  const slugMatches = findRecordsByUrl(article.targetSlug);
  detail.targetSlugInIndex = slugMatches.length > 0;

  if (slugMatches.length > 0) {
    addIssue({
      severity: 'error',
      code: 'NEW_ARTICLE_SLUG_ALREADY_INDEXED',
      weekId,
      mode: 'NEW_ARTICLE',
      message: `Lo slug ${targetSlug} è già usato da un contenuto esistente.`,
      url: targetSlug,
      conflictsWith: slugMatches.map(describeRecord),
    });
  }

  // 3. La focus keyword non deve essere già presidiata.
  const keywordMatches =
    recordsByFocusKeyword.get(focusKeyword) || [];
  detail.focusKeywordInIndex = keywordMatches.length > 0;

  if (keywordMatches.length > 0) {
    addIssue({
      severity: 'error',
      code: 'NEW_ARTICLE_FOCUS_KEYWORD_ALREADY_USED',
      weekId,
      mode: 'NEW_ARTICLE',
      message: `La focus keyword "${article.focusKeyword}" è già usata da un contenuto esistente.`,
      focusKeyword: article.focusKeyword,
      conflictsWith: keywordMatches.map(describeRecord),
    });
  }

  // 4. Il titolo normalizzato non deve coincidere con un
  // contenuto esistente.
  const titleMatches =
    recordsByTitle.get(normalizedTitle) || [];
  detail.titleInIndex = titleMatches.length > 0;

  if (titleMatches.length > 0) {
    addIssue({
      severity: 'error',
      code: 'NEW_ARTICLE_TITLE_ALREADY_USED',
      weekId,
      mode: 'NEW_ARTICLE',
      message: `Il titolo "${article.title}" coincide con un contenuto esistente.`,
      title: article.title,
      conflictsWith: titleMatches.map(describeRecord),
    });
  }

  // 5. File, slug, focus keyword e titolo non devono ripetersi
  // fra le voci del calendario.
  const duplicateChecks = [
    {
      code: 'CALENDAR_TARGET_FILE_DUPLICATED',
      map: calendarFileUsage,
      key: targetFile,
      label: `Il file ${targetFile} è già dichiarato`,
      filePath: targetFile,
    },
    {
      code: 'CALENDAR_TARGET_SLUG_DUPLICATED',
      map: calendarUrlUsage,
      key: targetSlug,
      label: `Lo slug ${targetSlug} è già dichiarato`,
      url: targetSlug,
    },
    {
      code: 'CALENDAR_FOCUS_KEYWORD_DUPLICATED',
      map: calendarFocusKeywordUsage,
      key: focusKeyword,
      label: `La focus keyword "${article.focusKeyword}" è già dichiarata`,
      focusKeyword: article.focusKeyword,
    },
    {
      code: 'CALENDAR_TITLE_DUPLICATED',
      map: calendarTitleUsage,
      key: normalizedTitle,
      label: `Il titolo "${article.title}" è già dichiarato`,
      title: article.title,
    },
  ];

  for (const check of duplicateChecks) {
    const others = otherCalendarUsages(
      check.map,
      check.key,
      weekId
    );

    if (others.length === 0) {
      continue;
    }

    addIssue({
      severity: 'error',
      code: check.code,
      weekId,
      mode: 'NEW_ARTICLE',
      message: `${check.label} da ${others
        .map((usage) => `${usage.weekId} (${usage.role})`)
        .join(', ')}.`,
      filePath: check.filePath || null,
      url: check.url || null,
      focusKeyword: check.focusKeyword || null,
      title: check.title || null,
      conflictsWith: others,
    });
  }

  // 6. Sovrapposizione semantica: non blocca, ma va valutata.
  // Stessa soglia usata da check-duplicates.mjs per evitare
  // segnalazioni su token generici come "sito" o "web".
  const similarRecords = [];

  for (const record of records) {
    const keywordComparison = similarity(
      article.focusKeyword,
      record.focusKeyword
    );

    const titleComparison = similarity(
      article.title,
      record.title
    );

    const best =
      keywordComparison.score >= titleComparison.score
        ? keywordComparison
        : titleComparison;

    const containment =
      Boolean(record.focusKeyword) &&
      (normalizeText(article.focusKeyword).includes(
        normalizeText(record.focusKeyword)
      ) ||
        normalizeText(record.focusKeyword).includes(
          normalizeText(article.focusKeyword)
        ));

    if (
      best.sharedTokens.length >= 3 &&
      (best.score >= 0.58 || containment)
    ) {
      similarRecords.push({
        ...describeRecord(record),
        score: Number(best.score.toFixed(3)),
        sharedTokens: best.sharedTokens,
      });
    }
  }

  similarRecords.sort(
    (first, second) =>
      second.score - first.score ||
      first.filePath.localeCompare(second.filePath, 'it')
  );

  if (similarRecords.length > 0) {
    addIssue({
      severity: 'warning',
      code: 'NEW_ARTICLE_SEMANTIC_OVERLAP',
      weekId,
      mode: 'NEW_ARTICLE',
      message: `Il nuovo articolo si sovrappone parzialmente a ${similarRecords.length} contenuto/i esistente/i: verificare l'intento di ricerca.`,
      focusKeyword: article.focusKeyword,
      title: article.title,
      url: targetSlug,
      conflictsWith: similarRecords,
    });
  }

  detail.semanticOverlaps = similarRecords.length;

  checks.NEW_ARTICLE.push(detail);
}

function resolveExistingEntry(week, entry) {
  const filePath = normalizeFilePath(entry.filePath);
  const record = filePath
    ? recordsByFile.get(filePath)
    : undefined;
  const urlMatches = findRecordsByUrl(entry.url);

  return {
    filePath: filePath || null,
    url: entry.url ? normalizeUrl(entry.url) : null,
    fileInIndex: Boolean(record),
    urlInIndex: urlMatches.length > 0,
    urlMatchesFile:
      Boolean(record) &&
      urlMatches.some(
        (match) =>
          normalizeFilePath(match.filePath) === filePath
      ),
    record: record || null,
    urlMatches,
  };
}

function checkExistingReferences(week, entries, mode) {
  const resolved = [];

  for (const entry of entries) {
    const resolution = resolveExistingEntry(week, entry);
    resolved.push(resolution);

    if (!resolution.filePath) {
      addIssue({
        severity: 'error',
        code: 'EXISTING_CONTENT_MISSING_FILE_PATH',
        weekId: week.id || null,
        mode,
        message:
          'Un contenuto esistente non dichiara filePath.',
        url: resolution.url,
      });

      continue;
    }

    if (!resolution.fileInIndex) {
      addIssue({
        severity: 'error',
        code: 'EXISTING_CONTENT_FILE_NOT_INDEXED',
        weekId: week.id || null,
        mode,
        message: `Il file ${resolution.filePath} non è presente nell'inventario.`,
        filePath: resolution.filePath,
        url: resolution.url,
      });
    }

    if (resolution.url && !resolution.urlInIndex) {
      addIssue({
        severity: 'error',
        code: 'EXISTING_CONTENT_URL_NOT_INDEXED',
        weekId: week.id || null,
        mode,
        message: `L'URL ${resolution.url} non corrisponde a nessun contenuto dell'inventario.`,
        filePath: resolution.filePath,
        url: resolution.url,
      });
    }

    if (
      resolution.url &&
      resolution.urlInIndex &&
      resolution.fileInIndex &&
      !resolution.urlMatchesFile
    ) {
      addIssue({
        severity: 'error',
        code: 'EXISTING_CONTENT_URL_FILE_MISMATCH',
        weekId: week.id || null,
        mode,
        message: `L'URL ${resolution.url} appartiene a un contenuto diverso da ${resolution.filePath}.`,
        filePath: resolution.filePath,
        url: resolution.url,
        conflictsWith:
          resolution.urlMatches.map(describeRecord),
      });
    }

    const knownDuplicates =
      duplicateGroupsByFile.get(resolution.filePath) || [];

    for (const group of knownDuplicates) {
      addIssue({
        severity: 'warning',
        code: 'EXISTING_CONTENT_IN_DUPLICATE_GROUP',
        weekId: week.id || null,
        mode,
        message: `Il contenuto ${resolution.filePath} fa parte di un conflitto già rilevato (${group.groupType}: "${group.value}").`,
        filePath: resolution.filePath,
        url: resolution.url,
        conflictsWith: group.files.map((file) => ({
          filePath: file,
        })),
      });
    }
  }

  return resolved;
}

function declaresNewArticleFields(week) {
  const article = week.article;

  if (!article) {
    return [];
  }

  return [
    'targetFile',
    'targetSlug',
    'focusKeyword',
    'title',
  ].filter((field) => Boolean(article[field]));
}

function checkUpdateExisting(week) {
  const weekId = week.id || null;
  const entries = toExistingContentList(
    week.existingContent
  );

  const detail = {
    calendarId: weekId,
    mode: 'UPDATE_EXISTING',
    references: [],
    errors: 0,
    warnings: 0,
  };

  const errorsBefore = errors.length;
  const warningsBefore = warnings.length;

  if (entries.length === 0) {
    addIssue({
      severity: 'error',
      code: 'UPDATE_EXISTING_MISSING_TARGET',
      weekId,
      mode: 'UPDATE_EXISTING',
      message:
        'UPDATE_EXISTING non indica il contenuto da aggiornare.',
    });
  }

  const resolved = checkExistingReferences(
    week,
    entries,
    'UPDATE_EXISTING'
  );

  const distinctFiles = new Set(
    resolved.map((item) => item.filePath).filter(Boolean)
  );

  // Un aggiornamento deve insistere su un solo contenuto.
  if (distinctFiles.size > 1) {
    addIssue({
      severity: 'error',
      code: 'UPDATE_EXISTING_MULTIPLE_TARGETS',
      weekId,
      mode: 'UPDATE_EXISTING',
      message: `UPDATE_EXISTING indica ${distinctFiles.size} contenuti distinti: un aggiornamento deve avere un solo file di destinazione.`,
      conflictsWith: [...distinctFiles]
        .sort()
        .map((filePath) => ({ filePath })),
    });
  }

  // Non deve introdurre uno slug o un file alternativo.
  const newFields = declaresNewArticleFields(week);

  if (newFields.length > 0) {
    addIssue({
      severity: 'error',
      code: 'UPDATE_EXISTING_DECLARES_NEW_TARGET',
      weekId,
      mode: 'UPDATE_EXISTING',
      message: `UPDATE_EXISTING dichiara un nuovo contenuto (${newFields.join(', ')}): l'aggiornamento non deve creare slug o file alternativi.`,
      filePath: week.article?.targetFile || null,
      url: week.article?.targetSlug
        ? normalizeUrl(week.article.targetSlug)
        : null,
    });
  }

  detail.references = resolved.map((item) => ({
    filePath: item.filePath,
    url: item.url,
    fileInIndex: item.fileInIndex,
    urlInIndex: item.urlInIndex,
    urlMatchesFile: item.urlMatchesFile,
  }));

  detail.errors = errors.length - errorsBefore;
  detail.warnings = warnings.length - warningsBefore;

  checks.UPDATE_EXISTING.push(detail);
}

function checkConsolidate(week) {
  const weekId = week.id || null;
  const entries = toExistingContentList(
    week.existingContent
  );

  const detail = {
    calendarId: weekId,
    mode: 'CONSOLIDATE',
    references: [],
    distinctContents: 0,
    errors: 0,
    warnings: 0,
  };

  const errorsBefore = errors.length;
  const warningsBefore = warnings.length;

  const resolved = checkExistingReferences(
    week,
    entries,
    'CONSOLIDATE'
  );

  const distinctFiles = [
    ...new Set(
      resolved.map((item) => item.filePath).filter(Boolean)
    ),
  ].sort();

  detail.distinctContents = distinctFiles.length;

  if (distinctFiles.length < 2) {
    addIssue({
      severity: 'error',
      code: 'CONSOLIDATE_NOT_ENOUGH_CONTENT',
      weekId,
      mode: 'CONSOLIDATE',
      message: `CONSOLIDATE richiede almeno due contenuti distinti, trovati ${distinctFiles.length}.`,
      conflictsWith: distinctFiles.map((filePath) => ({
        filePath,
      })),
    });
  }

  // Un consolidamento non può introdurre un nuovo articolo.
  const newFields = declaresNewArticleFields(week);

  if (newFields.length > 0) {
    addIssue({
      severity: 'error',
      code: 'CONSOLIDATE_DECLARES_NEW_ARTICLE',
      weekId,
      mode: 'CONSOLIDATE',
      message: `CONSOLIDATE dichiara un nuovo articolo (${newFields.join(', ')}): il consolidamento produce solo una raccomandazione.`,
      filePath: week.article?.targetFile || null,
    });
  }

  // Segnalazione sempre presente: nessuna azione automatica.
  if (distinctFiles.length >= 2) {
    addIssue({
      severity: 'warning',
      code: 'CONSOLIDATE_REVIEW_REQUIRED',
      weekId,
      mode: 'CONSOLIDATE',
      message: `Consolidamento da valutare manualmente su ${distinctFiles.length} contenuti: nessuna eliminazione o redirect viene eseguita da questo controllo.`,
      conflictsWith: resolved
        .filter((item) => item.filePath)
        .map((item) => ({
          filePath: item.filePath,
          url: item.url,
          title: item.record?.title || null,
        })),
    });
  }

  detail.references = resolved.map((item) => ({
    filePath: item.filePath,
    url: item.url,
    fileInIndex: item.fileInIndex,
    urlInIndex: item.urlInIndex,
  }));

  detail.errors = errors.length - errorsBefore;
  detail.warnings = warnings.length - warningsBefore;

  checks.CONSOLIDATE.push(detail);
}

function checkSocialOnly(week) {
  const weekId = week.id || null;
  const entries = toExistingContentList(
    week.existingContent
  );

  const detail = {
    calendarId: weekId,
    mode: 'SOCIAL_ONLY',
    references: [],
    indexableOutput: false,
    errors: 0,
    warnings: 0,
  };

  const errorsBefore = errors.length;
  const warningsBefore = warnings.length;

  // Non deve comportarsi come un NEW_ARTICLE.
  const newFields = declaresNewArticleFields(week);

  if (newFields.length > 0) {
    detail.indexableOutput = true;

    addIssue({
      severity: 'error',
      code: 'SOCIAL_ONLY_DECLARES_ARTICLE',
      weekId,
      mode: 'SOCIAL_ONLY',
      message: `SOCIAL_ONLY dichiara un articolo (${newFields.join(', ')}): non deve produrre contenuti indicizzabili.`,
      filePath: week.article?.targetFile || null,
      url: week.article?.targetSlug
        ? normalizeUrl(week.article.targetSlug)
        : null,
    });
  }

  // Nessuna pubblicazione può aprire un nuovo URL sul blog.
  for (const publication of Array.isArray(week.publications)
    ? week.publications
    : []) {
    const publicationTargets = [
      publication.targetFile,
      publication.targetSlug,
      publication.url,
    ].filter(Boolean);

    if (publicationTargets.length > 0) {
      detail.indexableOutput = true;

      addIssue({
        severity: 'error',
        code: 'SOCIAL_ONLY_PUBLICATION_CREATES_URL',
        weekId,
        mode: 'SOCIAL_ONLY',
        message: `La pubblicazione "${publication.title}" dichiara una destinazione indicizzabile.`,
        url: normalizeUrl(
          publication.targetSlug || publication.url
        ),
        filePath:
          normalizeFilePath(publication.targetFile) || null,
      });
    }
  }

  const resolved = checkExistingReferences(
    week,
    entries,
    'SOCIAL_ONLY'
  );

  // Un file di blog citato ma inesistente equivarrebbe a
  // crearne uno nuovo.
  for (const item of resolved) {
    if (
      item.filePath &&
      !item.fileInIndex &&
      item.filePath.startsWith(contentDirectory)
    ) {
      detail.indexableOutput = true;

      addIssue({
        severity: 'error',
        code: 'SOCIAL_ONLY_WOULD_CREATE_ARTICLE',
        weekId,
        mode: 'SOCIAL_ONLY',
        message: `Il contenuto ${item.filePath} non esiste: una voce SOCIAL_ONLY non può crearlo.`,
        filePath: item.filePath,
        url: item.url,
      });
    }
  }

  if (entries.length === 0) {
    addIssue({
      severity: 'warning',
      code: 'SOCIAL_ONLY_WITHOUT_EXISTING_CONTENT',
      weekId,
      mode: 'SOCIAL_ONLY',
      message:
        'SOCIAL_ONLY non collega nessun contenuto esistente.',
    });
  }

  detail.references = resolved.map((item) => ({
    filePath: item.filePath,
    url: item.url,
    fileInIndex: item.fileInIndex,
    urlInIndex: item.urlInIndex,
  }));

  detail.errors = errors.length - errorsBefore;
  detail.warnings = warnings.length - warningsBefore;

  checks.SOCIAL_ONLY.push(detail);
}

for (const week of weeks) {
  if (!trackedModes.includes(week?.mode)) {
    continue;
  }

  if (week.mode === 'NEW_ARTICLE') {
    const errorsBefore = errors.length;
    const warningsBefore = warnings.length;

    await checkNewArticle(week);

    const detail =
      checks.NEW_ARTICLE[checks.NEW_ARTICLE.length - 1];

    detail.errors = errors.length - errorsBefore;
    detail.warnings = warnings.length - warningsBefore;

    continue;
  }

  if (week.mode === 'UPDATE_EXISTING') {
    checkUpdateExisting(week);
    continue;
  }

  if (week.mode === 'CONSOLIDATE') {
    checkConsolidate(week);
    continue;
  }

  checkSocialOnly(week);
}

const report = {
  sourceIndexGeneratedAt: index.generatedAt || null,
  sourceDuplicateReportGeneratedAt:
    duplicateReport?.generatedAt || null,
  totals: {
    calendarWeeks: weeks.length,
    indexedRecords: records.length,
    newArticles: checks.NEW_ARTICLE.length,
    updates: checks.UPDATE_EXISTING.length,
    consolidations: checks.CONSOLIDATE.length,
    socialOnly: checks.SOCIAL_ONLY.length,
    errors: errors.length,
    warnings: warnings.length,
  },
  errors,
  warnings,
  checks,
};

const previousReport = await readJsonIfPresent(
  reportPath,
  'Il precedente report conflitti'
);

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
    ? 'Controllo conflitti calendario completato.'
    : 'Report conflitti calendario invariato.'
);
console.table(report.totals);
console.log(
  `Report: ${path.relative(rootDirectory, reportPath)}`
);

if (warnings.length > 0) {
  console.log('\nAvvisi:');

  for (const warning of warnings) {
    console.log(
      `- [${warning.calendarId}] ${warning.code}: ${warning.message}`
    );
  }
}

if (errors.length > 0) {
  console.error('\nConflitti bloccanti:');

  for (const error of errors) {
    console.error(
      `- [${error.calendarId}] ${error.code}: ${error.message}`
    );
  }

  process.exitCode = 1;
} else {
  console.log(
    '\nNessun conflitto bloccante fra calendario e inventario.'
  );
}
