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

    get endID() { return this.#endID; } set endID(value) { this.#endID = value; }
    get endCep() { return this.#endCep; } set endCep(value) { this.#endCep = value; }
    get endLogradouro() { return this.#endLogradouro; } set endLogradouro(value) { this.#endLogradouro = value; }
    get endNumero() { return this.#endNumero; } set endNumero(value) { this.#endNumero = value; }
    get endComplemento() { return this.#endComplemento; } set endComplemento(value) { this.#endComplemento = value; }
    get endBairro() { return this.#endBairro; } set endBairro(value) { this.#endBairro = value; }
    get endCidade() { return this.#endCidade; } set endCidade(value) { this.#endCidade = value; }
    get endEstado() { return this.#endEstado; } set endEstado(value) { this.#endEstado = value; }
    get endPais() { return this.#endPais; } set endPais(value) { this.#endPais = value; }

    constructor(endID, endCep, endLogradouro, endNumero, endComplemento, endBairro, endCidade, endEstado, endPais) {
        this.#endID = endID;
        this.#endCep = endCep;
        this.#endLogradouro = endLogradouro;
        this.#endNumero = endNumero;
        this.#endComplemento = endComplemento;
        this.#endBairro = endBairro;
        this.#endCidade = endCidade;
        this.#endEstado = endEstado;
        this.#endPais = endPais;
    }

    async registrarEndereco() {
        const client = await pool.connect();

        try {
            const sql = `
                insert into tb_endereco (end_cep, end_logradouro, end_numero, end_complemento, end_bairro, end_cidade, end_estado, end_pais) 
                values ($1, $2, $3, $4, $5, $6, $7, $8)
                returning end_id, end_cep, end_numero, end_bairro, end_cidade, end_estado
            `;

            console.log(this.#endEstado);

            const values = [this.#endCep, this.#endLogradouro, this.#endNumero, this.#endComplemento, this.#endBairro, this.#endCidade, this.#endEstado, this.#endPais];

            const { rows } = await client.query(sql, values);
            return rows[0] ?? null;
        } finally {
            client.release();
        }
    }
}