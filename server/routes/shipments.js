const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/shipments', (req, res) => {
  try {
    const shipments = db.prepare('SELECT * FROM shipments ORDER BY created_at DESC').all();
    res.json(shipments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/shipments', (req, res) => {
  try {
    const { bl_number, origin, destination, mode, status, eta_date, packages, vessel_name, voyage_number, notes } = req.body;
    
    const stmt = db.prepare(`
      INSERT INTO shipments (bl_number, origin, destination, mode, status, eta_date, packages, vessel_name, voyage_number, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    const result = stmt.run(bl_number, origin, destination, mode, status || 'Booking', eta_date, packages, vessel_name || '', voyage_number || '', notes || '');
    
    res.status(201).json({ id: result.lastInsertRowid, message: 'Shipment created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/shipments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { bl_number, origin, destination, mode, eta_date, packages, vessel_name, voyage_number, notes } = req.body;
    
    const stmt = db.prepare(`
      UPDATE shipments 
      SET bl_number = ?, origin = ?, destination = ?, mode = ?, eta_date = ?, packages = ?, vessel_name = ?, voyage_number = ?, notes = ?
      WHERE id = ?
    `);
    
    const result = stmt.run(bl_number, origin, destination, mode, eta_date, packages, vessel_name, voyage_number, notes, id);
    
    if (result.changes === 0) return res.status(404).json({ error: 'Shipment not found' });
    
    res.json({ message: 'Shipment updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.patch('/shipments/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!status) return res.status(400).json({ error: 'Status is required' });

    const stmt = db.prepare('UPDATE shipments SET status = ? WHERE id = ?');
    const result = stmt.run(status, id);
    
    if (result.changes === 0) return res.status(404).json({ error: 'Shipment not found' });
    
    res.json({ message: 'Shipment status updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/shipments/:id', (req, res) => {
  try {
    const { id } = req.params;
    const result = db.prepare('DELETE FROM shipments WHERE id = ?').run(id);
    
    if (result.changes === 0) return res.status(404).json({ error: 'Shipment not found' });
    
    res.json({ message: 'Shipment deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
