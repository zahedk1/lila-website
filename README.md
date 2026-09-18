# For Lila 💗 Website for Lila

A little storyline website — scroll through the story, the timeline, the
letter, and the reasons, then open the final surprise.

## Project structure

```
lila-website/
├── index.html      the whole site (hero -> story -> timeline -> gallery -> letter -> reasons -> music -> finale button)
├── style.css        all styling for index.html
├── script.js        countdown, floating hearts, scroll reveal, flip cards, music player
├── flower.html       the finale page (linked from the "Open it" button)
├── flower.css        styling + animation for the flower finale
├── flower.js         builds and choreographs the flower bloom in code
├── images/           put your photos here
└── music/            put your song file here
```

## How to run it

1. Open the `lila-website` folder in VS Code.
2. Install the **"Live Server"** extension (if you don't have it) — right-click
   `index.html` and choose **"Open with Live Server"**. This lets images,
   fonts, and the audio player load correctly (double-clicking the file
   directly can cause some browsers to block those).
3. That's it — no build step, no dependencies to install.

## What to personalize before sending it

- [ ] Replace the photos in `/images` (see the note file inside that folder
      for exactly which filenames are expected).
- [ ] Add your song file to `/music` and update its filename/title/artist
      in the "MUSIC PLAYER" section of `index.html`.
- [ ] Rewrite the placeholder text in the **Timeline** and **Reasons**
      sections of `index.html` — search for the word `REPLACE` to find every
      spot that expects your own words.
- [ ] Double check the letter text in the **Letter** section reads the way
      you want — it's ready to go, but it's yours to adjust.
- [ ] If you want a real ticking countdown instead of "Soon 💍", set the
      `WEDDING_DATE` constant near the top of `script.js`.

## About the flower finale

The flower on `flower.html` is a hand-built peony, drawn entirely in SVG and
grown petal by petal in code — not a stock animation or clipart. Petal
counts, sizes, colors, and timing all live in the `CONFIG` and `TIMING`
objects at the top of `flower.js` if you want to tweak how it blooms.
