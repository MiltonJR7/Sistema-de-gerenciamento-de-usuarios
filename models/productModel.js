
import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true }
})

export default class ProductModel {

    #proID;
    #proNome;
    #proDescricao;
    #proPreco;
    #proImagem;
    #proCodigoBarras;
    #proStatus;
    #proDataCadastro;
    #catID;

    get proID() { return this.#proID; } set proID(value) { this.#proID = value; }
    get proNome() { return this.#proNome; } set proNome(value) { this.#proNome = value; }
    get proDescricao() { return this.#proDescricao; } set proDescricao(value) { this.#proDescricao = value; }
    get proPreco() { return this.#proPreco; } set proPreco(value) { this.#proPreco = value; }
    get proImagem() { return this.#proImagem; } set proImagem(value) { this.#proImagem = value; }
    get proCodigoBarras() { return this.#proCodigoBarras; } set proCodigoBarras(value) { this.#proCodigoBarras = value; }
    get proStatus() { return this.#proStatus; } set proStatus(value) { this.#proStatus = value; }
    get proDataCadastro() { return this.#proDataCadastro; } set proDataCadastro(value) { this.#proDataCadastro = value; }
    get catID() { return this.#catID; } set catID(value) { this.#catID = value; }

    constructor(proID, proNome, proDescricao, proPreco, proImagem, proCodigoBarras, proStatus, proDataCadastro, catID) {
        this.#proID = proID;
        this.#proNome = proNome;
        this.#proDescricao = proDescricao;
        this.#proPreco = proPreco;
        this.#proImagem = proImagem;
        this.#proCodigoBarras = proCodigoBarras;
        this.#proStatus = proStatus;
        this.#proDataCadastro = proDataCadastro;
        this.#catID = catID;
    }

    async listarProdutos() {
        const client = await pool.connect();

        try {
            const sql = "select * from tb_produto";
            
        } finally {
            client.release();
        }
    }


}