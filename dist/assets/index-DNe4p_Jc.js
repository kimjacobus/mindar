(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))n(e);new MutationObserver(e=>{for(const r of e)if(r.type==="childList")for(const i of r.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&n(i)}).observe(document,{childList:!0,subtree:!0});function o(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?r.credentials="include":e.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(e){if(e.ep)return;e.ep=!0;const r=o(e);fetch(e.href,r)}})();const s="/mindar/";document.querySelector("#app").innerHTML=`
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
    mindar-image="imageTargetSrc: ${s}targets.mind; autoStart: false; uiScanning: yes; uiLoading: yes;"
  >
    <a-assets>
      <!-- Drop your GLB into /public and rename it model.glb (or edit this path). -->
      <a-asset-item id="model" src="${s}model.glb"></a-asset-item>
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
`;document.getElementById("startBtn").addEventListener("click",async()=>{const a=document.getElementById("startBtn");a.disabled=!0,a.textContent="Starting…";try{const t=document.querySelector("a-scene");if(!t)throw new Error("Scene not found.");t.hasLoaded||await new Promise(n=>t.addEventListener("loaded",n,{once:!0}));const o=t.systems["mindar-image-system"];if(!o)throw new Error("MindAR system not found. Make sure mindar-image-aframe script is loaded before the scene.");await o.start(),a.textContent="AR Running ✅"}catch(t){console.error(t),a.disabled=!1,a.textContent="Start AR",alert(`Could not start AR.

${(t==null?void 0:t.message)||t}`)}});
