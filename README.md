# MindAR + A‑Frame WebAR (Image Tracking) Quickstart

A tiny, **VS Code friendly** WebAR prototype:
- **MindAR** does the image tracking
- **A‑Frame** renders your 3D content

You’ll run it locally with Vite, then deploy it anywhere static (Netlify, Vercel, GitHub Pages, S3, etc).

## 1) Install + run

```bash
npm install
npm run dev
```

Open the URL Vite prints (typically `http://localhost:5173`).

> Testing on a phone:
> - Put your phone on the **same Wi‑Fi** and open the network URL Vite prints (it looks like `http://192.168.x.x:5173`).
> - Some browsers require **HTTPS** for camera access when not on localhost. If your phone blocks the camera, use a tunnel (Cloudflare Tunnel / ngrok) or deploy to a real HTTPS host.

## 2) Add your image target (the thing people scan)

MindAR image tracking needs a compiled **targets.mind** file.
Use the official Image Targets Compiler:

- Open the compiler page in your browser
- Upload your target image
- Download the `.mind` file
- Put it here:

`/public/targets.mind`

Compiler tool: https://hiukim.github.io/mind-ar-js-doc/tools/compile/  (docs)  

## 3) Add your 3D model

Drop a **GLB** model into:

`/public/model.glb`

If you don’t add a model, you’ll still see the fallback cube.

## Notes

- `targetIndex: 0` means the **first image** in your compiled `.mind` file.
- Want multiple targets? Compile multiple images together, then duplicate the `<a-entity mindar-image-target="targetIndex: X">` blocks for each index.
