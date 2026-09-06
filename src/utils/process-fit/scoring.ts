export type FitAnswerValue = string;
export type FitAnswers = Record<string, FitAnswerValue>;
export type FitOutcome = 'GO' | 'PREPARARE' | 'NO-GO';

export type FitQuestion = {
  key: string;
  label: string;
  help?: string;
  options: Array<{ value: string; label: string; points: number }>;
};

export type FitResult = {
  score: number;
  outcome: FitOutcome;
  risk: 'basso' | 'medio' | 'alto';
  blockers: string[];
  strengths: string[];
  nextStep: string;
  dimensions: Array<{ key: string; label: string; points: number; max: number }>;
};

export const fitQuestions: FitQuestion[] = [
  {
    key: 'frequency',
    label: 'Quanto spesso si ripete questo processo?',
    help: 'Più un processo è frequente, più è facile misurare il valore dell’automazione.',
    options: [
      { value: 'daily', label: 'Ogni giorno o più volte al giorno', points: 20 },
      { value: 'weekly', label: 'Più volte al mese / ogni settimana', points: 15 },
      { value: 'monthly', label: 'Circa una volta al mese', points: 8 },
      { value: 'rare', label: 'Raramente o solo in casi particolari', points: 2 },
    ],
  },
  {
    key: 'repeatability',
    label: 'Quanto è ripetitivo il modo in cui viene svolto?',
    help: 'Un flusso stabile è più adatto di un’attività che cambia completamente ogni volta.',
    options: [
      { value: 'same', label: 'Quasi sempre gli stessi passaggi', points: 20 },
      { value: 'mostly', label: 'Stessa base con alcune eccezioni', points: 15 },
      { value: 'many-exceptions', label: 'Molte eccezioni e decisioni manuali', points: 8 },
      { value: 'unique', label: 'Ogni caso è sostanzialmente diverso', points: 0 },
    ],
  },
  {
    key: 'data',
    label: 'Dove vivono oggi i dati necessari?',
    help: 'La qualità della fonte dati conta più del modello AI scelto.',
    options: [
      { value: 'structured', label: 'CRM / gestionale / database con dati abbastanza ordinati', points: 15 },
      { value: 'mixed', label: 'Più sistemi digitali, ma sappiamo qual è la fonte principale', points: 12 },
      { value: 'email-sheets', label: 'Soprattutto email, fogli e documenti', points: 7 },
      { value: 'memory-paper', label: 'Molto dipende da memoria, carta o conoscenza informale', points: 0 },
    ],
  },
  {
    key: 'integration',
    label: 'Gli strumenti coinvolti possono essere collegati?',
    help: 'API, webhook o export affidabili riducono fragilità e costi di manutenzione.',
    options: [
      { value: 'api', label: 'Sì: API, webhook o integrazioni già disponibili', points: 15 },
      { value: 'likely', label: 'Probabilmente sì, ma va verificato', points: 12 },
      { value: 'unknown', label: 'Non lo sappiamo ancora', points: 6 },
      { value: 'closed', label: 'No o quasi: sistema chiuso / solo operazioni manuali', points: 0 },
    ],
  },
  {
    key: 'exceptions',
    label: 'Le eccezioni del processo sono conosciute?',
    help: 'I casi anomali devono poter essere riconosciuti e mandati a una persona.',
    options: [
      { value: 'documented', label: 'Sì, sono documentate', points: 10 },
      { value: 'known', label: 'Sì, chi lavora sul processo le conosce', points: 8 },
      { value: 'partial', label: 'Solo in parte', points: 4 },
      { value: 'unpredictable', label: 'No, emergono continuamente casi nuovi', points: 0 },
    ],
  },
  {
    key: 'owner',
    label: 'C’è una persona responsabile che conosce bene il processo?',
    options: [
      { value: 'clear', label: 'Sì, un referente chiaro', points: 10 },
      { value: 'shared', label: 'Sì, ma la responsabilità è condivisa', points: 7 },
      { value: 'unclear', label: 'No, nessuno ne ha davvero ownership', points: 0 },
    ],
  },
  {
    key: 'measurement',
    label: 'Possiamo misurare il prima e il dopo?',
    help: 'Esempi: tempo impiegato, errori, lead persi, tempo di risposta, costo per pratica.',
    options: [
      { value: 'baseline', label: 'Sì, abbiamo già numeri o KPI', points: 10 },
      { value: 'estimable', label: 'Non ancora, ma possiamo costruire una baseline', points: 6 },
      { value: 'none', label: 'No, oggi non misuriamo nulla e sarebbe difficile farlo', points: 0 },
    ],
  },
  {
    key: 'risk',
    label: 'Che tipo di conseguenza avrebbe un errore?',
    help: 'Il rischio non viene “compensato” dal punteggio: può imporre un livello di autonomia più prudente.',
    options: [
      { value: 'low', label: 'Bassa: errore reversibile, nessuna decisione sensibile', points: 0 },
      { value: 'medium', label: 'Media: serve revisione umana prima dell’azione', points: 0 },
      { value: 'high', label: 'Alta: decisioni sensibili, irreversibili o con forte impatto', points: 0 },
    ],
  },
];

const dimensionLabels: Record<string, string> = {
  frequency: 'Volume / frequenza',
  repeatability: 'Ripetitività',
  data: 'Maturità dei dati',
  integration: 'Integrabilità',
  exceptions: 'Gestione eccezioni',
  owner: 'Ownership',
  measurement: 'Misurabilità',
};

const maxByKey: Record<string, number> = {
  frequency: 20,
  repeatability: 20,
  data: 15,
  integration: 15,
  exceptions: 10,
  owner: 10,
  measurement: 10,
};

function pointsFor(key: string, value: string | undefined): number {
  const q = fitQuestions.find((item) => item.key === key);
  return q?.options.find((item) => item.value === value)?.points ?? 0;
}

export function computeFitResult(answers: FitAnswers): FitResult {
  const scoredKeys = Object.keys(maxByKey);
  const dimensions = scoredKeys.map((key) => ({
    key,
    label: dimensionLabels[key],
    points: pointsFor(key, answers[key]),
    max: maxByKey[key],
  }));
  const score = dimensions.reduce((sum, item) => sum + item.points, 0);

  const blockers: string[] = [];
  const strengths: string[] = [];

  if (answers.repeatability === 'unique') blockers.push('Il processo cambia troppo da caso a caso.');
  if (answers.data === 'memory-paper') blockers.push('I dati non hanno ancora una fonte digitale affidabile.');
  if (answers.integration === 'closed') blockers.push('Gli strumenti principali non risultano integrabili in modo affidabile.');
  if (answers.owner === 'unclear') blockers.push('Manca un referente che possa validare regole ed eccezioni.');
  if (answers.risk === 'high') blockers.push('Il rischio operativo richiede una progettazione specialistica e forte controllo umano.');
  if (answers.frequency === 'rare' && answers.repeatability !== 'same') blockers.push('Il volume è probabilmente troppo basso per giustificare una automazione dedicata.');

  if (pointsFor('frequency', answers.frequency) >= 15) strengths.push('Volume sufficiente per misurare benefici reali.');
  if (pointsFor('repeatability', answers.repeatability) >= 15) strengths.push('Flusso abbastanza stabile da poter essere standardizzato.');
  if (pointsFor('data', answers.data) >= 12) strengths.push('Base dati già abbastanza digitale e strutturata.');
  if (pointsFor('integration', answers.integration) >= 12) strengths.push('Buona probabilità di integrazione senza automazioni fragili.');
  if (pointsFor('measurement', answers.measurement) >= 6) strengths.push('È possibile costruire un confronto prima/dopo.');

  const hardNoGo =
    (answers.repeatability === 'unique' && answers.frequency === 'rare') ||
    (answers.data === 'memory-paper' && answers.integration === 'closed');

  const preparationGate =
    answers.data === 'memory-paper' ||
    answers.integration === 'closed' ||
    answers.owner === 'unclear' ||
    answers.risk === 'high';

  let outcome: FitOutcome;
  if (hardNoGo || score < 40) outcome = 'NO-GO';
  else if (score >= 70 && !preparationGate) outcome = 'GO';
  else outcome = 'PREPARARE';

  const risk: FitResult['risk'] = answers.risk === 'high' ? 'alto' : answers.risk === 'medium' ? 'medio' : 'basso';
  const nextStep =
    outcome === 'GO'
      ? 'Mappare il processo in dettaglio e definire baseline, integrazioni e un Pilot Operativo.'
      : outcome === 'PREPARARE'
        ? 'Sistemare prima i prerequisiti indicati: dati, ownership, integrazioni o gestione delle eccezioni.'
        : 'Non costruire un’automazione dedicata adesso: conviene semplificare il processo o scegliere un caso d’uso più frequente e stabile.';

  return { score, outcome, risk, blockers, strengths, nextStep, dimensions };
}
