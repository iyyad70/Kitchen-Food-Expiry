export interface GuideStep {
  id: string;
  number: string;
  title: string;
  summary: string;
  badge: string;
  content: string;
  codeSnippet?: {
    language: string;
    filename: string;
    code: string;
  };
  tips?: string[];
}

export const GUIDE_STEPS: GuideStep[] = [
  {
    id: 'step-architecture',
    number: '01',
    title: 'System Architecture & How Everything Connects',
    summary: 'Understand the big picture of your capstone before writing a single line of code.',
    badge: 'Concept',
    content: `A common mistake beginners make is trying to connect React Native or Power BI directly to MySQL. In production architectures:
1. **Database Layer**: Laragon runs MySQL (holds your users, pantry items, waste logs, and households).
2. **Backend API (Node.js + Express)**: Acts as the secure middleman. It executes SQL queries on MySQL and makes external calls to the Open Food Facts API.
3. **Frontend Clients**:
   - **React Native Mobile App**: For the end-user in the kitchen to scan barcodes, check expiry, and get notifications.
   - **React.js Admin Portal**: For admins to audit household waste and monitor pantry statistics.
4. **Analytics Layer (Power BI)**: Connects either directly to your Laragon MySQL database (via MySQL ODBC Connector) or imports your backend's exported CSV data to generate automated food waste reports for your report presentation.`,
    tips: [
      'Never put your MySQL root password inside React Native or React frontend code.',
      'All database reads and writes go through your Express REST API routes.',
      'Keep Laragon running in the background whenever you develop in VS Code.'
    ]
  },
  {
    id: 'step-laragon',
    number: '02',
    title: 'Laragon Setup & Running MySQL on Port 3306',
    summary: 'Download, start services, and verify MySQL is ready in under 3 minutes.',
    badge: 'Database',
    content: `Laragon is an isolated, portable local development environment for Windows that includes Apache, MySQL, PHP, and Node.js.

### Step-by-Step Instructions:
1. **Download Laragon**: Go to [laragon.org/download](https://laragon.org/download/) and download **Laragon Full** (with MySQL 8.x/5.7).
2. **Install to C:\\laragon**: Keep default path \`C:\\laragon\`.
3. **Start MySQL**:
   - Open Laragon.
   - Click the big **"Start All"** button at the bottom left.
   - You should see: \`Apache: 80\` and \`MySQL: 3306\`. Both text labels should turn active.
4. **Open Database GUI**:
   - Click the **"Database"** button inside Laragon (this opens HeidiSQL, which is pre-installed).
   - In the session manager:
     - **Host**: \`127.0.0.1\` or \`localhost\`
     - **User**: \`root\`
     - **Password**: *(leave blank/empty by default)*
     - **Port**: \`3306\`
   - Click **Open**. You are now connected to your local MySQL database!`,
    tips: [
      'If port 3306 is blocked, check if you already have XAMPP or another MySQL service running in Windows Task Manager.',
      'Laragon has a quick terminal: Right click anywhere in Laragon > Laragon > Terminal (it pre-configures MySQL and Node.js paths).'
    ]
  },
  {
    id: 'step-schema',
    number: '03',
    title: 'Complete MySQL Database Schema (SQL Script)',
    summary: 'Ready-to-run SQL script creating all tables, foreign keys, indexes, and initial test data.',
    badge: 'MySQL Code',
    content: `Run this script in HeidiSQL or phpMyAdmin (or inside VS Code MySQL extension). It creates the database \`smart_pantry_db\` and sets up 6 normalized tables with relational integrity and seed data matching your assignment.`,
    codeSnippet: {
      language: 'sql',
      filename: 'smart_pantry_schema.sql',
      code: `-- 1. Create the database
CREATE DATABASE IF NOT EXISTS smart_pantry_db
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE smart_pantry_db;

-- 2. Households Table (Supports family pantry sharing)
CREATE TABLE IF NOT EXISTS households (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    invite_code VARCHAR(10) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'household_head', 'member') DEFAULT 'member',
    household_id VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE SET NULL
);

-- 4. Pantry Items Table
CREATE TABLE IF NOT EXISTS pantry_items (
    id VARCHAR(36) PRIMARY KEY,
    household_id VARCHAR(36) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    barcode VARCHAR(32) NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    brand VARCHAR(100),
    category ENUM('Dairy', 'Bakery', 'Produce', 'Meat & Poultry', 'Pantry & Grains', 'Beverages', 'Frozen', 'Condiments') NOT NULL,
    quantity DECIMAL(6,2) DEFAULT 1.0,
    unit VARCHAR(20) DEFAULT 'unit',
    location ENUM('Fridge', 'Freezer', 'Pantry Shelf') DEFAULT 'Fridge',
    purchase_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('active', 'consumed', 'wasted') DEFAULT 'active',
    estimated_price DECIMAL(8,2) DEFAULT 0.00,
    image_url TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (household_id) REFERENCES households(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_expiry (expiry_date),
    INDEX idx_status (status)
);

-- 5. Food Waste / Consumption Logs (For Power BI Analytics)
CREATE TABLE IF NOT EXISTS waste_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_id VARCHAR(36),
    household_id VARCHAR(36),
    product_name VARCHAR(255),
    category VARCHAR(50),
    action_type ENUM('consumed', 'wasted') NOT NULL,
    estimated_cost DECIMAL(8,2) DEFAULT 0.00,
    days_to_expiry_when_acted INT,
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_action (action_type),
    INDEX idx_recorded (recorded_at)
);

-- 6. Notifications Table (Expiry alerts)
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    item_id VARCHAR(36),
    title VARCHAR(150) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('urgent', 'warning', 'info') DEFAULT 'warning',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ==========================================================
-- 7. Seed Initial Data (Matching the Assignment Specs)
-- ==========================================================
INSERT INTO households (id, name, invite_code) VALUES 
('h1', 'Farid Family Pantry', 'FAM-8821'),
('h0', 'System Admin Household', 'ADM-0001');

INSERT INTO users (id, name, email, password_hash, role, household_id) VALUES 
('u1', 'Ahmad Farid', 'farid@example.com', '$2a$10$SampleHashedPass123456', 'household_head', 'h1'),
('u2', 'Siti Aminah (Mom)', 'siti@example.com', '$2a$10$SampleHashedPass123456', 'member', 'h1'),
('u3', 'Daniel Izzat (Son)', 'daniel@example.com', '$2a$10$SampleHashedPass123456', 'member', 'h1'),
('u4', 'Dr. Sarah (Admin)', 'admin@smartpantry.edu', '$2a$10$SampleHashedPass123456', 'admin', 'h0');

-- Insert the Dutch Lady Milk example from assignment
INSERT INTO pantry_items (id, household_id, user_id, barcode, product_name, brand, category, quantity, unit, location, purchase_date, expiry_date, status, estimated_price, image_url)
VALUES 
('item-1', 'h1', 'u2', '9556185000433', 'Dutch Lady PureFarm Fresh Milk 1L', 'Dutch Lady', 'Dairy', 1, 'carton', 'Fridge', CURDATE() - INTERVAL 4 DAY, CURDATE() + INTERVAL 1 DAY, 'active', 7.50, 'https://images.openfoodfacts.org/images/products/955/618/500/0433/front_en.12.400.jpg'),
('item-2', 'h1', 'u1', '9556172000085', 'Gardenia Original Classic Bread', 'Gardenia', 'Bakery', 1, 'loaf', 'Pantry Shelf', CURDATE() - INTERVAL 3 DAY, CURDATE() + INTERVAL 2 DAY, 'active', 3.20, 'https://images.openfoodfacts.org/images/products/955/617/200/0085/front_en.4.400.jpg'),
('item-3', 'h1', 'u3', '9556358000104', 'Farm Fresh Greek Yogurt 400g', 'Farm Fresh', 'Dairy', 1, 'tub', 'Fridge', CURDATE() - INTERVAL 8 DAY, CURDATE() - INTERVAL 1 DAY, 'active', 9.80, 'https://images.openfoodfacts.org/images/products/955/635/800/0104/front_en.10.400.jpg');

INSERT INTO waste_logs (item_id, household_id, product_name, category, action_type, estimated_cost, days_to_expiry_when_acted) VALUES
('item-old-1', 'h1', 'Dutch Lady Strawberry Milk', 'Dairy', 'consumed', 7.50, 2),
('item-old-2', 'h1', 'Gardenia Whole Wheat Bread', 'Bakery', 'wasted', 3.80, -2);`
    },
    tips: [
      'In HeidiSQL: Click File > Open SQL file, paste this script, and press F9 (Run).',
      'The script uses `CURDATE() + INTERVAL 1 DAY` so your test records will always show fresh expiry alerts regardless of the date you test!'
    ]
  },
  {
    id: 'step-vscode-backend',
    number: '04',
    title: 'VS Code Setup & Node.js Express API',
    summary: 'Write the complete backend server connecting to Laragon MySQL and Open Food Facts API.',
    badge: 'Express API',
    content: `Now let's build the backend in VS Code. This server connects to your local Laragon MySQL and provides the API endpoints for both the React Native mobile app and the React Admin web portal.

### Steps in VS Code:
1. Open VS Code.
2. Open terminal (\`Ctrl + \`\`) and create your backend folder:
   \`\`\`bash
   mkdir smart-pantry-backend
   cd smart-pantry-backend
   npm init -y
   npm install express mysql2 cors dotenv axios
   \`\`\`
3. Create a file named \`.env\`:
   \`\`\`env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=
   DB_NAME=smart_pantry_db
   \`\`\`
4. Create \`server.js\` and paste the code below.`,
    codeSnippet: {
      language: 'javascript',
      filename: 'server.js',
      code: `const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// 1. MySQL Connection Pool to Laragon
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'smart_pantry_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test DB Connection
pool.getConnection()
  .then(conn => {
    console.log('✅ Connected successfully to Laragon MySQL (smart_pantry_db)');
    conn.release();
  })
  .catch(err => {
    console.error('❌ Database connection failed. Make sure Laragon MySQL is running!', err.message);
  });

// 2. Open Food Facts Barcode API Lookup
app.get('/api/barcode/:code', async (req, res) => {
  const { code } = req.params;
  try {
    const response = await axios.get(\`https://world.openfoodfacts.org/api/v2/product/\${code}.json\`, {
      headers: { 'User-Agent': 'SmartPantry-StudentProject/1.0' },
      timeout: 5000
    });

    if (response.data.status === 1) {
      const prod = response.data.product;
      return res.json({
        found: true,
        product: {
          barcode: code,
          productName: prod.product_name || prod.product_name_en || 'Unknown Product',
          brand: prod.brands || 'Generic',
          category: prod.categories_tags?.[0]?.replace('en:', '') || 'General',
          imageUrl: prod.image_front_url || prod.image_url || null,
          quantity: prod.quantity || '1 unit'
        }
      });
    }
    return res.status(404).json({ found: false, message: 'Barcode not found in Open Food Facts' });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to query Open Food Facts API', details: error.message });
  }
});

// 3. Get All Active Pantry Items
app.get('/api/pantry/:householdId', async (req, res) => {
  try {
    const [rows] = await pool.query(
      \`SELECT p.*, u.name as added_by_name 
       FROM pantry_items p 
       JOIN users u ON p.user_id = u.id 
       WHERE p.household_id = ? AND p.status = 'active' 
       ORDER BY p.expiry_date ASC\`,
      [req.params.householdId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Add New Product (From Barcode Scan)
app.post('/api/pantry', async (req, res) => {
  const { id, householdId, userId, barcode, productName, brand, category, quantity, unit, location, expiryDate, price, imageUrl, notes } = req.body;
  try {
    await pool.query(
      \`INSERT INTO pantry_items (id, household_id, user_id, barcode, product_name, brand, category, quantity, unit, location, purchase_date, expiry_date, estimated_price, image_url, notes)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURDATE(), ?, ?, ?, ?)\`,
      [id, householdId, userId, barcode, productName, brand, category, quantity, unit, location, expiryDate, price || 0, imageUrl, notes || '']
    );
    res.status(201).json({ success: true, message: 'Item saved to pantry' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 5. Mark Item as Consumed (Food Waste Prevented!)
app.put('/api/pantry/:id/consume', async (req, res) => {
  try {
    const [item] = await pool.query('SELECT * FROM pantry_items WHERE id = ?', [req.params.id]);
    if (!item.length) return res.status(404).json({ error: 'Item not found' });

    await pool.query("UPDATE pantry_items SET status = 'consumed' WHERE id = ?", [req.params.id]);
    await pool.query(
      \`INSERT INTO waste_logs (item_id, household_id, product_name, category, action_type, estimated_cost)
       VALUES (?, ?, ?, ?, 'consumed', ?)\`,
      [item[0].id, item[0].household_id, item[0].product_name, item[0].category, item[0].estimated_price]
    );

    res.json({ success: true, message: 'Logged as consumed. Great job preventing waste!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 6. Food Waste Analytics for Admin / Power BI
app.get('/api/analytics/waste-summary', async (req, res) => {
  try {
    const [stats] = await pool.query(\`
      SELECT 
        COUNT(*) as total_actions,
        SUM(CASE WHEN action_type = 'consumed' THEN 1 ELSE 0 END) as total_consumed,
        SUM(CASE WHEN action_type = 'wasted' THEN 1 ELSE 0 END) as total_wasted,
        SUM(CASE WHEN action_type = 'consumed' THEN estimated_cost ELSE 0 END) as money_saved,
        SUM(CASE WHEN action_type = 'wasted' THEN estimated_cost ELSE 0 END) as money_lost
      FROM waste_logs
    \`);
    res.json(stats[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(\`🚀 Smart Pantry API running on port \${PORT}\`));`
    },
    tips: [
      'Run `node server.js` in VS Code terminal. You will see: "Connected successfully to Laragon MySQL".',
      'Test in your browser: open `http://localhost:5000/api/barcode/9556185000433` - it returns Dutch Lady milk data in real-time!'
    ]
  },
  {
    id: 'step-mobile-connection',
    number: '05',
    title: 'Connecting React Native / React to the Backend',
    summary: 'Mastering the common "Network Error" issue when mobile apps call localhost.',
    badge: 'Frontend',
    content: `When building your React Native app or testing on your mobile phone, **\`localhost:5000\` will NOT connect**. Why? Because on the phone, "localhost" means the phone itself, not your computer running Laragon!

### The Exact Rules for API URLs:
1. **React Web Admin Portal (running in browser on your PC)**:
   - Use: \`http://localhost:5000/api\`
2. **Android Emulator (Android Studio)**:
   - Use: \`http://10.0.2.2:5000/api\` (Android routes \`10.0.2.2\` to your PC host).
3. **Physical Phone via Expo Go / USB**:
   - Find your PC IP address: In Windows command prompt run \`ipconfig\`.
   - Look for **IPv4 Address** (e.g. \`192.168.1.15\`).
   - Use: \`http://192.168.1.15:5000/api\` (Make sure phone and PC are on the same Wi-Fi!).

### Barcode Scanner in React Native:
In React Native, you can install \`expo-barcode-scanner\` or \`react-native-vision-camera\`:
\`\`\`bash
npx expo install expo-barcode-scanner
\`\`\`
When the camera reads barcode \`9556185000433\`, you trigger \`fetch('http://YOUR_IP:5000/api/barcode/9556185000433')\`!`,
    tips: [
      'In Windows Defender Firewall, if your phone cannot reach your PC, click "Allow an app through firewall" and check Node.js.',
      'Always test endpoints with Thunder Client inside VS Code first to be sure the backend is responding before troubleshooting React Native.'
    ]
  },
  {
    id: 'step-powerbi',
    number: '06',
    title: 'Connecting Power BI to Laragon MySQL & Visuals',
    summary: 'The exact step-by-step to hook Power BI to localhost MySQL and build stunning waste dashboards.',
    badge: 'Power BI',
    content: `Power BI is the secret weapon to get an A+ on this capstone because lecturers love seeing business intelligence and analytical insights from operational databases.

### Method A: Direct Database Connection (Recommended for Final Demo)
1. **Install MySQL ODBC Connector**:
   - Power BI requires the official MySQL ODBC driver on Windows.
   - Download **MySQL Connector/ODBC 8.0 (64-bit)**: [dev.mysql.com/downloads/connector/odbc/](https://dev.mysql.com/downloads/connector/odbc/).
   - Run the installer with default settings.
2. **Open Power BI Desktop**:
   - Click **Get Data** (top ribbon) > **More...** > search **MySQL database** > Click **Connect**.
3. **Server & Database parameters**:
   - **Server**: \`localhost:3306\` or \`127.0.0.1:3306\`
   - **Database**: \`smart_pantry_db\`
   - **Data Connectivity mode**: Select **Import** (fastest and supports all Power BI visual transformation functions).
4. **Authentication Credentials**:
   - Select **Database** on the left tab.
   - **User name**: \`root\`
   - **Password**: *(leave blank)*
   - Click **Connect** (if prompted with encryption warning, click "OK/Use unencrypted connection" since it is local).
5. **Select Tables in Navigator**:
   - Check: \`pantry_items\`, \`waste_logs\`, and \`users\`.
   - Click **Load**.

### Method B: 1-Click CSV Export (Guaranteed Zero-Install Fallback)
If university lab computers restrict installing ODBC drivers, our app includes a **"Export CSV for Power BI"** button in the Admin Portal! You can load that CSV directly into Power BI with **Get Data > Text/CSV** and build the exact same visual reports!

### The 4 Charts Lecturers Expect in Power BI:
1. **Donut / Pie Chart: Waste vs Consumed Ratio**:
   - Legend: \`waste_logs[action_type]\`
   - Values: \`Count of action_type\`
   - Shows: What percentage of stored groceries are consumed before expiring (e.g. 84%) vs thrown away (16%).
2. **Clustered Bar Chart: Food Waste by Category**:
   - X-Axis: \`category\` (Dairy, Bakery, Produce, Meat)
   - Y-Axis: \`Sum of estimated_cost\`
   - Highlights: Which category loses the family the most money.
3. **Card KPI: Total Money Saved ($ / RM)**:
   - Field: \`Sum of estimated_cost\` where \`action_type = 'consumed'\`.
4. **Stacked Column Chart: Monthly Waste Trend**:
   - Shows a decreasing line of food waste over time after using the app!`,
    tips: [
      'In Power BI, create a measure: Waste % = DIVIDE(CALCULATE(COUNT(waste_logs[id]), waste_logs[action_type]="wasted"), COUNT(waste_logs[id]), 0)',
      'Take screenshots of your Power BI dashboard and place them in Chapter 4 (Results & Discussion) of your thesis report!'
    ]
  },
  {
    id: 'step-defense',
    number: '07',
    title: 'Lecturer Defense Questions & Presentation Cheat Sheet',
    summary: 'The top 5 questions examiners ask for this capstone and how to answer like a pro.',
    badge: 'Presentation',
    content: `When presenting your final year capstone project, lecturers evaluate both your technical architecture and your problem-solving impact.

### Top 5 Examiner Questions:
1. **Q: "Why did you choose Open Food Facts API instead of building your own barcode database?"**
   - **A**: *"Open Food Facts is an open global collaborative database with over 3 million scanned items. By integrating their REST API, our users immediately have access to real product names, brands, and categories without needing manual data entry. We also implemented a local database cache in MySQL so repeated scans do not consume redundant network calls."*
2. **Q: "How does the system calculate expiry notifications?"**
   - **A**: *"In the Node.js backend, a scheduled cron task (or Firebase Cloud Function / background worker) queries MySQL daily for \`pantry_items WHERE expiry_date <= CURDATE() + INTERVAL 2 DAY AND status = 'active'\`. It then pushes an alert with recommended recipes to the user's mobile device."*
3. **Q: "Why use MySQL relational database on Laragon instead of NoSQL/MongoDB?"**
   - **A**: *"Because food waste tracking requires strict data relationships: Users belong to Households, Pantry Items belong to both a User and a Household, and Waste Logs link back to specific products. Relational foreign keys prevent orphan records and allow direct analytical SQL aggregation in Power BI."*
4. **Q: "How does the AI Food Suggestion feature prevent food waste?"**
   - **A**: *"Rather than just telling users 'Your milk is expiring', which often still results in panic or disposal, the app suggests tangible recipes (e.g., Pancakes, White Sauce, or Milkshake). This transitions the app from a passive reminder tool into an active behavioral change system."*
5. **Q: "How did you test your project?"**
   - **A**: *"We conducted unit testing on API endpoints using Thunder Client/Postman, validated real-time barcode scans with physical test packaging (such as Dutch Lady milk and Gardenia bread), and verified data pipeline integrity in Power BI."*`,
    tips: [
      'Prepare 2 physical items with barcodes on your presentation table (e.g., milk box or snack packet). Scanning a physical box in front of the lecturer guarantees top marks for demo execution!',
      'Emphasize the Sustainable Development Goals (SDG 12: Responsible Consumption and Production) in your introduction slides.'
    ]
  }
];
