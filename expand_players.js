const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'draft_board.csv');

// Read existing CSV
const csvContent = fs.readFileSync(csvPath, 'utf8');
const lines = csvContent.split('\n');
const headers = lines[0].split(',');

// Parse existing player names (lowercase for dedup)
const existingNames = new Set();
for (let i = 1; i < lines.length; i++) {
  if (lines[i].trim()) {
    const name = lines[i].split(',')[0].trim().toLowerCase();
    existingNames.add(name);
  }
}

console.log(`Existing players: ${existingNames.size}`);

// Helper to build a CSV row from a player object
function buildRow(headers, player) {
  return headers.map(h => {
    const val = player[h];
    if (val === undefined || val === null) return '';
    return String(val);
  }).join(',');
}

// New players to add
const newPlayers = [
  // WRs
  { player: 'Nico Collins', pos: 'WR', team: 'HOU', age: 26, my_rank: 67, consensus_rank: 70, proj_pts_2026: 185, ceiling_score: 82, floor_score_v2: 62, future_value: 68, injury_risk_score: 4.5, master_score: 71, target_share: 0.22, snap_pct: 0.78, vorp_adjusted: 35, bust_category: 'NONE', dp_value_2qb: 3200 },
  { player: 'Tee Higgins', pos: 'WR', team: 'CIN', age: 26, my_rank: 52, consensus_rank: 55, proj_pts_2026: 195, ceiling_score: 85, floor_score_v2: 65, future_value: 70, injury_risk_score: 5.5, master_score: 73, target_share: 0.23, snap_pct: 0.82, vorp_adjusted: 42, bust_category: 'RENTAL', dp_value_2qb: 4100 },
  { player: 'DJ Moore', pos: 'WR', team: 'CHI', age: 27, my_rank: 60, consensus_rank: 63, proj_pts_2026: 188, ceiling_score: 80, floor_score_v2: 60, future_value: 58, injury_risk_score: 3.5, master_score: 70, target_share: 0.21, snap_pct: 0.80, vorp_adjusted: 38, bust_category: 'SCHEME_RISK', dp_value_2qb: 3600 },
  { player: 'Brandon Aiyuk', pos: 'WR', team: 'SF', age: 27, my_rank: 58, consensus_rank: 60, proj_pts_2026: 190, ceiling_score: 83, floor_score_v2: 63, future_value: 60, injury_risk_score: 4.0, master_score: 72, target_share: 0.22, snap_pct: 0.81, vorp_adjusted: 40, bust_category: 'NONE', dp_value_2qb: 3800 },
  { player: 'Chris Olave', pos: 'WR', team: 'NO', age: 25, my_rank: 54, consensus_rank: 57, proj_pts_2026: 192, ceiling_score: 84, floor_score_v2: 64, future_value: 72, injury_risk_score: 5.0, master_score: 73, target_share: 0.22, snap_pct: 0.83, vorp_adjusted: 41, bust_category: 'SCHEME_RISK', dp_value_2qb: 4000 },
  { player: 'Michael Pittman Jr', pos: 'WR', team: 'IND', age: 27, my_rank: 65, consensus_rank: 68, proj_pts_2026: 182, ceiling_score: 78, floor_score_v2: 58, future_value: 55, injury_risk_score: 3.0, master_score: 68, target_share: 0.20, snap_pct: 0.79, vorp_adjusted: 32, bust_category: 'DECLINING', dp_value_2qb: 2900 },
  { player: 'Tank Dell', pos: 'WR', team: 'HOU', age: 24, my_rank: 62, consensus_rank: 65, proj_pts_2026: 186, ceiling_score: 88, floor_score_v2: 55, future_value: 78, injury_risk_score: 6.5, master_score: 70, target_share: 0.18, snap_pct: 0.72, vorp_adjusted: 36, bust_category: 'SCHEME_RISK', dp_value_2qb: 3400 },
  { player: 'Deebo Samuel', pos: 'WR', team: 'SF', age: 29, my_rank: 88, consensus_rank: 90, proj_pts_2026: 165, ceiling_score: 75, floor_score_v2: 50, future_value: 40, injury_risk_score: 6.8, master_score: 60, target_share: 0.17, snap_pct: 0.70, vorp_adjusted: 18, bust_category: 'DECLINING', dp_value_2qb: 1800 },
  { player: 'Jordan Addison', pos: 'WR', team: 'MIN', age: 23, my_rank: 55, consensus_rank: 58, proj_pts_2026: 193, ceiling_score: 86, floor_score_v2: 65, future_value: 75, injury_risk_score: 3.5, master_score: 74, target_share: 0.21, snap_pct: 0.82, vorp_adjusted: 43, bust_category: 'NONE', dp_value_2qb: 4200 },
  { player: 'DK Metcalf', pos: 'WR', team: 'PIT', age: 28, my_rank: 70, consensus_rank: 73, proj_pts_2026: 180, ceiling_score: 82, floor_score_v2: 58, future_value: 52, injury_risk_score: 4.5, master_score: 68, target_share: 0.20, snap_pct: 0.80, vorp_adjusted: 30, bust_category: 'DECLINING', dp_value_2qb: 2800 },
  { player: "Wan'Dale Robinson", pos: 'WR', team: 'NYG', age: 24, my_rank: 95, consensus_rank: 98, proj_pts_2026: 155, ceiling_score: 75, floor_score_v2: 48, future_value: 65, injury_risk_score: 5.5, master_score: 62, target_share: 0.16, snap_pct: 0.68, vorp_adjusted: 15, bust_category: 'SCHEME_RISK', dp_value_2qb: 1500 },
  { player: 'Khalil Shakir', pos: 'WR', team: 'BUF', age: 25, my_rank: 72, consensus_rank: 75, proj_pts_2026: 178, ceiling_score: 80, floor_score_v2: 58, future_value: 68, injury_risk_score: 3.0, master_score: 69, target_share: 0.19, snap_pct: 0.78, vorp_adjusted: 28, bust_category: 'NONE', dp_value_2qb: 2600 },
  { player: 'Cedric Tillman', pos: 'WR', team: 'CLE', age: 24, my_rank: 98, consensus_rank: 100, proj_pts_2026: 150, ceiling_score: 78, floor_score_v2: 45, future_value: 68, injury_risk_score: 4.0, master_score: 62, target_share: 0.15, snap_pct: 0.65, vorp_adjusted: 12, bust_category: 'SCHEME_RISK', dp_value_2qb: 1400 },
  { player: 'Cooper Kupp', pos: 'WR', team: 'LAR', age: 32, my_rank: 105, consensus_rank: 108, proj_pts_2026: 145, ceiling_score: 72, floor_score_v2: 45, future_value: 30, injury_risk_score: 7.5, master_score: 55, target_share: 0.19, snap_pct: 0.75, vorp_adjusted: 8, bust_category: 'DECLINING', dp_value_2qb: 800 },
  { player: 'Dontayvion Wicks', pos: 'WR', team: 'GB', age: 24, my_rank: 82, consensus_rank: 85, proj_pts_2026: 170, ceiling_score: 82, floor_score_v2: 52, future_value: 72, injury_risk_score: 3.5, master_score: 66, target_share: 0.17, snap_pct: 0.72, vorp_adjusted: 22, bust_category: 'NONE', dp_value_2qb: 2200 },
  { player: 'Jaylen Waddle', pos: 'WR', team: 'MIA', age: 26, my_rank: 75, consensus_rank: 78, proj_pts_2026: 175, ceiling_score: 84, floor_score_v2: 58, future_value: 65, injury_risk_score: 4.5, master_score: 69, target_share: 0.20, snap_pct: 0.80, vorp_adjusted: 26, bust_category: 'SCHEME_RISK', dp_value_2qb: 2500 },
  { player: 'Rashid Shaheed', pos: 'WR', team: 'NO', age: 26, my_rank: 90, consensus_rank: 93, proj_pts_2026: 162, ceiling_score: 80, floor_score_v2: 50, future_value: 65, injury_risk_score: 4.0, master_score: 64, target_share: 0.16, snap_pct: 0.70, vorp_adjusted: 16, bust_category: 'SCHEME_RISK', dp_value_2qb: 1600 },
  { player: 'Zay Flowers', pos: 'WR', team: 'BAL', age: 24, my_rank: 50, consensus_rank: 52, proj_pts_2026: 200, ceiling_score: 88, floor_score_v2: 68, future_value: 78, injury_risk_score: 3.5, master_score: 76, target_share: 0.22, snap_pct: 0.84, vorp_adjusted: 48, bust_category: 'NONE', dp_value_2qb: 4600 },
  { player: 'Jaxon Smith-Njigba', pos: 'WR', team: 'SEA', age: 23, my_rank: 45, consensus_rank: 47, proj_pts_2026: 205, ceiling_score: 90, floor_score_v2: 70, future_value: 82, injury_risk_score: 3.0, master_score: 78, target_share: 0.23, snap_pct: 0.85, vorp_adjusted: 52, bust_category: 'NONE', dp_value_2qb: 5000 },
  { player: 'Rome Odunze', pos: 'WR', team: 'CHI', age: 23, my_rank: 48, consensus_rank: 50, proj_pts_2026: 200, ceiling_score: 89, floor_score_v2: 68, future_value: 82, injury_risk_score: 3.0, master_score: 77, target_share: 0.22, snap_pct: 0.83, vorp_adjusted: 50, bust_category: 'NONE', dp_value_2qb: 4800 },
  // RBs
  { player: "D'Andre Swift", pos: 'RB', team: 'CHI', age: 26, my_rank: 55, consensus_rank: 58, proj_pts_2026: 185, ceiling_score: 82, floor_score_v2: 60, future_value: 60, injury_risk_score: 5.5, master_score: 70, target_share: 0.12, opportunity_share: 0.58, snap_pct: 0.72, vorp_adjusted: 40, bust_category: 'NONE', dp_value_2qb: 3500 },
  { player: 'Tony Pollard', pos: 'RB', team: 'TEN', age: 28, my_rank: 70, consensus_rank: 73, proj_pts_2026: 172, ceiling_score: 78, floor_score_v2: 55, future_value: 45, injury_risk_score: 4.5, master_score: 65, opportunity_share: 0.62, snap_pct: 0.70, vorp_adjusted: 28, bust_category: 'DECLINING', dp_value_2qb: 2200 },
  { player: 'Isiah Pacheco', pos: 'RB', team: 'KC', age: 26, my_rank: 60, consensus_rank: 63, proj_pts_2026: 182, ceiling_score: 80, floor_score_v2: 60, future_value: 60, injury_risk_score: 5.0, master_score: 69, opportunity_share: 0.65, snap_pct: 0.72, vorp_adjusted: 35, bust_category: 'NONE', dp_value_2qb: 2900 },
  { player: 'Brian Robinson Jr', pos: 'RB', team: 'WSH', age: 26, my_rank: 65, consensus_rank: 68, proj_pts_2026: 178, ceiling_score: 78, floor_score_v2: 58, future_value: 58, injury_risk_score: 4.0, master_score: 68, opportunity_share: 0.68, snap_pct: 0.70, vorp_adjusted: 32, bust_category: 'SCHEME_RISK', dp_value_2qb: 2600 },
  { player: 'Tyjae Spears', pos: 'RB', team: 'TEN', age: 24, my_rank: 68, consensus_rank: 70, proj_pts_2026: 175, ceiling_score: 82, floor_score_v2: 55, future_value: 70, injury_risk_score: 4.0, master_score: 68, opportunity_share: 0.55, snap_pct: 0.68, vorp_adjusted: 30, bust_category: 'NONE', dp_value_2qb: 2800 },
  { player: 'Jordan Mason', pos: 'RB', team: 'SF', age: 25, my_rank: 78, consensus_rank: 80, proj_pts_2026: 168, ceiling_score: 78, floor_score_v2: 52, future_value: 58, injury_risk_score: 4.5, master_score: 65, opportunity_share: 0.62, snap_pct: 0.68, vorp_adjusted: 24, bust_category: 'SCHEME_RISK', dp_value_2qb: 2000 },
  { player: 'Dameon Pierce', pos: 'RB', team: 'HOU', age: 25, my_rank: 90, consensus_rank: 93, proj_pts_2026: 155, ceiling_score: 75, floor_score_v2: 45, future_value: 55, injury_risk_score: 5.5, master_score: 60, opportunity_share: 0.52, snap_pct: 0.60, vorp_adjusted: 14, bust_category: 'NONE', dp_value_2qb: 1400 },
  { player: 'Kareem Hunt', pos: 'RB', team: 'FA', age: 30, my_rank: 115, consensus_rank: 118, proj_pts_2026: 135, ceiling_score: 65, floor_score_v2: 40, future_value: 25, injury_risk_score: 5.0, master_score: 50, opportunity_share: 0.55, snap_pct: 0.62, vorp_adjusted: 5, bust_category: 'DECLINING', dp_value_2qb: 500 },
  { player: 'Rhamondre Stevenson', pos: 'RB', team: 'NE', age: 26, my_rank: 75, consensus_rank: 77, proj_pts_2026: 172, ceiling_score: 78, floor_score_v2: 55, future_value: 58, injury_risk_score: 4.5, master_score: 66, opportunity_share: 0.65, snap_pct: 0.68, vorp_adjusted: 28, bust_category: 'SCHEME_RISK', dp_value_2qb: 2200 },
  { player: 'Zack Moss', pos: 'RB', team: 'IND', age: 26, my_rank: 85, consensus_rank: 88, proj_pts_2026: 162, ceiling_score: 74, floor_score_v2: 50, future_value: 50, injury_risk_score: 4.5, master_score: 62, opportunity_share: 0.60, snap_pct: 0.65, vorp_adjusted: 18, bust_category: 'NONE', dp_value_2qb: 1600 },
  // TEs
  { player: 'Pat Freiermuth', pos: 'TE', team: 'PIT', age: 26, my_rank: 85, consensus_rank: 88, proj_pts_2026: 130, ceiling_score: 72, floor_score_v2: 48, future_value: 58, injury_risk_score: 4.0, master_score: 62, target_share: 0.13, snap_pct: 0.70, vorp_adjusted: 20, bust_category: 'NONE', dp_value_2qb: 1800 },
  { player: 'Cole Kmet', pos: 'TE', team: 'CHI', age: 26, my_rank: 80, consensus_rank: 83, proj_pts_2026: 138, ceiling_score: 75, floor_score_v2: 50, future_value: 62, injury_risk_score: 3.5, master_score: 64, target_share: 0.13, snap_pct: 0.72, vorp_adjusted: 24, bust_category: 'SCHEME_RISK', dp_value_2qb: 2200 },
  { player: 'Luke Musgrave', pos: 'TE', team: 'GB', age: 24, my_rank: 75, consensus_rank: 78, proj_pts_2026: 145, ceiling_score: 80, floor_score_v2: 52, future_value: 72, injury_risk_score: 4.5, master_score: 66, target_share: 0.14, snap_pct: 0.73, vorp_adjusted: 28, bust_category: 'NONE', dp_value_2qb: 2600 },
  { player: 'Hunter Henry', pos: 'TE', team: 'NE', age: 30, my_rank: 100, consensus_rank: 102, proj_pts_2026: 118, ceiling_score: 65, floor_score_v2: 42, future_value: 35, injury_risk_score: 4.5, master_score: 55, target_share: 0.12, snap_pct: 0.68, vorp_adjusted: 10, bust_category: 'DECLINING', dp_value_2qb: 800 },
  { player: 'Dawson Knox', pos: 'TE', team: 'BUF', age: 28, my_rank: 92, consensus_rank: 95, proj_pts_2026: 122, ceiling_score: 70, floor_score_v2: 44, future_value: 45, injury_risk_score: 5.5, master_score: 58, target_share: 0.11, snap_pct: 0.65, vorp_adjusted: 14, bust_category: 'NONE', dp_value_2qb: 1100 },
  { player: 'Chigoziem Okonkwo', pos: 'TE', team: 'TEN', age: 25, my_rank: 78, consensus_rank: 80, proj_pts_2026: 140, ceiling_score: 78, floor_score_v2: 52, future_value: 68, injury_risk_score: 3.5, master_score: 65, target_share: 0.14, snap_pct: 0.72, vorp_adjusted: 26, bust_category: 'SCHEME_RISK', dp_value_2qb: 2400 },
  { player: 'Michael Mayer', pos: 'TE', team: 'LV', age: 23, my_rank: 88, consensus_rank: 90, proj_pts_2026: 125, ceiling_score: 76, floor_score_v2: 45, future_value: 68, injury_risk_score: 3.0, master_score: 62, target_share: 0.12, snap_pct: 0.68, vorp_adjusted: 18, bust_category: 'NONE', dp_value_2qb: 1900 },
  { player: 'Noah Gray', pos: 'TE', team: 'KC', age: 25, my_rank: 95, consensus_rank: 97, proj_pts_2026: 118, ceiling_score: 70, floor_score_v2: 42, future_value: 55, injury_risk_score: 3.5, master_score: 58, target_share: 0.11, snap_pct: 0.65, vorp_adjusted: 12, bust_category: 'SCHEME_RISK', dp_value_2qb: 1200 },
  // QBs
  { player: 'Justin Fields', pos: 'QB', team: 'PIT', age: 27, my_rank: 80, consensus_rank: 82, proj_pts_2026: 320, ceiling_score: 85, floor_score_v2: 52, future_value: 65, injury_risk_score: 5.5, master_score: 65, snap_pct: 0.75, vorp_adjusted: 28, bust_category: 'SCHEME_RISK', dp_value_2qb: 2500 },
  { player: 'Tua Tagovailoa', pos: 'QB', team: 'MIA', age: 28, my_rank: 88, consensus_rank: 90, proj_pts_2026: 300, ceiling_score: 80, floor_score_v2: 48, future_value: 52, injury_risk_score: 8.0, master_score: 58, snap_pct: 0.72, vorp_adjusted: 18, bust_category: 'DECLINING', dp_value_2qb: 1200 },
  { player: 'Sam Darnold', pos: 'QB', team: 'SEA', age: 28, my_rank: 95, consensus_rank: 97, proj_pts_2026: 285, ceiling_score: 75, floor_score_v2: 45, future_value: 45, injury_risk_score: 5.0, master_score: 56, snap_pct: 0.70, vorp_adjusted: 12, bust_category: 'SCHEME_RISK', dp_value_2qb: 900 },
  { player: 'Russell Wilson', pos: 'QB', team: 'NYG', age: 37, my_rank: 115, consensus_rank: 118, proj_pts_2026: 250, ceiling_score: 65, floor_score_v2: 38, future_value: 20, injury_risk_score: 6.0, master_score: 45, snap_pct: 0.65, vorp_adjusted: 5, bust_category: 'DECLINING', dp_value_2qb: 300 },
  // IDPs
  { player: 'Nick Bosa', pos: 'EDGE', team: 'SF', age: 27, my_rank: 18, consensus_rank: 20, proj_pts_2026: 165, ceiling_score: 92, floor_score_v2: 72, future_value: 75, injury_risk_score: 5.0, master_score: 82, pressure_rate_pass_rush: 0.28, pass_rush_win_rate: 0.24, snap_pct_def: 0.78, vorp_adjusted: 55, bust_category: 'NONE', dp_value_2qb: 5800 },
  { player: 'Josh Allen (EDGE)', pos: 'EDGE', team: 'JAC', age: 26, my_rank: 20, consensus_rank: 22, proj_pts_2026: 158, ceiling_score: 88, floor_score_v2: 68, future_value: 72, injury_risk_score: 4.0, master_score: 80, pressure_rate_pass_rush: 0.25, pass_rush_win_rate: 0.22, snap_pct_def: 0.80, vorp_adjusted: 50, bust_category: 'NONE', dp_value_2qb: 5200 },
  { player: 'Danielle Hunter', pos: 'EDGE', team: 'HOU', age: 30, my_rank: 35, consensus_rank: 37, proj_pts_2026: 138, ceiling_score: 80, floor_score_v2: 58, future_value: 50, injury_risk_score: 5.5, master_score: 70, pressure_rate_pass_rush: 0.22, pass_rush_win_rate: 0.20, snap_pct_def: 0.75, vorp_adjusted: 35, bust_category: 'DECLINING', dp_value_2qb: 2800 },
  { player: 'Azeez Ojulari', pos: 'EDGE', team: 'NYG', age: 24, my_rank: 40, consensus_rank: 42, proj_pts_2026: 130, ceiling_score: 85, floor_score_v2: 52, future_value: 78, injury_risk_score: 6.0, master_score: 68, pressure_rate_pass_rush: 0.20, pass_rush_win_rate: 0.18, snap_pct_def: 0.72, vorp_adjusted: 30, bust_category: 'NONE', dp_value_2qb: 2200 },
  { player: 'Uchenna Nwosu', pos: 'EDGE', team: 'SEA', age: 28, my_rank: 50, consensus_rank: 52, proj_pts_2026: 122, ceiling_score: 75, floor_score_v2: 50, future_value: 55, injury_risk_score: 4.5, master_score: 65, pressure_rate_pass_rush: 0.18, pass_rush_win_rate: 0.16, snap_pct_def: 0.70, vorp_adjusted: 22, bust_category: 'NONE', dp_value_2qb: 1500 },
  { player: 'Quinnen Williams', pos: 'DL', team: 'NYJ', age: 27, my_rank: 45, consensus_rank: 47, proj_pts_2026: 128, ceiling_score: 82, floor_score_v2: 58, future_value: 65, injury_risk_score: 4.0, master_score: 70, pressure_rate_pass_rush: 0.18, pass_rush_win_rate: 0.16, snap_pct_def: 0.75, vorp_adjusted: 28, bust_category: 'SCHEME_RISK', dp_value_2qb: 1800 },
  { player: 'Tremaine Edmunds', pos: 'LB', team: 'CHI', age: 27, my_rank: 48, consensus_rank: 50, proj_pts_2026: 125, ceiling_score: 78, floor_score_v2: 55, future_value: 62, injury_risk_score: 3.5, master_score: 68, snap_pct_def: 0.80, tackle_rate: 0.12, vorp_adjusted: 25, bust_category: 'SCHEME_RISK', dp_value_2qb: 1600 },
  { player: 'Devin Lloyd', pos: 'LB', team: 'JAC', age: 26, my_rank: 52, consensus_rank: 54, proj_pts_2026: 120, ceiling_score: 76, floor_score_v2: 52, future_value: 65, injury_risk_score: 3.5, master_score: 66, snap_pct_def: 0.78, tackle_rate: 0.11, vorp_adjusted: 22, bust_category: 'NONE', dp_value_2qb: 1400 },
  { player: 'Bobby Okereke', pos: 'LB', team: 'NYG', age: 28, my_rank: 55, consensus_rank: 57, proj_pts_2026: 115, ceiling_score: 72, floor_score_v2: 48, future_value: 55, injury_risk_score: 3.0, master_score: 63, snap_pct_def: 0.76, tackle_rate: 0.12, vorp_adjusted: 18, bust_category: 'NONE', dp_value_2qb: 1100 },
  { player: 'Micah McFadden', pos: 'LB', team: 'NYG', age: 25, my_rank: 58, consensus_rank: 60, proj_pts_2026: 112, ceiling_score: 74, floor_score_v2: 46, future_value: 65, injury_risk_score: 3.0, master_score: 63, snap_pct_def: 0.75, tackle_rate: 0.11, vorp_adjusted: 16, bust_category: 'NONE', dp_value_2qb: 1000 },
  { player: 'Darius Leonard', pos: 'LB', team: 'IND', age: 29, my_rank: 70, consensus_rank: 72, proj_pts_2026: 105, ceiling_score: 72, floor_score_v2: 45, future_value: 45, injury_risk_score: 7.0, master_score: 58, snap_pct_def: 0.72, tackle_rate: 0.10, vorp_adjusted: 12, bust_category: 'DECLINING', dp_value_2qb: 700 },
  { player: 'Zaire Franklin', pos: 'LB', team: 'IND', age: 28, my_rank: 62, consensus_rank: 64, proj_pts_2026: 110, ceiling_score: 70, floor_score_v2: 46, future_value: 50, injury_risk_score: 3.5, master_score: 60, snap_pct_def: 0.73, tackle_rate: 0.11, vorp_adjusted: 14, bust_category: 'NONE', dp_value_2qb: 800 },
  { player: 'Marcus Davenport', pos: 'EDGE', team: 'MIN', age: 28, my_rank: 65, consensus_rank: 67, proj_pts_2026: 115, ceiling_score: 76, floor_score_v2: 45, future_value: 55, injury_risk_score: 7.0, master_score: 60, pressure_rate_pass_rush: 0.16, pass_rush_win_rate: 0.14, snap_pct_def: 0.65, vorp_adjusted: 16, bust_category: 'DECLINING', dp_value_2qb: 900 },
  { player: 'Rashan Gary', pos: 'EDGE', team: 'GB', age: 27, my_rank: 38, consensus_rank: 40, proj_pts_2026: 135, ceiling_score: 86, floor_score_v2: 55, future_value: 70, injury_risk_score: 6.5, master_score: 70, pressure_rate_pass_rush: 0.22, pass_rush_win_rate: 0.20, snap_pct_def: 0.72, vorp_adjusted: 32, bust_category: 'NONE', dp_value_2qb: 2400 },
  { player: 'Jared Verse', pos: 'EDGE', team: 'CLE', age: 24, my_rank: 25, consensus_rank: 27, proj_pts_2026: 150, ceiling_score: 90, floor_score_v2: 62, future_value: 82, injury_risk_score: 4.0, master_score: 78, pressure_rate_pass_rush: 0.24, pass_rush_win_rate: 0.21, snap_pct_def: 0.76, vorp_adjusted: 45, bust_category: 'NONE', dp_value_2qb: 4500 },
  { player: 'Brian Burns', pos: 'EDGE', team: 'NYG', age: 27, my_rank: 42, consensus_rank: 44, proj_pts_2026: 128, ceiling_score: 82, floor_score_v2: 55, future_value: 65, injury_risk_score: 5.0, master_score: 68, pressure_rate_pass_rush: 0.20, pass_rush_win_rate: 0.18, snap_pct_def: 0.72, vorp_adjusted: 28, bust_category: 'NONE', dp_value_2qb: 2000 },
  { player: 'Jevon Holland', pos: 'DB', team: 'MIA', age: 25, my_rank: 60, consensus_rank: 62, proj_pts_2026: 108, ceiling_score: 78, floor_score_v2: 48, future_value: 68, injury_risk_score: 3.5, master_score: 64, snap_pct_def: 0.80, vorp_adjusted: 18, bust_category: 'SCHEME_RISK', dp_value_2qb: 1200 },
  { player: 'Marcus Maye', pos: 'DB', team: 'NO', age: 30, my_rank: 80, consensus_rank: 82, proj_pts_2026: 95, ceiling_score: 65, floor_score_v2: 38, future_value: 35, injury_risk_score: 5.5, master_score: 52, snap_pct_def: 0.72, vorp_adjusted: 8, bust_category: 'DECLINING', dp_value_2qb: 500 },
  { player: 'Talanoa Hufanga', pos: 'DB', team: 'SF', age: 25, my_rank: 55, consensus_rank: 57, proj_pts_2026: 112, ceiling_score: 80, floor_score_v2: 50, future_value: 70, injury_risk_score: 5.0, master_score: 64, snap_pct_def: 0.78, vorp_adjusted: 20, bust_category: 'NONE', dp_value_2qb: 1400 },
  { player: 'Antoine Winfield Jr', pos: 'DB', team: 'TB', age: 26, my_rank: 35, consensus_rank: 37, proj_pts_2026: 128, ceiling_score: 85, floor_score_v2: 60, future_value: 72, injury_risk_score: 3.5, master_score: 72, snap_pct_def: 0.82, vorp_adjusted: 32, bust_category: 'NONE', dp_value_2qb: 2800 },
];

let added = 0;
const newRows = [];

for (const player of newPlayers) {
  const nameLower = player.player.toLowerCase();
  if (existingNames.has(nameLower)) {
    console.log(`SKIP (duplicate): ${player.player}`);
    continue;
  }
  existingNames.add(nameLower);
  newRows.push(buildRow(headers, player));
  added++;
  console.log(`ADD: ${player.player} (${player.pos})`);
}

// Append new rows
const existingContent = csvContent.trimEnd();
const updatedContent = existingContent + '\n' + newRows.join('\n') + '\n';
fs.writeFileSync(csvPath, updatedContent, 'utf8');

console.log(`\nDone! Added ${added} players. Total: ${existingNames.size}`);
