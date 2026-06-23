# Cipriani — Fabbrica Infissi Alluminio

Sito vetrina statico B2B (3 pagine), pronto per GitHub Pages o Vercel.

## Struttura
```
index.html        Home
chi-siamo.html    Chi siamo + contatti (sezione #contatti: card, form, mappa)
prodotti.html     Sistemi a taglio freddo / taglio termico / varie + modale richiesta info
contatti.html     redirect a chi-siamo.html#contatti (compatibilità vecchi link)
css/style.css     Stili
js/main.js        Interazioni (header, slideshow, lightbox, tabs, modale, reveal, form)
img/              Foto, cataloghi, logo, favicon
```

## Prodotti
La pagina ha tre sottocategorie a schede: **A taglio freddo**, **A taglio termico**, **Varie**
(quest'ultima a "Prossimamente"). Ogni sistema mostra le caratteristiche tecniche reali da catalogo
e un bottone "Richiedi informazioni" che apre una **modale già precompilata col prodotto specifico**.

## Pubblicare su GitHub Pages
1. Crea un repository e carica il CONTENUTO di questa cartella nella root.
2. Settings → Pages → Source: "Deploy from a branch" → Branch: `main` / `(root)` → Save.
3. Online su `https://TUOUTENTE.github.io/NOMEREPO/` in 1–2 minuti.
In alternativa: importa il repo su Vercel senza configurazione.

## Da completare prima della consegna
- **P.IVA** nel footer (ora segnaposto `00000000000`).
- **Invio email dei moduli** — sono demo client-side. Per attivarli con Formspree:
  * Form contatti (chi-siamo): aggiungi `action="https://formspree.io/f/XXXX" method="POST"` al `<form id="qform">`.
  * Modale per-prodotto (prodotti): stessa cosa sul `<form id="rmForm">`. Il campo nascosto
    `name="prodotto"` arriva già compilato col sistema richiesto, così l'email indica quale prodotto.
