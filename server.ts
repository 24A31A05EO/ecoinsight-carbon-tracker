import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Set up SQLite Database
const db = new Database("carbon_matrix.db");

// Initialize Schema
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    email TEXT UNIQUE,
    hashed_password TEXT,
    sustainability_level INTEGER DEFAULT 1,
    eco_points INTEGER DEFAULT 0,
    daily_streak INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS eco_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    current_score INTEGER DEFAULT 0,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS carbon_activities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER,
    category TEXT,
    sub_category TEXT,
    input_value REAL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS carbon_calculations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    activity_id INTEGER UNIQUE,
    footprint_value REAL,
    calculation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(activity_id) REFERENCES carbon_activities(id)
  );
`);

// Insert default user if not exists
const user = db.prepare("SELECT * FROM users WHERE id = 1").get();
if (!user) {
  db.prepare(`INSERT INTO users (id, username, email, hashed_password, sustainability_level, eco_points, daily_streak) VALUES (1, 'eco_warrior', 'test@example.com', 'not_a_password', 3, 1850, 5)`).run();
  db.prepare(`INSERT INTO eco_scores (user_id, current_score) VALUES (1, 850)`).run();
  
  // Seed some activities
  const insertAct = db.prepare(`INSERT INTO carbon_activities (user_id, category, sub_category, input_value, created_at) VALUES (?, ?, ?, ?, datetime('now', ?))`);
  const res1 = insertAct.run(1, 'transport', 'car', 45, '-2 days');
  const res2 = insertAct.run(1, 'food', 'beef', 2, '-1 days');
  const res3 = insertAct.run(1, 'electricity', 'ac', 12, '0 days');

  const insertCalc = db.prepare(`INSERT INTO carbon_calculations (activity_id, footprint_value) VALUES (?, ?)`);
  insertCalc.run(res1.lastInsertRowid, 8.64);
  insertCalc.run(res2.lastInsertRowid, 15.4);
  insertCalc.run(res3.lastInsertRowid, 8.55);
}

// Engine calculations
const CARBON_RATES: Record<string, Record<string, number>> = {
  transport: { car: 0.192, bus: 0.105, train: 0.041, flight: 0.255, bike: 0.0 },
  electricity: { ac: 0.7125, fan: 0.0238, tv: 0.0475, laptop: 0.0238 },
  food: { beef: 7.7, chicken: 1.25, fish: 1.3, vegetarian: 0.8, vegan: 0.5 },
  waste: { plastic: 3.0, recyclables: 0.2, organic: 0.1 }
};

function calculateFootprint(category: string, subCategory: string, value: number) {
  const rate = CARBON_RATES[category.toLowerCase()]?.[subCategory.toLowerCase()] || 0;
  return rate * value;
}

// Routes
const router = express.Router();

router.get("/users/:id/stats", (req, res) => {
  const userId = req.params.id;
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(userId) as any;
  if (!user) return res.status(404).json({ detail: "User not found" });

  const activities = db.prepare(`
    SELECT a.*, c.footprint_value 
    FROM carbon_activities a 
    LEFT JOIN carbon_calculations c ON a.id = c.activity_id 
    WHERE a.user_id = ? ORDER BY a.created_at DESC
  `).all(userId) as any[];

  let totalFootprint = 0.0;
  const actList = activities.map(a => {
    totalFootprint += (a.footprint_value || 0);
    return {
      id: String(a.id),
      category: a.category,
      subCategory: a.sub_category,
      amount: a.input_value,
      footprint: a.footprint_value || 0,
      date: new Date(a.created_at + 'Z').toISOString()
    };
  });

  const score = db.prepare("SELECT current_score FROM eco_scores WHERE user_id = ?").get(userId) as any;

  res.json({
    eco_score: score ? score.current_score : 850,
    total_footprint_kg: Number(totalFootprint.toFixed(2)),
    activities: actList,
    level: user.sustainability_level,
    current_xp: user.eco_points,
    next_level_xp: Math.max(100, user.sustainability_level * 1000),
    daily_streak: user.daily_streak,
    badges: []
  });
});

router.post("/activities", (req, res) => {
  const userId = req.query.user_id;
  if (!userId) return res.status(400).json({ detail: "Missing user_id" });

  const { category, sub_category, input_value, description } = req.body;
  if (!["transport", "electricity", "food", "waste"].includes(category)) {
    return res.status(400).json({ detail: "Invalid category" });
  }

  // Insert Activity
  const actRes = db.prepare(`INSERT INTO carbon_activities (user_id, category, sub_category, input_value, description) VALUES (?, ?, ?, ?, ?)`).run(userId, category, sub_category, input_value, description || "");
  const actId = actRes.lastInsertRowid;

  const footprint = calculateFootprint(category, sub_category, input_value);

  db.prepare(`INSERT INTO carbon_calculations (activity_id, footprint_value) VALUES (?, ?)`).run(actId, footprint);

  // Update Score
  db.prepare(`UPDATE eco_scores SET current_score = current_score - ? WHERE user_id = ?`).run(Math.round(footprint), userId);

  const act = db.prepare("SELECT * FROM carbon_activities WHERE id = ?").get(actId) as any;

  res.status(201).json({
    id: act.id,
    user_id: act.user_id,
    category: act.category,
    sub_category: act.sub_category,
    input_value: act.input_value,
    description: act.description,
    created_at: new Date(act.created_at + 'Z').toISOString(),
    footprint_value: footprint
  });
});

router.get("/users/:id/recommendations", (req, res) => {
  res.json([
    { title: "Thermal Optimization", description: "Reduce AC usage by 2 hours daily.", co2_savings_kg: 9.98, money_savings_usd: 2.73, difficulty: "Low" }
  ]);
});

router.get("/users/:id/challenges", (req, res) => {
  res.json([
    { id: "c1", title: "Zero-Emission Commute", description: "Log 50km of bicycle transit.", target_kg: 50, progress_kg: 12, completed: false, reward_points: 200 }
  ]);
});

app.use("/api/v1", router);

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
