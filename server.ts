import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Database from 'better-sqlite3';
import { createServer as createViteServer } from 'vite';
import fs from 'fs';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import { Property } from './src/types';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // 1. Pre-flight & CORS (Must be first)
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-admin-api-key', 'Accept'],
    credentials: true
  }));

  // 2. Body Parsers
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // 3. Global API Header check
  app.use('/api', (req, res, next) => {
    if (req.method !== 'OPTIONS') {
      res.setHeader('Content-Type', 'application/json');
    }
    next();
  });

  // SQLite Database Initialization
  const dbPath = process.env.DATABASE_PATH || './database/estatein.db';
  const dbDir = (() => {
    const normalized = dbPath.replace(/\\/g, '/');
    const parts = normalized.split('/');
    parts.pop();
    return parts.join('/') || '.';
  })();
  fs.mkdirSync(dbDir, { recursive: true });
  const db = new Database(dbPath);
  db.pragma('journal_mode = WAL');

  // Security Middleware
  const authMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.log(`[Auth] Checking access for ${req.method} ${req.url}`);
    
    // Debug: Log important headers
    const xKey = req.headers['x-admin-api-key'];
    const authHeader = req.headers['authorization'];
    
    console.log(`[Auth] x-admin-api-key: ${xKey ? 'present' : 'absent'}`);
    console.log(`[Auth] Authorization: ${authHeader ? 'present' : 'absent'}`);

    let providedKey: string | undefined;

    if (xKey) {
      providedKey = Array.isArray(xKey) ? xKey[0] : xKey;
    } else if (authHeader) {
      const token = Array.isArray(authHeader) ? authHeader[0] : authHeader;
      providedKey = token.startsWith('Bearer ') ? token.substring(7) : token;
    }

    const expectedKey = (process.env.ADMIN_API_KEY || 'estatein-admin-secret-2024').trim();
    
    if (!providedKey || providedKey.trim() !== expectedKey) {
      console.warn(`[Auth] Forbidden! Expected: ${expectedKey.substring(0, 5)}... Received: ${providedKey ? (providedKey.substring(0, 5) + '...') : 'none'}`);
      
      return res.status(403).json({ 
        error: 'Unauthorized', 
        message: 'Valid admin-api-key is required in headers.' 
      });
    }
    next();
  };

  // Helper function for seeding 540+ properties
  async function seedDatabase(initialData: any[] = []) {
    try {
      console.log('🌱 Starting SQLite database seeding...');
      
      const tableExists = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='properties'").get();
      if (!tableExists) {
        db.exec(`
          CREATE TABLE IF NOT EXISTS properties (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT NOT NULL,
            price REAL NOT NULL,
            location TEXT NOT NULL,
            type TEXT NOT NULL,
            beds INTEGER NOT NULL,
            baths INTEGER NOT NULL,
            area TEXT NOT NULL,
            image TEXT NOT NULL,
            gallery TEXT,
            amenities TEXT,
            yearBuilt INTEGER,
            tagline TEXT,
            featured INTEGER DEFAULT 0,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
          )
        `);
      }

      db.prepare('DELETE FROM properties').run();

      const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
      const types = ['Apartment', 'Villa', 'Townhouse', 'Studio', 'Penthouse', 'Cottage'];
      const images = [
        'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800',
        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'
      ];

      const insert = db.prepare(`
        INSERT INTO properties 
        (title, description, price, location, type, beds, baths, area, image, gallery, amenities, yearBuilt, tagline, featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const insertMany = db.transaction((data) => {
        for (const row of data) insert.run(row);
      });

      const dataToInsert: any[] = [];
      
      // 1. Insert initial data (approx 50)
      if (initialData.length > 0) {
        initialData.forEach((prop) => {
          dataToInsert.push([
            prop.title,
            prop.description,
            prop.price,
            prop.location,
            prop.type,
            prop.beds || 0,
            prop.baths || 0,
            prop.area,
            prop.image || images[0],
            JSON.stringify(prop.gallery || []),
            JSON.stringify(prop.amenities || []),
            prop.yearBuilt,
            prop.tagline || "",
            0 // featured
          ]);
        });
      }

      // 2. Generate remaining to reach 540
      const remaining = 540 - dataToInsert.length;
      for (let i = 0; i < remaining; i++) {
        const city = cities[i % cities.length];
        const type = types[i % types.length];
        const image = images[i % images.length];
        const price = Math.floor(Math.random() * 2000000) + 100000;
        
        dataToInsert.push([
          `${city} ${type} ${i + 51}`,
          `A beautiful ${type} located in the heart of ${city}. This property offers modern living with great amenities and accessibility.`,
          price,
          `${city}, USA`,
          type,
          Math.floor(Math.random() * 5) + 1,
          Math.floor(Math.random() * 3) + 1,
          `${Math.floor(Math.random() * 3000) + 500} sqft`,
          image,
          JSON.stringify([image]),
          JSON.stringify(['Wifi', 'Parking', 'Heating']),
          2010 + Math.floor(Math.random() * 15),
          "Premium living at affordable prices",
          0
        ]);
      }

      insertMany(dataToInsert);

      console.log(`✅ Database seeded with ${dataToInsert.length} properties`);
      return dataToInsert.length;
    } catch (error) {
      console.error('❌ Seeding failed:', error);
      throw error;
    }
  }

  // Logger middleware
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API Request] ${req.method} ${req.url}`);
    }
    next();
  });

  // API Routes
  app.get('/api/health', async (req, res) => {
    try {
      db.prepare('SELECT 1').get();
      res.json({ status: 'ok', database: 'connected', engine: 'SQLite' });
    } catch (err) {
      res.status(500).json({ status: 'error', database: 'disconnected', engine: 'SQLite' });
    }
  });

  app.get('/api/seed', async (req, res) => {
    try {
      const { ALL_PROPERTIES } = await import('./src/data/properties.js');
      const count = await seedDatabase(ALL_PROPERTIES);
      res.json({ message: 'Database seeded successfully', count });
    } catch (error: any) {
      console.error('Seed API error:', error);
      res.status(500).json({ error: 'Failed to seed database', details: error.message });
    }
  });

  // --- Admin Metrics (Protected) ---
  app.get('/api/admin/metrics', authMiddleware, (req, res) => {
    try {
      const stats = db.prepare(`
        SELECT 
          COUNT(*) as totalListings,
          SUM(price) as portfolioValue
        FROM properties
      `).get() as { totalListings: number, portfolioValue: number | null };

      res.status(200).json({
        totalListings: stats.totalListings || 0,
        portfolioValue: stats.portfolioValue ? Number(stats.portfolioValue) : 0,
        activeSearches: 1248 // Realistic mock number
      });
    } catch (error: any) {
      console.error('[Metrics] Error:', error);
      res.status(500).json({ status: 'error', error: 'Failed to fetch metrics', details: error.message });
    }
  });

  // --- CRUD: CREATE (Protected) ---
  app.post('/api/properties', authMiddleware, async (req, res) => {
    try {
      console.log('[Admin] Received Create Property request:', req.body.title);
      const {
        title, description, price, location, type,
        beds, baths, area, image, gallery, amenities,
        yearBuilt, tagline, featured
      } = req.body;

      if (!title || !price || !location) {
        console.warn('[Admin] Validation failed: missing title, price or location');
        return res.status(400).json({ error: 'Validation Error', message: 'Title, Price, and Location are required.' });
      }

      console.log('[Admin] Preparing statement...');
      const stmt = db.prepare(`
        INSERT INTO properties 
        (title, description, price, location, type, beds, baths, area, image, gallery, amenities, yearBuilt, tagline, featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      console.log('[Admin] Running insertion...');
      const result = stmt.run(
        title, description, price, location, type,
        beds, baths, area, image, 
        Array.isArray(gallery) ? JSON.stringify(gallery) : (typeof gallery === 'string' ? gallery : '[]'), 
        Array.isArray(amenities) ? JSON.stringify(amenities) : (typeof amenities === 'string' ? amenities : '[]'),
        yearBuilt, tagline, featured ? 1 : 0
      );

      console.log('[Admin] Success! Last ID:', result.lastInsertRowid);
      const newProperty = db.prepare('SELECT * FROM properties WHERE id = ?').get(result.lastInsertRowid) as any;
      console.log(`[API Success] Created property ID: ${result.lastInsertRowid}`);
      res.status(201).json({
        ...newProperty,
        gallery: JSON.parse(newProperty.gallery || '[]'),
        amenities: JSON.parse(newProperty.amenities || '[]')
      });
    } catch (error: any) {
      console.error('[API Error] POST /api/properties:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

  // --- CRUD: UPDATE (Protected) ---
  app.put('/api/properties/:id', authMiddleware, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = req.body;
      
      const existing = db.prepare('SELECT id FROM properties WHERE id = ?').get(id);
      if (!existing) return res.status(404).json({ error: 'Not Found', message: `Property with ID ${id} not found.` });

      const fields = Object.keys(updates).filter(k => k !== 'id' && k !== 'createdAt' && k !== 'updatedAt');
      if (fields.length === 0) return res.status(400).json({ error: 'Bad Request', message: 'No fields provided for update.' });

      const setClause = fields.map(f => `${f} = ?`).join(', ');
      const values = fields.map(f => {
        const val = updates[f];
        if (f === 'gallery' || f === 'amenities') {
          return Array.isArray(val) ? JSON.stringify(val) : (typeof val === 'string' ? val : '[]');
        }
        if (f === 'featured') return val ? 1 : 0;
        return val;
      });

      const stmt = db.prepare(`UPDATE properties SET ${setClause}, updatedAt = CURRENT_TIMESTAMP WHERE id = ?`);
      stmt.run(...values, id);

      const updated = db.prepare('SELECT * FROM properties WHERE id = ?').get(id) as any;
      console.log(`[API Success] Updated property ID: ${id}`);
      res.json({
        ...updated,
        gallery: JSON.parse(updated.gallery || '[]'),
        amenities: JSON.parse(updated.amenities || '[]')
      });
    } catch (error: any) {
      console.error('[API Error] PUT /api/properties:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

  // --- CRUD: DELETE (Protected) ---
  app.delete('/api/properties/:id', authMiddleware, async (req, res) => {
    try {
      const result = db.prepare('DELETE FROM properties WHERE id = ?').run(req.params.id);
      if (result.changes === 0) return res.status(404).json({ error: 'Not Found', message: `Property with ID ${req.params.id} not found.` });
      console.log(`[API Success] Deleted property ID: ${req.params.id}`);
      res.json({ success: true, message: 'Property deleted successfully' });
    } catch (error: any) {
      console.error('[API Error] DELETE /api/properties:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

  // --- HIGH PERFORMANCE PAGINATION & FILTERING ---
  app.get('/api/properties', async (req, res) => {
    try {
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.max(1, parseInt(req.query.limit as string) || 9);
      const offset = (page - 1) * limit;

      const { type, minPrice, maxPrice, location, search } = req.query;
      
      let whereClause = 'WHERE 1=1';
      const params: any[] = [];

      if (type && type !== 'all') {
        whereClause += ' AND type = ?';
        params.push(type);
      }
      if (location && location !== 'all') {
        whereClause += ' AND location LIKE ?';
        params.push(`%${location}%`);
      }
      if (search) {
        whereClause += ' AND (title LIKE ? OR location LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }
      if (minPrice) {
        whereClause += ' AND price >= ?';
        params.push(Number(minPrice));
      }
      if (maxPrice) {
        whereClause += ' AND price <= ?';
        params.push(Number(maxPrice));
      }

      // 1. Get total count for metadata
      const countResult: any = db.prepare(`SELECT COUNT(*) as total FROM properties ${whereClause}`).get(params);
      const totalCount = countResult.total;

      // 2. Get paginated results
      const properties: any[] = db.prepare(
        `SELECT * FROM properties ${whereClause} ORDER BY featured DESC, createdAt DESC LIMIT ? OFFSET ?`
      ).all([...params, limit, offset]);

      // Parse JSON strings back to arrays
      const formattedProperties = properties.map((p: any) => ({
        ...p,
        gallery: p.gallery ? JSON.parse(p.gallery) : [],
        amenities: p.amenities ? JSON.parse(p.amenities) : []
      }));

      res.json({
        properties: formattedProperties,
        totalPages: Math.ceil(totalCount / limit) || 1,
        currentPage: page,
        totalCount
      });
    } catch (error: any) {
      console.error('Fetch properties error:', error);
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property: any = db.prepare('SELECT * FROM properties WHERE id = ?').get(req.params.id);
      if (!property) {
        return res.status(404).json({ error: 'Not Found', message: `Property with ID ${req.params.id} not found.` });
      }
      res.json({
        ...property,
        gallery: property.gallery ? JSON.parse(property.gallery) : [],
        amenities: property.amenities ? JSON.parse(property.amenities) : []
      });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  });

  app.post('/api/contact', async (req, res) => {
    try {
      const rawBody = req.body || {};
      const firstName = rawBody.firstName || rawBody.name || '';
      const lastName = rawBody.lastName || '';
      const email = rawBody.email || '';
      const phone = rawBody.phone || '';
      const inquiryType = rawBody.inquiryType || rawBody.propertyType || rawBody.inquiry || '';
      const source = rawBody.source || rawBody.location || rawBody.sourceInfo || '';
      const message = rawBody.message || rawBody.notes || '';

      const mailUser = (process.env.EMAIL_USER || process.env.GMAIL_USER)?.trim();
      const mailPass = (process.env.EMAIL_PASS || process.env.GMAIL_PASS)?.trim();

      if (!mailUser || !mailPass) {
        console.error('Email transport not configured: EMAIL_USER or EMAIL_PASS missing');
        return res.status(500).json({ error: 'Email transport not configured' });
      }

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: mailUser,
          pass: mailPass
        }
      });

      const subjectName = firstName || lastName ? `${firstName} ${lastName}`.trim() : 'Estatein Visitor';
      const mailOptions = {
        from: email ? `"${subjectName}" <${email}>` : mailUser,
        to: mailUser,
        subject: `Estatein Contact Form: ${subjectName}`,
        text: `New Estatein contact submission:\n\nName: ${subjectName}\nEmail: ${email}\nPhone: ${phone}\nInquiry Type: ${inquiryType}\nSource: ${source}\n\nMessage:\n${message}`,
        html: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #111;">
            <h2 style="color: #4e35b5;">Estatein Contact Form Submission</h2>
            <p><strong>Name:</strong> ${subjectName}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Phone:</strong> ${phone}</p>
            <p><strong>Inquiry Type:</strong> ${inquiryType}</p>
            <p><strong>Source:</strong> ${source}</p>
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>`
      };

      await transporter.sendMail(mailOptions);
      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error: any) {
      console.error('Email send error:', error);
      res.status(500).json({ error: 'Failed to send email', details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        hmr: false // Disable HMR to prevent websocket connection errors in this environment
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = fileURLToPath(new URL('./', import.meta.url));
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(fileURLToPath(new URL('./index.html', import.meta.url)));
    });
  }

  app.listen(Number(PORT), "0.0.0.0", async () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    
    // Auto-seed if empty
    try {
      const result: any = db.prepare('SELECT COUNT(*) as count FROM properties').get();
      if (result && result.count === 0) {
        const { ALL_PROPERTIES } = await import('./src/data/properties.js');
        await seedDatabase(ALL_PROPERTIES);
      }
    } catch (err) {
      // Catch error if table doesn't exist
      try {
        const { ALL_PROPERTIES } = await import('./src/data/properties.ts');
        await seedDatabase(ALL_PROPERTIES);
      } catch (seedErr) {
        console.error('Initial auto-seed failed:', seedErr);
      }
    }
  });
}

startServer();
