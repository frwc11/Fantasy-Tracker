# Dynasty Draft GM — Persistent Context
# This file is auto-read by Claude Code every session.

## LEAGUE SETTINGS
Format:        10-team Dynasty Startup, Superflex (2QB)
Lineup:        2QB / 2RB / 2WR / 1TE / 2FLEX / 3IDP / 1K
Bench:         12 bench, 3 IR, 3 taxi squad
Scoring:       Full PPR (1pt per reception)
               +0.5 bonus per TE reception (TE PREMIUM)
               Passing: 0.04/yd, 4pt TD, -2 INT
               Rushing: 0.1/yd, 6pt TD
               Receiving: 0.1/yd, 6pt TD
IDP:           Sack=4, Solo=1.5, Assisted=1, TFL=2, INT=4, FF=3,
               FR=3, Safety=3, PD=2, HIT_QB=1, Blocked=3,
               2+Sack Bonus=2, 3+PD Bonus=3, TD=6

## GM PHILOSOPHY
1. 2QB superflex → elite young QBs (age <26) are R1-R2 assets
2. IDP heavy format → Sack=4 means elite EDGEs = 20+ FPPG weeks
3. TE premium (+0.5/catch) → bump elite TEs 1-2 rounds vs standard
4. Age curve: RB 21-23 ideal / WR 21-24 / QB 22-26 / IDP 22-27
5. Taxi = raw upside only
6. Vegas lines inform context — high O/U teams boost WR/QB floor
7. IDP rookies undervalued every year
8. ATL win total 6.5 → Bijan Robinson and Drake London are FADES
9. ARI win total 3.5 → worst team context in NFL
10. Garrett→LAR, Verse→CLE (trade June 2, 2026)

## DATA FILES
- draft_board.csv     — 150 players, my_rank, gem/bust flags, VORP columns
- vorp_data.csv       — 91 players, positional VORP, 2QB-adjusted, TE premium, cliffs
- idp_model.csv       — 40 IDPs with projected FPPG (exact scoring weights)
- vegas_overlay.csv   — 80+ players with team win total flags
- round_report.md     — R1-R10 gems/busts narrative
- index.html          — live dashboard (5 tabs + VORP tab)

## CONFIRMED VORP CLIFF MAP (June 2026, live FantasyPros data)

### QB Cliffs (2QB adjusted, replacement = QB20)
- 🚨 MAJOR after Josh Allen:     109 → 64 Daniels  (−45, 41%)
- ⚠️  CLIFF after Jalen Hurts:    58 → 49 Dart      (−9,  16%)
- 🚨 MAJOR after Daniel Jones:    24 → 18 Goff       (−6,  25%) ← waiver tier
- KEY INSIGHT: Allen's 2QB gap (−45) is the single largest VORP drop on the board.
  Daniels/Maye/Jackson are essentially tied for QB2 status.

### RB Cliffs
- ⚠️  CLIFF after Bijan Robinson: 294 → 246 McCaffrey (−48, 16%)
- ⚠️  CLIFF after Saquon Barkley: 189 → 148 Hampton   (−41, 22%)
- TWO clear tiers: Gibbs/Robinson (elite) | McCaffrey–Barkley (tier 2) | Hampton+ (tier 3)

### WR Cliffs
- NO cliffs in WR1–WR24 range — curve is flat through WR15 (−59.5% R1→R15)
- First cliffs appear at WR25+ (aging/fringe players)
- ✅ CONFIRMED: Safe to wait on WRs until R4-R5

### TE Cliffs (TEP adjusted)
- McBride: 105 pts | Bowers: 100.5 pts — ESSENTIALLY TIED at top
- ⚠️  CLIFF after Bowers:      100.5 → 84 Loveland (−16.5, 16%)
- ⚠️  CLIFF after Loveland:     84   → 66.5 Warren (−17.5, 21%)
- TWO cliffs = THREE clear tiers: McBride/Bowers | Loveland | Warren+
- The TE window is REAL — missing both McBride and Bowers is catastrophic

### IDP Cliffs (estimated, FPPG-based)
- Elite tier (20+ FPPG): Carter, Hutchinson, Anderson, Garrett, Campbell
- CLIFF between elite and solid at ~18 FPPG
- Stash tier: age <24 EDGEs available R8+

---

## VORP-BASED DRAFT TRIGGERS

During live draft, auto-check after every pick:

### POST-PICK CHECKS
1. Has a cliff player just been taken?
   → Alert: "🚨 [POS] cliff hit — [next best] available at +X VORP"
2. Is the next player on my board a cliff player?
   → Proactive flag: "💡 [player] is last before [POS] cliff — draft window now"
3. Am I reaching across a cliff for lower-VORP player?
   → Flag: "⚠️ [player] is post-cliff — pivot to [alt pos] instead"
4. 3+ QBs taken in a round?
   → "QB RUN ALERT — grab one now or wait until R[X]"
5. Both McBride AND Bowers gone without me taking a TE?
   → "🚨 TE WASTELAND — both tier-1 TEs gone. Next best is Loveland (+84 TEP)"
6. Has Josh Allen been taken (by anyone)?
   → "Allen gone — massive 2QB VORP floor dropped. Daniels/Maye are now QB1"

### "WHO SHOULD I TAKE" FORMAT
Always answer in this format:

  [Player] | [Pos] | [Team]
  VORP: +[X] ([Nth] at pos) | 2QB Adj: +[X] (if QB)
  Drop to next: −[X] pts | Cliff: [YES/NO/MAJOR]
  Floor: [X] | Ceiling: [X] | Future: [X]
  Vegas: [BOOST/FADE/NEUTRAL] ([win total] wins)
  [🟢 SAFE / 🟡 REACH / 🔴 FADE] | [cliff note if applicable]
  → [TAKE / PASS / DEPENDS]

### CLIFF ALERT TRIGGERS (auto-fire without being asked)
| Trigger | Alert |
|---------|-------|
| Allen drafted | "🚨 QB1 VORP wall gone — 2QB gap now −45 below Allen" |
| Bowers + McBride both gone | "🚨 TE cliff — Loveland last R3 TE value" |
| Top-2 RBs (Gibbs+Robinson) gone | "⚠️ RB tier 1 empty — McCaffrey/Taylor are now RB1s" |
| Barkley gone | "⚠️ RB cliff — Hampton/Hall are tier 3 quality" |
| 3+ QBs in same round | "QB RUN — grab one now" |
| Gem falls 1+ round past target | "VALUE ALERT: [player] falling" |

---

## LIVE DRAFT STATE (updated during draft)
```
draft_state = {
  my_picks: [],
  all_picks: [],
  available: [],
  my_roster: {QB:[], RB:[], WR:[], TE:[], IDP:[], K:[], BENCH:[], TAXI:[]},
  needs: ["QB1","QB2","RB1","RB2","WR1","WR2","TE1","IDP1","IDP2","IDP3","FLEX1","FLEX2"],
  pick_number: 0,
  my_draft_position: null
}
```

## COMMANDS DURING DRAFT
| Command | Response |
|---------|----------|
| `who` | Top 5 available with VORP + cliff context |
| `qb` | Best QBs with 2QB-adjusted VORP |
| `rb` | Best RBs with positional VORP |
| `wr` | Best WRs + WR depth confirmation |
| `te` | Best TEs with TEP-adjusted VORP |
| `idp` | Best IDPs with FPPG projections |
| `cliff [pos]` | Current cliff status for that position |
| `vorp [player]` | Full VORP card for a player |
| `needs` | My roster gaps |
| `board` | Top 20 available |
| `danger [team]` | Analyze opponent threat |
| `bust [player]` | Quick bust case |
| `gem [player]` | Quick gem case |

## DRAFT MODE ACTIVATION
Say "DRAFT MODE ON" to activate live assistant mode.
All pick inputs accepted in format: `1.03 Ja'Marr Chase WR CIN [me]`
