/* ---- warm-up: build and upload everything once while loading, so nothing hitches mid-drive ----
   (traffic cars used to be built the first time they came near, and chunks/textures were uploaded
   to the GPU the first time they came into view; both caused brief freezes) */
(function(){
function warm(){
 try{
  const t0=performance.now();
  // 1. build every traffic car now
  if(typeof CIV!=='undefined'&&typeof civInst==='function'){for(const c of CIV){if(!c.inst&&!c.fail){const g=civInst(c);if(g){c.inst=g;g.visible=false;scene.add(g)}}if(!c.far){c.far=aiCar(c.col,FSTY[c.m]);c.far.visible=false}}}
  // 2. fetch the extra cars' textures now rather than 6 s in
  if(window.NC)for(const k in NC.cars)NC.cars[k].load();
  // 3. draw everything once into a tiny off-screen target (nothing flashes on screen)
  const rt=new THREE.WebGLRenderTarget(16,16),keep=[];
  scene.traverse(o=>{keep.push([o,o.visible,o.frustumCulled]);o.visible=true;o.frustumCulled=false});
  const sv=cam.position.clone();
  R.setRenderTarget(rt);R.render(scene,cam);R.setRenderTarget(null);
  for(const[o,v,f]of keep){o.visible=v;o.frustumCulled=f}
  rt.dispose();
  console.log('warm-up ms',Math.round(performance.now()-t0));
 }catch(e){console.warn('warm-up skipped',e)}
 window.WARMED=true;
}
let tries=0;(function wait(){if(window.READY===true){setTimeout(warm,300);return}if(++tries<600)setTimeout(wait,100)})();
// the extra cars' textures arrive asynchronously: draw them once more when they have landed
setTimeout(()=>{try{if(window.NC){const rt=new THREE.WebGLRenderTarget(16,16),keep=[];scene.traverse(o=>{keep.push([o,o.visible,o.frustumCulled]);o.visible=true;o.frustumCulled=false});R.setRenderTarget(rt);R.render(scene,cam);R.setRenderTarget(null);for(const[o,v,f]of keep){o.visible=v;o.frustumCulled=f}rt.dispose()}}catch(e){}},4500);
})();
