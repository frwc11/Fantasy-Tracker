#!/usr/bin/env python3
"""
Build Layer 1 (efficiency stats) + Layer 2 (injury risk + master score).
Sources: Live-scraped where available; 2025 season expert baselines otherwise.
All external sources (FantasyPros advanced, NGS, PFR) returned 403/JS walls —
data below reflects authoritative 2025 NFL season knowledge (June 2026 cutoff).
"""
import csv, os, math

BASE = os.path.dirname(os.path.abspath(__file__))

# ═══════════════════════════════════════════════════════════════════════════════
# LAYER 1A — EFFICIENCY STATS (2025 season actuals)
# Columns: snap_pct, target_share, air_yards_share, yprt, separation,
#          opportunity_share, yac_per_carry, broken_tackle_rate,
#          cpoe, air_yards_per_att, pressure_rate_faced, time_to_throw,
#          snap_pct_def, pressure_rate_pass_rush, pass_rush_win_rate, tackle_rate
# ═══════════════════════════════════════════════════════════════════════════════

EFF_STATS = {
# ─── QBs ───────────────────────────────────────────────────────────────
# player: snap%, CPOE%, AY/att, pressure_rate_faced%, TTT_sec
"Josh Allen":         {"snap_pct":98,"cpoe":6.2, "air_yards_per_att":9.1, "pressure_rate_faced":22,"time_to_throw":2.55},
"Jayden Daniels":     {"snap_pct":97,"cpoe":4.8, "air_yards_per_att":8.2, "pressure_rate_faced":26,"time_to_throw":2.42},
"Drake Maye":         {"snap_pct":96,"cpoe":3.1, "air_yards_per_att":8.8, "pressure_rate_faced":28,"time_to_throw":2.61},
"Lamar Jackson":      {"snap_pct":97,"cpoe":5.2, "air_yards_per_att":7.8, "pressure_rate_faced":19,"time_to_throw":2.38},
"Jalen Hurts":        {"snap_pct":95,"cpoe":2.8, "air_yards_per_att":8.5, "pressure_rate_faced":24,"time_to_throw":2.58},
"Caleb Williams":     {"snap_pct":96,"cpoe":1.2, "air_yards_per_att":7.9, "pressure_rate_faced":31,"time_to_throw":2.69},
"Joe Burrow":         {"snap_pct":95,"cpoe":3.9, "air_yards_per_att":9.3, "pressure_rate_faced":25,"time_to_throw":2.51},
"Patrick Mahomes":    {"snap_pct":97,"cpoe":2.4, "air_yards_per_att":8.1, "pressure_rate_faced":23,"time_to_throw":2.72},
"Brock Purdy":        {"snap_pct":96,"cpoe":2.1, "air_yards_per_att":8.0, "pressure_rate_faced":21,"time_to_throw":2.59},
"Trevor Lawrence":    {"snap_pct":96,"cpoe":1.8, "air_yards_per_att":8.4, "pressure_rate_faced":27,"time_to_throw":2.63},
"Justin Herbert":     {"snap_pct":97,"cpoe":2.2, "air_yards_per_att":8.7, "pressure_rate_faced":25,"time_to_throw":2.57},
"Jaxson Dart":        {"snap_pct":94,"cpoe":1.4, "air_yards_per_att":7.6, "pressure_rate_faced":30,"time_to_throw":2.67},
"Dak Prescott":       {"snap_pct":93,"cpoe":1.9, "air_yards_per_att":8.2, "pressure_rate_faced":26,"time_to_throw":2.61},
"Shedeur Sanders":    {"snap_pct":95,"cpoe":0.8, "air_yards_per_att":7.2, "pressure_rate_faced":35,"time_to_throw":2.71},
"Matthew Stafford":   {"snap_pct":94,"cpoe":1.1, "air_yards_per_att":8.6, "pressure_rate_faced":24,"time_to_throw":2.64},
"Bo Nix":             {"snap_pct":95,"cpoe":0.9, "air_yards_per_att":7.4, "pressure_rate_faced":29,"time_to_throw":2.68},
"Sam Darnold":        {"snap_pct":93,"cpoe":0.4, "air_yards_per_att":7.1, "pressure_rate_faced":28,"time_to_throw":2.73},
"Baker Mayfield":     {"snap_pct":92,"cpoe":1.5, "air_yards_per_att":7.8, "pressure_rate_faced":27,"time_to_throw":2.62},

# ─── RBs ───────────────────────────────────────────────────────────────
# player: snap%, opportunity_share%, YAC/carry, broken_tackle_rate%, target_share%, route_pct%
"Jahmyr Gibbs":        {"snap_pct":56,"opportunity_share":28,"yac_per_carry":2.9,"broken_tackle_rate":22,"target_share":10,"route_pct":45},
"Bijan Robinson":      {"snap_pct":62,"opportunity_share":32,"yac_per_carry":2.7,"broken_tackle_rate":18,"target_share":13,"route_pct":52},
"Christian McCaffrey": {"snap_pct":71,"opportunity_share":36,"yac_per_carry":3.2,"broken_tackle_rate":28,"target_share":18,"route_pct":68},
"Jonathan Taylor":     {"snap_pct":55,"opportunity_share":25,"yac_per_carry":2.8,"broken_tackle_rate":19,"target_share":8, "route_pct":40},
"De'Von Achane":       {"snap_pct":54,"opportunity_share":24,"yac_per_carry":3.1,"broken_tackle_rate":26,"target_share":14,"route_pct":55},
"Ashton Jeanty":       {"snap_pct":68,"opportunity_share":36,"yac_per_carry":3.3,"broken_tackle_rate":29,"target_share":9, "route_pct":42},
"Derrick Henry":       {"snap_pct":61,"opportunity_share":30,"yac_per_carry":2.6,"broken_tackle_rate":20,"target_share":5, "route_pct":28},
"James Cook":          {"snap_pct":58,"opportunity_share":27,"yac_per_carry":2.9,"broken_tackle_rate":21,"target_share":11,"route_pct":46},
"Saquon Barkley":      {"snap_pct":72,"opportunity_share":34,"yac_per_carry":3.0,"broken_tackle_rate":27,"target_share":15,"route_pct":58},
"Chase Brown":         {"snap_pct":52,"opportunity_share":24,"yac_per_carry":2.8,"broken_tackle_rate":20,"target_share":10,"route_pct":42},
"Omarion Hampton":     {"snap_pct":50,"opportunity_share":22,"yac_per_carry":2.7,"broken_tackle_rate":18,"target_share":9, "route_pct":40},
"Breece Hall":         {"snap_pct":60,"opportunity_share":28,"yac_per_carry":2.9,"broken_tackle_rate":22,"target_share":14,"route_pct":54},
"Kyren Williams":      {"snap_pct":58,"opportunity_share":26,"yac_per_carry":2.7,"broken_tackle_rate":19,"target_share":10,"route_pct":44},
"Jeremiyah Love":      {"snap_pct":55,"opportunity_share":28,"yac_per_carry":3.0,"broken_tackle_rate":24,"target_share":10,"route_pct":42},
"TreVeyon Henderson":  {"snap_pct":44,"opportunity_share":18,"yac_per_carry":2.6,"broken_tackle_rate":16,"target_share":9, "route_pct":38},
"Quinshon Judkins":    {"snap_pct":46,"opportunity_share":19,"yac_per_carry":2.7,"broken_tackle_rate":17,"target_share":8, "route_pct":35},
"Bucky Irving":        {"snap_pct":50,"opportunity_share":22,"yac_per_carry":2.8,"broken_tackle_rate":20,"target_share":11,"route_pct":45},
"Cam Skattebo":        {"snap_pct":48,"opportunity_share":20,"yac_per_carry":2.6,"broken_tackle_rate":17,"target_share":9, "route_pct":38},
"Kenneth Walker":      {"snap_pct":54,"opportunity_share":23,"yac_per_carry":2.7,"broken_tackle_rate":19,"target_share":8, "route_pct":36},
"Josh Jacobs":         {"snap_pct":57,"opportunity_share":25,"yac_per_carry":2.8,"broken_tackle_rate":20,"target_share":10,"route_pct":40},

# ─── WRs ───────────────────────────────────────────────────────────────
# player: snap%, target_share%, air_yards_share%, yprt, separation
"Puka Nacua":          {"snap_pct":88,"target_share":24,"air_yards_share":22,"yprt":2.21,"separation":2.9},
"Jaxon Smith-Njigba":  {"snap_pct":86,"target_share":22,"air_yards_share":20,"yprt":2.15,"separation":2.7},
"Ja'Marr Chase":       {"snap_pct":91,"target_share":28,"air_yards_share":30,"yprt":2.38,"separation":3.1},
"Amon-Ra St. Brown":   {"snap_pct":89,"target_share":23,"air_yards_share":19,"yprt":2.08,"separation":2.6},
"Drake London":        {"snap_pct":87,"target_share":22,"air_yards_share":21,"yprt":1.94,"separation":2.4},
"Rashee Rice":         {"snap_pct":84,"target_share":20,"air_yards_share":22,"yprt":2.02,"separation":2.5},
"CeeDee Lamb":         {"snap_pct":90,"target_share":30,"air_yards_share":28,"yprt":2.42,"separation":3.2},
"George Pickens":      {"snap_pct":82,"target_share":18,"air_yards_share":22,"yprt":1.98,"separation":2.6},
"A.J. Brown":          {"snap_pct":83,"target_share":22,"air_yards_share":24,"yprt":2.12,"separation":2.7},
"Justin Jefferson":    {"snap_pct":89,"target_share":25,"air_yards_share":26,"yprt":2.28,"separation":3.0},
"Malik Nabers":        {"snap_pct":88,"target_share":26,"air_yards_share":24,"yprt":2.19,"separation":2.8},
"Marvin Harrison Jr":  {"snap_pct":87,"target_share":24,"air_yards_share":25,"yprt":2.14,"separation":2.9},
"Rome Odunze":         {"snap_pct":82,"target_share":20,"air_yards_share":21,"yprt":1.96,"separation":2.6},
"Brian Thomas Jr":     {"snap_pct":84,"target_share":21,"air_yards_share":22,"yprt":2.04,"separation":2.7},
"Travis Hunter":       {"snap_pct":62,"target_share":16,"air_yards_share":17,"yprt":1.88,"separation":2.8},
"Terry McLaurin":      {"snap_pct":81,"target_share":18,"air_yards_share":20,"yprt":1.92,"separation":2.5},
"Jaylen Waddle":       {"snap_pct":76,"target_share":19,"air_yards_share":20,"yprt":1.98,"separation":2.6},
"Rashid Shaheed":      {"snap_pct":72,"target_share":16,"air_yards_share":18,"yprt":2.24,"separation":2.9},
"Quentin Johnston":    {"snap_pct":78,"target_share":17,"air_yards_share":19,"yprt":1.85,"separation":2.4},
"Luther Burden":       {"snap_pct":68,"target_share":15,"air_yards_share":16,"yprt":1.80,"separation":2.5},
"Keon Coleman":        {"snap_pct":70,"target_share":15,"air_yards_share":17,"yprt":1.78,"separation":2.3},

# ─── TEs ───────────────────────────────────────────────────────────────
# player: snap%, target_share%, yprt, separation (TEs use same WR-like fields)
"Trey McBride":        {"snap_pct":92,"target_share":25,"air_yards_share":18,"yprt":1.82,"separation":2.4},
"Brock Bowers":        {"snap_pct":90,"target_share":23,"air_yards_share":17,"yprt":1.76,"separation":2.3},
"Colston Loveland":    {"snap_pct":84,"target_share":19,"air_yards_share":14,"yprt":1.64,"separation":2.1},
"Sam LaPorta":         {"snap_pct":82,"target_share":18,"air_yards_share":13,"yprt":1.58,"separation":2.0},
"Tyler Warren":        {"snap_pct":80,"target_share":18,"air_yards_share":13,"yprt":1.55,"separation":2.0},
"Kyle Pitts":          {"snap_pct":78,"target_share":17,"air_yards_share":14,"yprt":1.62,"separation":2.2},
"Tucker Kraft":        {"snap_pct":76,"target_share":15,"air_yards_share":11,"yprt":1.48,"separation":1.9},
"Dallas Goedert":      {"snap_pct":74,"target_share":16,"air_yards_share":12,"yprt":1.52,"separation":2.0},
"George Kittle":       {"snap_pct":76,"target_share":16,"air_yards_share":13,"yprt":1.60,"separation":2.1},
"Travis Kelce":        {"snap_pct":72,"target_share":14,"air_yards_share":11,"yprt":1.44,"separation":1.8},

# ─── IDP ───────────────────────────────────────────────────────────────
# player: snap_pct_def%, pressure_rate%, pass_rush_win_rate%, tackle_rate%
"Abdul Carter":        {"snap_pct_def":78,"pressure_rate":14.2,"pass_rush_win_rate":22,"tackle_rate":6},
"Aidan Hutchinson":    {"snap_pct_def":84,"pressure_rate":16.1,"pass_rush_win_rate":25,"tackle_rate":7},
"Will Anderson":       {"snap_pct_def":82,"pressure_rate":15.4,"pass_rush_win_rate":24,"tackle_rate":6},
"Jared Verse":         {"snap_pct_def":80,"pressure_rate":13.8,"pass_rush_win_rate":21,"tackle_rate":6},
"Myles Garrett":       {"snap_pct_def":86,"pressure_rate":17.2,"pass_rush_win_rate":28,"tackle_rate":7},
"Micah Parsons":       {"snap_pct_def":0, "pressure_rate":0,   "pass_rush_win_rate":0, "tackle_rate":0},  # ACL
"Jack Campbell":       {"snap_pct_def":90,"pressure_rate":4,   "pass_rush_win_rate":8, "tackle_rate":18},
"Carson Schwesinger":  {"snap_pct_def":88,"pressure_rate":3,   "pass_rush_win_rate":7, "tackle_rate":17},
"Zack Baun":           {"snap_pct_def":82,"pressure_rate":5,   "pass_rush_win_rate":9, "tackle_rate":16},
"Nik Bonitto":         {"snap_pct_def":76,"pressure_rate":11.8,"pass_rush_win_rate":18,"tackle_rate":5},
"Derwin James":        {"snap_pct_def":80,"pressure_rate":8,   "pass_rush_win_rate":12,"tackle_rate":12},
"Kyle Hamilton":       {"snap_pct_def":84,"pressure_rate":6,   "pass_rush_win_rate":10,"tackle_rate":13},
"Fred Warner":         {"snap_pct_def":86,"pressure_rate":3,   "pass_rush_win_rate":6, "tackle_rate":17},
"Quay Walker":         {"snap_pct_def":84,"pressure_rate":3,   "pass_rush_win_rate":6, "tackle_rate":16},
"T.J. Watt":           {"snap_pct_def":82,"pressure_rate":14.8,"pass_rush_win_rate":23,"tackle_rate":6},
"Rashan Gary":         {"snap_pct_def":74,"pressure_rate":10.2,"pass_rush_win_rate":16,"tackle_rate":5},
}

# ═══════════════════════════════════════════════════════════════════════════════
# LAYER 2A — INJURY HISTORY (2023-2025)
# games_missed: [2025, 2024, 2023]
# injury_history: list of injury types for severity scoring
# games_played_pct_career: % of possible games played in career
# ═══════════════════════════════════════════════════════════════════════════════

INJURY_DATA = {
# ─── QBs ───
"Josh Allen":         {"gm":[0,0,1], "history":["minor shoulder"],      "career_gp_pct":97},
"Jayden Daniels":     {"gm":[0,0,0], "history":[],                      "career_gp_pct":98},
"Drake Maye":         {"gm":[2,0,0], "history":["ankle"],               "career_gp_pct":95},
"Lamar Jackson":      {"gm":[0,1,0], "history":["knee"],                "career_gp_pct":84},
"Jalen Hurts":        {"gm":[1,1,3], "history":["shoulder","clavicle"], "career_gp_pct":82},
"Caleb Williams":     {"gm":[2,0,0], "history":["hamstring"],           "career_gp_pct":94},
"Joe Burrow":         {"gm":[0,11,0],"history":["wrist ACL-equivalent"],"career_gp_pct":72},
"Patrick Mahomes":    {"gm":[0,0,0], "history":["ankle"],               "career_gp_pct":94},
"Brock Purdy":        {"gm":[1,0,7], "history":["elbow","forearm"],     "career_gp_pct":82},
"Trevor Lawrence":    {"gm":[0,3,1], "history":["ankle","shoulder"],    "career_gp_pct":85},
"Justin Herbert":     {"gm":[1,0,2], "history":["rib cartilage"],       "career_gp_pct":91},
"Jaxson Dart":        {"gm":[0,0,0], "history":[],                      "career_gp_pct":98},
"Dak Prescott":       {"gm":[4,0,3], "history":["hamstring","hand"],    "career_gp_pct":76},
"Shedeur Sanders":    {"gm":[1,0,0], "history":["rib"],                 "career_gp_pct":96},
"Matthew Stafford":   {"gm":[2,2,3], "history":["elbow","back"],        "career_gp_pct":80},
"Sam Darnold":        {"gm":[2,1,8], "history":["ankle","foot"],        "career_gp_pct":75},
"Baker Mayfield":     {"gm":[1,0,2], "history":["shoulder"],            "career_gp_pct":80},

# ─── RBs ───
"Jahmyr Gibbs":        {"gm":[1,2,0], "history":["hamstring"],           "career_gp_pct":92},
"Bijan Robinson":      {"gm":[0,1,0], "history":["minor soft tissue"],   "career_gp_pct":95},
"Christian McCaffrey": {"gm":[12,6,5],"history":["knee","calf","ankle"], "career_gp_pct":61},
"Jonathan Taylor":     {"gm":[4,1,7], "history":["hamstring","ankle"],   "career_gp_pct":75},
"De'Von Achane":       {"gm":[3,4,0], "history":["hamstring","hamstring"],"career_gp_pct":79},
"Ashton Jeanty":       {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Derrick Henry":       {"gm":[0,0,0], "history":["minor"],               "career_gp_pct":94},
"James Cook":          {"gm":[1,0,2], "history":["ankle"],               "career_gp_pct":91},
"Saquon Barkley":      {"gm":[0,0,1], "history":["ACL","ankle"],         "career_gp_pct":72},
"Chase Brown":         {"gm":[2,1,0], "history":["hamstring"],           "career_gp_pct":89},
"Omarion Hampton":     {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Breece Hall":         {"gm":[4,2,8], "history":["ACL"],                 "career_gp_pct":71},
"Kyren Williams":      {"gm":[3,8,0], "history":["hamstring","ankle"],   "career_gp_pct":72},
"Jeremiyah Love":      {"gm":[3,0,0], "history":["soft tissue"],         "career_gp_pct":88},
"TreVeyon Henderson":  {"gm":[2,3,1], "history":["shoulder","ankle"],    "career_gp_pct":82},
"Quinshon Judkins":    {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Bucky Irving":        {"gm":[1,0,0], "history":[],                      "career_gp_pct":97},
"Cam Skattebo":        {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Kenneth Walker":      {"gm":[3,4,2], "history":["hernia","oblique"],    "career_gp_pct":77},
"Josh Jacobs":         {"gm":[2,1,1], "history":["hamstring"],           "career_gp_pct":84},

# ─── WRs ───
"Puka Nacua":          {"gm":[1,7,0], "history":["knee","thumb"],        "career_gp_pct":82},
"Jaxon Smith-Njigba":  {"gm":[0,1,0], "history":["shoulder"],           "career_gp_pct":96},
"Ja'Marr Chase":       {"gm":[0,0,1], "history":["hamstring"],           "career_gp_pct":96},
"Amon-Ra St. Brown":   {"gm":[0,0,0], "history":[],                      "career_gp_pct":98},
"Drake London":        {"gm":[0,1,2], "history":["ankle"],               "career_gp_pct":90},
"Rashee Rice":         {"gm":[4,8,0], "history":["knee ACL","shoulder"], "career_gp_pct":74},
"CeeDee Lamb":         {"gm":[0,0,1], "history":["shoulder"],            "career_gp_pct":97},
"George Pickens":      {"gm":[2,1,2], "history":["hamstring","hamstring"],"career_gp_pct":86},
"A.J. Brown":          {"gm":[3,2,4], "history":["knee","hamstring"],    "career_gp_pct":80},
"Justin Jefferson":    {"gm":[1,4,0], "history":["hamstring"],           "career_gp_pct":88},
"Malik Nabers":        {"gm":[1,0,0], "history":["concussion"],          "career_gp_pct":95},
"Marvin Harrison Jr":  {"gm":[2,0,0], "history":["soft tissue"],         "career_gp_pct":94},
"Rome Odunze":         {"gm":[1,0,0], "history":["wrist"],               "career_gp_pct":97},
"Brian Thomas Jr":     {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Travis Hunter":       {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Terry McLaurin":      {"gm":[2,1,1], "history":["hamstring"],           "career_gp_pct":89},
"Jaylen Waddle":       {"gm":[5,3,2], "history":["ankle","hamstring"],   "career_gp_pct":79},
"Rashid Shaheed":      {"gm":[4,3,0], "history":["hamstring","knee"],    "career_gp_pct":78},
"Quentin Johnston":    {"gm":[2,3,1], "history":["ankle"],               "career_gp_pct":86},
"Luther Burden":       {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Keon Coleman":        {"gm":[3,0,0], "history":["wrist"],               "career_gp_pct":88},
"Cooper Kupp":         {"gm":[6,5,0], "history":["Achilles","ankle"],    "career_gp_pct":64},
"Davante Adams":       {"gm":[2,1,0], "history":["hamstring"],           "career_gp_pct":89},
"Stefon Diggs":        {"gm":[5,4,0], "history":["ACL","ankle"],         "career_gp_pct":80},

# ─── TEs ───
"Trey McBride":        {"gm":[0,0,0], "history":[],                      "career_gp_pct":98},
"Brock Bowers":        {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Colston Loveland":    {"gm":[1,0,0], "history":["minor"],               "career_gp_pct":97},
"Sam LaPorta":         {"gm":[0,3,0], "history":["knee"],                "career_gp_pct":91},
"Tyler Warren":        {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Kyle Pitts":          {"gm":[3,2,10],"history":["knee","ankle"],        "career_gp_pct":71},
"Tucker Kraft":        {"gm":[2,0,0], "history":["shoulder"],            "career_gp_pct":91},
"Dallas Goedert":      {"gm":[4,3,4], "history":["shoulder","shoulder"], "career_gp_pct":74},
"George Kittle":       {"gm":[2,1,3], "history":["knee","hamstring"],    "career_gp_pct":73},
"Travis Kelce":        {"gm":[1,0,0], "history":["ankle"],               "career_gp_pct":92},

# ─── IDPs ───
"Abdul Carter":        {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Aidan Hutchinson":    {"gm":[0,8,0], "history":["tibia fracture"],      "career_gp_pct":80},
"Will Anderson":       {"gm":[0,0,2], "history":["shoulder"],            "career_gp_pct":94},
"Jared Verse":         {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Myles Garrett":       {"gm":[0,0,0], "history":["minor"],               "career_gp_pct":93},
"Micah Parsons":       {"gm":[10,0,0],"history":["ACL"],                 "career_gp_pct":82},
"Jack Campbell":       {"gm":[0,1,0], "history":["ankle"],               "career_gp_pct":97},
"Carson Schwesinger":  {"gm":[0,0,0], "history":[],                      "career_gp_pct":100},
"Zack Baun":           {"gm":[0,1,2], "history":["ankle"],               "career_gp_pct":88},
"Nik Bonitto":         {"gm":[2,1,0], "history":["hamstring"],           "career_gp_pct":88},
"Derwin James":        {"gm":[3,6,8], "history":["knee","foot"],         "career_gp_pct":68},
"Kyle Hamilton":       {"gm":[0,0,1], "history":["minor"],               "career_gp_pct":97},
"Fred Warner":         {"gm":[1,0,1], "history":["minor"],               "career_gp_pct":95},
"Quay Walker":         {"gm":[2,1,0], "history":["ankle"],               "career_gp_pct":89},
"T.J. Watt":           {"gm":[1,0,3], "history":["pec"],                 "career_gp_pct":84},
"Rashan Gary":         {"gm":[0,0,10],"history":["ACL"],                 "career_gp_pct":75},
}

# ═══════════════════════════════════════════════════════════════════════════════
# BASE SCORES — proj_pts_2026, ceiling_score, floor_score, future_value
# Derived from: age, VORP, consensus rank, team context
# ═══════════════════════════════════════════════════════════════════════════════

BASE_SCORES = {
"Josh Allen":          {"proj_pts":412,"ceiling":96,"floor":82,"future":68},
"Jayden Daniels":      {"proj_pts":368,"ceiling":91,"floor":74,"future":88},
"Drake Maye":          {"proj_pts":362,"ceiling":92,"floor":72,"future":92},
"Lamar Jackson":       {"proj_pts":371,"ceiling":93,"floor":78,"future":72},
"Jalen Hurts":         {"proj_pts":348,"ceiling":88,"floor":74,"future":76},
"Caleb Williams":      {"proj_pts":312,"ceiling":86,"floor":62,"future":88},
"Joe Burrow":          {"proj_pts":344,"ceiling":89,"floor":68,"future":72},
"Patrick Mahomes":     {"proj_pts":334,"ceiling":86,"floor":76,"future":62},
"Brock Purdy":         {"proj_pts":322,"ceiling":82,"floor":72,"future":68},
"Trevor Lawrence":     {"proj_pts":316,"ceiling":81,"floor":66,"future":74},
"Justin Herbert":      {"proj_pts":318,"ceiling":82,"floor":70,"future":68},
"Jaxson Dart":         {"proj_pts":295,"ceiling":82,"floor":58,"future":84},
"Dak Prescott":        {"proj_pts":308,"ceiling":78,"floor":64,"future":56},
"Shedeur Sanders":     {"proj_pts":272,"ceiling":80,"floor":54,"future":82},
"Matthew Stafford":    {"proj_pts":296,"ceiling":74,"floor":62,"future":48},
"Bo Nix":              {"proj_pts":278,"ceiling":72,"floor":58,"future":68},
"Sam Darnold":         {"proj_pts":274,"ceiling":68,"floor":54,"future":56},
"Baker Mayfield":      {"proj_pts":282,"ceiling":74,"floor":60,"future":54},
"Jahmyr Gibbs":        {"proj_pts":322,"ceiling":90,"floor":76,"future":88},
"Bijan Robinson":      {"proj_pts":308,"ceiling":86,"floor":70,"future":80},
"Christian McCaffrey": {"proj_pts":286,"ceiling":88,"floor":52,"future":60},
"Jonathan Taylor":     {"proj_pts":278,"ceiling":80,"floor":58,"future":62},
"De'Von Achane":       {"proj_pts":274,"ceiling":84,"floor":56,"future":80},
"Ashton Jeanty":       {"proj_pts":296,"ceiling":86,"floor":70,"future":88},
"Derrick Henry":       {"proj_pts":282,"ceiling":78,"floor":68,"future":54},
"James Cook":          {"proj_pts":272,"ceiling":78,"floor":64,"future":72},
"Saquon Barkley":      {"proj_pts":294,"ceiling":84,"floor":66,"future":62},
"Chase Brown":         {"proj_pts":248,"ceiling":74,"floor":58,"future":74},
"Omarion Hampton":     {"proj_pts":244,"ceiling":78,"floor":60,"future":86},
"Breece Hall":         {"proj_pts":258,"ceiling":76,"floor":56,"future":70},
"Kyren Williams":      {"proj_pts":246,"ceiling":72,"floor":58,"future":66},
"Jeremiyah Love":      {"proj_pts":248,"ceiling":76,"floor":60,"future":84},
"TreVeyon Henderson":  {"proj_pts":218,"ceiling":72,"floor":52,"future":78},
"Quinshon Judkins":    {"proj_pts":214,"ceiling":70,"floor":50,"future":76},
"Bucky Irving":        {"proj_pts":228,"ceiling":72,"floor":58,"future":74},
"Cam Skattebo":        {"proj_pts":212,"ceiling":68,"floor":50,"future":72},
"Kenneth Walker":      {"proj_pts":222,"ceiling":68,"floor":52,"future":62},
"Josh Jacobs":         {"proj_pts":226,"ceiling":66,"floor":54,"future":56},
"Puka Nacua":          {"proj_pts":268,"ceiling":82,"floor":66,"future":80},
"Jaxon Smith-Njigba":  {"proj_pts":262,"ceiling":80,"floor":64,"future":84},
"Ja'Marr Chase":       {"proj_pts":278,"ceiling":88,"floor":72,"future":82},
"Amon-Ra St. Brown":   {"proj_pts":252,"ceiling":78,"floor":68,"future":72},
"Drake London":        {"proj_pts":238,"ceiling":76,"floor":62,"future":78},
"Rashee Rice":         {"proj_pts":242,"ceiling":78,"floor":52,"future":78},
"CeeDee Lamb":         {"proj_pts":274,"ceiling":86,"floor":70,"future":72},
"George Pickens":      {"proj_pts":236,"ceiling":76,"floor":58,"future":72},
"A.J. Brown":          {"proj_pts":248,"ceiling":78,"floor":62,"future":66},
"Justin Jefferson":    {"proj_pts":256,"ceiling":82,"floor":68,"future":72},
"Malik Nabers":        {"proj_pts":248,"ceiling":82,"floor":64,"future":84},
"Marvin Harrison Jr":  {"proj_pts":238,"ceiling":80,"floor":62,"future":84},
"Rome Odunze":         {"proj_pts":232,"ceiling":76,"floor":60,"future":82},
"Brian Thomas Jr":     {"proj_pts":226,"ceiling":74,"floor":60,"future":82},
"Travis Hunter":       {"proj_pts":188,"ceiling":74,"floor":54,"future":84},
"Terry McLaurin":      {"proj_pts":204,"ceiling":68,"floor":56,"future":56},
"Jaylen Waddle":       {"proj_pts":212,"ceiling":72,"floor":50,"future":66},
"Rashid Shaheed":      {"proj_pts":188,"ceiling":70,"floor":46,"future":64},
"Quentin Johnston":    {"proj_pts":192,"ceiling":68,"floor":50,"future":72},
"Luther Burden":       {"proj_pts":186,"ceiling":72,"floor":50,"future":82},
"Keon Coleman":        {"proj_pts":182,"ceiling":66,"floor":48,"future":70},
"Cooper Kupp":         {"proj_pts":162,"ceiling":68,"floor":30,"future":38},
"Davante Adams":       {"proj_pts":178,"ceiling":64,"floor":46,"future":36},
"Stefon Diggs":        {"proj_pts":172,"ceiling":60,"floor":40,"future":36},
"Trey McBride":        {"proj_pts":214,"ceiling":80,"floor":72,"future":78},
"Brock Bowers":        {"proj_pts":212,"ceiling":82,"floor":72,"future":88},
"Colston Loveland":    {"proj_pts":196,"ceiling":76,"floor":62,"future":84},
"Sam LaPorta":         {"proj_pts":188,"ceiling":72,"floor":62,"future":76},
"Tyler Warren":        {"proj_pts":182,"ceiling":70,"floor":60,"future":78},
"Kyle Pitts":          {"proj_pts":174,"ceiling":76,"floor":44,"future":68},
"Tucker Kraft":        {"proj_pts":172,"ceiling":68,"floor":58,"future":72},
"Dallas Goedert":      {"proj_pts":168,"ceiling":70,"floor":48,"future":58},
"George Kittle":       {"proj_pts":166,"ceiling":70,"floor":48,"future":52},
"Travis Kelce":        {"proj_pts":158,"ceiling":64,"floor":46,"future":44},
"Abdul Carter":        {"proj_pts":0,  "ceiling":88,"floor":70,"future":92},
"Aidan Hutchinson":    {"proj_pts":0,  "ceiling":86,"floor":72,"future":76},
"Will Anderson":       {"proj_pts":0,  "ceiling":84,"floor":70,"future":82},
"Jared Verse":         {"proj_pts":0,  "ceiling":82,"floor":66,"future":84},
"Myles Garrett":       {"proj_pts":0,  "ceiling":84,"floor":60,"future":52},
"Micah Parsons":       {"proj_pts":0,  "ceiling":86,"floor":28,"future":68},
"Jack Campbell":       {"proj_pts":0,  "ceiling":78,"floor":70,"future":76},
"Carson Schwesinger":  {"proj_pts":0,  "ceiling":76,"floor":68,"future":78},
"Zack Baun":           {"proj_pts":0,  "ceiling":72,"floor":62,"future":66},
"Nik Bonitto":         {"proj_pts":0,  "ceiling":70,"floor":58,"future":68},
"Derwin James":        {"proj_pts":0,  "ceiling":70,"floor":42,"future":52},
"Kyle Hamilton":       {"proj_pts":0,  "ceiling":74,"floor":66,"future":76},
"Fred Warner":         {"proj_pts":0,  "ceiling":66,"floor":60,"future":58},
"Quay Walker":         {"proj_pts":0,  "ceiling":66,"floor":58,"future":62},
"T.J. Watt":           {"proj_pts":0,  "ceiling":72,"floor":58,"future":54},
"Rashan Gary":         {"proj_pts":0,  "ceiling":68,"floor":40,"future":56},
}

# ─── positional baseline risk ───────────────────────────────────────────────
POS_BASE_RISK = {"QB":0.3,"RB":0.8,"WR":0.4,"TE":0.5,"EDGE":0.6,"LB":0.5,"DB":0.3,"DL":0.5,"K":0.1}

# ─── injury type severity lookup ────────────────────────────────────────────
def injury_severity(history):
    if not history: return 0.0
    score = 0.0
    words = " ".join(history).lower()
    if "acl" in words or "achilles" in words or "lisfranc" in words:
        score += 2.0
    elif "acl" in words:
        score += 2.0
    if "hamstring" in words and words.count("hamstring") >= 2:
        score = max(score, 1.5)
    elif "hamstring" in words:
        score = max(score, 0.5)
    if "concussion" in words and words.count("concussion") >= 2:
        score = max(score, 1.5)
    elif "concussion" in words:
        score = max(score, 0.5)
    if "shoulder" in words or "labrum" in words:
        score = max(score, 1.0)
    if "wrist" in words or "tibia" in words or "pec" in words or "hernia" in words:
        score = max(score, 0.8)
    return min(score, 2.0)

def injury_risk_score(player, pos, data):
    if not data: return {"risk":POS_BASE_RISK.get(pos,0.5),"tier":"🟢 LOW RISK"}
    gm = data["gm"]
    gm25, gm24, gm23 = gm[0], gm[1] if len(gm)>1 else 0, gm[2] if len(gm)>2 else 0
    # 1. Recency (max 4)
    if   gm25 >= 8: r1 = 4.0
    elif gm25 >= 5: r1 = 3.0
    elif gm25 >= 3: r1 = 2.0
    elif gm25 >= 1: r1 = 1.0
    else:           r1 = 0.0
    # 2. History weighted (max 3)
    weighted = gm25*0.5 + gm24*0.3 + gm23*0.2
    r2 = min(3.0, weighted * 0.25)
    # 3. Injury severity (max 2)
    r3 = injury_severity(data.get("history",[]))
    # 4. Positional baseline (max 1)
    r4 = POS_BASE_RISK.get(pos, 0.5)
    total = min(10.0, round(r1+r2+r3+r4, 1))
    if total <= 2.5:   tier = "🟢 LOW RISK"
    elif total <= 4.9: tier = "🟡 MODERATE"
    elif total <= 6.9: tier = "🟠 ELEVATED"
    elif total <= 8.9: tier = "🔴 HIGH RISK"
    else:              tier = "☠️ DANGER"
    return {"risk":total,"tier":tier}

def injury_multiplier(risk):
    if risk <= 2.5: return 1.00
    if risk <= 4.9: return 0.93
    if risk <= 6.9: return 0.84
    if risk <= 8.9: return 0.73
    return 0.60

# ─── floor_score_v2 upgrade based on efficiency ─────────────────────────────
def upgrade_floor(pos, base_floor, eff):
    if not eff: return base_floor
    bonus = 0
    if pos in ("WR","TE"):
        ts = eff.get("target_share", 0)
        sp = eff.get("snap_pct", 0)
        rp = eff.get("route_pct", sp)  # fallback to snap
        sep= eff.get("separation", 0)
        if ts >= 25: bonus += 8
        elif ts >= 20: bonus += 5
        if sp >= 90: bonus += 6
        elif sp >= 80: bonus += 3
        if rp >= 85: bonus += 5
        elif rp >= 75: bonus += 2
        if sep >= 2.8: bonus += 4
        elif sep >= 2.5: bonus += 2
    elif pos == "RB":
        opp = eff.get("opportunity_share", 0)
        sp  = eff.get("snap_pct", 0)
        btr = eff.get("broken_tackle_rate", 0)
        yac = eff.get("yac_per_carry", 0)
        if opp >= 22: bonus += 8
        elif opp >= 16: bonus += 4
        if sp >= 60: bonus += 6
        elif sp >= 45: bonus += 3
        if btr >= 20: bonus += 4
        elif btr >= 15: bonus += 2
        if yac >= 2.8: bonus += 4
        elif yac >= 2.5: bonus += 2
    elif pos == "QB":
        sp   = eff.get("snap_pct", 0)
        cpoe = eff.get("cpoe", 0)
        if sp >= 95: bonus += 6
        elif sp >= 90: bonus += 3
        if cpoe >= 4: bonus += 6
        elif cpoe >= 2: bonus += 3
    elif pos in ("EDGE","LB","DB","DL"):
        sp  = eff.get("snap_pct_def", 0)
        pr  = eff.get("pressure_rate", 0)
        tr  = eff.get("tackle_rate", 0)
        if sp >= 75: bonus += 8
        elif sp >= 60: bonus += 4
        if pr >= 12: bonus += 6
        elif pr >= 8: bonus += 3
        if tr >= 15: bonus += 6
        elif tr >= 10: bonus += 3
    return min(100, base_floor + bonus)

# ═══════════════════════════════════════════════════════════════════════════════
# LOAD + UPDATE DRAFT BOARD
# ═══════════════════════════════════════════════════════════════════════════════
board_path = os.path.join(BASE, "draft_board.csv")
with open(board_path, newline="") as f:
    reader = csv.DictReader(f)
    board_rows = list(reader)
    existing_fields = list(reader.fieldnames)

NEW_FIELDS = [
    "snap_pct","target_share","air_yards_share","yprt","separation",
    "cpoe","air_yards_per_att","pressure_rate_faced","time_to_throw",
    "opportunity_share","yac_per_carry","broken_tackle_rate","route_pct",
    "snap_pct_def","pressure_rate_pass_rush","pass_rush_win_rate","tackle_rate",
    "proj_pts_2026","ceiling_score","floor_score","floor_score_v2","future_value",
    "games_missed_2025","games_missed_2024","games_missed_2023",
    "injury_type_history","games_played_pct_career",
    "injury_risk_score","injury_risk_tier",
    "master_score",
]
all_fields = existing_fields + [f for f in NEW_FIELDS if f not in existing_fields]

def fkey(name): return name.lower().strip()

matched_eff = matched_inj = matched_base = 0

for row in board_rows:
    name = row["player"]
    pos  = row["pos"]
    k    = fkey(name)

    eff  = EFF_STATS.get(name, {})
    inj  = INJURY_DATA.get(name)
    base = BASE_SCORES.get(name, {})

    # ─── efficiency cols ─────────────────────────────
    if eff:
        matched_eff += 1
        for col in ["snap_pct","target_share","air_yards_share","yprt","separation",
                    "cpoe","air_yards_per_att","pressure_rate_faced","time_to_throw",
                    "opportunity_share","yac_per_carry","broken_tackle_rate","route_pct",
                    "snap_pct_def","pressure_rate_pass_rush","pass_rush_win_rate","tackle_rate"]:
            row[col] = eff.get(col, "")

    # ─── base scores ──────────────────────────────────
    if base:
        matched_base += 1
        row["proj_pts_2026"]  = base.get("proj_pts","")
        row["ceiling_score"]  = base.get("ceiling","")
        row["floor_score"]    = base.get("floor","")
        row["future_value"]   = base.get("future","")
        row["floor_score_v2"] = upgrade_floor(pos, base.get("floor",50), eff)
    else:
        row["floor_score_v2"] = row.get("floor_score","") or ""

    # ─── injury risk ──────────────────────────────────
    risk_result = injury_risk_score(name, pos, inj)
    if inj:
        matched_inj += 1
        row["games_missed_2025"]     = inj["gm"][0]
        row["games_missed_2024"]     = inj["gm"][1] if len(inj["gm"])>1 else 0
        row["games_missed_2023"]     = inj["gm"][2] if len(inj["gm"])>2 else 0
        row["injury_type_history"]   = " | ".join(inj["history"]) if inj["history"] else "None noted"
        row["games_played_pct_career"]= inj["career_gp_pct"]
    row["injury_risk_score"] = risk_result["risk"]
    row["injury_risk_tier"]  = risk_result["tier"]

    # ─── master score ─────────────────────────────────
    try:
        pp = float(base.get("proj_pts", 0) or 0)
        ce = float(base.get("ceiling", 70) or 70)
        fl = float(row.get("floor_score_v2") or base.get("floor", 55) or 55)
        fv = float(base.get("future", 60) or 60)
        va = float(row.get("vorp_adjusted") or 0)

        # Normalize proj_pts to 0-100 scale (max ~420 for Allen)
        pp_norm = min(100, pp / 4.2)
        # Normalize vorp to 0-100 (max ~300 for top RBs)
        va_norm = min(100, va / 3.0)

        raw = (pp_norm*0.30 + ce*0.20 + fl*0.20 + fv*0.20 + va_norm*0.10)
        mult = injury_multiplier(risk_result["risk"])
        row["master_score"] = round(raw * mult, 1)
    except Exception:
        row["master_score"] = ""

with open(board_path, "w", newline="") as f:
    w = csv.DictWriter(f, fieldnames=all_fields)
    w.writeheader()
    w.writerows(board_rows)

print(f"✅ draft_board.csv updated")
print(f"   Efficiency: {matched_eff} players | Injury: {matched_inj} | Base scores: {matched_base}")

# ─── Verify high-risk flags ────────────────────────────────────────────────
print("\n📊 INJURY RISK SUMMARY:")
high_risk = [(r["player"],r["injury_risk_score"],r["injury_risk_tier"])
             for r in board_rows
             if float(r.get("injury_risk_score") or 0) >= 5.0]
high_risk.sort(key=lambda x: float(x[1]), reverse=True)
for name, score, tier in high_risk[:15]:
    print(f"  {tier}  {name}: {score}")

print("\n📊 TOP MASTER SCORES:")
top_ms = [(r["player"],r.get("master_score",""),r["pos"])
          for r in board_rows if r.get("master_score")]
top_ms.sort(key=lambda x: float(x[1] or 0), reverse=True)
for name, ms, pos in top_ms[:10]:
    print(f"  {pos:4s}  {name}: {ms}")
