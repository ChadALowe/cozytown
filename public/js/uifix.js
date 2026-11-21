/* ---- UI fixes: FPS counter setting, and Escape closes whatever game or panel is open ---- */
(function(){
/* FPS counter: off unless turned on in OPTIONS (it used to show for everyone and printed over game titles) */
const fpsEl=[...document.body.children].find(e=>/FPS$/.test(e.textContent||'')&&e.style.position==='fixed');
let on=false;try{on=localStorage.getItem('cz_fps')==='1'}catch(e){}
const apply=()=>{if(fpsEl)fpsEl.style.display=on?'':'none';for(const b of row.querySelectorAll('button'))b.classList.toggle('on',(b.dataset.fps==='1')===on)};
const card=document.getElementById('optCard'),q=card&&card.querySelector('[data-res]'),row=document.createElement('div');
row.className='row';row.innerHTML='<b>FPS COUNTER</b><button data-fps="0">OFF</button><button data-fps="1">ON</button>';
if(q)q.parentElement.after(row);
row.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();on=b.dataset.fps==='1';try{localStorage.setItem('cz_fps',on?'1':'0')}catch(_){}apply()});
apply();
/* Escape: if a game or panel is open, press its own close button (once), instead of opening the pause menu over it */
const RX=/^\s*(LEAVE|QUIT|EXIT|CLOSE|DONE|BACK|✕|×|LEAVE TABLE|STAND UP)\s*$/i,SKIP='#hud,#menu,#mbtns';
const vis=e=>{if(e.offsetParent===null&&getComputedStyle(e).position!=='fixed')return false;const r=e.getBoundingClientRect();if(r.width<2||r.height<2)return false;const s=getComputedStyle(e);return s.visibility!=='hidden'&&s.display!=='none'&&+s.opacity>0};
function closer(){const c=[...document.querySelectorAll('button,div,span,a')].filter(e=>e.children.length===0&&RX.test(e.textContent)&&!e.closest(SKIP)&&vis(e));
 if(!c.length)return null;/* prefer an explicit leave/quit over a back/done, and the last (top-most) overlay in the page */
 const rank=e=>/LEAVE|QUIT|EXIT|CLOSE|✕|×/i.test(e.textContent)?1:0;c.sort((a,b)=>rank(a)-rank(b));return c[c.length-1]}
addEventListener('keydown',e=>{if(e.key!=='Escape'||e.repeat)return;if(typeof menuOpen!=='undefined'&&menuOpen)return;const b=closer();if(!b)return;
 e.preventDefault();e.stopImmediatePropagation();if(b.onpointerdown&&!b.onclick)b.dispatchEvent(new PointerEvent('pointerdown',{bubbles:true}));else if(b.ontouchstart&&!b.onclick)b.dispatchEvent(new Event('touchstart',{bubbles:true}));else b.click()},true);
})();
/* the district name banner shouldn't sit on top of the pause menu */
(function(){if(typeof setMenu!=='function')return;const s0=setMenu;setMenu=function(v){const r=s0.apply(this,arguments);try{const d=document.getElementById('crDis');if(v&&d)d.style.opacity=0}catch(e){}return r}})();
