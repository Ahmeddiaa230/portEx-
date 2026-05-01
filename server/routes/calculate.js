const express = require('express');
const router = express.Router();
const db = require('../db');
const ports = require('../ports');
const { lookupHsCode } = require('../utils/hsLookup');
const { resolveRole } = require('./auth');

// ETA ranges by region pair (days)
const etaRanges = {
  'Asia-Asia':            { min: 5,  max: 14 },
  'Asia-MiddleEast':      { min: 8,  max: 16 },
  'Asia-Europe':          { min: 20, max: 28 },
  'Asia-Americas':        { min: 18, max: 35 },
  'Asia-Africa':          { min: 18, max: 30 },
  'Asia-Oceania':         { min: 10, max: 20 },
  'MiddleEast-Europe':    { min: 12, max: 18 },
  'MiddleEast-Americas':  { min: 22, max: 32 },
  'MiddleEast-Africa':    { min: 8,  max: 16 },
  'Europe-Europe':        { min: 3,  max: 10 },
  'Europe-Americas':      { min: 10, max: 18 },
  'Europe-Africa':        { min: 8,  max: 16 },
  'Americas-Americas':    { min: 5,  max: 14 },
  'Africa-Africa':        { min: 7,  max: 14 },
  'Oceania-Oceania':      { min: 4,  max: 10 }
};

function getEta(originRegion, destRegion) {
  const key1 = `${originRegion}-${destRegion}`;
  const key2 = `${destRegion}-${originRegion}`;
  const range = etaRanges[key1] || etaRanges[key2] || { min: 20, max: 35 };
  return Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
}

// POST /api/calculate
router.post('/calculate', (req, res) => {
  try {
    if (!req.body || typeof req.body !== 'object') {
      return res.status(400).json({ error: 'Invalid request body' });
    }

    const {
      mode, origin, destination, cbm, weight_kg, packages,
      length_cm, width_cm, height_cm, language,
      hs_code, goods_value
    } = req.body;

    // Normalise strings
    const originStr      = (origin      || '').toString().trim();
    const destinationStr = (destination || '').toString().trim();
    const modeStr        = (mode        || '').toString().trim();

    // --- Input validation ---
    const cbmNum = parseFloat(cbm);
    const weightNum = parseFloat(weight_kg);
    const pkgsNum = parseInt(packages, 10);
    const goodsNum = parseFloat(goods_value) || 0;

    if (!originStr) {
      return res.status(400).json({ error: 'Invalid input: origin' });
    }
    if (!destinationStr) {
      return res.status(400).json({ error: 'Invalid input: destination' });
    }
    if (!['cbm', 'dimensions'].includes(modeStr)) {
      return res.status(400).json({ error: 'Invalid input: mode must be cbm or dimensions' });
    }
    if (isNaN(cbmNum) || cbmNum < 0 || cbmNum > 10000) {
      return res.status(400).json({ error: 'Invalid input: cbm (0-10000)' });
    }
    if (isNaN(weightNum) || weightNum < 0 || weightNum > 500000) {
      return res.status(400).json({ error: 'Invalid input: weight_kg (0-500000)' });
    }
    if (isNaN(pkgsNum) || pkgsNum < 0 || pkgsNum > 10000) {
      return res.status(400).json({ error: 'Invalid input: packages (0-10000)' });
    }

    // --- Auth / role ---
    const role = resolveRole(req.headers.authorization);
    const isAdmin = role === 'admin';

    // --- Port lookup (flexible: name, code, or case-insensitive) ---
    function findPort(query) {
      const q = query.toLowerCase();
      return ports.find(p => p.name === query)
          || ports.find(p => p.code === query.toUpperCase())
          || ports.find(p => p.name.toLowerCase() === q);
    }
    const originPort = findPort(originStr);
    const destPort   = findPort(destinationStr);

    if (!originPort || !destPort) {
      return res.status(400).json({ error: 'Unknown port name: ' + (!originPort ? originStr : destinationStr) });
    }

    // --- Freight calculation ---
    const chargeableWeight = Math.max(cbmNum * 1000, weightNum);
    const chargeableCbm    = chargeableWeight / 1000;

    // B3: use destination port baseRate
    const baseRatePerCbm = destPort.baseRate;
    const totalBase = chargeableCbm * baseRatePerCbm;
    const baf       = totalBase * 0.15;
    const caf       = totalBase * 0.05;
    const thcOrigin = 120 + (cbmNum * 5);
    const thcDest   = 150 + (cbmNum * 5);
    const rawFreight = totalBase + baf + caf + thcOrigin + thcDest;

    // --- Hidden markup on freight (Part C) ---
    const freightMultiplier = isAdmin ? 1.0 : (rawFreight >= 500 ? 1.05 : 1.10);
    const adjustedBase      = totalBase  * freightMultiplier;
    const adjustedBaf       = baf        * freightMultiplier;
    const adjustedCaf       = caf        * freightMultiplier;
    const adjustedThcOrigin = thcOrigin  * freightMultiplier;
    const adjustedThcDest   = thcDest    * freightMultiplier;
    const freightSubtotal   = adjustedBase + adjustedBaf + adjustedCaf + adjustedThcOrigin + adjustedThcDest;

    // --- Customs (CIF-based) ---
    let customsDuty  = null;
    let dutyRate     = null;
    let cifValue     = null;
    let hsCategory   = null;

    if (hs_code && hs_code.trim() !== '') {
      const hsResult = lookupHsCode(hs_code.trim());
      dutyRate   = hsResult.dutyRate;
      hsCategory = hsResult.category;
      // CIF = declared goods value + freight + insurance (1.5%)
      cifValue     = goodsNum + freightSubtotal + (goodsNum * 0.015);
      customsDuty  = cifValue * (dutyRate / 100);
    }

    // --- Grand total with markup ---
    let grandTotal = freightSubtotal;
    if (customsDuty !== null) {
      const rawGrand = freightSubtotal + customsDuty;
      const grandMultiplier = isAdmin ? 1.0 : (rawGrand >= 500 ? 1.05 : 1.10);
      // Distribute proportionally
      const baseScale = rawGrand > 0 ? grandMultiplier : 1;
      grandTotal = freightSubtotal * baseScale + customsDuty * baseScale;
    }

    // --- Dynamic ETA ---
    const etaDays = getEta(originPort.region, destPort.region);

    // --- Save to DB ---
    const stmt = db.prepare(`
      INSERT INTO calculations (
        mode, origin, destination, cbm, weight_kg, packages,
        length_cm, width_cm, height_cm, base_rate, baf, caf,
        thc_origin, thc_dest, total_usd, eta_days, language,
        hs_code, duty_rate, customs_duty, goods_value
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      mode, origin, destination, cbmNum, weightNum, pkgsNum,
      length_cm || null, width_cm || null, height_cm || null,
      adjustedBase, adjustedBaf, adjustedCaf, adjustedThcOrigin, adjustedThcDest,
      grandTotal, etaDays, language || 'en',
      hs_code || null, dutyRate || null, customsDuty || null, goodsNum || null
    );

    return res.status(201).json({
      id: result.lastInsertRowid,
      etaDays,
      baseRate: adjustedBase,
      baf: adjustedBaf,
      caf: adjustedCaf,
      thcOrigin: adjustedThcOrigin,
      thcDest: adjustedThcDest,
      freightSubtotal,
      cifValue,
      customsDuty,
      dutyRate,
      hsCategory,
      grandTotal,
      chargeableWeight,
      chargeableCbm,
      isAdmin
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/history
router.get('/history', (req, res) => {
  try {
    const limit   = Math.min(parseInt(req.query.limit, 10) || 20, 100);
    const offset  = parseInt(req.query.offset, 10) || 0;
    const history = db.prepare(
      'SELECT * FROM calculations ORDER BY created_at DESC LIMIT ? OFFSET ?'
    ).all(limit, offset);
    const total = db.prepare('SELECT COUNT(*) as count FROM calculations').get().count;
    res.json({ history, total });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/history/:id
router.delete('/history/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM calculations WHERE id = ?').run(id);
    if (result.changes === 0) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/stats
router.get('/stats', (req, res) => {
  try {
    const total      = db.prepare('SELECT COUNT(*) as count FROM calculations').get().count;
    const avgCbm     = db.prepare('SELECT AVG(cbm) as avg FROM calculations').get().avg || 0;
    const topOrigins = db.prepare(
      'SELECT origin as name, COUNT(*) as count FROM calculations GROUP BY origin ORDER BY count DESC LIMIT 5'
    ).all();
    const topDestinations = db.prepare(
      'SELECT destination as name, COUNT(*) as count FROM calculations GROUP BY destination ORDER BY count DESC LIMIT 5'
    ).all();
    res.json({ total, avgCbm, topOrigins, topDestinations });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/ports
router.get('/ports', (req, res) => {
  res.json(ports);
});

module.exports = router;
