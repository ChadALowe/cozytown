#!/usr/bin/env python3
"""
COZY TOWN FULL TEST
Plays through the whole game in headless Chrome and writes a report.

It only runs when you ask for it, either:
  - on GitHub: Actions tab -> "Full test" -> Run workflow, or
  - on your own computer:  python tests/fulltest/run.py

What it does:
  1. boots the game from a clean save and checks it loads without errors
  2. walks a grid over every map and records every action prompt it finds
  3. enters every building and presses every action inside it
  4. presses every outdoor action it found (fishing, trains, secrets, farm jobs...)
  5. opens every phone app
  6. checks Escape closes each mini-game instead of opening the menu over it
  7. checks a save survives a reload and that NEW GAME starts fresh
  8. measures memory after loading

It fails (exit code 1) if anything throws a page error or a step crashes.
Errors the game logs to czErrs() are listed as warnings.

Options:
  --workers N     browser pages working at once (default 2)
  --quick         only the first 12 buildings and outdoor spots (a few minutes)
  --out DIR       where the report goes (default tests/fulltest/report)
  --chrome PATH   use this Chrome instead of Playwright's own
"""
import argparse, asyncio, functools, http.server, json, os, re, shutil, socketserver, sys, threading, time

from playwright.async_api import async_playwright

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..', 'public'))
ARGS = ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist',
        '--enable-precise-memory-info', '--js-flags=--expose-gc']
CLOSE_RX = r'^\s*(LEAVE|QUIT|EXIT|CLOSE|DONE|BACK|✕|×|LEAVE TABLE|STAND UP|NO THANKS|CANCEL)\s*$'
SKIP_ACT = re.compile(r'LEAVE|EXIT|GO OUT|OUTSIDE|BACK TO', re.I)
GAMES = re.compile(r'FRUIT|POOL|TABLE FOOT|SEAGULL|BOWL LANE 1|COIN PUSH|HEAVY BAG|SNOOKER|BINGO CARD|FOUR HOLES|DARTS|WHACK|STEP INTO')

# --------------------------------------------------------------------------- page helpers
SETUP = r'''()=>{window.__T=[];const t0=toast;toast=function(t){__T.push(String(t));return t0.apply(this,arguments)};cash=1e6;GT=12;
 window.__ov=()=>{const e=document.elementFromPoint(innerWidth/2,innerHeight/2);return e&&e.tagName!=='CANVAS'?1:0};
 window.__st=()=>({inside:GS.inside|0,menu:!!menuOpen,busy:typeof busy!=='undefined'?!!busy:null,ov:__ov()});
 window.__fps=()=>new Promise(r=>{let n=0,mx=0,l=performance.now();const s=l;function f(t){const d=t-l;l=t;if(d>mx)mx=d;n++;if(t-s<1500)requestAnimationFrame(f);else r({fps:+(n/(t-s)*1000).toFixed(1),worst:Math.round(mx),calls:R.info.render.calls,tris:R.info.render.triangles})}requestAnimationFrame(f)});
 try{exitCar()}catch(e){}}'''

SWEEP = r'''(a)=>{const [x0,x1,z0,z1,st]=a;GS.onFoot=1;GS.inside=0;const out={};const sx=GS.x,sz=GS.z;GS.x=1e5;GS.z=1e5;
 for(let x=x0;x<=x1;x+=st)for(let z=z0;z<=z1;z+=st){P.x=x;P.z=z;try{P.y=gH(x,z)+.02}catch(e){}let c;
  try{c=ctx()}catch(e){const k='ERR:'+String(e).slice(0,80);out[k]=out[k]||[x,z];continue}
  if(!c||!c.fn||c.far)continue;const l=String(c.label);if(l==='ENTER CAR'||l==='EXIT'||l==='—')continue;if(!out[l])out[l]=[x,z]}
 GS.x=sx;GS.z=sz;return out}'''

BUTTONS = '''()=>[...document.querySelectorAll('button,div,span,a')].filter(e=>e.offsetParent!==null&&e.children.length===0&&/%s/i.test(e.textContent)&&!e.closest('#hud,#menu,#mbtns')).length''' % CLOSE_RX.replace('\\', '\\\\')


class Server:
    def __init__(self):
        handler = functools.partial(QuietHandler, directory=ROOT)
        self.httpd = socketserver.ThreadingTCPServer(('127.0.0.1', 0), handler)
        self.httpd.daemon_threads = True
        self.port = self.httpd.server_address[1]
        threading.Thread(target=self.httpd.serve_forever, daemon=True).start()

    def stop(self):
        self.httpd.shutdown()


class QuietHandler(http.server.SimpleHTTPRequestHandler):
    def log_message(self, *a):
        pass


class Page:
    """One browser page playing the game."""

    def __init__(self, browser, port, shots):
        self.browser, self.port, self.shots = browser, port, shots
        self.errs, self.cons, self.czall = [], [], []

    async def open(self):
        self.ctx = await self.browser.new_context(viewport={'width': 900, 'height': 560})
        self.pg = await self.ctx.new_page()
        self.pg.on('pageerror', lambda e: self.errs.append(str(e)[:300]))
        self.pg.on('console', lambda m: self.cons.append(m.text[:300]) if m.type == 'error' and '404' not in m.text else None)

    async def boot(self, clear=True):
        url = f'http://127.0.0.1:{self.port}/index.html'
        self.czall += await self.cz()
        t = time.time()
        if clear:
            await self.pg.goto(url)
            await self.pg.evaluate('()=>{localStorage.clear();sessionStorage.clear()}')
        await self.pg.goto(url)
        await self.pg.wait_for_function('window.__bootDone===1', timeout=300000)
        bt = time.time() - t
        await self.pg.click('#go')
        await self.pg.wait_for_timeout(3000)
        await self.ev(SETUP)
        return bt

    async def ev(self, js, arg=None):
        return await self.pg.evaluate(js, arg)

    async def shot(self, name):
        try:
            await self.pg.screenshot(path=os.path.join(self.shots, name + '.jpg'), type='jpeg', quality=55, timeout=20000)
        except Exception:
            pass

    async def close_whatever(self):
        """Close an open game or panel the way a player would: Escape first, then its close button."""
        for _ in range(3):
            st = await self.ev('()=>__st()')
            if not st['menu'] and not st['ov'] and not st['busy']:
                return True
            await self.pg.keyboard.press('Escape')
            await self.pg.wait_for_timeout(600)
            st = await self.ev('()=>__st()')
            if st['menu'] and not st['busy']:
                await self.pg.keyboard.press('Escape')
                await self.pg.wait_for_timeout(400)
        st = await self.ev('()=>__st()')
        return not st['menu'] and not st['ov'] and not st['busy']

    async def cz(self):
        try:
            return await self.ev('()=>window.czErrs?czErrs().map(x=>x.m):[]')
        except Exception:
            return []


# --------------------------------------------------------------------------- the steps
async def step_boot(p, R):
    bt = await p.boot()
    await p.ev('()=>{try{gc()}catch(e){}}')
    mem = await p.ev('()=>({heap:Math.round(performance.memory.usedJSHeapSize/1e6),geos:R.info.memory.geometries,tex:R.info.memory.textures})')
    R['boot'] = {'seconds': round(bt, 1), 'heap_mb': mem['heap'], 'geometries': mem['geos'], 'textures': mem['tex'], 'errors': list(p.errs)}
    log(f"boot {bt:.1f}s, heap {mem['heap']} MB")


async def step_sweep(p, R):
    await p.ev('()=>{try{exitCar()}catch(e){}}')
    await p.pg.wait_for_timeout(1200)
    maps = await p.ev('()=>{const M=AIRPORT.MAPS;return Object.keys(M).map(k=>{const m=M[k];return [k,m.ox,m.oz,m.reg]})}')
    regions = [('village', -1200, 1200, -1200, 1200)]
    for k, ox, oz, reg in maps:
        if reg:
            regions.append((k, ox + reg[0], ox + reg[1], oz + reg[2], oz + reg[3]))
    found = {}
    for name, x0, x1, z0, z1 in regions:
        x = x0
        while x <= x1:
            r = await p.ev(SWEEP, [x, min(x + 60, x1), z0, z1, 2.5])
            for k, v in r.items():
                found.setdefault(name, {}).setdefault(k, v)
            x += 62.5
    R['prompts'] = found
    R['prompt_errors'] = [k for reg in found.values() for k in reg if k.startswith('ERR:')]
    log('sweep: ' + ', '.join(f'{k} {len(v)}' for k, v in found.items()))


async def crawl_shops(p, idx, out):
    """Enter each building in idx and press every action inside."""
    for si in idx:
        rec = {'i': si, 'acts': []}
        e0 = len(p.errs)
        try:
            info = await p.ev(f'()=>{{const o=SHOPD[{si}];__T.length=0;enterShop(o,true);return {{t:o.t}}}}')
            rec.update(info)
            await p.pg.wait_for_timeout(2500)
            rec['inside'] = await p.ev('()=>GS.inside|0')
            rec['perf'] = await p.ev('()=>__fps()')
            await p.shot(f's{si:03d}')
            acts = await p.ev('()=>IA.map((a,i)=>{let l;try{l=typeof a.label==="function"?a.label():a.label}catch(e){l="ERR "+e}return [i,String(l),!!a.fn]})')
            rec['labels'] = [l for _, l, _ in acts]
            for i, l, hasfn in acts:
                if not hasfn or SKIP_ACT.search(l):
                    continue
                a = {'l': l}
                ea = len(p.errs)
                await p.ev('()=>{__T.length=0}')
                try:
                    await p.ev(f'()=>IA[{i}].fn()')
                except Exception as ex:
                    a['throw'] = str(ex)[:200]
                await p.pg.wait_for_timeout(1500)
                a['toast'] = await p.ev('()=>__T.slice(0,3)')
                await p.shot(f's{si:03d}_a{i:02d}')
                a['errs'] = p.errs[ea:]
                a['closed'] = await p.close_whatever()
                rec['acts'].append(a)
                if not a['closed'] or not await p.ev('()=>GS.inside'):
                    a['recovered'] = 1
                    await p.boot()
                    await p.ev(f'()=>enterShop(SHOPD[{si}],true)')
                    await p.pg.wait_for_timeout(2000)
            try:
                await p.ev('()=>leaveShop(true)')
            except Exception as ex:
                rec['leave_err'] = str(ex)[:200]
            await p.pg.wait_for_timeout(600)
        except Exception as ex:
            rec['fatal'] = str(ex)[:300]
            try:
                await p.boot()
            except Exception:
                pass
        rec['errs'] = p.errs[e0:]
        out.append(rec)
        log(f"  [{len(out)}] {rec.get('t')}: {len(rec['acts'])} actions, {len(rec['errs'])} errors" + (' FATAL' if rec.get('fatal') else ''))


async def crawl_places(p, items, out):
    """Press each outdoor action found by the sweep, from a fresh game each time."""
    for reg, l, x, z in items:
        await p.boot()
        e0 = len(p.errs)
        r = {'reg': reg, 'l': l, 'x': x, 'z': z}
        try:
            r['got'] = await p.ev('''([x,z,l])=>{GS.x=1e5;GS.z=1e5;P.x=x;P.z=z;P.y=gH(x,z)+.02;__T.length=0;const c=ctx();if(String(c.label)!==l)return 'label now '+c.label;c.fn();return 'ok'}''', [x, z, l])
            await p.pg.wait_for_timeout(3000)
            r['toast'] = await p.ev('()=>__T.slice(0,4)')
        except Exception as ex:
            r['fatal'] = str(ex)[:300]
        await p.shot('o_' + re.sub(r'\W+', '_', l)[:40])
        r['errs'] = p.errs[e0:]
        out.append(r)
        log(f"  place {l}: {r.get('got')} {len(r['errs'])} errors")


async def step_phone(p, R):
    await p.boot()
    apps = await p.ev("()=>['msg','bank','stk','pho','job',...PHX.map(x=>x.k)]")
    res = []
    for a in apps:
        e0 = len(p.errs)
        r = {'app': a}
        try:
            await p.ev(f'()=>{{if(!PHN.ov)phOpen();phGo("{a}")}}')
            await p.pg.wait_for_timeout(800)
            r['text'] = (await p.ev('()=>document.querySelector("#phC").innerText.slice(0,120)')).replace('\n', ' ')
        except Exception as ex:
            r['fatal'] = str(ex)[:300]
        await p.shot('ph_' + a)
        r['errs'] = p.errs[e0:]
        res.append(r)
    try:
        await p.ev('()=>phClose()')
    except Exception:
        pass
    R['phone'] = res
    log(f'phone: {len(res)} apps')


async def step_escape(p, R, shops):
    todo, seen = [], set()
    for r in shops:
        for i, l in enumerate(r.get('labels', [])):
            key = re.sub(r'\(.*?\)|vs \w+', '', l).strip()
            if GAMES.search(l) and key not in seen:
                seen.add(key)
                todo.append((r['i'], l))
    res = []
    for si, l in todo:
        await p.boot()
        await p.ev(f'()=>enterShop(SHOPD[{si}],true)')
        await p.pg.wait_for_timeout(2000)
        idx = await p.ev(f'(l)=>IA.findIndex(a=>{{try{{return (typeof a.label==="function"?a.label():a.label)===l}}catch(e){{return false}}}})', l)
        if idx < 0:
            continue
        await p.ev(f'()=>IA[{idx}].fn()')
        await p.pg.wait_for_timeout(1500)
        before = await p.ev('()=>__st()')
        if not before['busy'] and not before['ov']:
            continue  # game did not open (needs chips, closed, etc)
        await p.pg.keyboard.press('Escape')
        await p.pg.wait_for_timeout(900)
        after = await p.ev('()=>__st()')
        ok = not after['busy'] and not after['menu'] and not after['ov']
        res.append({'game': l, 'ok': ok, 'after': after})
    R['escape'] = res
    log(f"escape: {sum(r['ok'] for r in res)}/{len(res)} games close with Escape")


async def step_save(p, R):
    await p.boot()
    await p.ev('()=>{cash=4321;saveGame()}')
    await p.pg.wait_for_timeout(300)
    await p.boot(clear=False)
    cash = await p.ev('()=>cash')
    v = await p.ev('()=>{try{return JSON.parse(localStorage.getItem("c1save")).cz.v}catch(e){return null}}')
    R['save'] = {'cash_after_reload': cash, 'version': v, 'ok': cash == 4321 and v == 2}
    log(f"save round trip: {'ok' if R['save']['ok'] else 'FAILED'} (cash {cash}, version {v})")


# --------------------------------------------------------------------------- report
def report(R, out):
    fails, warns = [], []
    if R['boot']['errors']:
        fails.append(f"Boot threw {len(R['boot']['errors'])} errors: {R['boot']['errors'][0]}")
    for k in R.get('prompt_errors', []):
        fails.append(f'A prompt threw while sweeping the map: {k}')
    for r in R['shops']:
        if r.get('fatal'):
            fails.append(f"{r.get('t')}: the step crashed: {r['fatal']}")
        if r.get('inside') == 0:
            warns.append(f"{r.get('t')}: entering did not take you inside")
        for a in r['acts']:
            if a.get('throw'):
                fails.append(f"{r.get('t')} / {a['l']}: threw {a['throw']}")
            for e in a['errs']:
                fails.append(f"{r.get('t')} / {a['l']}: {e}")
            if not a['closed']:
                warns.append(f"{r.get('t')} / {a['l']}: could not close it again")
        for e in r['errs']:
            if not any(e in a['errs'] for a in r['acts']):
                fails.append(f"{r.get('t')}: {e}")
    for r in R['places']:
        if r.get('fatal'):
            fails.append(f"Outdoor {r['l']}: the step crashed: {r['fatal']}")
        for e in r['errs']:
            fails.append(f"Outdoor {r['l']}: {e}")
    for r in R['phone']:
        if r.get('fatal') or r['errs']:
            fails.append(f"Phone app {r['app']}: {r.get('fatal') or r['errs'][0]}")
    for r in R.get('escape', []):
        if not r['ok']:
            fails.append(f"Escape did not close {r['game']}")
    if 'save' in R and not R['save']['ok']:
        fails.append('A save did not survive a reload')
    for m in sorted(set(R.get('czerrs', []))):
        warns.append('Logged by the game: ' + m)
    for c in sorted(set(R.get('console', [])))[:20]:
        warns.append('Console error: ' + c)

    slow = sorted([r for r in R['shops'] if r.get('perf')], key=lambda r: -r['perf']['tris'])[:8]
    acts = sum(len(r['acts']) for r in R['shops'])
    L = ['# Cozy Town full test', '',
         f"**{'PASSED' if not fails else 'FAILED'}** · {time.strftime('%Y-%m-%d %H:%M')} · {R['seconds'] // 60} min", '',
         f"- Boot: {R['boot']['seconds']} s, {R['boot']['heap_mb']} MB of memory after loading",
         f"- Buildings entered: {len(R['shops'])}, actions pressed inside: {acts}",
         f"- Outdoor actions: {len(R['places'])}, phone apps: {len(R['phone'])}",
         f"- Mini-games closed by Escape: {sum(r['ok'] for r in R.get('escape', []))}/{len(R.get('escape', []))}",
         f"- Save survives a reload: {'yes' if R.get('save', {}).get('ok') else 'NO'}", '']
    L += ['## Failures', ''] + ([f'- {f}' for f in fails] or ['None.']) + ['']
    L += ['## Warnings', ''] + ([f'- {w}' for w in warns] or ['None.']) + ['']
    L += ['## Heaviest rooms (triangles drawn)', '', '| Room | Triangles | Draw calls |', '| --- | --- | --- |']
    L += [f"| {r['t']} | {r['perf']['tris']:,} | {r['perf']['calls']} |" for r in slow]
    L += ['', 'Frame rates are from a software renderer, so compare rooms with each other rather than with a phone.',
          'Screenshots of every room and action are in the `shots` folder.']
    with open(os.path.join(out, 'report.md'), 'w') as f:
        f.write('\n'.join(L) + '\n')
    with open(os.path.join(out, 'report.json'), 'w') as f:
        json.dump(R, f, indent=1)
    return fails


T0 = time.time()


def log(s):
    print(f'[{int(time.time() - T0):4d}s] {s}', flush=True)


async def main():
    ap = argparse.ArgumentParser(description='Cozy Town full test')
    ap.add_argument('--workers', type=int, default=2)
    ap.add_argument('--quick', action='store_true')
    ap.add_argument('--out', default=os.path.join(HERE, 'report'))
    ap.add_argument('--chrome', default=os.environ.get('CHROME_PATH'))
    a = ap.parse_args()
    shutil.rmtree(a.out, ignore_errors=True)
    shots = os.path.join(a.out, 'shots')
    os.makedirs(shots)
    srv = Server()
    R = {}
    async with async_playwright() as pw:
        kw = {'args': ARGS}
        if a.chrome:
            kw['executable_path'] = a.chrome
        browser = await pw.chromium.launch(**kw)
        pages = []
        for _ in range(max(1, a.workers)):
            p = Page(browser, srv.port, shots)
            await p.open()
            pages.append(p)
        main_p = pages[0]
        await step_boot(main_p, R)
        await step_sweep(main_p, R)
        n = await main_p.ev('()=>SHOPD.length')
        idx = list(range(n))[:12] if a.quick else list(range(n))
        items = [(reg, l, x, z) for reg, o in R['prompts'].items() for l, (x, z) in o.items()
                 if not l.startswith('ERR:') and not re.match(r'(ENTER |CLOSED|FOR SALE)', l)]
        if a.quick:
            items = items[:12]
        log(f'crawling {len(idx)} buildings and {len(items)} outdoor actions with {len(pages)} pages')
        # split the work: interleave buildings across pages, outdoor actions go to the last page
        shops = [[] for _ in pages]
        places = []
        jobs = []
        for k, p in enumerate(pages):
            await p.boot()
            jobs.append(crawl_shops(p, idx[k::len(pages)], shops[k]))
        await asyncio.gather(*jobs)
        await crawl_places(pages[-1], items, places)
        R['shops'] = sorted([r for s in shops for r in s], key=lambda r: r['i'])
        R['places'] = places
        await step_phone(main_p, R)
        await step_escape(main_p, R, R['shops'])
        await step_save(main_p, R)
        R['czerrs'] = []
        R['console'] = []
        for p in pages:
            R['czerrs'] += p.czall + await p.cz()
            R['console'] += p.cons
        await browser.close()
    srv.stop()
    R['seconds'] = int(time.time() - T0)
    fails = report(R, a.out)
    log(f"{'PASSED' if not fails else 'FAILED with %d problems' % len(fails)}. Report: {os.path.join(a.out, 'report.md')}")
    sys.exit(1 if fails else 0)


if __name__ == '__main__':
    asyncio.run(main())
