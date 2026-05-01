const express = require('express');
const router = express.Router();
const { lookupHsCode } = require('../utils/hsLookup');

/**
 * POST /api/hs-lookup
 * Body: { hsCode, description, destinationCountry }
 */
router.post('/', async (req, res) => {
  try {
    const { hsCode, description } = req.body;

    if (!hsCode) {
      return res.status(400).json({ error: 'HS Code is required' });
    }

    const result = lookupHsCode(hsCode);

    return res.json({
      found: result.found,
      hsCode,
      description: description || (result.found ? 'Classified via local table' : ''),
      dutyRate: result.dutyRate,
      category: result.category,
      note: result.note
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
