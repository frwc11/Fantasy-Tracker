const fs = require('fs');

const csv = fs.readFileSync('/home/user/Fantasy-Tracker/draft_board.csv','utf8');
const lines = csv.trim().split('\n');
const headers = lines[0].split(',');

const existing = new Set();
for(let i=1;i<lines.length;i++){
  const name = lines[i].split(',')[0].toLowerCase().trim();
  existing.add(name);
}
console.log('Existing players:', existing.size);

function row(obj){
  return headers.map(h => {
    const v = obj[h];
    if(v===undefined||v===null) return '';
    return String(v);
  }).join(',');
}

const newPlayers = [
  // More WRs
  {player:'Christian Kirk',pos:'WR',team:'JAC',age:28,my_rank:102,consensus_rank:105,proj_pts_2026:148,ceiling_score:72,floor_score_v2:48,future_value:45,injury_risk_score:3.5,master_score:58,target_share:0.17,snap_pct:0.75,vorp_adjusted:10,bust_category:'DECLINING',dp_value_2qb:900,tier:8,target_round:10},
  {player:'Tyler Lockett',pos:'WR',team:'SEA',age:32,my_rank:118,consensus_rank:120,proj_pts_2026:138,ceiling_score:68,floor_score_v2:42,future_value:28,injury_risk_score:4.0,master_score:52,target_share:0.16,snap_pct:0.72,vorp_adjusted:5,bust_category:'DECLINING',dp_value_2qb:500,tier:9,target_round:12},
  {player:'Marquise Brown',pos:'WR',team:'KC',age:28,my_rank:110,consensus_rank:112,proj_pts_2026:142,ceiling_score:70,floor_score_v2:45,future_value:42,injury_risk_score:5.5,master_score:54,target_share:0.15,snap_pct:0.70,vorp_adjusted:7,bust_category:'NONE',dp_value_2qb:700,tier:9,target_round:11},
  {player:'Elijah Moore',pos:'WR',team:'CLE',age:24,my_rank:95,consensus_rank:98,proj_pts_2026:155,ceiling_score:76,floor_score_v2:48,future_value:62,injury_risk_score:4.0,master_score:60,target_share:0.16,snap_pct:0.72,vorp_adjusted:12,bust_category:'SCHEME_RISK',dp_value_2qb:1100,tier:8,target_round:10},
  {player:'Michael Thomas',pos:'WR',team:'NO',age:32,my_rank:125,consensus_rank:128,proj_pts_2026:125,ceiling_score:62,floor_score_v2:35,future_value:20,injury_risk_score:8.5,master_score:44,target_share:0.16,snap_pct:0.68,vorp_adjusted:2,bust_category:'DECLINING',dp_value_2qb:200,tier:10,target_round:14},
  {player:'Odell Beckham Jr',pos:'WR',team:'MIA',age:33,my_rank:130,consensus_rank:132,proj_pts_2026:118,ceiling_score:60,floor_score_v2:32,future_value:15,injury_risk_score:8.0,master_score:42,target_share:0.14,snap_pct:0.65,vorp_adjusted:1,bust_category:'DECLINING',dp_value_2qb:150,tier:10,target_round:14},
  {player:'Josh Reynolds',pos:'WR',team:'DEN',age:29,my_rank:120,consensus_rank:122,proj_pts_2026:135,ceiling_score:66,floor_score_v2:40,future_value:35,injury_risk_score:3.5,master_score:50,target_share:0.16,snap_pct:0.70,vorp_adjusted:4,bust_category:'NONE',dp_value_2qb:400,tier:9,target_round:13},
  {player:'Kadarius Toney',pos:'WR',team:'KC',age:26,my_rank:122,consensus_rank:124,proj_pts_2026:130,ceiling_score:70,floor_score_v2:35,future_value:45,injury_risk_score:7.0,master_score:48,target_share:0.13,snap_pct:0.62,vorp_adjusted:3,bust_category:'DECLINING',dp_value_2qb:350,tier:9,target_round:13},
  {player:'Van Jefferson',pos:'WR',team:'LAR',age:28,my_rank:115,consensus_rank:117,proj_pts_2026:138,ceiling_score:68,floor_score_v2:42,future_value:40,injury_risk_score:5.0,master_score:52,target_share:0.14,snap_pct:0.68,vorp_adjusted:6,bust_category:'SCHEME_RISK',dp_value_2qb:600,tier:9,target_round:12},
  {player:'Juju Smith-Schuster',pos:'WR',team:'NE',age:28,my_rank:112,consensus_rank:115,proj_pts_2026:140,ceiling_score:68,floor_score_v2:44,future_value:38,injury_risk_score:5.5,master_score:52,target_share:0.15,snap_pct:0.70,vorp_adjusted:6,bust_category:'DECLINING',dp_value_2qb:600,tier:9,target_round:12},

  // More RBs
  {player:'Miles Sanders',pos:'RB',team:'CAR',age:27,my_rank:100,consensus_rank:102,proj_pts_2026:145,ceiling_score:68,floor_score_v2:42,future_value:38,injury_risk_score:5.5,master_score:55,opportunity_share:0.55,snap_pct:0.65,vorp_adjusted:8,bust_category:'DECLINING',dp_value_2qb:700,tier:9,target_round:12},
  {player:'Najee Harris',pos:'RB',team:'PIT',age:27,my_rank:92,consensus_rank:95,proj_pts_2026:158,ceiling_score:72,floor_score_v2:50,future_value:50,injury_risk_score:4.5,master_score:60,opportunity_share:0.68,snap_pct:0.72,vorp_adjusted:15,bust_category:'NONE',dp_value_2qb:1200,tier:8,target_round:10},
  {player:'Ezekiel Elliott',pos:'RB',team:'DAL',age:30,my_rank:108,consensus_rank:110,proj_pts_2026:140,ceiling_score:65,floor_score_v2:40,future_value:25,injury_risk_score:5.5,master_score:50,opportunity_share:0.60,snap_pct:0.65,vorp_adjusted:5,bust_category:'DECLINING',dp_value_2qb:500,tier:9,target_round:12},
  {player:'Aaron Jones',pos:'RB',team:'MIN',age:30,my_rank:95,consensus_rank:97,proj_pts_2026:152,ceiling_score:70,floor_score_v2:48,future_value:38,injury_risk_score:5.0,master_score:57,opportunity_share:0.62,snap_pct:0.68,vorp_adjusted:12,bust_category:'DECLINING',dp_value_2qb:900,tier:8,target_round:11},
  {player:'Clyde Edwards-Helaire',pos:'RB',team:'KC',age:26,my_rank:105,consensus_rank:107,proj_pts_2026:143,ceiling_score:68,floor_score_v2:42,future_value:42,injury_risk_score:6.5,master_score:52,opportunity_share:0.50,snap_pct:0.60,vorp_adjusted:6,bust_category:'DECLINING',dp_value_2qb:600,tier:9,target_round:12},
  {player:'Chase Edmonds',pos:'RB',team:'DEN',age:29,my_rank:118,consensus_rank:120,proj_pts_2026:130,ceiling_score:62,floor_score_v2:38,future_value:28,injury_risk_score:4.5,master_score:47,opportunity_share:0.45,snap_pct:0.55,vorp_adjusted:3,bust_category:'NONE',dp_value_2qb:300,tier:10,target_round:14},
  {player:'Cam Akers',pos:'RB',team:'HOU',age:26,my_rank:110,consensus_rank:112,proj_pts_2026:138,ceiling_score:70,floor_score_v2:42,future_value:48,injury_risk_score:6.0,master_score:52,opportunity_share:0.52,snap_pct:0.62,vorp_adjusted:5,bust_category:'NONE',dp_value_2qb:500,tier:9,target_round:12},
  {player:'J.K. Dobbins',pos:'RB',team:'LAC',age:26,my_rank:88,consensus_rank:90,proj_pts_2026:163,ceiling_score:80,floor_score_v2:52,future_value:58,injury_risk_score:7.0,master_score:61,opportunity_share:0.65,snap_pct:0.68,vorp_adjusted:18,bust_category:'NONE',dp_value_2qb:1400,tier:7,target_round:10},

  // More TEs
  {player:'Tyler Higbee',pos:'TE',team:'LAR',age:31,my_rank:108,consensus_rank:110,proj_pts_2026:108,ceiling_score:62,floor_score_v2:38,future_value:28,injury_risk_score:6.0,master_score:50,target_share:0.10,snap_pct:0.62,vorp_adjusted:5,bust_category:'DECLINING',dp_value_2qb:600,tier:9,target_round:12},
  {player:'Evan Engram',pos:'TE',team:'JAC',age:30,my_rank:95,consensus_rank:97,proj_pts_2026:118,ceiling_score:68,floor_score_v2:42,future_value:35,injury_risk_score:5.5,master_score:56,target_share:0.11,snap_pct:0.65,vorp_adjusted:10,bust_category:'DECLINING',dp_value_2qb:900,tier:8,target_round:11},
  {player:'Austin Hooper',pos:'TE',team:'TEN',age:30,my_rank:115,consensus_rank:117,proj_pts_2026:100,ceiling_score:58,floor_score_v2:35,future_value:22,injury_risk_score:4.5,master_score:46,target_share:0.09,snap_pct:0.58,vorp_adjusted:2,bust_category:'DECLINING',dp_value_2qb:300,tier:10,target_round:14},
  {player:'Gerald Everett',pos:'TE',team:'LAC',age:31,my_rank:112,consensus_rank:114,proj_pts_2026:104,ceiling_score:60,floor_score_v2:36,future_value:25,injury_risk_score:4.0,master_score:48,target_share:0.10,snap_pct:0.60,vorp_adjusted:3,bust_category:'DECLINING',dp_value_2qb:400,tier:9,target_round:13},
  {player:'Jelani Woods',pos:'TE',team:'IND',age:25,my_rank:100,consensus_rank:102,proj_pts_2026:112,ceiling_score:76,floor_score_v2:42,future_value:65,injury_risk_score:4.5,master_score:56,target_share:0.10,snap_pct:0.62,vorp_adjusted:8,bust_category:'NONE',dp_value_2qb:800,tier:8,target_round:11},
  {player:'Will Dissly',pos:'TE',team:'SEA',age:29,my_rank:118,consensus_rank:120,proj_pts_2026:98,ceiling_score:58,floor_score_v2:34,future_value:28,injury_risk_score:5.5,master_score:46,target_share:0.09,snap_pct:0.56,vorp_adjusted:2,bust_category:'NONE',dp_value_2qb:250,tier:10,target_round:14},

  // More QBs
  {player:'Derek Carr',pos:'QB',team:'NO',age:33,my_rank:105,consensus_rank:107,proj_pts_2026:268,ceiling_score:68,floor_score_v2:42,future_value:30,injury_risk_score:5.0,master_score:52,snap_pct:0.72,vorp_adjusted:8,bust_category:'DECLINING',dp_value_2qb:700,tier:9,target_round:12},
  {player:'Ryan Tannehill',pos:'QB',team:'TEN',age:35,my_rank:118,consensus_rank:120,proj_pts_2026:245,ceiling_score:60,floor_score_v2:36,future_value:18,injury_risk_score:5.5,master_score:44,snap_pct:0.68,vorp_adjusted:3,bust_category:'DECLINING',dp_value_2qb:200,tier:10,target_round:14},
  {player:'Gardner Minshew',pos:'QB',team:'LV',age:28,my_rank:112,consensus_rank:114,proj_pts_2026:255,ceiling_score:64,floor_score_v2:40,future_value:35,injury_risk_score:4.0,master_score:50,snap_pct:0.70,vorp_adjusted:5,bust_category:'NONE',dp_value_2qb:400,tier:9,target_round:13},
  {player:'Mac Jones',pos:'QB',team:'JAC',age:27,my_rank:108,consensus_rank:110,proj_pts_2026:258,ceiling_score:66,floor_score_v2:40,future_value:40,injury_risk_score:4.5,master_score:52,snap_pct:0.70,vorp_adjusted:6,bust_category:'SCHEME_RISK',dp_value_2qb:500,tier:9,target_round:12},

  // More IDPs - EDGE
  {player:'Za\'Darius Smith',pos:'EDGE',team:'CLE',age:32,my_rank:65,consensus_rank:67,proj_pts_2026:115,ceiling_score:72,floor_score_v2:48,future_value:35,injury_risk_score:6.0,master_score:58,pressure_rate_pass_rush:0.17,pass_rush_win_rate:0.15,snap_pct_def:0.68,vorp_adjusted:15,bust_category:'DECLINING',dp_value_2qb:800,tier:7,target_round:9},
  {player:'Yannick Ngakoue',pos:'EDGE',team:'IND',age:29,my_rank:70,consensus_rank:72,proj_pts_2026:110,ceiling_score:70,floor_score_v2:45,future_value:40,injury_risk_score:5.0,master_score:57,pressure_rate_pass_rush:0.16,pass_rush_win_rate:0.14,snap_pct_def:0.66,vorp_adjusted:12,bust_category:'NONE',dp_value_2qb:700,tier:7,target_round:9},
  {player:'Carl Lawson',pos:'EDGE',team:'NYJ',age:28,my_rank:72,consensus_rank:74,proj_pts_2026:108,ceiling_score:76,floor_score_v2:44,future_value:52,injury_risk_score:7.5,master_score:56,pressure_rate_pass_rush:0.17,pass_rush_win_rate:0.15,snap_pct_def:0.65,vorp_adjusted:11,bust_category:'NONE',dp_value_2qb:650,tier:7,target_round:9},
  {player:'Emmanuel Ogbah',pos:'EDGE',team:'MIA',age:31,my_rank:78,consensus_rank:80,proj_pts_2026:102,ceiling_score:65,floor_score_v2:40,future_value:30,injury_risk_score:5.5,master_score:52,pressure_rate_pass_rush:0.15,pass_rush_win_rate:0.13,snap_pct_def:0.62,vorp_adjusted:8,bust_category:'DECLINING',dp_value_2qb:500,tier:8,target_round:10},
  {player:'Harold Landry',pos:'EDGE',team:'TEN',age:28,my_rank:68,consensus_rank:70,proj_pts_2026:112,ceiling_score:74,floor_score_v2:46,future_value:50,injury_risk_score:5.0,master_score:58,pressure_rate_pass_rush:0.16,pass_rush_win_rate:0.14,snap_pct_def:0.68,vorp_adjusted:13,bust_category:'NONE',dp_value_2qb:750,tier:7,target_round:9},
  {player:'Chase Young',pos:'EDGE',team:'NO',age:26,my_rank:60,consensus_rank:62,proj_pts_2026:120,ceiling_score:82,floor_score_v2:50,future_value:62,injury_risk_score:7.0,master_score:61,pressure_rate_pass_rush:0.18,pass_rush_win_rate:0.16,snap_pct_def:0.70,vorp_adjusted:18,bust_category:'NONE',dp_value_2qb:1000,tier:7,target_round:9},
  {player:'Shaquil Barrett',pos:'EDGE',team:'TB',age:32,my_rank:85,consensus_rank:87,proj_pts_2026:98,ceiling_score:65,floor_score_v2:38,future_value:25,injury_risk_score:6.5,master_score:50,pressure_rate_pass_rush:0.15,pass_rush_win_rate:0.13,snap_pct_def:0.62,vorp_adjusted:6,bust_category:'DECLINING',dp_value_2qb:400,tier:8,target_round:11},

  // More LBs
  {player:'Foye Oluokun',pos:'LB',team:'JAC',age:29,my_rank:65,consensus_rank:67,proj_pts_2026:112,ceiling_score:70,floor_score_v2:48,future_value:50,injury_risk_score:3.0,master_score:62,snap_pct_def:0.78,tackle_rate:0.12,vorp_adjusted:16,bust_category:'NONE',dp_value_2qb:950,tier:7,target_round:9},
  {player:'Roquan Smith',pos:'LB',team:'BAL',age:28,my_rank:48,consensus_rank:50,proj_pts_2026:125,ceiling_score:80,floor_score_v2:58,future_value:65,injury_risk_score:3.0,master_score:68,snap_pct_def:0.82,tackle_rate:0.13,vorp_adjusted:24,bust_category:'NONE',dp_value_2qb:1700,tier:6,target_round:8},
  {player:'Patrick Queen',pos:'LB',team:'PIT',age:26,my_rank:55,consensus_rank:57,proj_pts_2026:118,ceiling_score:76,floor_score_v2:52,future_value:62,injury_risk_score:3.5,master_score:65,snap_pct_def:0.80,tackle_rate:0.12,vorp_adjusted:20,bust_category:'NONE',dp_value_2qb:1300,tier:7,target_round:9},
  {player:'Kwon Alexander',pos:'LB',team:'NO',age:30,my_rank:88,consensus_rank:90,proj_pts_2026:100,ceiling_score:62,floor_score_v2:38,future_value:30,injury_risk_score:6.5,master_score:50,snap_pct_def:0.68,tackle_rate:0.10,vorp_adjusted:6,bust_category:'DECLINING',dp_value_2qb:350,tier:9,target_round:12},
  {player:'Lavonte David',pos:'LB',team:'TB',age:34,my_rank:95,consensus_rank:97,proj_pts_2026:95,ceiling_score:60,floor_score_v2:35,future_value:18,injury_risk_score:5.0,master_score:46,snap_pct_def:0.65,tackle_rate:0.11,vorp_adjusted:4,bust_category:'DECLINING',dp_value_2qb:200,tier:9,target_round:13},

  // More DBs/Safeties
  {player:'Budda Baker',pos:'DB',team:'ARI',age:28,my_rank:70,consensus_rank:72,proj_pts_2026:105,ceiling_score:72,floor_score_v2:48,future_value:52,injury_risk_score:4.0,master_score:60,snap_pct_def:0.80,vorp_adjusted:14,bust_category:'SCHEME_RISK',dp_value_2qb:1000,tier:7,target_round:9},
  {player:'Minkah Fitzpatrick',pos:'DB',team:'PIT',age:27,my_rank:55,consensus_rank:57,proj_pts_2026:115,ceiling_score:78,floor_score_v2:52,future_value:65,injury_risk_score:3.5,master_score:66,snap_pct_def:0.82,vorp_adjusted:20,bust_category:'NONE',dp_value_2qb:1500,tier:6,target_round:8},
  {player:'Derwin James',pos:'DB',team:'LAC',age:28,my_rank:42,consensus_rank:44,proj_pts_2026:122,ceiling_score:84,floor_score_v2:58,future_value:68,injury_risk_score:6.0,master_score:68,snap_pct_def:0.80,vorp_adjusted:25,bust_category:'NONE',dp_value_2qb:1800,tier:6,target_round:8},
  {player:'Kevin Byard',pos:'DB',team:'TEN',age:31,my_rank:85,consensus_rank:87,proj_pts_2026:98,ceiling_score:64,floor_score_v2:40,future_value:32,injury_risk_score:4.5,master_score:52,snap_pct_def:0.72,vorp_adjusted:7,bust_category:'DECLINING',dp_value_2qb:450,tier:8,target_round:11},
  {player:'Kyle Hamilton',pos:'DB',team:'BAL',age:24,my_rank:32,consensus_rank:34,proj_pts_2026:130,ceiling_score:88,floor_score_v2:62,future_value:78,injury_risk_score:3.0,master_score:75,snap_pct_def:0.84,vorp_adjusted:32,bust_category:'NONE',dp_value_2qb:2600,tier:5,target_round:6},
  {player:'Xavier McKinney',pos:'DB',team:'GB',age:25,my_rank:62,consensus_rank:64,proj_pts_2026:110,ceiling_score:76,floor_score_v2:50,future_value:65,injury_risk_score:4.0,master_score:62,snap_pct_def:0.78,vorp_adjusted:16,bust_category:'NONE',dp_value_2qb:1200,tier:7,target_round:9},
];

const added = [];
for(const p of newPlayers){
  if(existing.has(p.player.toLowerCase())){
    console.log('SKIP (exists):', p.player);
    continue;
  }
  // Set defaults for missing fields
  if(!p.tier) p.tier = 8;
  if(!p.target_round) p.target_round = 10;
  if(!p.gem_flag) p.gem_flag = 0;
  if(!p.is_rookie) p.is_rookie = 0;
  added.push(p);
  existing.add(p.player.toLowerCase());
}

const newLines = added.map(p => row(p));
const output = lines.join('\n') + '\n' + newLines.join('\n') + '\n';
fs.writeFileSync('/home/user/Fantasy-Tracker/draft_board.csv', output);
console.log(`\nAdded ${added.length} new players. Total rows: ${lines.length - 1 + added.length}`);
