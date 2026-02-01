## 1. Mitä tekoäly teki hyvin?

Tekoäly onnistui luomaan toimivan pohjaratkaisun projektille yllättävän nopeasti. Projektin rakenne oli selkeä ja noudatti hyviä käytäntöjä: Controller-Service-Repository -kerrosarkkitehtuuri erotteli vastuut järkevästi, ja TypeScriptin käyttö Zodin kanssa toi tyyppiturvallisuutta validointiin. Kaikki vaaditut API-endpointit toteutettiin, ja varausten päällekkäisyystarkistus toimi odotetusti.

Erityisen hyvänä pidin sitä, että tekoäly käytti UUID:ta varausten tunnisteina ja lisäsi aikaleiman varauksen luontiin. Myös RESTful-periaatteiden noudattaminen reittien suunnittelussa oli johdonmukaista. Kokonaisuutena pohja oli hyvä, mutta pinnan alla piili useita pieniä ongelmia.

## 2. Mitä tekoäly teki huonosti?

Suurimmat ongelmat liittyivät siihen, mitä tekoäly jätti huomioimatta. DELETE-operaatio ei ollut idempotentti, mikä rikkoo HTTP-standardia: jo poistetun varauksen poistaminen palautti 404-virheen, vaikka oikea vastaus olisi ollut 204. Validoinnit olivat myös puutteelliset, sillä tyhjä käyttäjänimi hyväksyttiin ilman virhettä.

Virheenkäsittely oli toteutettu tavalla, jota en pitäisi hyvänä käytäntönä. Controller tarkisti virheviestejä string-matchingilla (`error.message.includes('not found')`), mikä on hauras ratkaisu: jos joku muuttaa virheviestin sanamuotoa, koko virheenkäsittely hajoaa. Sama koodi myös toistui jokaisessa controller-metodissa.

Tietokantapuolella Foreign Key -rajoitteet eivät olleet käytössä, koska SQLite vaatii erillisen `PRAGMA foreign_keys = ON` -komennon. Ilman tätä tietokannan eheys ei ole taattu. Lisäksi varausten päällekkäisyystarkistus ei ollut transaktiossa, mikä teoriassa mahdollistaa race condition-tilanteen, jos kaksi käyttäjää varaa saman ajan samanaikaisesti.

## 3. Tärkeimmät parannukset

Aloitin parannukset luomalla useita testejä, jotta varmistin tietokantapohjan toimivuuden. Tämä oli hyvä tarkistus, sillä löin useita pieniä ongelmia, jotka olivat aiheuttaneet epätoimivuuden. Tekoäly oli jo itse luonut muutaman testin, mutta ne olivat mielestäni puutteellisia, tästä oli hyvä jatkaa eteenpäin. Kysyin myös toiselta tekoälymallilta parannusehdotuksia, josta löin useita hyviä ehdotuksia. Olen aiemmissa projekteissani huomannut että tietyt mallit tulevat helposti sokeaksi omille virheilleen.

Tärkein tekemäni parannus oli virheenkäsittelyn uudistaminen. Loin omat virheluokat (`NotFoundError`, `ConflictError`) ja keskitetyn error handler -middlewaren. Tämä poisti toistuvan koodin controllereista ja teki virheenkäsittelystä tyyppipohjaiseen. Paljon varmatoimisempaa kuin string-matching. Controller-koodi lyheni merkittävästi ja on nyt helpommin ylläpidettävää.

Toinen keskeinen muutos oli tietokantatransaktion lisääminen. Vaikka SQLite on synkroninen, halusin noudattaa hyvää arkkitehtuuria: varauksen tarkistuksen ja tallennuksen tulee tapahtua yhtenä jakamattomana kokonaisuutena tietojen eheyden takaamiseksi.

Korjasin myös syötteiden validoinnit lisäämällä `.trim().min(1)` käyttäjänimelle ja roomId:lle. Nyt tyhjät arvot ja pelkät välilyönnit hylätään jo validointivaiheessa. Lisäksi otin Foreign Key -rajoitteet käyttöön ja lisäsin health check -tarkistuspisteen, jota tarvitaan tuotantoympäristössä load balancereiden kanssa.

Kaiken kaikkiaan tekoälyn tuottama koodi oli hyvä lähtökohta, mutta vaati kriittistä tarkastelua. Ilman refaktorointia koodissa olisi ollut useita piileviä ongelmia, jotka olisivat voineet aiheuttaa ongelmia tuotannossa. Muokkasin myös projektin rakennetta hieman selkeämmäksi, jotta sitä olisi helpompi ymmärtää ja ylläpitää.

Vaikka AI-avustettu kehitys on minulle jo tuttua, koin että opin tehtävästä paljon uutta. API-kehitys on minulle vielä melko uusi asia, ja siksi otinkin tämän tehtävän erityisesti oppimisen kannalta. Pyrin käyttämään tekoälyä niin, että ymmärtäisin jokaisen sen ehdottaman muutoksen toiminnan ja tarkoituksen. Olen huomannut että tekoälyllä on tapana valita jokin lähestymistapa hyvin nopeasti ja pysyä siinä, vaikka se ei ole aina parhain tapa. Siksi pyrinkin luomaan aluksi suunnitelmia, ja pyytämään aina useampia ratkaisuja ennenkuin valitsen jonkin millä lähdetään jatkamaan. Se että jokin ratkaisu toimii pintapuolisesti, ei mielestäni riitä. Lopputuloksen pitää olla kestävä.

Kiitoksia tästä mahdollisuudesta, odotan seuraavaa vaihetta innolla!