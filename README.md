# trace.moe.js

A simple JS wrapper around the trace.moe API with typings

## How to install

```js
npm install trace.moe
// or
yarn add trace.moe
```

## How to get started

Importing the package in your project

```js
// Import the package
const { Client } = require("trace.moe");

// or (whatever you prefer)
const traceAPI = require("trace.moe");
const Client = traceAPI.Client;
```

Creating the client and (optional) adding an API key

```js
// If don't have an API key
const traceClient = new Client();

// If you have an API key
const traceClient = new Client(YOUR_API_KEY);
```

All set, let's request some anime!

## Examples

Getting quota usage and more<br>
_"Client" will be the Client we created above_

```js
const accountInfo = await traceClient.getAccountInfo();

/* accountInfo - Example
{
    id: "example@gmail.com",
    priority: 0,
    concurrency: 1,
    quota: 1000,
    quotaUsed: 43
}
*/
```

Getting similar anime by passing along an URL (or a valid buffer)

```js
// URL
const searchResults = await traceClient.getSimilarFromURL("https://example.com/example.png");

// or a Buffer (replace "valid buffer" with a buffer representing a buffer)
const searchResults = await traceClient.getSimilarFromBuffer("valid buffer");

// or if you want to pass options
const searchResults = await traceClient.getSimilarFromURL("https://example.com/example.png", { 
    cutBorders: true
});

/* searchResults - Example
{
    frameCount: 745406,
    error: "",
    result: [
        {
        anilist: {
            id: 99939,
            idMal: 34658,
            title: { 
                "native": "ネコぱらOVA", 
                "romaji": "Nekopara OVA", 
                english: null 
            },
            synonyms: ["Neko Para OVA"],
            isAdult: false
        },
        filename: "Nekopara - OVA (BD 1280x720 x264 AAC).mp4",
        episode: null,
        from: 97.75,
        to: 98.92,
        similarity": 0.9440424588727485,
        video: "https://media.trace.moe/video/99939/Nekopara%20-%20OVA%20(BD%201280x720%20x264%20AAC).mp4?t=98.33500000000001&token=xxxxxxxxxxxxxx",
        image: "https://media.trace.moe/image/99939/Nekopara%20-%20OVA%20(BD%201280x720%20x264%20AAC).mp4?t=98.33500000000001&token=xxxxxxxxxxxxxx"
        }
    ]
}
*/
```

## Using Options (all are optional)

| Option | Type | Description |
| --- | --- | --- |
| cutBorders | `boolean` | Cuts black borders from screenshots that for example are taking with a phone |
| aniListID | `number` | Search for a specific scene in an anime (in case you know the show name, but you forgot which episode) |
| anilistInfo | `boolean` | Wether to include extra info from AniList, might slowdown request | 
| useAdvancedPreviews | `boolean` | Replaces `video` and `image` with Media Classes |

```
/* MediaPreview
{
    url: string,
    muted: boolean,
    size: "SMALL", "MEDIUM", "LARGE",

    mute() // mutes audio of clip
    setSize() // changes the size of the clip (small, medium or large)
}
*/
```

## Docs
For full docs about trace.moe, visit https://soruly.github.io/trace.moe-api
All responses will be the same as documented there with the only exception being `options.useAdvancedPreviews`. This will override the `image` and `video` URLs of all results to `MediaClasses`.
