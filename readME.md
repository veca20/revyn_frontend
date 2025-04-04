# Revyn Frontend/Weboldal Dokumentáció
Ez a dokumentáció weboldal működését és célját írja le a Revyn weboldalhoz.
Amit közösen a társammal Szarvas Petrával alkottunk meg. Azt szerettük volna hogyan legyen egy olyan weboldalunk ahol egészséges illetve olyan termékeket tudunk arúsítani amik a sportólók számára kedveznek és edzés után vagy el tudják ezeket fogyasztani hogy másabbúl induljona  napjuk és igy meg alkottuk a Revyn márkát!

## Tartalomjegyzék
-Index az az a fő oldal amiről több különböző oldalra tudunk navigálni
    -About Revyn ahol az oldalról és a cégről tudunk meg információkat
    -Where To Buy ahol egy google térkép segítségével tudjuk meg nézni hol találhatóak azoka  boltok ahol a termékeket árúsítják
    -Veryfy Your Revny olal ahol azt tudjuk meg nézni mely országokban található még a termék 
    -Profil szerekesztés
    -Kilépés 
    -Kosár

## `index.html` (Főoldal / Shop)

A látogatók számára elérhető főoldal, ahol megjelennek az elérhető termékek
### Főbb elemek:
- **Navigációs sáv**: SHOP, ABOUT REVYN, WHERE TO BUY, VERIFY YOUR REVYN linkek.
- **Kosár és felhasználói ikon**: Kosárban lévő termékek száma dinamikusan frissül.
- **Termékek megjelenítése**: `#products-container` ID-jű divbe töltődnek be JavaScript segítségével.
- **Footer**: Hivatkozás az About oldalra és hírlevél feliratkozás.


## `buy.html` (Hol kapható?)

Ezen az oldalon térképen jelenik meg, hogy hol lehet a Revyn termékeket beszerezni.

### Főbb elemek:
- **Navigációs sáv**: Ugyanaz, mint az index oldalon.
- **Google Maps integráció**: A `#map` ID-jű div jeleníti meg a térképet 750px magasságban.
- **Footer**: Hírlevél feliratkozási lehetőség és navigációs linkek.

---
# Használt technológiák
- Html
- Css
- Js
- FontAwesome


# Projekt struktúrája
## Mappa struktúra
/ src 


├── js    
├── css        
├── html       

# Fő funkciók
- ki- be jelentekezés
- termékek vásárlása
- boltok keresése
- admin területen:
    - teremékek feltöltése
    - termékek szerkesztése
    - termék törlése
    - megrendelések    

