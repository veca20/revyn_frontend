# Revyn Frontend/Weboldal Dokumentáció
Ez a dokumentáció weboldal működését és célját írja le a Revyn weboldalhoz.
Amit közösen a társammal Szarvas Petrával alkottunk meg. Azt szerettük volna hogyan legyen egy olyan weboldalunk ahol egészséges illetve olyan termékeket tudunk arúsítani amik a sportólók számára kedveznek és edzés után vagy el tudják ezeket fogyasztani hogy másabbúl induljona  napjuk és igy meg alkottuk a Revyn márkát!



[REVYN az oldal](https://revyn.netlify.app/login.html)


Az oldal terve Figmában készült kisebb nagyobb változtatásokkal : [Figma](https://www.figma.com/design/KlrOcYakGPKJ5s0flexzjo/REVYN-PROJEKT?node-id=0-1&p=f&t=XAn30HcjmKRYZaq9-0)



# Tartalomjegyzék
### Index az az a fő oldal amiről több különböző oldalra tudunk navigálni:
    - About Revyn ahol az oldalról és a cégről tudunk meg információkat
    - Where To Buy ahol egy google térkép segítségével tudjuk meg nézni hol találhatóak azoka  boltok ahol a termékeket árúsítják
    - Veryfy Your Revny olal ahol azt tudjuk meg nézni mely országokban található még a termék 
    - Profil szerekesztés
    - Kilépés 
    - Kosár

## `index.html` (Főoldal / Shop)


![Mobil Nézete a kosár oldalnak](képek/kosar.png)
![Mobil Nézete a fő oldalnak](képek/fooldal.png)

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

## `registration.html` (Regisztráció)
- **Új felhasználók regisztrációja:**:
    - Keresztnév, vezetéknév, email és jelszó mezők
    - Űrlap validáció

![Mobil Nézete a regisztáció fülnek](képek/regisztracio.png)

![Mobil Nézete a login oldalnak](képek/login.png)

## `profileszerkesztes.html` (A felhasználók itt tudják szerkeszteni adataikat)
- **Regisztrált felhasználók számára:**:
    - Profiladatok szerkesztése
    - Jelszó változtatás

# E-kereskedelmi funkciók

## `product.html` (Termékek megjelenítésére szolgáló oldal)
    - Termékkép, név, ár és leírás
    - "Kosárba" funkció
    - Kosár számláló a fejlécben

![Mobil Nézete a rendelés leadása résznek](képek/product.png)

## `cart.html` ( Bevásálókosár és pénztár)
    - Elérhetőségi adatok gyűjtése
    - Szállítási cím űrlap
    - Fizetési folyamat
    - Kuponkód bevitele
    - Rendelés összegzés

![Mobil Nézete a rendelés leadása résznek](képek/redelesleadas.png)

# Admin felület

## `addproduct.html`(Új termék felvitele)
    - Terméknév, ár, készlet, leírás
    - Képfeltöltési lehetőség

## `editproduct.html`(Termékek szerkesztése és törlése)
    - Termékneve,ára,leírásának módosítása
    - Termék törlése

## `orders.html`(Itt találhatjuk a megrenedeléseket)
    - Megjeleníti az ügyfelek nevét, címét és számlázási adatait
    - Táblázatos formátum könnyű áttekintéshez



# Tartalom oldalak

## `AboutRevyn.html` (Márka történet)
    - Célkitűzés és értékek
    - Termék jellemzők és előnyök
    - Tudományos alapok az összetevőkhöz
    - Vélemények és jövőbeli tervek

![Mobil Nézete a rendelés le adása résznek](képek/about.png)
## `veryfyyourrevyn.html` (Országok ahol megtalálható a márka)
    - Vizuális országválasztó zászlókkal
    - 12 támogatott ország


---
# Technikai megvalósítás
## Frontend technológiák
- HTML5 szemantikus struktúra
- CSS a stílusozáshoz és reszponzív tervezéshez
- Font Awesome ikonok a felhasználói felülethez
- Mobil-first megközelítés hamburger menüvel

## Főbb JavaScript funkciók
    - Kosár kezelés (termékek hozzáadása/eltávolítása, mennyiség módosítása)
    - Űrlap validáció regisztrációhoz és pénztárhoz
    - Termékkezelés admin felhasználóknak
    - Dinamikus tartalom betöltése termékoldalakhoz

# Használati forgatókönyvek
## Vásárlói út:
    -Termékek böngészése → Kosárba → Pénztár → Fizetés
    -Fiók létrehozása → Profil szerkesztése → Rendelési előzmények

## Admin munkafolyamat:
    - Új termékek felvétele → Meglévő termékek szerkesztése → Rendelések megtekintése
    - Készlet és árazás kezelése

## Márka interakció:
    - Ismerje meg a Revyn történetét és küldetését
     -Hitelesítse termékét országonként


# Projekt struktúrája
## File struktúra
├── html/

│   ├── login.html               - Bejelentkezési oldal

│   ├── registration.html        - Felhasználói regisztráció

│   ├── editproduct.html        - termékek szerkesztése admin részére

│   ├── orders.html        - Rendelések megtekenitése admin részre 

│   ├── addproduct.html          - Admin termékfelvételi űrlap


│   ├── AboutRevyn.html          - Céginformációs oldal


│   ├── cart.html                - Bevásárlókosár és pénztár


│   ├── orders.html              - Admin rendeléskezelés


│   ├── product.html             - Termék részletes oldal


│   ├── profileszerkesztes.html  - Felhasználói profil szerkesztés


│   ├── veryfyyourrevyn.html     - Termék hitelesítés országonként

├── css/


│   ├── (a html -hez tartozó  stílusfájlok)


├── js/


│   ├── (a html-hez tartozó JavaScript fájlok)


├── img/

│   ├── logo.png                 - Márka logó


│   ├── flag/                    - Országzászlók hitelesítéshez

 # Jövőbeli fejlesztések
    - Keresési funkció hozzáadása termékekhez
    - Reszponzív design implementálása minden képernyőmérethez
    - Többnyelvű támogatás hozzáadása

# Az oldalon használt hivatkozások

[Netlyfy](https://www.netlify.com/)




[Git hub](https://github.com/)


[Git hub frontend ](https://github.com/veca20/revyn_frontend)


[Font Awesome](https://fontawesome.com/)


[Chat GPT](https://chatgpt.com/)


[DeepSeek](https://chat.deepseek.com/)


BEJELENTKEZÉS: 

nagyjuli@mail.com

123456



