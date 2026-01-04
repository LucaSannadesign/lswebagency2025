#!/bin/bash
# Script di utilità per verificare configurazione domini Vercel
# Usa questo script per diagnosticare il problema

set -e

echo "=== Verifica Configurazione Domini Vercel ==="
echo ""

# Verifica se Vercel CLI è installato
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI non installato"
    echo "Installa con: npm i -g vercel"
    exit 1
fi

echo "✅ Vercel CLI installato"
echo ""

# Verifica login
echo "Verifica login Vercel..."
if ! vercel whoami &> /dev/null; then
    echo "❌ Non sei loggato"
    echo "Esegui: vercel login"
    exit 1
fi

echo "✅ Loggato come: $(vercel whoami)"
echo ""

# Lista progetti
echo "=== Progetti disponibili ==="
vercel projects ls
echo ""

# Verifica domini del progetto lswebagency
echo "=== Domini del progetto 'lswebagency' ==="
if vercel domains ls lswebagency 2>/dev/null; then
    echo ""
else
    echo "⚠️  Progetto 'lswebagency' non trovato o domini non assegnati"
    echo ""
fi

# Lista tutti i domini (per trovare dove sono assegnati)
echo "=== Tutti i domini del team (cerca lswebagency.com) ==="
vercel domains ls 2>/dev/null | grep -i lswebagency || echo "Nessun dominio lswebagency trovato"
echo ""

# Test API su dominio custom
echo "=== Test API su dominio custom ==="
echo "Test: curl -sI https://www.lswebagency.com/api/ping"
if curl -sI https://www.lswebagency.com/api/ping 2>/dev/null | head -n 5; then
    STATUS=$(curl -sI https://www.lswebagency.com/api/ping 2>/dev/null | head -n 1 | awk '{print $2}')
    if [ "$STATUS" = "200" ]; then
        echo "✅ API funziona (200 OK)"
    elif [ "$STATUS" = "404" ]; then
        echo "❌ API non trovata (404) - Dominio probabilmente assegnato a progetto sbagliato"
    elif [ "$STATUS" = "401" ]; then
        echo "⚠️  Accesso negato (401) - Deployment Protection attiva"
    else
        echo "⚠️  Status code: $STATUS"
    fi
else
    echo "❌ Errore di connessione"
fi
echo ""

echo "=== Istruzioni ==="
echo "1. Se vedi 404: domini sono assegnati a progetto sbagliato"
echo "2. Vai su Vercel Dashboard → Settings → Domains per gestire domini"
echo "3. Vedi VERCEL_DOMAIN_SETUP.md per istruzioni dettagliate"
echo ""


