# Brief immagine — Quanto costa un sito web professionale nel 2026

- **Settimana editoriale:** `ls-2026-w01`
- **Articolo:** `src/content/data/post/quanto-costa-un-sito-web-professionale.mdx`
- **Stato:** **file non ancora generato.** L'immagine verrà prodotta separatamente e caricata a mano.

## Requisiti tecnici

| Parametro | Valore |
|---|---|
| Percorso finale | `public/images/blog/quanto-costa-un-sito-web-professionale.webp` |
| Dimensioni | 1200 × 630 px |
| Formato | WebP |
| Peso indicativo | sotto i 150 KB |
| Variante social (opzionale, da calendario) | 1080 × 1350 px, WebP |

Il percorso è già dichiarato nel frontmatter dell'articolo (`image`, `ogImage`, `twitterImage`) e in `editorial/calendar.yml`. Finché il file non esiste, la copertina risulta mancante: va caricata prima di togliere `draft: true`.

## Obiettivo comunicativo

Rappresentare **la lettura di un preventivo**, non il prezzo. L'immagine deve suggerire confronto e trasparenza, mai un listino o un'offerta commerciale.

Da evitare in modo esplicito:

- cifre in euro leggibili, cartellini prezzo, simboli di sconto o percentuali;
- salvadanai, monete, sacchi di denaro, grafici in crescita;
- volti di stock, strette di mano, riunioni generiche;
- loghi, marchi o riferimenti a LS Web Agency;
- testo lungo o didascalie: al massimo poche parole, e solo se restano nitide alla dimensione di anteprima.

## Direzione visiva

- Piano ravvicinato di un documento di preventivo stilizzato su una superficie neutra: righe di voci allineate, alcune evidenziate, colonna degli importi volutamente sfocata o astratta.
- In alternativa: due documenti affiancati, chiaramente diversi per lunghezza, a suggerire il confronto tra due offerte.
- Palette coerente con il sito: neutri freddi (grigi ardesia, bianco) con un accento viola/fucsia usato con parsimonia sugli elementi in evidenza.
- Illuminazione morbida, laterale. Composizione ordinata, molto spazio negativo sul lato sinistro o superiore per non interferire con il titolo nelle anteprime social.
- Nessuna prospettiva estrema: l'immagine deve restare leggibile anche a 400 px di larghezza.

## Prompt proposto (generazione AI)

```
Close-up flat lay of a stylized professional service quotation document on a
clean neutral desk surface. The document shows a structured list of work items
with clear rows and sections; the price column is intentionally abstract and
out of focus, with no readable numbers or currency symbols. A second, visibly
shorter document is partially visible beside it, suggesting a comparison
between two offers. Cool neutral palette — slate grey, off-white — with a
restrained violet accent highlighting two rows. Soft directional lighting,
subtle shadows, shallow depth of field. Generous empty space in the upper left
area. Modern editorial photography style, 1200x630, landscape, no text, no
logos, no people, no coins or money symbols.
```

Prompt negativo suggerito: `readable text, numbers, currency symbols, price tags, coins, money, piggy bank, charts, people, faces, handshake, logos, watermark, cluttered composition`.

## Alt text

`Computer portatile con due proposte per un sito web messe a confronto`

Già inserito nel frontmatter come `imageAlt`. Se l'immagine finale mostrasse due documenti affiancati anziché uno, aggiornare l'alt in: `Due preventivi per un sito web professionale messi a confronto voce per voce`.

## Controlli prima della pubblicazione

1. Il file esiste in `public/images/blog/` con il nome esatto indicato sopra.
2. Nessuna cifra è leggibile nell'immagine.
3. L'alt text descrive ciò che si vede davvero.
4. L'anteprima social a 1200 × 630 non taglia elementi significativi.
