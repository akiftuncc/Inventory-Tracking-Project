@echo off
set "dosyaKonumu=<dosyanın_konumu>"
cd /d "%dosyaKonumu%"
start chrome http://localhost:3000/
node ./js/sqlnode.js