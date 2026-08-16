---
title: "Playing radio with a Flic Button + Amazon Alexa + My Pod skill + Wiim Pro"
description: "Here’s how I have implemented a feature to play my favorite radio stream by clicking a single button on my night stand. It consists of multiple steps."
pubDatetime: 2025-11-23T12:00:00.000Z
tags: []
---

Here’s how I have implemented a feature to play my favorite radio stream by clicking a single button on my night stand. It consists of multiple steps.

### A Flic button connected to Alexa

A button from Flic, [https://flic.io/](https://flic.io/), is needed.

In the Flic button settings I have mapped a button’s all action to Amazon Alexa:

![](/images/posts/playing-radio-with-a-flic-button-amazon-alexa-my-pod-skill-wiim-pro-66df21557d40-01-9cc5ce5afc.jpg)

### Radio streams configured to an Amazon Alexa skill “My Pod”

In the Amazon Alexa app I have added [an Amazon Alexa skill “My Pod” by avasoft.co.uk](https://www.amazon.com/Matt-Evans-My-Pod/dp/B077Y6GC3D) to my Alexa’s skills.

Then, with a browser, one can go to [https://mypodapp.com/](https://mypodapp.com/), login with the Amazon account, go to Playlists, create a playlist “Links” and then add each stream URL as a link there. As an example, I have defined

- [https://stream.radiohelsinki.fi/](https://stream.radiohelsinki.fi/), Radio Helsinki

and will get an Alexa Shortcut “Ask my pod to play Radio Helsinki”.

### Amazon Alexa routine to connect the button presses to ask the “My Pod” skill to play

I have added a routine for each button action to run the skill as if I talked to Alexa, and the long press to stop.

![](/images/posts/playing-radio-with-a-flic-button-amazon-alexa-my-pod-skill-wiim-pro-66df21557d40-02-283a0ca856.jpg)

_A routine to start playing the stream_

![](/images/posts/playing-radio-with-a-flic-button-amazon-alexa-my-pod-skill-wiim-pro-66df21557d40-03-ab4f3c2be9.jpg)

_A routine to stop playing_

### Connecting Alexa to the Wiim Pro streamer

Finally, I have connected the Alexa device to my [Wiim Pro streamer](https://www.wiimhome.com/wiimpro/overview), so Alexa will use that to play the streams.

![](/images/posts/playing-radio-with-a-flic-button-amazon-alexa-my-pod-skill-wiim-pro-66df21557d40-04-d5643b77c1.jpg)

### Conclusion

By combining this setup, only a single click is needed to start playing the stream and a long press will stop it. The integration works reliably.
