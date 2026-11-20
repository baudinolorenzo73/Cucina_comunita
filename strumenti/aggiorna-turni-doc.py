#!/usr/bin/env python3
"""Rigenera turni-doc.js da turni.html.

Va lanciato OGNI VOLTA che si modifica turni.html, altrimenti aprendo
l'app da file locale (D:/...) si vedrebbe la versione vecchia dei turni.

Uso (dalla cartella del progetto):
    python strumenti/aggiorna-turni-doc.py
by Lollo ®2026
"""
import json, pathlib, sys

radice = pathlib.Path(__file__).resolve().parent.parent
sorgente = radice / "turni.html"
destinazione = radice / "turni-doc.js"

if not sorgente.exists():
    sys.exit("turni.html non trovato: lancia lo script dalla cartella del progetto.")

testo = sorgente.read_text(encoding="utf-8")
js = json.dumps(testo, ensure_ascii=False).replace("\u2028", "\\u2028").replace("\u2029", "\\u2029")
contenuto = ("/* Generato da turni.html con strumenti/aggiorna-turni-doc.py: non modificare a mano. */\n"
             "window.TURNI_DOCUMENT=" + js + ";\n")
tmp = destinazione.with_suffix(".js.tmp")
tmp.write_text(contenuto, encoding="utf-8")   # scrittura atomica: prima il file temporaneo...
tmp.replace(destinazione)                     # ...poi lo rinomina sopra quello vecchio
print(f"OK: turni-doc.js aggiornato ({len(testo):,} caratteri).")
