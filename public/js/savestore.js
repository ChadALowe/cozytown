/* ---- ONE SAVE ----
   Everything the game keeps now lives in the single 'c1save' record (version 2). Modules that used to keep their own
   localStorage keys (car tuning, outfits, records, bets...) still call localStorage as before, but those keys are
   redirected into c1save.cz.side, so a save, a load and a NEW GAME always move together.
   Old saves are migrated the first time: the loose keys are copied in, and removed once a version-2 save is written. */
(function(){
const KEYS=['tune1','c1range','c1look','c1clo','c1kart','c1bets','c1fan','c1arc'],MAIN='c1save',VER=2;
const SP=Storage.prototype,g0=SP.getItem,s0=SP.setItem,r0=SP.removeItem;
const raw={get:k=>{try{return g0.call(localStorage,k)}catch(e){return null}},set:(k,v)=>{try{s0.call(localStorage,k,v);return true}catch(e){return false}},del:k=>{try{r0.call(localStorage,k)}catch(e){}}};
/* a NEW GAME reloads the page with this flag, so every module starts from scratch */
let fresh=false;try{fresh=sessionStorage.getItem('cz_newgame')==='1';sessionStorage.removeItem('cz_newgame')}catch(e){}
const SIDE={};let legacy=false;
if(!fresh){let d=null;try{d=JSON.parse(raw.get(MAIN)||'null')}catch(e){}
 const sd=d&&d.cz&&d.cz.side;
 if(sd&&typeof sd==='object')Object.assign(SIDE,sd);
 for(const k of KEYS){const v=raw.get(k);if(v!=null){legacy=true;if(SIDE[k]==null)SIDE[k]=v}}}
const mine=function(k){return this===localStorage&&KEYS.includes(k)};
/* write one side key straight into the existing save, so records and tuning stick without a manual save */
function persist(){let d=null;try{d=JSON.parse(raw.get(MAIN)||'null')}catch(e){}if(!d||!d.cz)return;d.cz.side=Object.assign({},SIDE);d.v=VER;if(raw.set(MAIN,JSON.stringify(d)))dropLegacy()}
function dropLegacy(){if(!legacy)return;for(const k of KEYS)raw.del(k);legacy=false}
SP.getItem=function(k){return mine.call(this,k)?(SIDE[k]!=null?String(SIDE[k]):null):g0.call(this,k)};
SP.setItem=function(k,v){if(!mine.call(this,k))return s0.call(this,k,v);SIDE[k]=String(v);persist()};
SP.removeItem=function(k){if(!mine.call(this,k))return r0.call(this,k);delete SIDE[k];persist()};
window.CZSAVE={VER,SIDE,fresh,
 /* called by cozySave: the side data rides along in every full save */
 attach(o){o.side=Object.assign({},SIDE);o.v=VER;setTimeout(dropLegacy,0);return o},
 newGame(){try{const cur=raw.get(MAIN);if(cur)raw.set(MAIN+'_prev',cur);raw.del(MAIN);for(const k of KEYS)raw.del(k);sessionStorage.setItem('cz_newgame','1')}catch(e){}location.reload()}};
})();
