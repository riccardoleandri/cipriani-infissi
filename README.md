# Cipriani — Fabbrica Infissi Alluminio

Sito vetrina statico (3 pagine), pronto per GitHub Pages o Vercel.

## Struttura
```
index.html        Home
prodotti.html     Linee di prodotto + cataloghi finiture
contatti.html     Contatti, form preventivo, mappa
css/style.css     Stili
js/main.js        Interazioni (header, slideshow, selettore, lightbox, form)
img/              Foto, cataloghi, logo, favicon
```

## Pubblicare su GitHub Pages
1. Crea un repository e carica TUTTO il contenuto di questa cartella nella root.
2. Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / `(root)` → Save.
3. Il sito sarà online su `https://TUOUTENTE.github.io/NOMEREPO/` in 1–2 minuti.

In alternativa: importa il repo su Vercel (Add New → Project) senza alcuna configurazione.

## Da completare prima della consegna
- **P.IVA** nel footer (ora segnaposto `00000000000`).
- **Form preventivo**: è una demo client-side, non invia email. Collegarlo a
  [Formspree](https://formspree.io) o simile: basta impostare `action` e `method` sul `<form>`.
- Le foto d'atmosfera (hero, CTA) sono su CDN Unsplash con licenza libera; se un giorno
  servisse tutto in locale, scaricarle in `img/` e aggiornare gli URL.
