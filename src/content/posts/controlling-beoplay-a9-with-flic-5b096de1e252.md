---
title: "Controlling Beoplay A9 with Flic"
description: "How to get Beoplay A9 to start/stop playing TuneIn when a Flic button is pressed"
pubDatetime: 2021-01-01T12:00:00.000Z
tags: []
---

How to get Beoplay A9 to start/stop playing TuneIn when a [Flic](https://flic.io/) button is pressed

---

### To prepare:

- Set your DHCP server to give a fixed internal IP address to your Beoplay A9.
- In the Bang & Olufsen mobile app, choose the product -> Product Settings -> Configure -> Your Content -> TuneIn -> login with your TuneIn account.
- Setup your TuneIn favorites. See [https://okko.eu/yle-n-radiokanavat-manuaalisesti-tunein-palvelun-kautta-hifi-laitteesi-hakemistoon-b84bef7ab667](https://okko.eu/yle-n-radiokanavat-manuaalisesti-tunein-palvelun-kautta-hifi-laitteesi-hakemistoon-b84bef7ab667) if you’re from Finland and want to listen to YLE’s channels.

Go to Flic mobile app, choose the button, then define the Click, Double Click or Hold action to be an “Internet Request”.

---

### To define the Beoplay device to start playing TuneIn radio on the same channel it was previously playing:

Go to Flic mobile app, choose the button, then define the Click, Double Click or Hold action to be an “Internet Request”.

URL: http://10.0.200.3:8080/BeoZone/Zone/ActiveSources  
Method: POST  
Content type: application/json; charset=utf-8  
Body:  
{“primaryExperience”:{“source”:{“id”:”radio:2890.1200219.26008989@products.bang-olufsen.com”}}}  
Validate certificate(s): Off

The URL must be with the IP address, BeoPlay does not accept a hostname there.

### To define the Beoplay device to stop playing (any source):

Go to Flic mobile app, choose the button, then define the Click, Double Click or Hold action to be an “Internet Request”.

URL: http://10.0.200.3:8080/BeoZone/Zone/Stream/Stop  
Method: POST  
Content-type: application/json; charset=utf-8  
Body:  
*(leave body empty)  
*Validate certificate(s): Off

---

### Which devices are supported?

I have only tested BeoPlay A9 3rd gen. Let me know if you do the same on some other Bang & Olufsen product. These should be supported according to [https://beointegration.com/direct-ip-drivers/](https://beointegration.com/direct-ip-drivers/):

**Bang & Olufsen Audio Systems:  
**Beosound Stage  
Beosound 35  
Beosound Essence MKII  
Beosound Core  
Beosound Shape  
Beosound Edge  
Beosound 1 1st/2nd Gen  
Beosound 2 1st/2nd Gen  
Beolink Converter NL/ML  
Beoplay A9 2nd/3rd/4th Gen  
Beoplay A6  
Beoplay M5  
Beoplay M3

**Bang & Olufsen Active Loudspeakers:**  
BeoLab 90  
BeoLab 50

### Where could I get other request types?

Maybe from the code of [https://github.com/tlk/beoplay-macos-remote-cli](https://github.com/tlk/beoplay-macos-remote-cli)
