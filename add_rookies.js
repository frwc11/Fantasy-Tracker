#!/usr/bin/env node
const fs = require('fs');

// ────────────────────────────────────────────────────────────
// 2026 ROOKIE CLASS DATA
// ────────────────────────────────────────────────────────────
const ROOKIES_2026 = [
  // ELITE_TAXI
  { player:'Fernando Mendoza', pos:'QB', team:'LV', age:22, consensus_rank:18, my_rank:18, adp_round:2, target_round:2,
    tier:'R2', value_gap:0, gem_flag:1,
    notes:'1.01 overall pick 2026 — SF QB value — LV building around him — Heisman winner — decade-long asset',
    proj_pts_2026:310, ceiling_score:88, floor_score:62, floor_score_v2:62, future_value:85,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:1.5, injury_risk_tier:'🟢 LOW RISK',
    master_score:78.2, taxi_grade:'ELITE_TAXI', is_rookie:1,
    rookie_context:'1.01 overall pick — starting Day 1 in LV — Heisman + national champion — top SF QB asset in 2026 class',
    dp_value_2qb:6200, dp_rank_2qb:19, market_inefficiency:'FAIR',
  },
  { player:'Carnell Tate', pos:'WR', team:'TEN', age:21, consensus_rank:22, my_rank:20, adp_round:2, target_round:2,
    tier:'R2', value_gap:2, gem_flag:1,
    notes:'1.04 pick — alpha WR target for Cam Ward in ascending TEN offense — top-4 draft capital',
    proj_pts_2026:175, ceiling_score:86, floor_score:58, floor_score_v2:58, future_value:83,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:1.8, injury_risk_tier:'🟢 LOW RISK',
    master_score:77.1, taxi_grade:'ELITE_TAXI', is_rookie:1,
    rookie_context:'1.04 overall pick — Cam Ward connection locked — target share alpha from Day 1',
    dp_value_2qb:5800, dp_rank_2qb:23, market_inefficiency:'FAIR',
  },
  { player:'David Bailey', pos:'EDGE', team:'NYJ', age:22, consensus_rank:8, my_rank:8, adp_round:1, target_round:1,
    tier:'R1', value_gap:0, gem_flag:1,
    notes:'1.02 overall pick — elite pass rusher — immediate IDP impact — NYJ pass rush featured player',
    proj_pts_2026:225, ceiling_score:90, floor_score:72, floor_score_v2:72, future_value:86,
    proj_sacks:10, proj_solo_tackles:40, proj_ints:1, proj_tfl:7, proj_fppg:18.2,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:1.5, injury_risk_tier:'🟢 LOW RISK',
    master_score:78.8, taxi_grade:'ELITE_TAXI', is_rookie:1,
    rookie_context:'1.02 overall pick — best pure pass rusher in 2026 class — starts immediately — top IDP value',
    dp_value_2qb:4800, dp_rank_2qb:29, market_inefficiency:'FAIR',
  },
  { player:'Rueben Bain Jr.', pos:'EDGE', team:'MIA', age:22, consensus_rank:16, my_rank:14, adp_round:2, target_round:2,
    tier:'R2', value_gap:2, gem_flag:1,
    notes:'1.15 pick — most fantasy-ready pass rusher in class — explosive first step — wins immediately',
    proj_pts_2026:195, ceiling_score:85, floor_score:65, floor_score_v2:65, future_value:82,
    proj_sacks:9, proj_solo_tackles:35, proj_ints:0, proj_tfl:6, proj_fppg:16.8,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:76.5, taxi_grade:'ELITE_TAXI', is_rookie:1,
    rookie_context:'Pick 15 overall — pairs with Anthony Hill Jr in MIA pass rush — most ready EDGE in class',
    dp_value_2qb:3900, dp_rank_2qb:40, market_inefficiency:'FAIR',
  },
  { player:'Arvell Reese', pos:'LB', team:'NYG', age:22, consensus_rank:10, my_rank:10, adp_round:1, target_round:1,
    tier:'R1', value_gap:0, gem_flag:1,
    notes:'1.05 pick — tackle machine — could lead NFL in tackles Year 1 — NYG elite LB prospect',
    proj_pts_2026:280, ceiling_score:88, floor_score:72, floor_score_v2:72, future_value:84,
    proj_sacks:2, proj_solo_tackles:88, proj_ints:2, proj_tfl:10, proj_fppg:19.8,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:1.5, injury_risk_tier:'🟢 LOW RISK',
    master_score:79.2, taxi_grade:'ELITE_TAXI', is_rookie:1,
    rookie_context:'Pick 5 overall — tackle monster — range and instincts — Day 1 starter alongside Edmunds',
    dp_value_2qb:4200, dp_rank_2qb:35, market_inefficiency:'FAIR',
  },
  // STRONG_TAXI
  { player:'Jordyn Tyson', pos:'WR', team:'TEN', age:21, consensus_rank:35, my_rank:32, adp_round:4, target_round:3,
    tier:'R3', value_gap:3, gem_flag:0,
    notes:'R1 pick — pairs with Tate + Ward in TEN — secondary target share alpha opportunity',
    proj_pts_2026:140, ceiling_score:80, floor_score:50, floor_score_v2:50, future_value:74,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:69.4, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'R1 pick — Ward offense upside — shares targets with Tate — STRONG_TAXI dart throw',
    dp_value_2qb:2800, dp_rank_2qb:58, market_inefficiency:'FAIR',
  },
  { player:'Makai Lemon', pos:'WR', team:'PHI', age:21, consensus_rank:30, my_rank:28, adp_round:3, target_round:3,
    tier:'R3', value_gap:2, gem_flag:0,
    notes:'PHI traded up — elite Eagles offensive system — potential deep target specialist',
    proj_pts_2026:148, ceiling_score:81, floor_score:52, floor_score_v2:52, future_value:76,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:70.2, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'PHI traded up to get him — Eagles system boosts WR value — Hurts connection',
    dp_value_2qb:3100, dp_rank_2qb:53, market_inefficiency:'FAIR',
  },
  { player:'KC Concepcion', pos:'WR', team:'CLE', age:21, consensus_rank:33, my_rank:30, adp_round:3, target_round:3,
    tier:'R3', value_gap:3, gem_flag:0,
    notes:'CLE R1 pick — ascending offense around Sanders — WR alpha target share opportunity',
    proj_pts_2026:135, ceiling_score:79, floor_score:48, floor_score_v2:48, future_value:73,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:68.1, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'R1 pick for CLE — Sanders connection from draft capital — CLE 5.5 wins FADE but target share real',
    dp_value_2qb:2600, dp_rank_2qb:63, market_inefficiency:'FAIR',
  },
  { player:'Omar Cooper Jr.', pos:'WR', team:'NYJ', age:22, consensus_rank:38, my_rank:36, adp_round:4, target_round:4,
    tier:'R4', value_gap:2, gem_flag:0,
    notes:'NYJ R1 pick — crowded target share risk — upside capped by NYJ 5.5 win FADE situation',
    proj_pts_2026:128, ceiling_score:76, floor_score:44, floor_score_v2:44, future_value:70,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:65.3, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'R1 pick NYJ — scheme risk from 5.5 win total — target share battle in crowded room',
    dp_value_2qb:2200, dp_rank_2qb:72, market_inefficiency:'FAIR',
  },
  { player:'Jadarian Price', pos:'RB', team:'SEA', age:21, consensus_rank:28, my_rank:26, adp_round:3, target_round:3,
    tier:'R3', value_gap:2, gem_flag:0,
    notes:'SEA R1 RB — McDaniel scheme BOOST — ideal fit for zone-read system — SEA 10.5 wins BOOST',
    proj_pts_2026:180, ceiling_score:82, floor_score:58, floor_score_v2:58, future_value:77,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:72.8, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'SEA R1 RB — McDaniel zone run scheme is RB gold — SEA 10.5 wins BOOST — best rookie RB in class',
    dp_value_2qb:4500, dp_rank_2qb:31, market_inefficiency:'FAIR',
  },
  { player:'Ty Simpson', pos:'QB', team:'LAR', age:22, consensus_rank:48, my_rank:45, adp_round:5, target_round:5,
    tier:'R5', value_gap:3, gem_flag:0,
    notes:'LAR R1 QB — Stafford successor — McVay scheme — learning year before taking over',
    proj_pts_2026:120, ceiling_score:78, floor_score:40, floor_score_v2:40, future_value:75,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:1.8, injury_risk_tier:'🟢 LOW RISK',
    master_score:65.0, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'Stafford heir in McVay system — LAR 11.5 wins BOOST team context — take the upside stash',
    dp_value_2qb:3200, dp_rank_2qb:51, market_inefficiency:'FAIR',
  },
  { player:"De'Zhaun Stribling", pos:'WR', team:'SF', age:22, consensus_rank:40, my_rank:42, adp_round:4, target_round:5,
    tier:'R5', value_gap:-2, gem_flag:0,
    notes:'SF R2 WR — CBS Sports cautious: "not ranking nearly as high as most" — 49ers system could boost',
    proj_pts_2026:118, ceiling_score:74, floor_score:42, floor_score_v2:42, future_value:70,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:63.2, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'R2 pick SF — CBS Sports lower on him than market — 49ers system upside real — WAIT on ADP',
    dp_value_2qb:2100, dp_rank_2qb:74, market_inefficiency:'FAIR',
  },
  { player:'Denzel Boston', pos:'WR', team:'CLE', age:22, consensus_rank:42, my_rank:40, adp_round:4, target_round:4,
    tier:'R4', value_gap:2, gem_flag:0,
    notes:'CLE R2 WR — pairs with KC Concepcion — shares target budget in Sanders-led offense',
    proj_pts_2026:112, ceiling_score:73, floor_score:40, floor_score_v2:40, future_value:70,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:62.8, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'CLE R2 pick — stacks with Concepcion — one of them wins target battle — speculation on which',
    dp_value_2qb:1900, dp_rank_2qb:80, market_inefficiency:'FAIR',
  },
  { player:'Kenyon Sadiq', pos:'TE', team:'NYJ', age:22, consensus_rank:44, my_rank:42, adp_round:4, target_round:5,
    tier:'R5', value_gap:2, gem_flag:0,
    notes:'NYJ R2 TE — ascending TE target in NYJ offense — long development window',
    proj_pts_2026:90, ceiling_score:76, floor_score:38, floor_score_v2:38, future_value:72,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:62.1, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'R2 TE NYJ — ascending target share — NYJ 5.5 FADE a concern but TE premium scoring helps',
    dp_value_2qb:1800, dp_rank_2qb:82, market_inefficiency:'FAIR',
  },
  { player:'Sonny Styles', pos:'LB', team:'WAS', age:22, consensus_rank:14, my_rank:13, adp_round:2, target_round:2,
    tier:'R2', value_gap:1, gem_flag:0,
    notes:'Pick 7 overall — two-way impact LB — WAS 7.5 wins modest — top LB in class alongside Reese',
    proj_pts_2026:240, ceiling_score:82, floor_score:65, floor_score_v2:65, future_value:76,
    proj_sacks:2, proj_solo_tackles:78, proj_ints:2, proj_tfl:9, proj_fppg:17.2,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:1.8, injury_risk_tier:'🟢 LOW RISK',
    master_score:74.5, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'Pick 7 overall — two-way impact — WAS system usage — strong IDP value even in year 1',
    dp_value_2qb:3400, dp_rank_2qb:47, market_inefficiency:'FAIR',
  },
  { player:'Caleb Downs', pos:'DB', team:'DAL', age:21, consensus_rank:20, my_rank:19, adp_round:2, target_round:2,
    tier:'R2', value_gap:1, gem_flag:0,
    notes:'Pick 11 overall — ballhawk safety — DAL 10.5 wins BOOST — INT upside is elite',
    proj_pts_2026:195, ceiling_score:80, floor_score:62, floor_score_v2:62, future_value:76,
    proj_sacks:2, proj_solo_tackles:55, proj_ints:4, proj_tfl:4, proj_fppg:16.1,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:1.8, injury_risk_tier:'🟢 LOW RISK',
    master_score:72.9, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'Pick 11 — DAL 10.5 wins BOOST — ballhawk DB who can score TDs — elite secondary IDP asset',
    dp_value_2qb:3100, dp_rank_2qb:53, market_inefficiency:'FAIR',
  },
  { player:'Anthony Hill Jr.', pos:'EDGE', team:'MIA', age:22, consensus_rank:25, my_rank:24, adp_round:3, target_round:3,
    tier:'R3', value_gap:1, gem_flag:0,
    notes:'Pick 60 R2 — complements Rueben Bain Jr in MIA pass rush — ascending role',
    proj_pts_2026:160, ceiling_score:78, floor_score:55, floor_score_v2:55, future_value:72,
    proj_sacks:7, proj_solo_tackles:30, proj_ints:0, proj_tfl:5, proj_fppg:13.8,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:68.4, taxi_grade:'STRONG_TAXI', is_rookie:1,
    rookie_context:'R2 pick 60 — MIA tandem EDGE with Bain — complementary role but pass rush upside in year 2+',
    dp_value_2qb:2400, dp_rank_2qb:66, market_inefficiency:'FAIR',
  },
  // SPECULATIVE
  { player:'Carson Beck', pos:'QB', team:'ARI', age:23, consensus_rank:65, my_rank:68, adp_round:7, target_round:8,
    tier:'R8', value_gap:-3, gem_flag:0,
    notes:'R3 pick — ARI backup to start — 3.5 win FADE team — deep dynasty stash only',
    proj_pts_2026:80, ceiling_score:70, floor_score:35, floor_score_v2:35, future_value:62,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.2, injury_risk_tier:'🟢 LOW RISK',
    master_score:55.2, taxi_grade:'SPECULATIVE', is_rookie:1,
    rookie_context:'R3 ARI — behind Love at the depth chart — taxi squad stash — ARI 3.5 wins FADE',
    dp_value_2qb:1200, dp_rank_2qb:98, market_inefficiency:'FAIR',
  },
  { player:'Drew Allar', pos:'QB', team:'PIT', age:23, consensus_rank:70, my_rank:72, adp_round:7, target_round:8,
    tier:'R8', value_gap:-2, gem_flag:0,
    notes:'R2 pick PIT — developmental — Wilson successor — learning under Russ 2026',
    proj_pts_2026:85, ceiling_score:72, floor_score:38, floor_score_v2:38, future_value:64,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:56.8, taxi_grade:'SPECULATIVE', is_rookie:1,
    rookie_context:'PIT R2 pick — Wilson successor — taxi squad — PIT is a winning organization',
    dp_value_2qb:1400, dp_rank_2qb:93, market_inefficiency:'FAIR',
  },
  { player:'Germie Bernard', pos:'WR', team:'PIT', age:22, consensus_rank:58, my_rank:62, adp_round:6, target_round:7,
    tier:'R7', value_gap:-4, gem_flag:0,
    notes:'PIT R2 pick 47 — crowded WR room — PIT 10.5 wins BOOST context helps',
    proj_pts_2026:100, ceiling_score:72, floor_score:40, floor_score_v2:40, future_value:63,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.2, injury_risk_tier:'🟢 LOW RISK',
    master_score:58.4, taxi_grade:'SPECULATIVE', is_rookie:1,
    rookie_context:'PIT R2 pick — crowded WR depth in PIT — Wait to see who wins target battle before drafting',
    dp_value_2qb:1600, dp_rank_2qb:88, market_inefficiency:'FAIR',
  },
  { player:'Nicholas Singleton', pos:'RB', team:'TEN', age:22, consensus_rank:75, my_rank:78, adp_round:8, target_round:9,
    tier:'R9', value_gap:-3, gem_flag:0,
    notes:'TEN R5 pick 165 — handcuff to monitor — TEN offense improving',
    proj_pts_2026:80, ceiling_score:68, floor_score:35, floor_score_v2:35, future_value:60,
    games_missed_2025:0, games_missed_2024:0, games_missed_2023:0, injury_type_history:'None noted',
    games_played_pct_career:100, injury_risk_score:2.0, injury_risk_tier:'🟢 LOW RISK',
    master_score:53.1, taxi_grade:'SPECULATIVE', is_rookie:1,
    rookie_context:'TEN R5 pick — pure taxi stash — handcuff Price eventually — age 22 upside only',
    dp_value_2qb:900, dp_rank_2qb:110, market_inefficiency:'FAIR',
  },
];

// ────────────────────────────────────────────────────────────
// Parse existing CSV
// ────────────────────────────────────────────────────────────
const csv = fs.readFileSync('/home/user/Fantasy-Tracker/draft_board.csv', 'utf8');
const lines = csv.trim().split('\n');
const headers = lines[0].split(',').map(h => h.trim());

function parseRow(line) {
  const vals = line.split(',');
  const obj = {};
  headers.forEach((h, i) => { obj[h] = (vals[i] || '').trim(); });
  return obj;
}
const rows = lines.slice(1).map(parseRow);

// ────────────────────────────────────────────────────────────
// Add new columns to ALL existing rows
// ────────────────────────────────────────────────────────────
const NEW_COLS = ['is_rookie', 'taxi_grade', 'rookie_context', 'depth_position', 'depth_role', 'is_handcuff', 'handcuff_of'];

// Mark Jeremiyah Love as rookie (already on board)
const EXISTING_ROOKIES = {
  'Jeremiyah Love': { is_rookie:1, taxi_grade:'ELITE_TAXI', rookie_context:'1.03 overall pick ARI — total package RB — receiving upside — ARI building around him long-term' },
  'Travis Hunter':  { is_rookie:0, taxi_grade:'NONE', rookie_context:'' }, // 2025 pick, not 2026
};

rows.forEach(p => {
  const rookieData = EXISTING_ROOKIES[p.player];
  p.is_rookie = rookieData ? rookieData.is_rookie : 0;
  p.taxi_grade = rookieData ? rookieData.taxi_grade : 'NONE';
  p.rookie_context = rookieData ? rookieData.rookie_context : '';
  p.depth_position = '';
  p.depth_role = '';
  p.is_handcuff = 0;
  p.handcuff_of = '';
});

// ────────────────────────────────────────────────────────────
// Build new headers
// ────────────────────────────────────────────────────────────
const newHeaders = [...headers, ...NEW_COLS];

// ────────────────────────────────────────────────────────────
// Convert existing rows to new format
// ────────────────────────────────────────────────────────────
function rowToCSV(p) {
  return newHeaders.map(h => {
    const v = p[h] !== undefined ? String(p[h]) : '';
    return v.includes(',') ? `"${v}"` : v;
  }).join(',');
}

const allRows = [...rows];

// ────────────────────────────────────────────────────────────
// Add new rookies (skip if already exists)
// ────────────────────────────────────────────────────────────
const existingPlayers = new Set(rows.map(r => r.player.toLowerCase()));

let added = 0;
ROOKIES_2026.forEach(r => {
  if (existingPlayers.has(r.player.toLowerCase())) {
    // Update existing row with rookie data
    const existing = allRows.find(x => x.player.toLowerCase() === r.player.toLowerCase());
    if (existing) {
      existing.is_rookie = 1;
      existing.taxi_grade = r.taxi_grade;
      existing.rookie_context = r.rookie_context;
      if (r.gem_flag) existing.gem_flag = r.gem_flag;
    }
    console.log('Updated existing:', r.player);
    return;
  }

  // Build full row
  const newRow = {};
  newHeaders.forEach(h => { newRow[h] = ''; });

  newRow.player = r.player;
  newRow.pos = r.pos;
  newRow.team = r.team;
  newRow.age = r.age;
  newRow.consensus_rank = r.consensus_rank;
  newRow.my_rank = r.my_rank;
  newRow.adp_round = r.adp_round;
  newRow.target_round = r.target_round;
  newRow.tier = r.tier;
  newRow.value_gap = r.value_gap || 0;
  newRow.gem_flag = r.gem_flag || 0;
  newRow.notes = r.notes || '';
  newRow.proj_pts_2026 = r.proj_pts_2026 || '';
  newRow.ceiling_score = r.ceiling_score || '';
  newRow.floor_score = r.floor_score || '';
  newRow.floor_score_v2 = r.floor_score_v2 || '';
  newRow.future_value = r.future_value || '';
  newRow.games_missed_2025 = r.games_missed_2025 !== undefined ? r.games_missed_2025 : 0;
  newRow.games_missed_2024 = r.games_missed_2024 !== undefined ? r.games_missed_2024 : 0;
  newRow.games_missed_2023 = r.games_missed_2023 !== undefined ? r.games_missed_2023 : 0;
  newRow.injury_type_history = r.injury_type_history || 'None noted';
  newRow.games_played_pct_career = r.games_played_pct_career || 100;
  newRow.injury_risk_score = r.injury_risk_score || 2.0;
  newRow.injury_risk_tier = r.injury_risk_tier || '🟢 LOW RISK';
  newRow.master_score = r.master_score || '';
  newRow.bust_category = r.bust_category || (r.gem_flag ? 'GEM' : 'NONE');
  newRow.bust_reason = r.bust_reason || '';
  newRow.dp_value_2qb = r.dp_value_2qb || '';
  newRow.dp_rank_2qb = r.dp_rank_2qb || '';
  newRow.dp_vs_my_rank = r.dp_rank_2qb && r.my_rank ? r.dp_rank_2qb - r.my_rank : '';
  newRow.market_inefficiency = r.market_inefficiency || '';
  newRow.is_rookie = 1;
  newRow.taxi_grade = r.taxi_grade;
  newRow.rookie_context = r.rookie_context || '';
  newRow.depth_position = '';
  newRow.depth_role = '';
  newRow.is_handcuff = 0;
  newRow.handcuff_of = '';
  // IDP-specific
  if (r.proj_fppg) newRow.proj_fppg = r.proj_fppg;

  allRows.push(newRow);
  added++;
});

// Sort by my_rank
allRows.sort((a, b) => (parseInt(a.my_rank) || 999) - (parseInt(b.my_rank) || 999));

// Write
const output = [newHeaders.join(','), ...allRows.map(rowToCSV)].join('\n') + '\n';
fs.writeFileSync('/home/user/Fantasy-Tracker/draft_board.csv', output);
console.log(`✅ Updated draft_board.csv: ${rows.length} existing + ${added} new rookies = ${allRows.length} total | ${newHeaders.length} columns`);

// Summary
const rookies = allRows.filter(r => r.is_rookie == 1);
console.log('Rookie count:', rookies.length);
console.log('Taxi grades:', [...new Set(rookies.map(r=>r.taxi_grade))]);
