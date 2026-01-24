import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true },
})

export default class AddressModel {

    #endID;
    #endCep;
    #endLogradouro;
    #endNumero;
    #endComplemento;
    #endBairro;
    #endCidade;
    #endEstado;
    #endPais;
    #usuID;

    get endID() { return this.#endID; } set endID(value) { this.#endID = value; }
    get endCep() { return this.#endCep; } set endCep(value) { this.#endCep = value; }
    get endLogradouro() { return this.#endLogradouro; } set endLogradouro(value) { this.#endLogradouro = value; }
    get endNumero() { return this.#endNumero; } set endNumero(value) { this.#endNumero = value; }
    get endComplemento() { return this.#endComplemento; } set endComplemento(value) { this.#endComplemento = value; }
    get endBairro() { return this.#endBairro; } set endBairro(value) { this.#endBairro = value; }
    get endCidade() { return this.#endCidade; } set endCidade(value) { this.#endCidade = value; }
    get endEstado() { return this.#endEstado; } set endEstado(value) { this.#endEstado = value; }
    get endPais() { return this.#endPais; } set endPais(value) { this.#endPais = value; }
    get usuID() { return this.#usuID; } set usuID(value) { this.#usuID = value; }

    constructor(endID, endCep, endLogradouro, endNumero, endComplemento, endBairro, endCidade, endEstado, endPais, usuID) {
        this.#endID = endID;
        this.#endCep = endCep;
        this.#endLogradouro = endLogradouro;
        this.#endNumero = endNumero;
        this.#endComplemento = endComplemento;
        this.#endBairro = endBairro;
        this.#endCidade = endCidade;
        this.#endEstado = endEstado;
        this.#endPais = endPais;
        this.#usuID = usuID;
    }

    async registrarEndereco() {
        const client = await pool.connect();

        try {
            const sql = `
                insert into tb_endereco (end_cep, end_logradouro, end_numero, end_complemento, end_bairro, end_cidade, end_estado, end_pais, usu_id) 
                values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
                returning end_id, end_cep, end_numero, end_bairro, end_cidade, end_estado, usu_id
            `;
            
            const values = [this.#endCep, this.#endLogradouro, this.#endNumero, this.#endComplemento, this.#endBairro, this.#endCidade, this.#endEstado, this.#endPais, this.#usuID];
            const { rows } = await client.query(sql, values);
            return rows[0] ?? null;
        } finally {
            client.release();
        }
    }

    async listarEnderecos(id) {
        const client = await pool.connect();

        try {
            const sql = `
                select
                tb_endereco.end_id,
                tb_endereco.end_cep,
                tb_endereco.end_logradouro,
                tb_endereco.end_numero,
                tb_endereco.end_complemento,
                tb_endereco.end_bairro,
                tb_endereco.end_cidade,
                tb_endereco.end_estado,
                tb_endereco.end_pais,
                tb_endereco.end_padrao,
                tb_usuario.usu_id
                from tb_endereco
                inner join tb_usuario on tb_endereco.usu_id = tb_usuario.usu_id
                where tb_usuario.usu_id = $1
            `;

            const result = await client.query(sql, [id]);
            const rows = result.rows;

            let listaEndereco = [];

            for (let i = 0; i < rows.length; i++) {
                let endereco = new AddressModel();
                endereco.endID = rows[i].end_id;
                endereco.endCep = rows[i].end_cep;
                endereco.endLogradouro = rows[i].end_logradouro;
                endereco.endNumero = rows[i].end_numero;
                endereco.endComplemento = rows[i].end_complemento;
                endereco.endBairro = rows[i].end_bairro;
                endereco.endCidade = rows[i].end_cidade;
                endereco.endEstado = rows[i].end_estado;
                endereco.endPais = rows[i].end_pais;
                endereco.usuID = rows[i].usu_id;

                listaEndereco.push(endereco);
            }

            return listaEndereco;
        } finally {
            client.release();
        }
    }

    async listarEnderecosDashboard() {
        const client = await pool.connect();

        try {
            const sql = `
                select
                tb_endereco.end_id,
                tb_endereco.end_cep,
                tb_endereco.end_logradouro,
                tb_endereco.end_numero,
                tb_endereco.end_complemento,
                tb_endereco.end_bairro,
                tb_endereco.end_cidade,
                tb_endereco.end_estado,
                tb_endereco.end_pais,
                tb_endereco.end_padrao,
                tb_usuario.usu_id
                from tb_endereco
                inner join tb_usuario on tb_endereco.usu_id = tb_usuario.usu_id
            `;

            const result = await client.query(sql);
            const rows = result.rows;

            let listaEndereco = [];

            for (let i = 0; i < rows.length; i++) {
                let endereco = new AddressModel();
                endereco.endID = rows[i].end_id;
                endereco.endCep = rows[i].end_cep;
                endereco.endLogradouro = rows[i].end_logradouro;
                endereco.endNumero = rows[i].end_numero;
                endereco.endComplemento = rows[i].end_complemento;
                endereco.endBairro = rows[i].end_bairro;
                endereco.endCidade = rows[i].end_cidade;
                endereco.endEstado = rows[i].end_estado;
                endereco.endPais = rows[i].end_pais;
                endereco.usuID = rows[i].usu_id;

                listaEndereco.push(endereco);
            }

            return listaEndereco;
        } finally {
            client.release();
        }
    }

    async deleteAddress(id) {
        const client = await pool.connect();

        try {
            const sql = "delete from tb_endereco where end_id = $1";
            const result = await client.query(sql, [id]);
            return result;
        } finally {
            client.release();
        }
    }
}