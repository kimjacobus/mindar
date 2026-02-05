(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const n of e)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function a(e){const n={};return e.integrity&&(n.integrity=e.integrity),e.referrerPolicy&&(n.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?n.credentials="include":e.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function o(e){if(e.ep)return;e.ep=!0;const n=a(e);fetch(e.href,n)}})();document.querySelector("#app").innerHTML=`
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
    mindar-image="imageTargetSrc: ./targets.mind; autoStart: false; uiScanning: yes; uiLoading: yes;"
  >
    <a-assets>
      <!-- Drop your GLB into /public and rename it model.glb (or edit this path). -->
      <a-asset-item id="model" src="./model.glb"></a-asset-item>
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
`;async function d(){await s("https://aframe.io/releases/1.5.0/aframe.min.js"),await s("https://cdn.jsdelivr.net/npm/mind-ar@1.2.5/dist/mindar-image-aframe.prod.js")}function s(r){return new Promise((t,a)=>{if(document.querySelector(`script[src="${r}"]`))return t();const e=document.createElement("script");e.src=r,e.async=!0,e.onload=t,e.onerror=()=>a(new Error(`Failed to load ${r}`)),document.head.appendChild(e)})}document.getElementById("startBtn").addEventListener("click",async()=>{const r=document.getElementById("startBtn");r.disabled=!0,r.textContent="Starting…";try{await d(),await new Promise(o=>requestAnimationFrame(o));const t=document.querySelector("a-scene");if(!t)throw new Error("Scene not found.");const a=t.systems["mindar-image-system"];if(!a)throw new Error("MindAR system not found. Check that targets.mind exists in /public.");await a.start(),r.textContent="AR Running ✅"}catch(t){console.error(t),r.disabled=!1,r.textContent="Start AR",alert(`Could not start AR.

${(t==null?void 0:t.message)||t}

Common fixes:
• Make sure /public/targets.mind exists (compiled from your image)
• Use HTTPS when testing on phones (or a tunnel)
• Try Safari on iPhone, Chrome on Android`)}});
