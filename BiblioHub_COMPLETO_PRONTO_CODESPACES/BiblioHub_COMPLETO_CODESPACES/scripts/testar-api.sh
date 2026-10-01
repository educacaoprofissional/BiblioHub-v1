#!/usr/bin/env bash
set -e
BASE="http://127.0.0.1:3001"
echo "1) Status"; curl -fsS "$BASE/api/status"; echo
echo "2) Login leitor"; LOGIN=$(curl -fsS -X POST "$BASE/api/auth/login" -H 'Content-Type: application/json' -d '{"email":"aluno@bibliohub.edu.br","password":"biblioteca123"}'); echo "$LOGIN"
TOKEN=$(node -e 'const d=JSON.parse(process.argv[1]);console.log(d.token)' "$LOGIN")
echo "3) Acervo"; curl -fsS "$BASE/api/books" | head -c 300; echo "..."
echo "4) Biblioteca do leitor"; curl -fsS "$BASE/api/me/library" -H "Authorization: Bearer $TOKEN"; echo
echo "Testes básicos concluídos."
