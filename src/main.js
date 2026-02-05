import './style.css';

document.querySelector('#app').innerHTML = `
  <div class="hud">
    <div class="badge">WebAR Prototype</div>
    <div class="hint">
      1) Allow camera<br/>
      2) Point at your printed image
    </div>
    <button id="startBtn" class="btn">Start AR</button>
    <a class="link" href="/HOW_TO_SWAP_TARGETS_AND_MODELS.md" target="_blank" rel="noreferrer">How do I swap the target + model?</a>
  </div>

  <!--
    MindAR can run as plain static HTML.
    Here we keep it simple but still use Vite for easy local dev in VS Code.
  -->
  <a-scene
    embedded
    renderer="colorManagement: true; physicallyCorrectLights: true"
    vr-mode-ui="enabled: false"
    device-orientation-permission-ui="enabled: false"
    mindar-image="imageTargetSrc: /targets.mind; autoStart: false; uiScanning: yes; uiLoading: yes;"
  >
    <a-assets>
      <!-- Drop your GLB into /public and rename it model.glb (or edit this path). -->
      <a-asset-item id="model" src="/model.glb"></a-asset-item>
    </a-assets>

    <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

    <!-- targetIndex: 0 means "the first image" in the .mind file -->
    <a-entity mindar-image-target="targetIndex: 0">
      <!-- If you don't provide a model.glb, you'll still see this fallback box -->
      <a-box position="0 0 0" rotation="0 0 0" scale="0.7 0.7 0.7"></a-box>

      <!-- Your 3D model (glTF/GLB) anchored to the image -->
      <a-gltf-model
        src="#model"
        position="0 0 0"
        rotation="0 0 0"
        scale="0.6 0.6 0.6"
      ></a-gltf-model>

      <!-- A tiny “label” floating above the target -->
      <a-entity position="0 0.55 0">
        <a-text value="Hello from WebAR 👋" align="center" width="2.2"></a-text>
      </a-entity>
    </a-entity>
  </a-scene>
`;

async function loadScriptsOnce() {
  // A‑Frame
  await loadScript('https://aframe.io/releases/1.5.0/aframe.min.js');
  // MindAR A‑Frame build (CDN)
  await loadScript('https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js');
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) return resolve();
    const s = document.createElement('script');
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error(`Failed to load ${src}`));
    document.head.appendChild(s);
  });
}

document.getElementById('startBtn').addEventListener('click', async () => {
  const btn = document.getElementById('startBtn');
  btn.disabled = true;
  btn.textContent = 'Starting…';

  try {
    await loadScriptsOnce();

    // When scripts load, A-Frame registers custom elements and builds the scene.
    // We wait one animation frame so the scene exists.
    await new Promise(r => requestAnimationFrame(r));

    const scene = document.querySelector('a-scene');
    if (!scene) throw new Error('Scene not found.');

    // MindAR exposes a system named "mindar-image-system" in A‑Frame.
    const mindarSystem = scene.systems['mindar-image-system'];
    if (!mindarSystem) {
      throw new Error('MindAR system not found. Check that targets.mind exists in /public.');
    }

    await mindarSystem.start();
    btn.textContent = 'AR Running ✅';
  } catch (e) {
    console.error(e);
    btn.disabled = false;
    btn.textContent = 'Start AR';
    alert(
      `Could not start AR.\n\n` +
      `${e?.message || e}\n\n` +
      `Common fixes:\n` +
      `• Make sure /public/targets.mind exists (compiled from your image)\n` +
      `• Use HTTPS when testing on phones (or a tunnel)\n` +
      `• Try Safari on iPhone, Chrome on Android`
    );
  }
});
