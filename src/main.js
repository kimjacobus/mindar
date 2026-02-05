import './style.css';


const BASE = import.meta.env.BASE_URL;

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
    mindar-image="imageTargetSrc: ${BASE}targets.mind; autoStart: false; uiScanning: no; uiLoading: no;"
  >
    <a-assets>
      <!-- Drop your GLB into /public and rename it model.glb (or edit this path). -->
      <a-asset-item id="model" src="${BASE}model.glb"></a-asset-item>
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

document.getElementById('startBtn').addEventListener('click', async () => {
  const btn = document.getElementById('startBtn');
  btn.disabled = true;
  btn.textContent = 'Starting…';

  const fail = (msg, err) => {
    console.error(msg, err);
    btn.disabled = false;
    btn.textContent = 'Start AR';
    alert(msg + (err?.message ? `\n\n${err.message}` : ''));
  };

  try {
    const scene = document.querySelector('a-scene');
    if (!scene) throw new Error('Scene not found.');

    // 1) Wait until A-Frame finished initializing
    if (!scene.hasLoaded) {
      await new Promise((resolve) => scene.addEventListener('loaded', resolve, { once: true }));
    }

    // 2) Wait until renderer is actually running (helps avoid timing weirdness)
    await new Promise((resolve) => scene.addEventListener('renderstart', resolve, { once: true }));

    // 3) Preflight camera permission INSIDE the click gesture
    // This removes a whole class of "stuck" starts.
    let tmpStream = null;
    try {
      tmpStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
    } finally {
      if (tmpStream) tmpStream.getTracks().forEach((t) => t.stop());
    }

    const sys = scene.systems['mindar-image-system'];
    if (!sys) throw new Error('MindAR system not found (script not loaded or scene created too early).');

    // 4) Add a timeout so you never get stuck forever
    const startPromise = sys.start();

    await Promise.race([
      startPromise,
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MindAR start timed out (camera blocked or initialization stalled).')), 8000)
      ),
    ]);

    btn.textContent = 'AR Running ✅';
  } catch (e) {
    fail('Could not start AR.', e);
  }
});
