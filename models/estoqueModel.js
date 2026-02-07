
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true }
})

export default class EstoqueModel {

    #estID;
    #proID;
    #estQuantidade;
    #estMinimo;

    get estID() { return this.#estID; } set estID(value) { this.#estID = value; }
    get proID() { return this.#proID; } set proID(value) { this.#proID = value; }
    get estQuantidade() { return this.#estQuantidade; } set estQuantidade(value) { this.#estQuantidade = value; }
    get estMinimo() { return this.#estMinimo; } set estMinimo(value) { this.#estMinimo = value; }

    constructor(estID, proID, estQuantidade, estMinimo) {
        this.#estID = estID;
        this.#proID = proID;
        this.#estQuantidade = estQuantidade;
        this.#estMinimo = estMinimo;
    }

    async criarEstoqueInicial(client, proID, dados) {

        const sql = `
            insert into tb_estoque (pro_id, est_quantidade, est_minimo) 
            values ($1, $2, $3)
        `;

        const values = [
            proID,
            dados.estoque,
            dados.estoqueMin
        ]
        
        await client.query(sql, values);
    }

    async procurarEstoqueID(id) {
        const client = await pool.connect();

        try {
            const sql = "select * from tb_estoque where pro_id = $1";

            const result = await client.query(sql, [id]);
            const row = result.rows[0];

            if(!row) return null;
            return row;
        } finally {
            client.release();
        }
    }
}