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
  #usuDate;
  #perID;

  get usuID() { return this.#usuID; } set usuID(value) { this.#usuID = value; }
  get usuNome() { return this.#usuNome; } set usuNome(value) { this.#usuNome = value; }
  get usuEmail() { return this.#usuEmail; } set usuEmail(value) { this.#usuEmail = value; }
  get usuSenha() { return this.#usuSenha; } set usuSenha(value) { this.#usuSenha = value; }
  get usuAtivo() { return this.#usuAtivo; } set usuAtivo(value) { this.#usuAtivo = value; }
  get usuDate() { return this.#usuDate; } set usuDate(value) { this.#usuDate = value; }
  get perID() { return this.#perID; } set perID(value) { this.#perID = value; }

  constructor(usuID, usuNome, usuEmail, usuSenha, usuAtivo, usuDate, perID) {
    this.#usuID = usuID;
    this.#usuNome = usuNome;
    this.#usuEmail = usuEmail;
    this.#usuSenha = usuSenha;
    this.#usuAtivo = usuAtivo;
    this.#usuDate = usuDate;
    this.#perID = perID;
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
      WHERE usu_id = $1
    `
    const rows = await client.query(sql, [id]);

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

  async listarUsuarios() {
    const client = await pool.connect();

    try {
      const sql = `
        select
          tb_usuario.usu_id,
          tb_usuario.usu_nome,
          tb_usuario.usu_email,
          tb_usuario.usu_ativo,
          tb_usuario.usu_criacao,
          tb_perfil.per_tipo
        from tb_usuario
        inner join tb_perfil on tb_usuario.per_id = tb_perfil.per_id
      `;

      const result = await client.query(sql);
      const rows = result.rows;

      let listaUsuario = [];

      for (let i = 0; i < rows.length; i++) {
        let usuario = new UserModel();
        usuario.usuID = rows[i].usu_id;
        usuario.usuNome = rows[i].usu_nome;
        usuario.usuEmail = rows[i].usu_email;
        usuario.usuAtivo = rows[i].usu_ativo;
        usuario.usuCriacao = rows[i].usu_criacao;
        usuario.perTipo = rows[i].per_tipo;

        listaUsuario.push(usuario);
      }

      return listaUsuario;
    } finally {
      client.release();
    }
    
  }

  async deleteUser(id) {
    const client = await pool.connect();

    try {
      const sql = "delete from tb_usuario where usu_id = $1";
      const result = await client.query(sql, [id]);
      return result;
    } finally {
      client.release();
    }
  }
}
