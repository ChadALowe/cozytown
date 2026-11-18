/* ===== Speedometer gauge: a round MPH dial with a needle, shown only while driving ===== */
(function(){
const el=document.getElementById('speed');if(!el)return;
const st=document.createElement('style');st.textContent='#speed{position:absolute;line-height:0;transform:none!important}#speed svg{width:100%;height:100%;display:block;filter:drop-shadow(0 2px 4px rgba(0,0,0,.6))}#speed text{font-family:monospace;font-weight:bold}';document.head.appendChild(st);
const C=100,R0=86;let t='';
const pt=(a,r)=>{const rad=(a-90)*Math.PI/180;return[C+Math.cos(rad)*r,C+Math.sin(rad)*r]};
const ang=v=>-135+Math.min(1,v/120)*270;
const arc=(v0,v1,r,col,w)=>{const a=pt(ang(v0),r),b=pt(ang(v1),r),large=(ang(v1)-ang(v0))>180?1:0;return '<path d="M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' A'+r+' '+r+' 0 '+large+' 1 '+b[0].toFixed(1)+' '+b[1].toFixed(1)+'" fill="none" stroke="'+col+'" stroke-width="'+w+'" stroke-linecap="round"/>'};
t+='<circle cx="100" cy="100" r="96" fill="#14161c" stroke="#9aa0ac" stroke-width="4"/><circle cx="100" cy="100" r="90" fill="#0c0e13" stroke="#3a3f4a" stroke-width="2"/>';
t+=arc(0,70,78,'#2a3a52',8)+arc(70,100,78,'#4a3a1a',8)+arc(100,120,78,'#5a1a1a',8);
for(let v=0;v<=120;v+=10){const major=v%20===0,a=ang(v),p1=pt(a,major?66:71),p2=pt(a,80);t+='<line x1="'+p1[0].toFixed(1)+'" y1="'+p1[1].toFixed(1)+'" x2="'+p2[0].toFixed(1)+'" y2="'+p2[1].toFixed(1)+'" stroke="'+(v>=100?'#ff5a4a':v>=70?'#ffb040':'#e8ecf4')+'" stroke-width="'+(major?3:1.6)+'"/>';if(major){const q=pt(a,52);t+='<text x="'+q[0].toFixed(1)+'" y="'+(q[1]+4).toFixed(1)+'" font-size="12" fill="#e8ecf4" text-anchor="middle">'+v+'</text>'}}
t+='<path id="gfill" d="" fill="none" stroke="#4aa8ff" stroke-width="8" stroke-linecap="round" opacity=".9"/>';
t+='<text x="100" y="138" font-size="30" fill="#fff" text-anchor="middle" id="mph">0</text><text x="100" y="156" font-size="12" fill="#9fb4d0" text-anchor="middle">MPH</text>';
t+='<g id="gndl"><polygon points="97,104 100,24 103,104" fill="#ff4a3a"/><polygon points="98.5,104 100,24 100,104" fill="#ff8a7a"/></g><circle cx="100" cy="100" r="8" fill="#2a2e38" stroke="#9aa0ac" stroke-width="2"/><circle cx="100" cy="100" r="3" fill="#ff4a3a"/>';
el.innerHTML='<svg viewBox="0 0 200 200">'+t+'</svg>';
const nd=document.getElementById('gndl'),fl=document.getElementById('gfill');let cur=0;
const mm=document.getElementById('mm');let lk='';
function place(){if(!mm)return;const r=mm.getBoundingClientRect(),s=Math.max(80,Math.min(r.width,r.height)*.92),k=[r.left,r.bottom,s].map(Math.round).join();if(k===lk)return;lk=k;el.style.width=el.style.height=s+'px';el.style.left=Math.round(r.left+(r.width-s)/2)+'px';el.style.top=Math.round(r.bottom+6)+'px';el.style.bottom='auto';el.style.right='auto'}
function upd(dt){const driving=!GS.onFoot&&!GS.inside&&!menuOpen;el.style.display=driving?'block':'none';if(!driving)return;place();
 const v=Math.abs(GS.speed)*2.237;cur+=(v-cur)*Math.min(1,dt*10);nd.setAttribute('transform','rotate('+(ang(cur)).toFixed(1)+' 100 100)');
 if(cur>1){const a=pt(ang(0),78),b=pt(ang(Math.min(cur,120)),78),large=(ang(Math.min(cur,120))-ang(0))>180?1:0;fl.setAttribute('d','M'+a[0].toFixed(1)+' '+a[1].toFixed(1)+' A78 78 0 '+large+' 1 '+b[0].toFixed(1)+' '+b[1].toFixed(1));fl.setAttribute('stroke',cur>100?'#ff4a3a':cur>70?'#ffb040':'#4aa8ff')}else fl.setAttribute('d','')}
const u0=updJob;updJob=function(dt){u0(dt);upd(dt)};
})();
