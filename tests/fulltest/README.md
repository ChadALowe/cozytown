# Full test

A bot that plays through the whole of Cozy Town in headless Chrome and writes a report. It never runs by itself.

**On GitHub:** Actions tab → **Full test** → **Run workflow**. Tick *Quick run* for a few-minute check of the first 12 buildings.
A full run takes about an hour. The report shows on the run's summary page, and the screenshots are attached as `fulltest-report`.

**On your computer:**

```
pip install playwright
python -m playwright install chromium
python tests/fulltest/run.py            # full run
python tests/fulltest/run.py --quick    # a few minutes
```

The report goes to `tests/fulltest/report/report.md` (with `report.json` and a `shots` folder of screenshots).

What it checks:

- the game boots from a clean save without errors, and how much memory it holds
- every action prompt on every map, found by walking a grid over the world
- every building: goes in and presses every action inside, then closes it again
- every outdoor action it found, from a fresh game each time
- every phone app opens
- Escape closes each mini-game instead of opening the pause menu over it
- a save survives a reload

It **fails** on any page error, a crashed step, a mini-game Escape can't close, or a save that doesn't survive.
Errors the game logged to `czErrs()`, actions that couldn't be closed and rooms you couldn't get into are listed as **warnings**.
