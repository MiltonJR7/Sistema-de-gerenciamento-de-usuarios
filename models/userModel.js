import 'dotenv/config';
import { Pool } from 'pg';
import bcrypt from 'bcrypt';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true }
});

export default class UserModel {
    #usuID;
    #usuNome;
    #usuEmail;
    #usuSenha;
    #usuAtivo;
    #usuDate;
    #usuGenero;
    #usuUrlImagem;
    #usuNumero;
    #perID;

    get usuID() { return this.#usuID; } set usuID(value) { this.#usuID = value; }
    get usuNome() { return this.#usuNome; } set usuNome(value) { this.#usuNome = value; }
    get usuEmail() { return this.#usuEmail; } set usuEmail(value) { this.#usuEmail = value; }
    get usuSenha() { return this.#usuSenha; } set usuSenha(value) { this.#usuSenha = value; }
    get usuAtivo() { return this.#usuAtivo; } set usuAtivo(value) { this.#usuAtivo = value; }
    get usuDate() { return this.#usuDate; } set usuDate(value) { this.#usuDate = value; }
    get usuGenero() { return this.#usuGenero; } set usuGenero(value) { this.#usuGenero = value; }
    get usuUrlImagem() { return this.#usuUrlImagem; } set usuUrlImagem(value) { this.#usuUrlImagem = value; }
    get usuNumero() { return this.#usuNumero; } set usuNumero(value) { this.#usuNumero = value; }
    get perID() { return this.#perID; } set perID(value) { this.#perID = value; }

    constructor(usuID, usuNome, usuEmail, usuSenha, usuAtivo, usuDate, usuGenero, usuUrlImagem, usuNumero, perID) {
        this.#usuID = usuID;
        this.#usuNome = usuNome;
        this.#usuEmail = usuEmail;
        this.#usuSenha = usuSenha;
        this.#usuAtivo = usuAtivo;
        this.#usuDate = usuDate;
        this.#usuGenero = usuGenero;
        this.#usuUrlImagem = usuUrlImagem;
        this.#usuNumero = usuNumero;
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

    async registrarUsuario() {
        const client = await pool.connect();

        try {
            const saltRounds = 10;
            const hash = await bcrypt.hash(this.#usuSenha, saltRounds);

            const sql = `
                INSERT INTO tb_usuario (usu_nome, usu_email, usu_hash_senha, usu_genero)
                VALUES ($1, $2, $3, $4)
                RETURNING usu_id, usu_nome, usu_email, per_id
            `;

            const values = [this.#usuNome, this.#usuEmail, hash, this.#usuGenero];

            const { rows } = await client.query(sql, values);
            return rows[0] ?? null;
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
                tb_usuario.usu_numero,
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
                usuario.usuDate = rows[i].usu_criacao;
                usuario.usuNumero = rows[i].usu_numero;
                usuario.perTipo = rows[i].per_tipo;

                listaUsuario.push(usuario);
            }

            return listaUsuario;
        } finally {
            client.release();
        }
    }

    async listarUsuarioPeloID(id) {
        const client = await pool.connect();

        try {
            const sql = `
                select
                tb_usuario.usu_id,
                tb_usuario.usu_nome,
                tb_usuario.usu_email,
                tb_usuario.usu_ativo,
                tb_usuario.usu_criacao,
                tb_usuario.usu_genero,
                tb_usuario.usu_url_imagem,
                tb_usuario.usu_numero,
                tb_perfil.per_tipo
                from tb_usuario
                inner join tb_perfil on tb_usuario.per_id = tb_perfil.per_id
                where tb_usuario.usu_id = $1
                limit 1
            `;

            const result = await client.query(sql, [id]);
            const row = result.rows[0];
            if (!row) return null;
            return row;
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

    async alterarUser(id) {
        const client = await pool.connect();

        try {
            let campos = [];
            let valores = [];
            let i = 1;

            if (this.#usuNome !== undefined) {
                campos.push(`usu_nome = $${i++}`);
                valores.push(this.#usuNome);
            }

            if (this.#usuEmail !== undefined) {
                campos.push(`usu_email = $${i++}`);
                valores.push(this.#usuEmail);
            }

            if (this.#usuGenero !== undefined) {
                campos.push(`usu_genero = $${i++}`);
                valores.push(this.#usuGenero);
            }

            if (this.#usuSenha !== undefined) {
                const saltRounds = 10;
                const hash = await bcrypt.hash(this.#usuSenha, saltRounds);

                campos.push(`usu_hash_senha = $${i++}`);
                valores.push(hash);

                console.log("senha: ", this.#usuSenha);
                console.log("hash: ", hash)
            }

            if (this.#usuUrlImagem !== undefined) {
                campos.push(`usu_url_imagem = $${i++}`);
                valores.push(this.#usuUrlImagem);
            }

            if (this.#usuNumero !== undefined) {
                campos.push(`usu_numero = $${i++}`);
                valores.push(this.#usuNumero);
            }

            if (campos.length === 0) return false;

            const sql = `
                UPDATE tb_usuario
                SET ${campos.join(", ")}
                WHERE usu_id = $${i}
            `;
            valores.push(id);

            const result = await client.query(sql, valores);
            return result;
        } finally {
            client.release();
        }
    }

    async alterarUserPerfil(id) {
        const client = await pool.connect();

        try {
            let campos = [];
            let valores = [];
            let i = 1;

            if (this.#usuNome !== undefined) {
                campos.push(`usu_nome = $${i++}`);
                valores.push(this.#usuNome);
            }

            if (this.#usuEmail !== undefined) {
                campos.push(`usu_email = $${i++}`);
                valores.push(this.#usuEmail);
            }

            if (this.#usuGenero !== undefined) {
                campos.push(`usu_genero = $${i++}`);
                valores.push(this.#usuGenero);
            }

            if (this.#usuUrlImagem !== undefined) {
                campos.push(`usu_url_imagem = $${i++}`);
                valores.push(this.#usuUrlImagem);
            }

            if (this.#usuNumero !== undefined) {
                campos.push(`usu_numero = $${i++}`);
                valores.push(this.#usuNumero);
            }

            if (campos.length === 0) return false;

            const sql = `
                UPDATE tb_usuario
                SET ${campos.join(", ")}
                WHERE usu_id = $${i}
            `;
            valores.push(id);

            const result = await client.query(sql, valores);
            return result.rowCount > 0;
        } finally {
            client.release();
        }
    }
}
