# Game modules

These files used to be one big `js/app.js`. They are still classic scripts that share globals, loaded in
number order by the boot list in `index.html`, and run back to back with no pause between them, so they
behave exactly like the single file did.

| File | What's in it |
|---|---|
| 01-core | renderer, textures, world data, mesh builder, terrain, home build, `bakeGroup` |
| 02-village | roads, signs, buildings, shop fronts, placement, street furniture, trees, sky |
| 03-player | car extras, player figure, wheels, time of day, state and input |
| 04-home-jobs | house interior, courier jobs, traffic, rain, music |
| 05-cars | Fiesta, Royal Mail van, Land Rover, car gallery, lamp glows |
| 06-life | shops and customers, clock, decor, garden, the cat, fishing, café |
| 07-people | villager figures and the clothing/hair geometry |
| 08-farm-pub | farm, food and energy, darts, zoom, bottle caps, herding, milking |
| 09-pub-games | fruit machine, scratch cards, pool |
| 10-garage-bowling | showroom, Joe's garage, spray booth, bowling |
| 11-clothing | character customiser, clothing shops (incl. Rani's Silk House), try-on |
| 12-table-football | pub table football |
| 13-bets-fc | Lucky Bets, Village Rovers FC ground and matchday |
| 14-services-range | hairdresser, estate agent, florist, shooting range |
| 15-football-engine | match engine v2 |
| 16-arcade | Neon Arcade and its games |
| 17-main | civilian traffic, cash shop, audio, UI, main loop |
| 18-corner-shop | Singh's corner shop: interior, Mr Singh, snacks and drinks menu |

## Rules when editing

- A file can't call a `function` declared in a **later** file while it is loading (top-level code).
  Inside functions that run later it's fine. If you need to wrap a function (`const f0=fn;fn=function(){…}`),
  its declaration must be in the same file or an earlier one.
- Don't declare the same function name twice; with separate files the later one only takes over once it loads.
