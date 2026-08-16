---
title: "YLE:n radiokanavat manuaalisesti TuneIn-palvelun kautta Hifi-laitteesi hakemistoon"
description: "Miten syötän TuneIn-palveluun suosikkeihini streamin suoran osoitteen"
pubDatetime: 2020-11-01T12:00:00.000Z
tags: []
---

**Miten syötän TuneIn-palveluun suosikkeihini streamin suoran osoitteen**

- Rekisteröidy TuneIn-palveluun www-selaimella. Älä valitse maksullista versiota, vaan sulje sitä mahdollisesti tarjoavat dialogit, jos et halua maksullista versiota
- Lataa TuneIn-sovellus iOS:lle, kirjaudu siihen sisään samoilla tunnuksilla. Jos sinulle tarjotaan maksullista Premium-versiota, niin yläkulmasta löytyy X, jolla pääsee siitä ohi.
- Valitse iOS-sovelluksen alareunasta Library
- Klikkaa Custom URL
- Tähän valikkoon voit syöttää streamin suoran osoitteen.
- Jostain syystä Custom URL -vaihtoehtoa ei ole TuneIn-palvelun www-versiossa. Jos löydät sieltä, niin laita viestiä esim. Twitterissä @okko

**Miten löydän streamin suoran osoitteen?**

- Mene osoitteeseen [https://www.radioplayer.fi/haku](https://www.radioplayer.fi/haku)
- Avaa selaimen Developer Tools ja sieltä Network tab
- Hae “yle”
- Katso Network tabilta pyyntö [https://www.radioplayer.fi/api/v1/search?query=yle](https://www.radioplayer.fi/api/v1/search?query=yle)
- … vastauksesta löydät esim. “Yle Klassinen”-kohdalta “streamUrl”: “[https://yleradiolive.akamaized.net/hls/live/2027676/in-YleKlassinen/master.m3u8?hlsSegmentFormat=AAC](https://yleradiolive.akamaized.net/hls/live/2027676/in-YleKlassinen/master.m3u8?hlsSegmentFormat=AAC)”.
- Poimi osoite talteen ja ota sen lopusta pois“hlsSegmentFormat=AAC”. Lataa näin muodostunut osoite ja poimi kyseisestä tiedostosta haluamasi laatuinen stream, 256 on laadukkain. Listassa on kaksi 64-, kaksi 128- ja kaksi 256-tasoista streamia, joista toinen on varaosoite, kumpikin toimii.

YLE, älkää poistako tätä mahdollisuutta, please. Hifilaitteilla on tärkeää saada hakemisto pyörähtämään TuneInin kautta, koska niihin kaikkiin ei voi lisätä streameja suoraan. Nämä hifilaitteet **eivät soita** TuneIn-mainoksia ja niiden käyttäminen on siksi täysin YLE:n hengen mukaista. Terveisin, hifisti!
