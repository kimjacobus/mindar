(function(){const i=document.createElement("link").relList;if(i&&i.supports&&i.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const n of t.addedNodes)n.tagName==="LINK"&&n.rel==="modulepreload"&&o(n)}).observe(document,{childList:!0,subtree:!0});function a(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=a(e);fetch(e.href,t)}})();const s="/mindar/";document.querySelector("#app").innerHTML=`
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
    mindar-image="imageTargetSrc: ${s}targets.mind; autoStart: false; uiScanning: no; uiLoading: no;"
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
`;document.getElementById("startBtn").addEventListener("click",async()=>{const r=document.getElementById("startBtn");r.disabled=!0,r.textContent="Starting…";const i=(a,o)=>{console.error(a,o),r.disabled=!1,r.textContent="Start AR",alert(a+(o!=null&&o.message?`

${o.message}`:""))};try{const a=document.querySelector("a-scene");if(!a)throw new Error("Scene not found.");a.hasLoaded||await new Promise(n=>a.addEventListener("loaded",n,{once:!0})),await new Promise(n=>a.addEventListener("renderstart",n,{once:!0}));let o=null;try{o=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:!1})}finally{o&&o.getTracks().forEach(n=>n.stop())}const e=a.systems["mindar-image-system"];if(!e)throw new Error("MindAR system not found (script not loaded or scene created too early).");const t=e.start();await Promise.race([t,new Promise((n,l)=>setTimeout(()=>l(new Error("MindAR start timed out (camera blocked or initialization stalled).")),8e3))]),r.textContent="AR Running ✅"}catch(a){i("Could not start AR.",a)}});
