
import 'dotenv/config';
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { neon } from '@neondatabase/serverless';
import cookieParser from 'cookie-parser';

import UserRoute from './routes/userRoute.js';
import DashboardRoute from './routes/dashboardRoute.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set("trust proxy", 1);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());

const sql = neon(process.env.DATABASE_URL);
app.get('/db', async (req, res) => {
  try {
    const result = await sql`SELECT version()`;
    res.type('text').send(result[0].version);
  } catch (err) {
    console.error('DB error:', err);
    res.status(500).type('text').send('Database connection failed');
  }
});

app.use('/', UserRoute);
app.use('/', DashboardRoute);

if (!process.env.VERCEL) {
  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
}

export default app;
