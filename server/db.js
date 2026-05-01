const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, '..', 'portex.db'));

// Schema initialization — calculations table
db.exec(`
  CREATE TABLE IF NOT EXISTS calculations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    mode TEXT,
    origin TEXT,
    destination TEXT,
    cbm REAL,
    weight_kg REAL,
    packages INTEGER,
    length_cm REAL,
    width_cm REAL,
    height_cm REAL,
    base_rate REAL,
    baf REAL,
    caf REAL,
    thc_origin REAL,
    thc_dest REAL,
    total_usd REAL,
    eta_days INTEGER,
    language TEXT,
    hs_code TEXT,
    duty_rate REAL,
    customs_duty REAL,
    goods_value REAL
  );
`);

// Add missing columns to calculations if upgrading an older DB
const addIfMissing = (col, type) => {
  try {
    db.exec(`ALTER TABLE calculations ADD COLUMN ${col} ${type}`);
  } catch (_) { /* column already exists — ignore */ }
};
addIfMissing('hs_code', 'TEXT');
addIfMissing('duty_rate', 'REAL');
addIfMissing('customs_duty', 'REAL');
addIfMissing('goods_value', 'REAL');

// Shipments table
db.exec(`
  CREATE TABLE IF NOT EXISTS shipments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    bl_number TEXT,
    origin TEXT,
    destination TEXT,
    mode TEXT,
    status TEXT DEFAULT 'Booking',
    eta_date TEXT,
    packages INTEGER,
    vessel_name TEXT,
    voyage_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed calculations if empty
const calcsCount = db.prepare('SELECT COUNT(*) as count FROM calculations').get().count;
if (calcsCount === 0) {
  const insertCalc = db.prepare(`
    INSERT INTO calculations (
      mode, origin, destination, cbm, weight_kg, packages, base_rate, baf, caf,
      thc_origin, thc_dest, total_usd, eta_days, language
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const seedCalcs = [
    ['MODE A', 'Shanghai', 'Rotterdam', 10, 5000, 100, 40, 60, 20, 150, 180, 850, 25, 'en'],
    ['MODE A', 'Shenzhen', 'Los Angeles', 5, 2500, 50, 50, 37.5, 12.5, 145, 175, 620, 18, 'en'],
    ['MODE B', 'Singapore', 'Jebel Ali', 2, 1000, 20, 45, 13.5, 4.5, 130, 160, 398, 12, 'ar'],
    ['MODE A', 'Busan', 'Hamburg', 12, 8000, 150, 35, 63, 21, 180, 210, 894, 28, 'tr'],
    ['MODE B', 'Ningbo', 'New York', 8, 4000, 80, 60, 72, 24, 160, 190, 926, 26, 'en'],
    ['MODE A', 'Qingdao', 'Felixstowe', 15, 9000, 180, 45, 101.25, 33.75, 195, 225, 1230, 30, 'en'],
    ['MODE B', 'Tianjin', 'Antwerp', 6, 3000, 60, 35, 31.5, 10.5, 150, 180, 582, 32, 'en'],
    ['MODE A', 'Tokyo', 'Sydney', 4, 2000, 40, 75, 45, 15, 140, 170, 670, 15, 'en'],
    ['MODE B', 'Mumbai', 'Durban', 10, 6000, 100, 80, 120, 40, 170, 200, 1330, 20, 'en'],
    ['MODE A', 'Colombo', 'Mombasa', 20, 10000, 200, 95, 285, 95, 220, 250, 2750, 16, 'en']
  ];
  const seedTx = db.transaction((calcs) => {
    for (const c of calcs) insertCalc.run(c);
  });
  seedTx(seedCalcs);
}

module.exports = db;
