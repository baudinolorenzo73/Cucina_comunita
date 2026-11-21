# La nostra cucina — Ricettario, menù, turni e spesa · 2.10.2

by Lollo ®2026 · app web/PWA che funziona anche offline.

## Come si usa (in breve)

1. **Barra in alto**: dice se sei in modalità *Pubblico* (grigio-blu), *Operatore* (verde) o *Master* (oro) e contiene i comandi che valgono ovunque. Su telefono diventa una riga di icone: 🖨 ⬇ 💾 🔑.
2. **🖨 Stampa** stampa la schermata aperta: ricette, menù del giorno o calendario del mese, spesa, turni, fonti, dedica.
3. **⬇ Esporta** crea PDF, Word o Excel della schermata aperta. In Ricette c'è «Scegli quali ricette…», in Preferite escono solo le preferite. Nelle due spese c'è anche **📲 WhatsApp / Condividi**.
4. **💾 Backup** salva *tutto* in un file .json; «Ripristina da file…» (operatori) rimette solo le parti spuntate e prima scarica una copia di sicurezza. Dopo 7 giorni senza backup compare un avviso.
5. **Accesso operatori**: serve per modificare e per generare i turni; si chiude dopo 15 minuti di inattività.
6. **Turni**: tutti vedono i turni pubblicati e, in **👤 I miei turni**, i propri giorni con il pulsante per aggiungerli al calendario del telefono. Gli operatori generano i turni e li pubblicano per tutti.
7. **Spesa comunità**: «➕ Aggiungi al volo» (solo oggi), «Aggiungi un prodotto» (anche nella lista fissa), ✎ per modificare, duplicare o eliminare, ALTRO per il testo libero, «Selezione ▾» per spuntare in blocco. Stampa su massimo 2 pagine A4.
8. **⚙ Impostazioni** → *App*: installa o aggiorna l'app (da file locale apre la versione online e porta con sé i dati). → *Aspetto* · *Dati* · *Assistente AI*.
9. I dati restano **solo nel browser** del dispositivo: il backup è l'unico modo per conservarli o spostarli.
10. **? Aiuto**: il pulsante ? in alto e il ? accanto a ogni titolo spiegano l'app e ogni sezione; la guida completa con figure è in `docs/Guida-La-nostra-cucina.pdf`.

## Manutenzione (per Lorenzo)

- **Pubblicare i turni per tutti**: da operatore/master, Turni → «📤 Pubblica i turni per tutti» → scegli il mese → si scarica `turni-pubblicati.js`. Mettilo nella cartella del progetto al posto del vecchio e ripubblica con Pubblica. Il file contiene tutti i mesi pubblicati (ultimi 24).

- Dopo ogni modifica a `turni.html` lancia `python strumenti/aggiorna-turni-doc.py`, poi ripubblica. Se ti dimentichi, da master compare un avviso.
- Pubblica lo ZIP con Pubblica: `index.html`, `sw.js` e `manifest.webmanifest` stanno alla radice.

Storia completa delle versioni: vedi [LEGGIMI.md](LEGGIMI.md).
