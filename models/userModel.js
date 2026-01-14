import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { require: true },
});

export default class UserModel {
  #usuID;
  #usuNome;
  #usuEmail;
  #usuSenha;
  #usuAtivo;

  get usuID() { return this.#usuID; } set usuID(value) { this.#usuID = value; }
  get usuNome() { return this.#usuNome; } set usuNome(value) { this.#usuNome = value; }
  get usuEmail() { return this.#usuEmail; } set usuEmail(value) { this.#usuEmail = value; }
  get usuSenha() { return this.#usuSenha; } set usuSenha(value) { this.#usuSenha = value; }
  get usuAtivo() { return this.#usuAtivo; } set usuAtivo(value) { this.#usuAtivo = value; }

  constructor(usuID, usuNome, usuEmail, usuSenha, usuAtivo) {
    this.#usuID = usuID;
    this.#usuNome = usuNome;
    this.#usuEmail = usuEmail;
    this.#usuSenha = usuSenha;
    this.#usuAtivo = usuAtivo;
  }

  async logar(email, senhaDigitada) {
    const client = await pool.connect();

    try {
      const sql = `
        SELECT usu_id, usu_nome, usu_email, usu_ativo, per_id, usu_hash_senha
        FROM tb_usuario
        WHERE usu_email = $1
        LIMIT 1
      `;

      const { rows } = await client.query(sql, [email]);
      const user = rows[0];

      if (!user) return null;

      const ok = await bcrypt.compare(senhaDigitada, user.usu_hash_senha);
      if (!ok) return null;

      delete user.usu_hash_senha;

      return user;
    } finally {
      client.release();
    }
  }

  async registarUsuario() {
    const client = await pool.connect();

    try {
      const saltRounds = 10;
      const hash = await bcrypt.hash(this.#usuSenha, saltRounds);

      const sql = `
        INSERT INTO tb_usuario (usu_nome, usu_email, usu_hash_senha)
        VALUES ($1, $2, $3)
        RETURNING usu_id, usu_nome, usu_email, per_id
      `;

      const values = [this.#usuNome, this.#usuEmail, hash];

      const { rows } = await client.query(sql, values);
      return rows[0] ?? null;
    } finally {
      client.release();
    }
  }

  async obterID(id) {
    const client = await pool.connect();

    try {
      const sql = `
      SELECT usu_id, usu_nome, usu_email, usu_hash_senha, usu_ativo
      FROM tb_usuario
      WHERE usu_id = ?
    `
    const rows = await client.query(sql);

    if(rows.length > 0) {
      let row = rows[0];
      return new UserModel(
        row["usu_id"],
        row["usu_nome"],
        row["usu_email"],
        row["usu_hash_senha"],
        row["usu_ativo"]
      )
    }
    return null;
    } finally {
      client.release();
    }
  }
}
