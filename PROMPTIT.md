Aloitin suunnittelemalla Gemini 3 Pro kielimallin kanssa

## Prompti 
Hei, tehtäväni on tehdä kokoushuoneiden varausrajapinta. Palvelun tulee tarjota seuraavat toiminnot:
Varauksen luonti: Varaa huone tietylle aikavälille.
● Varauksen peruutus: Poista varaus.
● Varausten katselu: Listaa kaikki tietyn huoneen varaukset.
Toimintalogiikka (business rules):
● Varaukset eivät saa mennä päällekkäin (kaksi henkilöä ei voi varata samaa huonetta
samaan aikaan).
● Varaukset eivät voi sijoittua menneisyyteen.
● Aloitusajan täytyy olla ennen lopetusaikaa.
Tekniset reunaehdot:
● Voit käyttää mitä tahansa yleistä ohjelmointikieltä, joka on sinulle tuttu (Python,
JavaScript/TypeScript, Java, C# tai vastaava).
● Voit käyttää muistinvaraista tietokantaa (in-memory database), jotta ympäristön
pystytys pysyy yksinkertaisena (esim. PostgreSQL tai MySQL-asennusta ei vaadita).
Muuta huomioitavaa:
● Kuten oikeissakin työtehtävissä, tehtävänanto ei välttämättä sisällä kaikkea tarvittavaa
informaatiota. Koska käytettävissä ei ole “asiakasta” jolta kysyä lisätietoja, niin tehtävän
läpiviemiseksi saat tehdä itse oletuksia, kunhan dokumentoit tekemäsi oletukset.

Alkuperäiset vaatimukset jättävät avoimia kysymyksiä. Vaikka asiakasta ei ole, simuloi minun asiakastani. Minä kysyn sinulta kysymyksiä ja lisätietoja ja sinä vastaat niihin.

1. Montako kokoushuonetta järjestelmän tulee tukea

2. Pitääkö järjestelmässä määritellä millainen kokoushuone on

3. Varatessa varataanko jokin tietty huone vai vain mikä vain huone

4. Vaatiiko järjestelmä käyttöoikeuksia, tarvitaanko admin-oikeuksia?

5. Kuinka kauas tulevaisuuteen varauksia saa tehdö? Onko varauksilla maksimikesto?

6. Onko toimistolla aukioloajat? Millä aikavälillä huoneita saa varata?

7. Kuinka tarkkoja varausaikojen tulee olla? Pitääkö varausten alkaa esim. tasatunnein, vai milloin vain?

8. Pitääkö varauksia olla mahdollista muokata

9. Jos muokkaus vaaditaan, saako kuka tahansa poistaa kenen tahansa varauksen, vai vain oman varauksensa?

10. Mitä tietoja varauksesta pitää tallentaa, riittääkö varaajan nimi, vai tarvitaanko esim. aihe? 

## Vastaus
Hei! Hyppään mielelläni "asiakkaan" rooliin. Koska tehtävänannossa mainittiin, että asiakasta ei oikeasti ole ja saat tehdä oletuksia, nämä vastaukset toimivat hyvinä oletuksina, jotka voit kirjata dokumentaatioosi.

Tavoitteena on pitää ratkaisu tehtävänannon mukaisesti "yksinkertaisena", mutta silti järkevänä kokonaisuutena.

Tässä vastaukset kysymyksiisi:

1. Montako kokoushuonetta järjestelmän tulee tukea? Järjestelmän tulisi tukea useampaa huonetta, ei vain yhtä. Voit tässä vaiheessa kuitenkin kovakoodata järjestelmään esimerkiksi 3–5 kokoushuonetta (esim. "Neukkari 1", "Neukkari 2" jne.) tai antaa niiden olla dynaamisia. Emme tarvitse erillistä hallintanäkymää huoneiden luomiseen tässä vaiheessa.

2. Pitääkö järjestelmässä määritellä millainen kokoushuone on? Ei tarvitse. Tässä MVP-vaiheessa (Minimum Viable Product) riittää, että huoneella on yksilöivä tunniste (ID) ja nimi. Kapasiteettia tai varustelutietoja ei tarvita.

3. Varatessa varataanko jokin tietty huone vai vain mikä vain huone? Varatessa tulee kohdistaa varaus tiettyyn huoneeseen. Käyttäjä siis valitsee, minkä huoneen hän haluaa (esim. varataan huone ID:llä 1).

4. Vaatiiko järjestelmä käyttöoikeuksia, tarvitaanko admin-oikeuksia? Pidetään toteutus kevyenä: ei tunnistautumista tai käyttäjärooleja. Tehtävänannon mukaan kyseessä on yksinkertainen rajapinta, joten oletetaan, että API on sisäisessä verkossa luotettujen käyttäjien saatavilla.

5. Kuinka kauas tulevaisuuteen varauksia saa tehdä? Onko varauksilla maksimikesto? Tehtävänanto kieltää vain menneisyyteen varaamisen. Asiakkaana linjaan lisäksi:

    Ei aikarajaa sille, kuinka kauas tulevaisuuteen varataan.

    Ei teknistä maksimikestoa varaukselle (vaikka 24h kokous onkin epätodennäköinen, koodin ei tarvitse estää sitä).

6. Onko toimistolla aukioloajat? Millä aikavälillä huoneita saa varata? Ei rajoiteta aukioloaikoja koodissa. Huoneita saa varata 24/7. Tämä yksinkertaistaa logiikkaa, kun ei tarvitse huomioida viikonloppuja tai pyhäpäiviä.

7. Kuinka tarkkoja varausaikojen tulee olla? Pitääkö varausten alkaa esim. tasatunnein, vai milloin vain? Mennään minuuttitarkkuudella. Vaikka ihmiset varaavat yleensä tasatunteja, järjestelmän tulee teknisesti sallia varaus esim. ajalle 10:15–11:45. Tärkeintä on, että päällekkäisyydet estetään.

8. Pitääkö varauksia olla mahdollista muokata?

Ei tarvitse. Tehtävänannossa pyydettiin vain toiminnot: luonti, peruutus ja katselu. Jos käyttäjä haluaa muuttaa aikaa, hän voi peruuttaa vanhan ja tehdä uuden varauksen.

9. Jos muokkaus vaaditaan, saako kuka tahansa poistaa kenen tahansa varauksen? Koska meillä ei ole tunnistautumista (kohta 4), niin teknisesti kuka tahansa saa poistaa minkä tahansa varauksen, kunhan tietää varauksen ID:n. Tämä on hyväksyttävä puute tässä harjoituksessa.

10. Mitä tietoja varauksesta pitää tallentaa? Tallennetaan seuraavat tiedot:

    Varaajan nimi (pakollinen, jotta tiedetään kuka on varannut).

    Aikaväli (alku ja loppu).

    Huoneen tunniste.

    (Vapaaehtoinen lisä): Varauksen aihe/otsikko olisi kiva lisä, mutta ei pakollinen.

Yhteenveto dokumentaatiotasi varten: Voit kirjata PROMPTIT.md tai ANALYYSI.md tiedostoihin, että oletusarvona on "yksinkertainen, tunnistautumaton sisäverkon palvelu, jossa käyttäjät varaavat tiettyjä huoneita ilman aukioloaikarajoitteita".

## Prompti
Auta minua luomaan tekninen määrittely, user stories, api endpoint pdf tiedostoon näiden lisätietojen perusteella. Haluan käyttää Typescript/Node/Express ja SQLite tietokantaa (in memory)

## Vastaus
Tässä on tekninen määrittely kyseisestä aiheesta. Jos sitä tarvitsee muuttaa jollakin tavalla, ilmoitathan.
"Tekninen määrittely.pdf"

## Prompti
Auta minua keksimään ensimmäinen prompti teknisen määrittelyn pohjalta.

## Vastaus
Tämä on kriittisin vaihe. Ensimmäisen promptin laatu määrittää, kuinka paljon joudut "tappelemaan" tekoälyn kanssa myöhemmin.

Tehtävänannossa kehotetaan käyttämään tekoälyä junior-tason parikoodaajana. Lisäksi sinulla on nyt erittäin vahva tekninen suunnitelma ("Suunnitelma.pdf"), joten emme anna tekoälyn arvailla arkkitehtuuria, vaan pakotamme sen noudattamaan laatimaasi suunnitelmaa.

Tässä on ehdotus ensimmäiseksi promptiksi. Se on kirjoitusasultaan selkeä ja "seniorimainen" ohjeistus juniorille.
Ensimmäinen Prompt (Kopioi tämä tekoälylle)

Suosittelen käyttämään englantia promptissa teknisen tarkkuuden vuoksi, vaikka kommunikoitkin muuten suomeksi (tehtävänanto sallii englannin koodissa, commit-viestit suomeksi).

Prompt:
Markdown

Act as my Junior Pair Programmer. I will act as the Lead Developer.
Our task is to build a Meeting Room Booking API (MVP).

I have already designed the architecture. Your job is to implement the initial codebase based on my specifications.

**Technical Stack (Strict Requirements):**
* **Language:** Node.js (LTS) with TypeScript.
* **Framework:** Express.js.
* **Database:** SQLite using `better-sqlite3` library (running in-memory).
* **Validation:** Zod.
* **Architecture:** Layered Architecture (Controller -> Service -> Repository).

**Database Schema:**
Use the following structure for the SQLite database. Initialize tables on startup.
1.  **Rooms:**
    * `id` (TEXT, PRIMARY KEY) - e.g., "neukkari-1"
    * `name` (TEXT)
    * `capacity` (INTEGER)
2.  **Bookings:**
    * `id` (TEXT, PRIMARY KEY) - UUID
    * `roomId` (TEXT, FOREIGN KEY references Rooms)
    * `user` (TEXT) - Name of the user
    * `startTime` (TEXT) - ISO8601 UTC
    * `endTime` (TEXT) - ISO8601 UTC
    * `createdAt` (TEXT) - DEFAULT CURRENT_TIMESTAMP

**Required Endpoints (API Specification):**
1.  `GET /api/v1/rooms/:id/bookings`: List bookings for a specific room.
2.  `POST /api/v1/bookings`: Create a booking.
    * *Validation:* user required, valid ISO8601 dates, startTime < endTime, startTime not in past.
    * *Business Logic:* NO overlapping bookings allowed for the same room.
    * *Overlap Logic:* A conflict exists if (NewStart < ExistingEnd) AND (NewEnd > ExistingStart).
3.  `DELETE /api/v1/bookings/:id`: Cancel a booking.

**Instructions:**
1.  Set up the project structure (folder layout).
2.  Provide the `package.json` dependencies.
3.  Write the code for `server.ts` (or `app.ts`), and the Controller, Service, and Repository layers.
4.  Include a seed script to create 3-5 static meeting rooms on startup.
5.  Do NOT implement authentication yet.

Please generate the code.

Miksi tämä on hyvä prompt?

    Roolitus: Määrittelet heti suhteen (Lead vs. Junior), mikä vastaa tehtävänannon vaatimusta.

    Arkkitehtuurin pakotus: "Suunnitelma.pdf" -dokumentissa määrittelit Node.js:n, TypeScriptin, Expressin ja better-sqlite3:n. Tämä prompti estää tekoälyä käyttämästä esimerkiksi sequelize:a tai typeorm:ia, jotka monimutkaistaisivat yksinkertaista tehtävää.

    Tietomalli: Määrittelet tarkat sarakkeet ja tyypit (ISO8601 TEXT), kuten suunnitelmassa päätettiin. Tämä estää aikavyöhykesekoilut heti alussa.

    Logiikka: Prompti sisältää kriittisen kaavan päällekkäisyyksien tarkistamiseen: (NewStart < ExistingEnd) AND (NewEnd > ExistingStart). Tämä on yleisin kohta, jossa tekoäly tekee virheen (se tarkistaa usein vain onko aloitusaika varauksen sisällä), joten annoimme sille valmiin kaavan.


## Prompti - Tässä käytetty Antigravity IDE:ä ja Gemini 3 Pro (high) mallia
Act as my Junior Pair Programmer. I will act as the Lead Developer.
Our task is to build a Meeting Room Booking API (MVP).

I have already designed the architecture. Your job is to implement the initial codebase based on my specifications.

Technical Stack (Strict Requirements):
Language: Node.js with TypeScript.
Framework: Express.js.
Database: SQLite using better-sqlite3 library (running in-memory).
Validation: Zod.
Architecture: Layered Architecture (Controller -> Service -> Repository).

Database Schema:
Use the following structure for the SQLite database. Initialize tables on startup.
1.  Rooms:
    `id` (TEXT, PRIMARY KEY) - e.g., "neukkari-1"
    `name` (TEXT)
    `capacity` (INTEGER)
2.  Bookings:
    `id` (TEXT, PRIMARY KEY) - UUID
    `roomId` (TEXT, FOREIGN KEY references Rooms)
    `user` (TEXT) - Name of the user
    `startTime` (TEXT) - ISO8601 UTC
    `endTime` (TEXT) - ISO8601 UTC
    `createdAt` (TEXT) - DEFAULT CURRENT_TIMESTAMP

Required Endpoints (API Specification):
1.  `GET /api/v1/rooms/:id/bookings`: List bookings for a specific room.
2.  `POST /api/v1/bookings`: Create a booking.
    alidation:user required, valid ISO8601 dates, startTime < endTime, startTime not in past.
    usiness Logic:NO overlapping bookings allowed for the same room.
    verlap Logic:A conflict exists if (NewStart < ExistingEnd) AND (NewEnd > ExistingStart).
3.  `DELETE /api/v1/bookings/:id`: Cancel a booking.

Instructions:
1.  Set up the project structure (folder layout).
2.  Provide the `package.json` dependencies.
3.  Write the code for `server.ts` (or `app.ts`), and the Controller, Service, and Repository layers.
4.  Include a seed script to create 3-5 static meeting rooms on startup.
5.  Do NOT implement authentication yet.

## Vastaus


Project Initialization
Started project initialization.

Files Edited
tsconfig.json
package.json
Task
Progress Updates
1
Initializing project structure and dependencies

Database Implementation
Initialized project files (
package.json
, 
tsconfig.json
). Installing dependencies. Creating source directories.

Files Edited
Task
seed.ts
database.ts
Progress Updates
1
Implementing database connection, schema, and seed script

Core Logic Implementation
Initialized project structure, database layer, and implemented Zod schemas and Repositories.

Files Edited
Task
bookings.routes.ts
bookings.controller.ts
bookings.service.ts
bookings.repository.ts
rooms.repository.ts
Progress Updates
1
Implementing Zod schemas, Repositories, Services, and Controllers

2
Implementing Services, Controllers, and Routes

Server Setup
Implemented core logic including Zod schemas, Repositories, Services, Controllers and Routes.

Files Edited
Task
server.ts
Progress Updates
1
Implementing server entry point and error handling

Verification
Implemented the API and verified all requirements with a test script. All tests passed.

Files Edited
Walkthrough
Task
verify_api.ts
Progress Updates
1
Creating verification script and running tests

2
Documenting verification results and completing task

I have completed the implementation of the Meeting Room Booking API. The server is up and running, and I've verified the functionality/endpoints including the overlap logic

## Tässä vaiheessa projekti pyörii ja rakennetut testit läpäisevät

## Prompti
I want to test and analyze this project. The AI built tests pass but that does not necessarily mean everything works. Help me look for flaws in the project. I can use Postman for testing

## Vastaus
Researching Project & Flaw Detection
Verified all potential flaws. Creating FLAWS.md to document the found issues: idempotent delete violation, empty user validation, and architectural weaknesses regarding foreign keys and concurrency.

Files Edited
FLAWS.md
verify_empty_user.ts
analyze_flaws.ts
Progress Updates
1
Reading documentation and project structure

2
Inspecting implementation files for logic verification

3
Inspecting schema and controller files

4
Checking verification script

5
Creating and running analyze_flaws.ts

6
Verifying empty username flaw

7
Documenting findings in FLAWS.md

I have analyzed the project and found several flaws, including an idempotency violation, input validation gaps, and structural issues with the database and concurrency handling. I've documented these in FLAWS.md.

## Prompti - Tässä käytetty Claude Opus 4.5 mallia
Hei, miten testaisin näitä Flaws.md tiedoston kohtia postmanilla? Tahdon ymmärtää niitä itse

## Vastaus
Hei! Loistava tapa oppia - kokeilemalla itse! Katsotaan ensin myös API:n rakenne, jotta voin antaa tarkat Postman-ohjeet.

Analyzed

bookings.controller.ts
Error while viewing
rooms.controller.ts
Cannot view file outline for
rooms.controller.ts
which does not exist.
Searched
*
9 results
Analyzed
bookings.routes.ts#L1-16
Selvä! Nyt näen API:n rakenteen. Tässä ohjeet jokaisen FLAWS.md:n kohdan testaamiseen Postmanilla:

🧪 Postman-testausohjeet
API pyörii osoitteessa http://localhost:3000/api/v1 (tarkista portti omasta npm run dev -ulostulosta).

1.1 Idempotency Violation in Delete Operation
Tavoite: Todistaa, että DELETE ei ole idempotentti - sama pyyntö kahdesti tuottaa eri tuloksen.

Vaiheet:

Luo ensin varaus:
Method: POST
URL: http://localhost:3000/api/v1/bookings
Headers: Content-Type: application/json
Body (raw JSON):
json
{
  "roomId": "room-1",
  "user": "Testi Käyttäjä",
  "startTime": "2026-02-02T10:00:00Z",
  "endTime": "2026-02-02T11:00:00Z"
}
Odota vastaus: 201 Created ja id kentässä varauksen ID
Poista varaus ensimmäisen kerran:
Method: DELETE
URL: http://localhost:3000/api/v1/bookings/{id} (korvaa {id} oikealla ID:llä)
Odota vastaus: 204 No Content ✅
Poista sama varaus uudelleen:
Method: DELETE
URL: sama kuin yllä
Odota vastaus: 404 Not Found ❌ (Tämä on vika - pitäisi olla 204)
1.2 Missing Validation for User Name
Tavoite: Todistaa, että tyhjä käyttäjänimi hyväksytään.

Vaiheet:

Luo varaus tyhjällä käyttäjänimellä:
Method: POST
URL: http://localhost:3000/api/v1/bookings
Headers: Content-Type: application/json
Body (raw JSON):
json
{
  "roomId": "room-1",
  "user": "",
  "startTime": "2026-02-02T12:00:00Z",
  "endTime": "2026-02-02T13:00:00Z"
}
Odota vastaus: 201 Created ❌ (Tämä on vika - pitäisi olla 400 Validation Error)
2.1 Missing Foreign Key Enforcement
Tavoite: Todistaa, että varaus voidaan yrittää tehdä olemattomalle huoneelle (service estää, mutta DB ei).

Vaiheet:

Yritä varausta olemattomalle huoneelle:
Method: POST
URL: http://localhost:3000/api/v1/bookings
Body:
json
{
  "roomId": "olematon-huone-xyz",
  "user": "Testi",
  "startTime": "2026-02-02T14:00:00Z",
  "endTime": "2026-02-02T15:00:00Z"
}
Odota vastaus: 404 Not Found (Service estää tämän)
Huom: Tätä vikaa ei voi suoraan testata Postmanilla, koska Service-kerros tarkistaa huoneen. Vika ilmenisi vain suorassa tietokanta-operaatiossa.

2.2 Concurrency / Race Condition Risk
Tavoite: Demonstroida mahdollista tuplavarausta.

Tämä on vaikea testata Postmanilla, mutta voit kokeilla:

Avaa kaksi Postman-ikkunaa/tabia
Tee molempiin sama POST-pyyntö samalle ajalle:
json
{
  "roomId": "room-1",
  "user": "Käyttäjä A",
  "startTime": "2026-02-02T16:00:00Z",
  "endTime": "2026-02-02T17:00:00Z"
}
Lähetä molemmat mahdollisimman nopeasti
Huom: SQLite on synkroninen, joten tämä ei todennäköisesti tuota vikaa. Vika ilmenisi asynkronisessa ympäristössä.

2.3 Fragile Error Handling
Tavoite: Ymmärtää, miten virhekäsittely toimii.

Vaiheet:

Hae varauksia olemattomalle huoneelle:
Method: GET
URL: http://localhost:3000/api/v1/rooms/ei-olemassa/bookings
Odota vastaus: 404 ja viesti sisältää "not found"
Tämä vika on koodissa - controller etsii error.message.includes('not found'). Jos service muuttaisi viestiä esim. "Room not found" → "Huonetta ei löydy", API palauttaisi 500.

2.4 Time Synchronization
Tavoite: Todistaa, että "juuri nyt" varaukset voivat epäonnistua.

Vaiheet:

Luo varaus joka alkaa JUURI NYT:
Method: POST
URL: http://localhost:3000/api/v1/bookings
Body: (käytä tämänhetkistä aikaa)
json
{
  "roomId": "room-1",
  "user": "Testi",
  "startTime": "2026-02-01T13:19:30Z",
  "endTime": "2026-02-01T14:00:00Z"
}
Jos verkon viive on suuri, pyyntö voi hylätä "menneisyyteen" kuuluvana.

## Prompti
Korjasin koodia huomattavasti, jäikö minulta jotain huomaamatta?

## Vastaus
Mahtavaa työtä! 🎉 Olet tehnyt todella paljon hyvää refaktorointia. Tässä yhteenveto:

✅ Tekemäsi korjaukset
Korjaus	Tiedosto	Status
Virheluokat luotu	
src/errors/AppError.ts
✅
NotFoundError/ConflictError käytössä	
bookings.controller.ts
 (create)	✅
Transaktio race conditionin estoon	
bookings.service.ts
✅
Foreign Key PRAGMA	
database.ts
✅
Käyttämätön import poistettu	
database.ts
✅
Logger middleware	
server.ts
✅
roomId validointi	
booking.schema.ts
✅
Datetime viestien parannus	
booking.schema.ts
✅
⚠️ Huomasin yhden puuttuvan kohdan
bookings.controller.ts
:n 
list
 ja 
cancel
 metodit käyttävät edelleen string-matchingia:

typescript
// Rivit 46-47 ja 56-57 - vielä vanha tapa:
if (error.message.includes('not found')) {
Ja 
bookings.service.ts
:n 
getBookingsForRoom
 heittää vielä vanhan 
Error
:n:

Analyzed
bookings.service.ts#L1-54
Jep, rivi 45 käyttää vielä throw new Error(...):

typescript
// Rivi 45 - pitäisi olla:
throw new NotFoundError(`Room with ID ${roomId} not found`);
Ja controller tarvitsee päivityksen 
list
-metodiin:

typescript
// Rivi 46-47 - muuta:
} else if (error instanceof NotFoundError) {
    res.status(404).json({ error: error.message });
📋 Viimeiset korjaukset
bookings.service.ts
 rivi 45: new Error → new NotFoundError
bookings.controller.ts
 list-metodi: Käytä instanceof NotFoundError
Nämä ovat pieniä, mutta tekevät refaktoroinnista johdonmukaisen.

