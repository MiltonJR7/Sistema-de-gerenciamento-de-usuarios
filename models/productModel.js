
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
    #subID;

    get proID() { return this.#proID; } set proID(value) { this.#proID = value; }
    get proNome() { return this.#proNome; } set proNome(value) { this.#proNome = value; }
    get proDescricao() { return this.#proDescricao; } set proDescricao(value) { this.#proDescricao = value; }
    get proPreco() { return this.#proPreco; } set proPreco(value) { this.#proPreco = value; }
    get proImagem() { return this.#proImagem; } set proImagem(value) { this.#proImagem = value; }
    get proCodigoBarras() { return this.#proCodigoBarras; } set proCodigoBarras(value) { this.#proCodigoBarras = value; }
    get proStatus() { return this.#proStatus; } set proStatus(value) { this.#proStatus = value; }
    get proDataCadastro() { return this.#proDataCadastro; } set proDataCadastro(value) { this.#proDataCadastro = value; }
    get catID() { return this.#catID; } set catID(value) { this.#catID = value; }
    get subID() { return this.#subID; } set subID(value) { this.#subID = value; }

    constructor(proID, proNome, proDescricao, proPreco, proImagem, proCodigoBarras, proStatus, proDataCadastro, catID, subID) {
        this.#proID = proID;
        this.#proNome = proNome;
        this.#proDescricao = proDescricao;
        this.#proPreco = proPreco;
        this.#proImagem = proImagem;
        this.#proCodigoBarras = proCodigoBarras;
        this.#proStatus = proStatus;
        this.#proDataCadastro = proDataCadastro;
        this.#catID = catID;
        this.#subID = subID;
    }

    async listarProdutos() {
        const client = await pool.connect();

        try {
            const sql = `
                select 
                tb_produto.pro_id,
                tb_produto.pro_nome,
                tb_produto.pro_descricao,
                tb_produto.pro_preco,
                tb_produto.pro_imagem,
                tb_produto.pro_codigo_barras,
                tb_produto.pro_status,
                tb_produto.pro_data_cadastro,
                tb_categoria.cat_nome
                from tb_produto
                inner join tb_categoria on tb_produto.cat_id = tb_categoria.cat_id
            `;

            const result = await client.query(sql);
            const rows = result.rows;

            let listaProdutos = [];

            for(let i = 0; i < rows.length; i++) {
                let produtos = new ProductModel();
                produtos.proID = rows[i].pro_id;
                produtos.proNome = rows[i].pro_nome;
                produtos.proDescricao = rows[i].pro_descricao;
                produtos.proPreco = rows[i].pro_preco;
                produtos.proImagem = rows[i].pro_imagem;
                produtos.proCodigoBarras = rows[i].pro_codigo_barras;
                produtos.proStatus = rows[i].pro_status;
                produtos.proDataCadastro = rows[i].pro_data_cadastro;
                produtos.catNome = rows[i].cat_nome;

                listaProdutos.push(produtos)
            }

            return listaProdutos;
        } finally {
            client.release();
        }
    }

    async cadastrarProduto(client, dados) {
        const sql = `
            insert into tb_produto (pro_nome, pro_descricao, pro_preco, pro_imagem, pro_codigo_barras, pro_status, cat_id, sub_id)
            values ($1, $2, $3, $4, $5, $6, $7, $8)
            returning pro_id, pro_nome, pro_preco, pro_imagem, pro_status, cat_id
        `;

        const values = [ 
            dados.nome,
            dados.descricao,
            dados.preco,
            dados.imagem,
            dados.codigoBarras,
            dados.status,
            dados.categoria,
            dados.subcategoria
        ];

        const { rows } = await client.query(sql, values);
        const row = rows[0];

        if (!row) return null;

        return {
            proID: row.pro_id,
            proNome: row.pro_nome,
            proPreco: row.pro_preco,
            proImagem: row.pro_imagem,
            proStatus: row.pro_status,
            catID: row.cat_id
        };
    }

    async deletarProduto(id) {
        const client = await pool.connect();

        try {
            const sql = `delete from tb_produto where pro_id = $1`;
            const result = await client.query(sql, [id]);
            return result;
        } finally {
            client.release();
        }
    }

    async listarProdutosPorID(id) {
        const client = await pool.connect();

        try {
            const sql = `
                select 
                tb_produto.pro_id,
                tb_produto.pro_nome,
                tb_produto.pro_descricao,
                tb_produto.pro_preco,
                tb_produto.pro_imagem,
                tb_produto.pro_codigo_barras,
                tb_produto.pro_status,
                tb_produto.pro_data_cadastro,
                tb_produto.cat_id,
                tb_categoria.cat_nome
                from tb_produto
                inner join tb_categoria on tb_produto.cat_id = tb_categoria.cat_id
                where pro_id = $1
            `;
            const result = await client.query(sql, [id]);
            const rows = result.rows[0];

            if(!rows) return null;
            return rows;
        } finally {
            client.release();
        }
    }

    async alterarProduto(client, dados, id){
        const sql = `
            update tb_produto set
            pro_nome = $1,
            pro_descricao = $2,
            pro_preco = $3,
            pro_imagem = $4,
            pro_codigo_barras = $5,
            pro_status = $6,
            cat_id = $7,
            sub_id = $8
            where pro_id = $9
        `;

        const values = [ 
            dados.nome,
            dados.descricao,
            dados.preco,
            dados.imagem,
            dados.codigoBarras,
            dados.status,
            dados.categoria,
            dados.subcategoria,
            id
        ];

        await client.query(sql, values);
    }
}

