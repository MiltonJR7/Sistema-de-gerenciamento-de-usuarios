
import 'dotenv/config';
import { Pool } from "pg";
import ProductModel from "../models/productModel.js";
import EstoqueModel from "../models/estoqueModel.js";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { require: true }
})

export default class ProductService {

    async joinProductInStock(dados, imagem) {
        const client = await pool.connect();
        
        try {
            await client.query('BEGIN');

            const productModel = new ProductModel();
            const estoqueModel = new EstoqueModel();

            dados.imagem = imagem;

            const produto = await productModel.cadastrarProduto(client, dados);
            await estoqueModel.criarEstoqueInicial(client, produto.proID, dados);

            await client.query('COMMIT');

            return produto.proID;
        } catch(err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }
}