---
title: "LongPlayt suoraan Kindleen"
description: "LongPlay voisi lisätä palveluunsa ominaisuuden, jolla uudet artikkelit tulevat suoraan tilaajien Kindle-lukulaitteisiin. Määrittelin toiminnallisuuden LP:lle valmiiksi, olkaa hyvä."
pubDatetime: 2016-09-11T12:00:00.000Z
tags: []
---

LongPlay voisi lisätä palveluunsa ominaisuuden, jolla uudet artikkelit tulevat suoraan tilaajien Kindle-lukulaitteisiin. Määrittelin toiminnallisuuden LP:lle valmiiksi, olkaa hyvä.

### Lisätään ensin käyttäjätietoihin Send-To-Kindle -sähköpostiosoitteelle oma kenttä

![](/images/posts/longplayt-suoraan-kindleen-219801294d87-01-641d6b2302.png)

“Amazonin asetuksiin…”-tekstilinkki osoittaisi osoitteeseen [https://www.amazon.com/gp/help/customer/display.html/?nodeId=200767340#approvefrom](https://www.amazon.com/gp/help/customer/display.html/?nodeId=200767340#approvefrom)

### Lähetys

Muodostetaan Send To Kindle -sähköpostiosoitteista oma sähköpostilistansa ja joko lähetetään sinne otsikolla “convert” artikkelin PDF-tiedosto sellaisenaan, tai konvertoidaan ensin artikkeli [Calibrella](https://calibre-ebook.com/) AZW- tai MOBI-tiedostoksi ja lähetetään se.

Liiteen voi lähettää tilaajille esimerkiksi tavallisella sähköpostiohjelmalla ja [MailGunilla](http://www.mailgun.com/pricing). Lähetyksessä ei voi käyttää samaa sähköpostilistapalvelua, jolla LP jo nyt ilmoittaa uusista artikkeleista sähköpostitse, sillä MailChimp ei tue liitetiedostoja suoraan sähköposteissa.

### Lopputulos

![](/images/posts/longplayt-suoraan-kindleen-219801294d87-02-49624a28ae.jpg)

### Muut mediat

Esimerkiksi Helsingin Sanomat voisi myydä tilauksia Amazonin kautta, jolloin aamun lehti toimitettaisiin automaattisesti Kindleihin. Tähän sopiva alusta on [Kindle Store, jossa on jo muita eurooppalaisia sanomalehtiä](https://www.amazon.com/s/ref=lp_165389011_nr_n_1?fst=as%3Aoff&rh=n%3A133140011%2Cn%3A%21133141011%2Cn%3A165389011%2Cn%3A2399044011&bbn=165389011&ie=UTF8&qid=1473582354&rnid=165389011). Silloin Amazon ottaa toki siivun tuloista, mutta jakelu skaalautuu satoihin tuhansiin ongelmitta.
