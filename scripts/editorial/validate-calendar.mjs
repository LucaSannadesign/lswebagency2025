import fs from 'node:fs/promises';
import path from 'node:path';
import yaml from 'js-yaml';

const rootDirectory = process.cwd();
const calendarPath = path.join(
  rootDirectory,
  'editorial/calendar.yml'
);

const allowedModes = new Set([
  'NEW_ARTICLE',
  'UPDATE_EXISTING',
  'SOCIAL_ONLY',
  'CONSOLIDATE',
]);

// Stati realmente previsti dal flusso editoriale:
// "planned" prima della bozza, "drafting" quando la bozza
// esiste ma non è pubblicabile, "needs_manual_review" quando
// serve una decisione umana.
const allowedStatuses = new Set([
  'planned',
  'drafting',
  'needs_manual_review',
]);

const draftingStatus = 'drafting';

const requiredArticleFields = [
  'date',
  'title',
  'targetFile',
  'targetSlug',
  'focusKeyword',
  'searchIntent',
  'category',
  'imagePath',
];

const requiredMetadata = [
  'title',
  'description',
  'slug',
  'canonical',
  'focusKeyword',
  'tags',
  'category',
  'author',
  'publishDate',
  'updateDate',
  'image',
  'imageAlt',
  'ogTitle',
  'ogDescription',
  'ogImage',
  'ogType',
  'twitterCard',
  'twitterTitle',
  'twitterDescription',
  'twitterImage',
  'robots',
  'draft',
];

function normalizeDate(value) {
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10);
  }

  if (typeof value === 'string') {
    const parsed = new Date(`${value.slice(0, 10)}T00:00:00Z`);

    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString().slice(0, 10);
    }
  }

  return null;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasExistingContent(value) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return Boolean(value && typeof value === 'object');
}

function checkRequiredFields(object, fields, context, errors) {
  for (const field of fields) {
    const value = object?.[field];

    if (
      value == null ||
      value === '' ||
      (Array.isArray(value) && value.length === 0)
    ) {
      errors.push(`${context}: campo obbligatorio mancante "${field}"`);
    }
  }
}

const rawCalendar = await fs.readFile(calendarPath, 'utf8');
const calendar = yaml.load(rawCalendar);

const errors = [];
const warnings = [];

if (!calendar || typeof calendar !== 'object') {
  throw new Error('Il calendario YAML non contiene un oggetto valido.');
}

if (!calendar.brand?.id) {
  errors.push('brand.id mancante');
}

if (!calendar.brand?.timezone) {
  errors.push('brand.timezone mancante');
}

if (!Array.isArray(calendar.weeks)) {
  errors.push('weeks deve essere un array');
}

const weeks = Array.isArray(calendar.weeks)
  ? calendar.weeks
  : [];

const expectedWeeks = calendar.period?.weeks;
const expectedPublications = calendar.period?.publications;
const publicationsPerWeek =
  calendar.cadence?.publicationsPerWeek;

if (
  Number.isInteger(expectedWeeks) &&
  weeks.length !== expectedWeeks
) {
  errors.push(
    `Numero settimane errato: previste ${expectedWeeks}, trovate ${weeks.length}`
  );
}

const periodStart = normalizeDate(calendar.period?.startDate);
const periodEnd = normalizeDate(calendar.period?.endDate);

if (!periodStart || !periodEnd) {
  errors.push('period.startDate o period.endDate non validi');
}

const weekIds = new Set();
const publicationDates = new Map();
const targetFiles = new Map();
const targetSlugs = new Map();
const focusKeywords = new Map();

let totalPublications = 0;

for (const [weekIndex, week] of weeks.entries()) {
  const context = `Settimana ${weekIndex + 1}`;

  if (!isNonEmptyString(week.id)) {
    errors.push(`${context}: id mancante`);
  } else if (weekIds.has(week.id)) {
    errors.push(`${context}: id duplicato "${week.id}"`);
  } else {
    weekIds.add(week.id);
  }

  if (!allowedModes.has(week.mode)) {
    errors.push(
      `${context}: mode non valida "${week.mode}"`
    );
  }

  if (!isNonEmptyString(week.theme)) {
    errors.push(`${context}: theme mancante`);
  }

  const weekStatus = isNonEmptyString(week.status)
    ? week.status.trim()
    : null;

  if (!weekStatus) {
    errors.push(`${context}: status mancante`);
  } else if (!allowedStatuses.has(weekStatus)) {
    errors.push(
      `${context}: status non valido "${week.status}"`
    );
  } else if (
    weekStatus === draftingStatus &&
    week.mode !== 'NEW_ARTICLE'
  ) {
    errors.push(
      `${context}: lo status "${draftingStatus}" è ammesso solo con mode NEW_ARTICLE`
    );
  }

  if (!Array.isArray(week.publications)) {
    errors.push(`${context}: publications deve essere un array`);
    continue;
  }

  if (
    Number.isInteger(publicationsPerWeek) &&
    week.publications.length !== publicationsPerWeek
  ) {
    errors.push(
      `${context}: previste ${publicationsPerWeek} pubblicazioni, trovate ${week.publications.length}`
    );
  }

  totalPublications += week.publications.length;

  for (
    const [publicationIndex, publication] of
    week.publications.entries()
  ) {
    const publicationContext =
      `${context}, pubblicazione ${publicationIndex + 1}`;

    checkRequiredFields(
      publication,
      ['date', 'type', 'title', 'channels'],
      publicationContext,
      errors
    );

    const publicationDate = normalizeDate(publication.date);

    if (!publicationDate) {
      errors.push(
        `${publicationContext}: data non valida`
      );
    } else {
      if (
        periodStart &&
        periodEnd &&
        (
          publicationDate < periodStart ||
          publicationDate > periodEnd
        )
      ) {
        errors.push(
          `${publicationContext}: data ${publicationDate} fuori dal periodo`
        );
      }

      const existingPublication =
        publicationDates.get(publicationDate);

      if (existingPublication) {
        errors.push(
          `${publicationContext}: data duplicata ${publicationDate}, già usata da ${existingPublication}`
        );
      } else {
        publicationDates.set(
          publicationDate,
          publication.title
        );
      }
    }

    if (
      !Array.isArray(publication.channels) ||
      publication.channels.length === 0
    ) {
      errors.push(
        `${publicationContext}: almeno un canale è obbligatorio`
      );
    }
  }

  if (week.mode === 'NEW_ARTICLE') {
    if (!week.article) {
      errors.push(`${context}: article mancante`);
      continue;
    }

    checkRequiredFields(
      week.article,
      requiredArticleFields,
      `${context}, articolo`,
      errors
    );

    checkRequiredFields(
      week.article.cta,
      ['label', 'url'],
      `${context}, CTA articolo`,
      errors
    );

    const articleDate = normalizeDate(week.article.date);

    const publicationDateValues =
      week.publications
        .map((publication) =>
          normalizeDate(publication.date)
        )
        .filter(Boolean);

    if (
      articleDate &&
      !publicationDateValues.includes(articleDate)
    ) {
      errors.push(
        `${context}: la data dell'articolo ${articleDate} non coincide con nessuna pubblicazione`
      );
    }

    if (
      week.article.targetFile &&
      !week.article.targetFile.startsWith(
        'src/content/data/post/'
      )
    ) {
      errors.push(
        `${context}: targetFile deve trovarsi in src/content/data/post/`
      );
    }

    if (
      week.article.targetFile &&
      !/\.mdx?$/.test(week.article.targetFile)
    ) {
      errors.push(
        `${context}: targetFile deve essere Markdown o MDX`
      );
    }

    if (
      week.article.targetSlug &&
      !week.article.targetSlug.startsWith('/blog/')
    ) {
      errors.push(
        `${context}: targetSlug deve iniziare con /blog/`
      );
    }

    if (
      week.article.imagePath &&
      !week.article.imagePath.startsWith(
        '/images/blog/'
      )
    ) {
      errors.push(
        `${context}: imagePath deve iniziare con /images/blog/`
      );
    }

    if (
      week.article.imagePath &&
      !week.article.imagePath.endsWith('.webp')
    ) {
      errors.push(
        `${context}: l'immagine in evidenza deve essere WebP`
      );
    }

    const uniquenessChecks = [
      {
        label: 'targetFile',
        value: week.article.targetFile,
        map: targetFiles,
      },
      {
        label: 'targetSlug',
        value: week.article.targetSlug,
        map: targetSlugs,
      },
      {
        label: 'focusKeyword',
        value: week.article.focusKeyword
          ?.toLowerCase()
          .trim(),
        map: focusKeywords,
      },
    ];

    for (const check of uniquenessChecks) {
      if (!check.value) continue;

      const existingWeek = check.map.get(check.value);

      if (existingWeek) {
        errors.push(
          `${context}: ${check.label} duplicato con ${existingWeek}`
        );
      } else {
        check.map.set(check.value, week.id);
      }
    }
  }

  if (
    week.mode === 'UPDATE_EXISTING' &&
    !hasExistingContent(week.existingContent)
  ) {
    errors.push(
      `${context}: UPDATE_EXISTING richiede existingContent`
    );
  }

  if (
    week.mode === 'CONSOLIDATE' &&
    (
      !Array.isArray(week.existingContent) ||
      week.existingContent.length < 2
    )
  ) {
    errors.push(
      `${context}: CONSOLIDATE richiede almeno due contenuti esistenti`
    );
  }

  if (
    week.mode === 'SOCIAL_ONLY' &&
    !hasExistingContent(week.existingContent)
  ) {
    warnings.push(
      `${context}: SOCIAL_ONLY senza existingContent`
    );
  }
}

if (
  Number.isInteger(expectedPublications) &&
  totalPublications !== expectedPublications
) {
  errors.push(
    `Numero pubblicazioni errato: previste ${expectedPublications}, trovate ${totalPublications}`
  );
}

const configuredMetadata =
  calendar.articleDefaults?.requiredMetadata || [];

for (const field of requiredMetadata) {
  if (!configuredMetadata.includes(field)) {
    errors.push(
      `articleDefaults.requiredMetadata non contiene "${field}"`
    );
  }
}

if (
  calendar.articleDefaults?.draft !== true
) {
  errors.push(
    'articleDefaults.draft deve essere true'
  );
}

if (
  calendar.articleDefaults?.robots !==
  'noindex, nofollow'
) {
  errors.push(
    'articleDefaults.robots deve essere "noindex, nofollow"'
  );
}

if (
  calendar.articleDefaults?.featuredImage
    ?.generateWhen !== 'article_draft_created'
) {
  errors.push(
    'L’immagine deve essere generata quando viene creata la bozza'
  );
}

if (
  calendar.workflow?.humanApprovalRequired !== true
) {
  errors.push(
    'workflow.humanApprovalRequired deve essere true'
  );
}

if (
  calendar.workflow?.automaticPublishing !== false
) {
  errors.push(
    'workflow.automaticPublishing deve essere false'
  );
}

const summary = {
  weeks: weeks.length,
  publications: totalPublications,
  newArticles: weeks.filter(
    (week) => week.mode === 'NEW_ARTICLE'
  ).length,
  updates: weeks.filter(
    (week) => week.mode === 'UPDATE_EXISTING'
  ).length,
  consolidations: weeks.filter(
    (week) => week.mode === 'CONSOLIDATE'
  ).length,
  socialOnly: weeks.filter(
    (week) => week.mode === 'SOCIAL_ONLY'
  ).length,
  errors: errors.length,
  warnings: warnings.length,
};

console.log('\nCalendario editoriale');
console.table(summary);

if (warnings.length > 0) {
  console.log('\nAvvisi:');

  for (const warning of warnings) {
    console.log(`- ${warning}`);
  }
}

if (errors.length > 0) {
  console.error('\nErrori di validazione:');

  for (const error of errors) {
    console.error(`- ${error}`);
  }

  process.exitCode = 1;
} else {
  console.log('\nCalendario valido.');
}
