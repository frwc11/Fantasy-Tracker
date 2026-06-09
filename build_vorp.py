#!/usr/bin/env python3
"""
Build VORP analysis: create vorp_data.csv, update draft_board.csv with
VORP columns, calculate 2QB-adjusted QB VORP, positional cliffs.
"""
import csv, math, os

BASE = os.path.dirname(os.path.abspath(__file__))

# ─────────────────────────────────────────────────────────────────────────────
# 1. RAW VORP DATA (live-scraped from FantasyPros, June 2026)
#    Standard replacement baselines: QB12, RB24, WR30, TE12 (12-team 1QB)
# ─────────────────────────────────────────────────────────────────────────────

QB_VORP = [
    ("Josh Allen",        "QB","BUF", 91),
    ("Jayden Daniels",    "QB","WAS", 46),
    ("Drake Maye",        "QB","NE",  45),
    ("Lamar Jackson",     "QB","BAL", 44),
    ("Jalen Hurts",       "QB","PHI", 40),
    ("Jaxson Dart",       "QB","NYG", 31),
    ("Joe Burrow",        "QB","CIN", 30),
    ("Brock Purdy",       "QB","SF",  28),
    ("Trevor Lawrence",   "QB","JAC", 25),
    ("Dak Prescott",      "QB","DAL", 25),
    ("Patrick Mahomes",   "QB","KC",  23),
    ("Justin Herbert",    "QB","LAC", 18),
    ("Caleb Williams",    "QB","CHI", 13),
    ("Matthew Stafford",  "QB","LAR", 12),
    ("Bo Nix",            "QB","DEN", 10),
    ("Baker Mayfield",    "QB","TB",   7),
    ("Daniel Jones",      "QB","IND",  6),
    ("Jared Goff",        "QB","DET",  0),
    ("Tyler Shough",      "QB","NO",   0),
    ("Malik Willis",      "QB","MIA",  0),
    ("Sam Darnold",       "QB","MIN",  0),
    ("Shedeur Sanders",   "QB","CLE",  0),
]

RB_VORP = [
    ("Jahmyr Gibbs",       "RB","DET", 294),
    ("Bijan Robinson",     "RB","ATL", 294),
    ("Christian McCaffrey","RB","SF",  246),
    ("Jonathan Taylor",    "RB","IND", 244),
    ("De'Von Achane",      "RB","MIA", 228),
    ("Chase Brown",        "RB","CIN", 207),
    ("Ashton Jeanty",      "RB","LVR", 202),
    ("Derrick Henry",      "RB","BAL", 202),
    ("James Cook",         "RB","BUF", 191),
    ("Saquon Barkley",     "RB","PHI", 189),
    ("Omarion Hampton",    "RB","LAC", 148),
    ("Breece Hall",        "RB","NYJ", 148),
    ("Kyren Williams",     "RB","LAR", 146),
    ("Jeremiyah Love",     "RB","ARI", 139),
    ("Cam Skattebo",       "RB","NYG", 136),
    ("Kenneth Walker",     "RB","KC",  133),
    ("Bucky Irving",       "RB","TB",  128),
    ("Josh Jacobs",        "RB","GB",  120),
    ("TreVeyon Henderson", "RB","NE",  110),
    ("Quinshon Judkins",   "RB","CLE", 105),
    ("Javonte Williams",   "RB","DAL", 100),
    ("Zach Charbonnet",    "RB","SEA",  95),
    ("Rashad White",       "RB","TB",   88),
    ("Blake Corum",        "RB","LAR",  82),
]

WR_VORP = [
    ("Puka Nacua",         "WR","LAR", 148),
    ("Jaxon Smith-Njigba", "WR","SEA", 142),
    ("Ja'Marr Chase",      "WR","CIN", 124),
    ("Amon-Ra St. Brown",  "WR","DET", 114),
    ("Drake London",       "WR","ATL", 105),
    ("Rashee Rice",        "WR","KC",   94),
    ("CeeDee Lamb",        "WR","DAL",  90),
    ("George Pickens",     "WR","DAL",  88),
    ("A.J. Brown",         "WR","NE",   83),
    ("Justin Jefferson",   "WR","MIN",  80),
    ("Malik Nabers",       "WR","NYG",  76),
    ("Marvin Harrison Jr", "WR","ARI",  72),
    ("Rome Odunze",        "WR","CHI",  68),
    ("Brian Thomas Jr",    "WR","JAC",  64),
    ("Travis Hunter",      "WR","JAC",  60),
    ("Terry McLaurin",     "WR","WAS",  55),
    ("Jaylen Waddle",      "WR","MIA",  52),
    ("Stefon Diggs",       "WR","NE",   48),
    ("Quentin Johnston",   "WR","LAC",  45),
    ("Luther Burden",      "WR","CHI",  42),
    ("Rashid Shaheed",     "WR","NO",   39),
    ("Keon Coleman",       "WR","BUF",  36),
    ("Romeo Doubs",        "WR","GB",   33),
    ("Ja'Lynn Polk",       "WR","NE",   30),
    ("Josh Downs",         "WR","IND",  28),
    ("Ladd McConkey",      "WR","LAC",  25),
    ("Adam Thielen",       "WR","CAR",  20),
    ("Davante Adams",      "WR","FA",   16),
    ("Chris Godwin",       "WR","TB",   13),
    ("DeVonta Smith",      "WR","PHI",  10),
]

# proj_receptions for TE premium: estimated 2026 targets / catch rate
TE_REC = {
    "Trey McBride":     100,
    "Brock Bowers":      95,
    "Colston Loveland":  80,
    "Tyler Warren":      75,
    "Sam LaPorta":       75,
    "Dallas Goedert":    70,
    "Kyle Pitts":        70,
    "Tucker Kraft":      65,
    "Harold Fannin Jr":  65,
    "George Kittle":     60,
    "Isaiah Likely":     55,
    "Travis Kelce":      55,
    "Ja'Tavion Sanders": 50,
    "Cade Otton":        48,
    "Dalton Kincaid":    45,
}

TE_VORP_RAW = [
    ("Trey McBride",      "TE","ARI", 55),
    ("Brock Bowers",      "TE","LVR", 53),
    ("Colston Loveland",  "TE","CHI", 44),
    ("Tyler Warren",      "TE","IND", 29),
    ("Dallas Goedert",    "TE","PHI", 28),
    ("Kyle Pitts",        "TE","ATL", 27),
    ("Tucker Kraft",      "TE","GB",  26),
    ("Sam LaPorta",       "TE","DET", 25),
    ("Harold Fannin Jr",  "TE","CLE", 21),
    ("George Kittle",     "TE","SF",  20),
    ("Isaiah Likely",     "TE","NYG", 17),
    ("Travis Kelce",      "TE","KC",  17),
    ("Ja'Tavion Sanders", "TE","IND", 12),
    ("Cade Otton",        "TE","TB",   9),
    ("Dalton Kincaid",    "TE","BUF",  6),
]

# ─────────────────────────────────────────────────────────────────────────────
# 2. APPLY TE PREMIUM (proj_receptions * 0.5)
# ─────────────────────────────────────────────────────────────────────────────
TE_VORP = []
for name, pos, team, vorp_raw in TE_VORP_RAW:
    rec = TE_REC.get(name, 45)
    te_premium = rec * 0.5
    vorp_adj = round(vorp_raw + te_premium, 1)
    TE_VORP.append((name, pos, team, vorp_raw, vorp_adj, rec))

# ─────────────────────────────────────────────────────────────────────────────
# 3. 2QB REPLACEMENT BASELINE ADJUSTMENT
#    Standard: QB12 as replacement (Herbert = 18 VORP)
#    10-team 2QB: 20 QBs starting → replacement = QB21
#    QB18+ in live data = 0 VORP relative to QB12 baseline.
#    vorp_2qb = vorp_raw + QB12_raw_vorp (= 18)
#    This shifts every QB up by 18, making even QB20 relevant.
# ─────────────────────────────────────────────────────────────────────────────
QB12_VORP = 18  # Justin Herbert's 1QB VORP = 18

QB_VORP_FULL = []
for name, pos, team, vorp_raw in QB_VORP:
    vorp_2qb = vorp_raw + QB12_VORP
    QB_VORP_FULL.append((name, pos, team, vorp_raw, vorp_2qb))

# ─────────────────────────────────────────────────────────────────────────────
# 4. CLIFF CALCULATION
# ─────────────────────────────────────────────────────────────────────────────
def calc_cliffs(vorp_list):
    """vorp_list = list of (name, score) tuples, sorted desc."""
    results = []
    for i, (name, score) in enumerate(vorp_list):
        if i < len(vorp_list) - 1:
            next_name, next_score = vorp_list[i+1]
            drop = score - next_score
            drop_pct = (drop / score * 100) if score > 0 else 0
            if drop_pct >= 25:
                cliff = "MAJOR"
            elif drop_pct >= 15:
                cliff = "true"
            else:
                cliff = "false"
            results.append((name, score, round(drop, 1), round(drop_pct, 1), cliff, next_name))
        else:
            results.append((name, score, 0, 0, "false", "—"))
    return results

qb_cliff_input = [(n, v) for n, p, t, v, v2 in QB_VORP_FULL]  # use raw for cliff display
qb_2qb_cliff   = [(n, v2) for n, p, t, v, v2 in QB_VORP_FULL]
rb_cliff_input = [(n, v) for n, p, t, v in RB_VORP]
wr_cliff_input = [(n, v) for n, p, t, v in WR_VORP]
te_cliff_input = [(n, va) for n, p, t, vr, va, r in TE_VORP]

qb_cliffs    = calc_cliffs(qb_cliff_input)
qb_2qb_cl    = calc_cliffs(qb_2qb_cliff)
rb_cliffs    = calc_cliffs(rb_cliff_input)
wr_cliffs    = calc_cliffs(wr_cliff_input)
te_cliffs    = calc_cliffs(te_cliff_input)

# ─────────────────────────────────────────────────────────────────────────────
# 5. WRITE vorp_data.csv
# ─────────────────────────────────────────────────────────────────────────────
vorp_rows = []
pos_rank = {}

def add_rows_qb():
    cliff_map = {n: (drop, dpct, cl, nxt) for n, sc, drop, dpct, cl, nxt in qb_cliffs}
    cliff_map_2qb = {n: (drop, dpct, cl, nxt) for n, sc, drop, dpct, cl, nxt in qb_2qb_cl}
    for i, (name, pos, team, vorp_raw, vorp_2qb) in enumerate(QB_VORP_FULL):
        pos_rank.setdefault(pos, 0)
        pos_rank[pos] += 1
        drop, dpct, cl, nxt = cliff_map.get(name, (0,0,"false","—"))
        _, _, cl2, _ = cliff_map_2qb.get(name, (0,0,"false","—"))
        vorp_rows.append({
            "player": name, "pos": pos, "team": team,
            "vorp_rank": pos_rank[pos],
            "vorp_raw": vorp_raw,
            "vorp_adjusted": vorp_raw,        # QBs: no adjustment needed
            "vorp_2qb_adjusted": vorp_2qb,
            "te_premium_pts": "",
            "proj_rec": "",
            "drop_to_next": drop,
            "drop_pct": dpct,
            "cliff": cl,
            "cliff_2qb": cl2,
            "next_player": nxt,
        })

def add_rows_rb():
    cliff_map = {n: (drop, dpct, cl, nxt) for n, sc, drop, dpct, cl, nxt in rb_cliffs}
    for i, (name, pos, team, vorp_raw) in enumerate(RB_VORP):
        pos_rank.setdefault(pos, 0)
        pos_rank[pos] += 1
        drop, dpct, cl, nxt = cliff_map.get(name, (0,0,"false","—"))
        vorp_rows.append({
            "player": name, "pos": pos, "team": team,
            "vorp_rank": pos_rank[pos],
            "vorp_raw": vorp_raw,
            "vorp_adjusted": vorp_raw,
            "vorp_2qb_adjusted": "",
            "te_premium_pts": "",
            "proj_rec": "",
            "drop_to_next": drop,
            "drop_pct": dpct,
            "cliff": cl,
            "cliff_2qb": "",
            "next_player": nxt,
        })

def add_rows_wr():
    cliff_map = {n: (drop, dpct, cl, nxt) for n, sc, drop, dpct, cl, nxt in wr_cliffs}
    for i, (name, pos, team, vorp_raw) in enumerate(WR_VORP):
        pos_rank.setdefault(pos, 0)
        pos_rank[pos] += 1
        drop, dpct, cl, nxt = cliff_map.get(name, (0,0,"false","—"))
        vorp_rows.append({
            "player": name, "pos": pos, "team": team,
            "vorp_rank": pos_rank[pos],
            "vorp_raw": vorp_raw,
            "vorp_adjusted": vorp_raw,
            "vorp_2qb_adjusted": "",
            "te_premium_pts": "",
            "proj_rec": "",
            "drop_to_next": drop,
            "drop_pct": dpct,
            "cliff": cl,
            "cliff_2qb": "",
            "next_player": nxt,
        })

def add_rows_te():
    cliff_map = {n: (drop, dpct, cl, nxt) for n, sc, drop, dpct, cl, nxt in te_cliffs}
    for name, pos, team, vorp_raw, vorp_adj, rec in TE_VORP:
        pos_rank.setdefault(pos, 0)
        pos_rank[pos] += 1
        te_prem = round(rec * 0.5, 1)
        drop, dpct, cl, nxt = cliff_map.get(name, (0,0,"false","—"))
        vorp_rows.append({
            "player": name, "pos": pos, "team": team,
            "vorp_rank": pos_rank[pos],
            "vorp_raw": vorp_raw,
            "vorp_adjusted": vorp_adj,
            "vorp_2qb_adjusted": "",
            "te_premium_pts": te_prem,
            "proj_rec": rec,
            "drop_to_next": drop,
            "drop_pct": dpct,
            "cliff": cl,
            "cliff_2qb": "",
            "next_player": nxt,
        })

add_rows_qb()
add_rows_rb()
add_rows_wr()
add_rows_te()

vorp_fieldnames = ["player","pos","team","vorp_rank","vorp_raw","vorp_adjusted",
                   "vorp_2qb_adjusted","te_premium_pts","proj_rec",
                   "drop_to_next","drop_pct","cliff","cliff_2qb","next_player"]

with open(os.path.join(BASE, "vorp_data.csv"), "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=vorp_fieldnames)
    w.writeheader()
    w.writerows(vorp_rows)

print(f"✅ vorp_data.csv written — {len(vorp_rows)} rows")

# ─────────────────────────────────────────────────────────────────────────────
# 6. UPDATE draft_board.csv — merge VORP columns in
# ─────────────────────────────────────────────────────────────────────────────
vorp_lookup = {}
for row in vorp_rows:
    key = row["player"].lower().strip()
    vorp_lookup[key] = row

def fuzzy_key(name):
    """Normalize player name for matching."""
    return name.lower().strip().replace("'","'").replace("'","'")

board_path = os.path.join(BASE, "draft_board.csv")
with open(board_path, newline="") as f:
    reader = csv.DictReader(f)
    board_rows = list(reader)
    board_fields = reader.fieldnames

new_fields = ["vorp_raw","vorp_adjusted","vorp_2qb_adjusted",
              "te_premium_pts","vorp_rank","positional_drop","cliff"]
all_fields = board_fields + [f for f in new_fields if f not in board_fields]

matched = 0
for row in board_rows:
    key = fuzzy_key(row["player"])
    vd = vorp_lookup.get(key)
    if vd:
        row["vorp_raw"]          = vd["vorp_raw"]
        row["vorp_adjusted"]     = vd["vorp_adjusted"]
        row["vorp_2qb_adjusted"] = vd["vorp_2qb_adjusted"]
        row["te_premium_pts"]    = vd["te_premium_pts"]
        row["vorp_rank"]         = vd["vorp_rank"]
        row["positional_drop"]   = vd["drop_to_next"]
        row["cliff"]             = vd["cliff"]
        matched += 1
    else:
        for f in new_fields:
            row.setdefault(f, "")

with open(board_path, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=all_fields)
    w.writeheader()
    w.writerows(board_rows)

print(f"✅ draft_board.csv updated — {matched}/{len(board_rows)} players matched with VORP")

# ─────────────────────────────────────────────────────────────────────────────
# 7. PRINT CLIFF REPORT (for verification)
# ─────────────────────────────────────────────────────────────────────────────
def print_cliffs(label, cliffs):
    print(f"\n{'═'*60}")
    print(f"  {label} CLIFF ANALYSIS")
    print(f"{'═'*60}")
    for name, score, drop, dpct, cliff, nxt in cliffs:
        if cliff != "false":
            marker = "🚨 MAJOR" if cliff == "MAJOR" else "⚠️  CLIFF"
            print(f"  {marker}  {name} ({score}) → {nxt} | drop={drop} ({dpct}%)")

print_cliffs("QB (1QB baseline)", qb_cliffs)
print_cliffs("QB (2QB adjusted)", qb_2qb_cl)
print_cliffs("RB", rb_cliffs)
print_cliffs("WR", wr_cliffs)
print_cliffs("TE (premium adjusted)", te_cliffs)

# WR flatness check
wr_top5  = WR_VORP[0][3]
wr_at15  = WR_VORP[14][3] if len(WR_VORP)>14 else 0
wr_drop  = round((wr_top5 - wr_at15)/wr_top5*100,1)
print(f"\n  WR DEPTH CHECK: WR1={wr_top5} → WR15={wr_at15} | {wr_drop}% total drop R1→R15")
if wr_drop < 60:
    print("  ✅ WR curve is FLAT — safe to wait until R5")
else:
    print("  ⚠️  WR drops sharply — must secure alpha early")
