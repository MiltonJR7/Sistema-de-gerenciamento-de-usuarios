
import 'dotenv/config';
import http from 'http';
import express from 'express';
import UserRoute from './routes/userRoute.js';
import { neon } from "@neondatabase/serverless";

const app = express();
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json());

const sql = neon(process.env.DATABASE_URL);

// rota teste do banco
app.get("/db", async (req, res) => {
  const result = await sql`SELECT version()`;
  res.type("text").send(result[0].version);
});

app.use("/", UserRoute);

const port = 5000;
http.createServer(app).listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
