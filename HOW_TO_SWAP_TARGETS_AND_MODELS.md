# Swap the scanned image + the 3D content

## A) Swap the scanned image (image tracking target)

1) Go to MindAR’s Image Targets Compiler:
   https://hiukim.github.io/mind-ar-js-doc/tools/compile/

2) Upload your image (the one printed on your marketing stand).

3) Click compile, then download the output file (it ends with `.mind`).

4) Put it into this project at:

`public/targets.mind`

That’s it. Refresh your dev server.

## B) Swap the 3D model

1) Put your GLB file at:

`public/model.glb`

2) Refresh the page.

If you want a different filename, edit this line in `src/main.js`:

```html
<a-asset-item id="model" src="/model.glb"></a-asset-item>
```

## C) Replace the “Hello from WebAR” label

Edit this line in `src/main.js`:

```html
<a-text value="Hello from WebAR 👋" ...></a-text>
```

## D) Fix scale/orientation quickly

Common quick tweaks (in `src/main.js`):

- Rotate upright:
  `rotation="90 0 0"` or `rotation="0 180 0"`
- Scale:
  `scale="0.3 0.3 0.3"`
- Lift above the image:
  `position="0 0.2 0"`
