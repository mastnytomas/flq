# Projektový návod

Tento repozitář obsahuje serverovou a klientskou část projektu. Serverová část je napsaná v jazyce JavaScript s využitím frameworku Express, zatímco klientská část je postavená na Reactu s podporou TypeScriptu a používá knihovnu Ant Design.
# Popis projektu

Tento projekt je webová aplikace, která umožňuje uživatelům testovat své znalosti v oblasti fotbalu. Aplikace je rozdělena na serverovou a klientskou část.
# Serverová část
Serverová část zajišťuje zpracování požadavků ze klientů a ukládání dat do souboru data.json. Používá framework Express pro vytvoření serveru a knihovnu fs pro práci se soubory.

Serverová část poskytuje následující API endpointy:

```POST /saveData```: Ukládá zaslaná data do souboru data.json. Přijímá JSON objekt a přidává ho do stávajícího seznamu dat.

```GET /loadData```: Načítá data ze souboru data.json. Vrací seznam načtených dat v transformovaném formátu.
# Klientská část
Klientská část aplikace je zodpovědná za interakci s uživatelem. Uživatel může v aplikaci vybírat z různých kvízů, ve kterých hádá základní sestavy fotbalových týmů. Kromě hádání sestav má také možnost vytvářet vlastní sestavy. Formace, které lze pro sestavu vybrat, jsou definovány v souboru client/config/config.tsx. Přidání dalších sestav je velmi jednoduché a provádí se úpravou tohoto konfiguračního souboru.
Klientská část je postavena na frameworku React s TypeScriptem a využitím knihovny Ant Design.

# Instalace a spuštění
Před spuštěním serveru a klientské části je potřeba nainstalovat potřebné závislosti. V kořenovém adresáři projektu spusťte následující příkaz:
```
yarn install
```
Spuštění serveru
Serverová část je dostupná na portu 3001. Pro spuštění serveru použijte následující příkaz:
```
node index.js
```
Po úspěšném spuštění serveru uvidíte v konzoli zprávu "The server is running on http://localhost:3001".

Spuštění klientské části
Klientská část běží na portu 3000. Pro spuštění klientského serveru použijte následující příkaz:
```
yarn dev
```
Po úspěšném spuštění klientské části aplikace si můžete otevřít webový prohlížeč a navštívit adresu http://localhost:3000.

# Další informace
Pro více informací a detaily o implementaci si prohlédněte kód projektu.

Obrázek dresu je k dispozici zde: https://cdn-icons-png.flaticon.com/256/1031/1031435.png

Obrázek hřiště dostupný zde: https://all-free-download.com/free-vector/download/soccer_field_311115.html