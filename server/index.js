require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');

const calculateRoutes = require('./routes/calculate');
const shipmentsRoutes = require('./routes/shipments');
const hsRoutes = require('./routes/hs');
const { router: authRouter } = require('./routes/auth');
const db = require('./db');
const ports = require('./ports');

const app = express();

// CORS — read origins from env, fall back to localhost
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

app.use(cors({
  origin: allowedOrigins,
  methods: ['GET', 'POST', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Rate limiting on all /api routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, please try again later.' }
});
app.use('/api', apiLimiter);

// Mount routes
app.use('/api/auth', authRouter);
app.use('/api', calculateRoutes);
app.use('/api', shipmentsRoutes);
app.use('/api/hs-lookup', hsRoutes);

// Prevent JS/CSS caching during development
app.use((req, res, next) => {
  if (req.path.endsWith('.js') || req.path.endsWith('.css')) {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
  }
  next();
});

// Serve static files from /public
const path = require('path');
app.use('/public', express.static(path.join(__dirname, '../public')));

// Serve HTML files from the root directory
app.get('/', (req, res) => res.sendFile(path.join(__dirname, '../index.html')));
app.get('/:page.html', (req, res) => {
  const safePages = ['index', 'about', 'activities', 'calculator', 'contact'];
  if (safePages.includes(req.params.page)) {
    res.sendFile(path.join(__dirname, `../${req.params.page}.html`));
  } else {
    res.status(404).send('Not found');
  }
});
app.get('/sw.js', (req, res) => res.sendFile(path.join(__dirname, '../sw.js')));
app.get('/manifest.json', (req, res) => res.sendFile(path.join(__dirname, '../manifest.json')));

// Quick stats endpoint
app.get('/api/stats/quick', (req, res) => {
  try {
    const stmtActive  = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status IN ('Booking','Loaded','On Vessel')");
    const stmtPending = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'Arrived'");
    const stmtCleared = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'Cleared'");
    res.json({
      active:  stmtActive.get().count,
      pending: stmtPending.get().count,
      cleared: stmtCleared.get().count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Full aggregated stats endpoint
app.get('/api/stats/full', (req, res) => {
  try {
    const totalShipments = db.prepare('SELECT COUNT(*) as count FROM shipments').get().count;
    const active         = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status IN ('Booking','Loaded','On Vessel')").get().count;
    const cleared        = db.prepare("SELECT COUNT(*) as count FROM shipments WHERE status = 'Cleared'").get().count;
    const monthlyCostRow = db.prepare("SELECT SUM(total_usd) as total FROM calculations WHERE created_at >= date('now','-30 days')").get();
    const monthlyCost    = monthlyCostRow.total || 0;

    const monthlyVolume = db.prepare(`
      SELECT strftime('%Y-%m', created_at) as month, COUNT(*) as shipments
      FROM shipments
      WHERE created_at >= date('now','-6 months')
      GROUP BY month ORDER BY month ASC
    `).all();

    const topOrigins = db.prepare(`
      SELECT origin as name, COUNT(*) as value FROM shipments
      GROUP BY origin ORDER BY value DESC LIMIT 5
    `).all();

    const topDestinations = db.prepare(`
      SELECT destination as name, COUNT(*) as value FROM shipments
      GROUP BY destination ORDER BY value DESC LIMIT 5
    `).all();

    const distributionRows = db.prepare(`
      SELECT mode as name, COUNT(*) as value FROM shipments GROUP BY mode
    `).all();

    res.json({
      kpis: { totalShipments, active, cleared, monthlyCost },
      monthlyVolume, topOrigins, topDestinations,
      distribution: distributionRows
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Ports list
app.get('/api/ports', (req, res) => {
  res.json(ports);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`PortEx server running on http://localhost:${PORT}`);
});
