---
title: "Apotti – uhka kansanterveydelle?"
description: "Tämä kirjoitus on julkaistu alunperin 13.9.2012 Franticin blogissa."
pubDatetime: 2022-11-22T12:00:00.000Z
tags: []
---

Tämä kirjoitus on julkaistu alunperin 13.9.2012 [Franticin blogissa](https://web.archive.org/web/20120913044657/http://frantic.com/notes/31267318028).

A THREAT TO THE NATION’S HEALTH?

> _The Finnish state is about to buy a new healthcare IT system; the purchase is estimated to cost €1.8 billion. Read on (in Finnish only) to find out what we think about all this._

Suomen potilastietojärjestelmiä ollaan uudistamassa. Todennäköisin Suomen valinta uudeksi järjestelmäksi korvaamaan nykyiset järjestelmät on Accenturen Sitralle tekemässä Sirius-esiselvityksessä \[[1](https://web.archive.org/web/20120913044657/http://www.sitra.fi/NR/rdonlyres/EC4CA5AD-634B-4F80-8ACC-6E70FFAEAFFF/0/Sirius_Potilastietoj%C3%A4rjestelm%C3%A4kartoitus_tiivistelm%C3%A4.pdf)\] ykköseksi tullut yhdysvaltalaisen Epic Systemsin Epic-järjestelmä. Se on ohjelmoitu MUMPS- eli M-kielellä (Massachusetts General Hospital Utility Multi-Programming System), joka on melko eksoottinen, harvojen osaama ja tähän sektoriin tarkoitettu kieli. Sen ominaisuuksiin kuuluvat mm. yksimerkkiset lyhenteet funktioille, vasemmalta oikealle etenevä laskenta (2+3\*10 antaa tulokseksi 50) ja vain yksi datatyyppi (voit vähentää “OMENA”:sta “APPELSIINI”:n) \[[2](https://web.archive.org/web/20120913044657/http://thedailywtf.com/Articles/A_Case_of_the_MUMPS.aspx)\].

Näin ulkoa tarkastellen pessimisti voisi ajatella, että tällä järjestelmällä kaikki uudetkin tarvittavat ominaisuudet tulevat kalliiksi tehdä ja niiden toteutus on altis virheille. Sitoutumalla yhteen näin massiiviseen, yhden yrityksen toimittamaan suljetun koodin järjestelmään sen kanssa ollaan naimisissa vuosikymmeniä, maksoi mitä maksoi. Jos järjestelmä ei toimi kunnolla, se on uhka kansanterveydelle ja potilasturvallisuudelle, ei vain rahoillemme.

Uusi järjestelmä tulee arvioiden mukaan maksamaan 1 800 miljoonaa euroa \[[3](https://web.archive.org/web/20120913044657/http://www.tietoviikko.fi/kaikki_uutiset/hs+18+miljardin+euron+potilastietojarjestelmassa+accenturella+kaksoisrooli++suosittelee+ja+myy+samaa+jarjestelmaa/a821273)\] ja asiaa käsittelee huomenna tiistaina Helsingin kaupungin Terveyslautakunta \[[4](https://web.archive.org/web/20120913044657/http://www.hel.fi/hki/Terke/fi/P__t_ksenteko/Asiakirja?ls=11&doc=Terke_2012-09-11_Tervlk_13_El)\].

Asiasta voi lukea lisää mm. kirjoituksista \[[5](https://web.archive.org/web/20120913044657/http://vesirajassa.blogspot.fi/2012/06/epic-fail-eli-sairaaloiden-it-eilen.html)\] ja \[[6](https://web.archive.org/web/20120913044657/http://virrassa.wordpress.com/2012/09/09/hinnalla-milla-hyvansa-potilastietojarjestelma-vai-avaruussukkula/)\], kannattaa tutustua.

**Miten Frantic sen tekisi?**

Terveydenhoitojärjestelmässä on nähdäkseni kaksi ydinasiaa. Toinen on tiedon tallennus ja esittäminen. Toinen on prosessit ja niiden ohjaus. Näiden ei tarvitse olla samassa järjestelmässä eikä niiden tulisi olla samassa järjestelmässä näin massiivisessa palvelussa.

Rakentaisimme ytimeksi tietovaraston, jonne kaikki data tallennettaisiin loogisina yksikköinä (kuten potilas, lääkemääräys, laboratoriotesti, toimenpide, laskutettava asia). Se huolehtisi tiedon eheydestä, varmuuskopioinnista, saatavuudesta sekä tietosuojauksesta tarjoamalla autentikaation mukaiset tiedot avoimien ohjelmointirajapintojen kautta. Tietorakenteiden suunnittelu on periaatteessa helppoa. Työläintä on kerätä kaikkien eri tietorakenteiden erikoistapaukset ja suunnitella niille järkevät tietorakenteet. Tietokantapalvelimet ja tietokantaohjelmistot tällä vaatimustasolla ovat hinnaltaan yrityksen Extranet-palveluun verrattuna ihan toisessa kertaluokassa. Otetaan karkeaksi arvioksi, että tämän toteutus ja ylläpito viidelle vuodelle maksaisi 100 miljoonaa euroa, siis 100 000 000 euroa. Alle 20 euroa per suomalainen. Hinta-arvio ei voi olla kauheasti alakanttiin, koska pankit pystyvät tarjoamaan tilipalvelut ilmaiseksi ja verkkopankin joillakin euroilla kuukaudessa.

Rakentaisimme tietojen tarkasteluun moderneilla verkkotekniikoilla toimivan selainpohjaisen verkkopalvelun. Sen avulla tietoja voisi katsella ja lisätä. Verkkopalvelu hakisi datat edellä mainitusta tietovarastosta rajapintoja käyttäen. Tämä olisi perustason järjestelmä, jonka toimivuus (mm. vasteajat) ovat ihmisen käsitettävissä olevan kokoluokan projekti. Mikäli kaikki muu pettäisi, nämä kaksi olisivat aina käytettävissä. Otetaan karkeaksi arvioksi jälleen, että ollaan taas tavanomaista palvelua suuremmassa kertaluokassa ja että tämän toteutus ja ylläpito maksaisi viisi miljoonaa euroa. Ei siihen oikein saa enempää menemään, vaikka miten yrittäisi ja tuottaisi dokumentaatiota.

Nyt hintalappu olisi siis 105 miljoonaa euroa. Mutta nythän jäi vielä pois prosessit ja niiden ohjaus. Kyllä, tässä piilee ratkaisun avain. Näitä sovelluksia voisi ostaa helposti verkkopohjaisina tarpeiden muuttuessa, ja ainoa vaatimus olisi, että niihin kirjaudutaan samoilla käyttäjätunnuksilla (Single Sign On), ne auditoidaan ja että palvelun tekemät toiminnot johtavat lopulta aina tallennukseen tietovarastoon. Terveydenhuolto kehittyy ja muuttuu siinä missä muukin yhteiskunta. Näitä ohjelmia olisi ketterää ottaa käyttöön, yhdistää toisiin ja vaihtaa tarpeiden muuttuessa. Niiden toteutukseen, ylläpitoon ja käyttäjäkoulutukseen jäisi vielä vajaa 1,7 miljardia euroa. Syntyisi monta tuotetta maailmalle, uutta liiketoimintaa Suomeen ja ketteriä ratkaisuja terveydenhuoltoon.

Näin internetkin toimii, pienistä palasista tulee jotakin suurta ja toimivaa. Monoliittinen, suljetun koodin jättijärjestelmä ei ole tätä päivää ja sen hankinta on virhe.

_Kuvassa näkyy esimerkkipätkä perinteisestä M-koodilla tehdystä päivämääräkäsittelystä \[_[_7_](https://web.archive.org/web/20120913044657/http://faqs.cs.uu.nl/na-dir/m-technology-faq/part2.html)_\]._

### Author

> _Oskari Okko Ojala works as an Account Director and Senior Developer at Frantic. His dream is having his code running on some device on Mars. When not working, he’s likely to be online anyway or then somewhere along the Helsinki shoreline._
