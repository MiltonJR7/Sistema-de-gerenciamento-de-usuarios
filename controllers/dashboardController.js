
import AddressModel from "../models/addressModel.js";
import CategoriaModel from "../models/categoriaModel.js";
import EstoqueModel from "../models/estoqueModel.js";
import ProductModel from "../models/productModel.js";
import UserModel from "../models/userModel.js";
import ProductService from "../services/productService.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export default class DashboardController {
    async dashboardView(req, res) {
        
        try {
            const banco = new UserModel();
            const lista = await banco.listarUsuarios();

            if(lista === null) return res.status(400).json({ mensage: "Erro na lista retornada!" });
            return res.render('Dashboard/dashboardPage', { layout: "Dashboard/layoutDashboard", lista: lista });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ err: "Erro na controladora com status: 500 - possivelmente erro com o banco de dados. --- dashboardView ---" });
        }
    }

    async deleteUsers(req, res) {

        try {
            let idUsuario = req.body.obj;

            if(!idUsuario) return res.status(400).json({ message: "Erro: id não encontrado", ok: false });
            const banco = new UserModel();
            const result = await banco.deleteUser(idUsuario);

            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ err: "Erro na controladora com status: 500 - possivelmente erro com o banco de dados. --- deleteUsers ---", ok: false });
        }
    }

    async deleteAddress(req, res) {

        try {
            let idAddress = req.body.obj;
            
            if(!idAddress) return res.status(400).json({ message: "Erro: id não encontrado", ok: false });
            const banco = new AddressModel();
            const result = await banco.deleteAddress(idAddress);

            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ err: "Erro na controladora com status: 500 - possivelmente erro com o banco de dados. --- deleteAddress ---", ok: false });
        }
    }

    async dashboardEnderecoView(req, res) {

        try {
            const banco = new AddressModel();
            const lista = await banco.listarEnderecosDashboard();
            
            if(lista === null) return res.status(400).json({ mensage: "Erro na lista retornada!", ok: false });
            return res.render('Dashboard/addressPage', { layout: "Dashboard/layoutDashboard", lista: lista });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardEnderecoView ---" });
        }
    }

    async dashboardUserServiceView(req, res) {
        
        try {
            const banco = new UserModel();
            const bancoAddress = new AddressModel();

            const lista = await banco.listarUsuarioPeloID(req.params.id);
            const listaAddress = await bancoAddress.listarEnderecosDashboard();

            if(lista === null) return res.status(400).json({ mensage: "Erro na lista retornada!", ok: false });
            return res.render('Dashboard/userServicesAlterPage.ejs', { layout: "Dashboard/layoutDashboard", lista: lista, listaAddress: listaAddress });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardUserServiceView ---" });
        }
    }

    async dashboardUserServiceDelete(req, res) {

        try {
            let idUserServices = req.params.id;

            if(idUserServices !== req.body.obj) return res.status(400).json({ mensage: "Erro provavel tentativa de manipulacao do params", ok: false });
            if(!idUserServices) return res.status(500).json({ mensage: "Erro params inexistente ou invalido!", ok: false }); 

            const banco = new UserModel();
            const result = await banco.deleteUser(idUserServices);

            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardUserServiceDelete ---" });
        }
    }

    async dashboardUserServiceAlter(req, res) {
        
        try {
            let idUserServices = req.params.id;
            const {nome, email, genero, senha, cleanNumber} = req.body;
            if(!idUserServices) return res.status(500).json({ mensage: "Erro params inexistente ou invalido!", ok: false }); 

            const banco = new UserModel();
            if(nome) banco.usuNome = nome;
            if(email) banco.usuEmail = email;
            if(genero) banco.usuGenero = genero;
            if(senha) banco.usuSenha = senha;
            if(cleanNumber) banco.usuNumero = cleanNumber;

            if (req.file) {
                const uploaded = await uploadToCloudinary(req.file.buffer, "users");
                banco.usuUrlImagem = uploaded.secure_url;
            }

            const result = await banco.alterarUser(idUserServices);
            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardUserServiceAlter ---" });
        }
    }

    async dashboardProductsView(req, res) {

        try {
            const banco = new ProductModel();
            const lista = await banco.listarProdutos();

            res.render('Dashboard/productPage', { layout: "Dashboard/layoutDashboard", lista: lista });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardProductsView ---" });
        }
    }

    async dashboardProductServicesView(req, res) {

        try {
            const bancoCategoria = new CategoriaModel();
            const listaCategorias = await bancoCategoria.listarCategorias();

            res.render('Dashboard/productServicesAddPage', { layout: "Dashboard/layoutDashboard", lista: listaCategorias });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro de renderização: 400 - possivelmente erro de variaveis. --- dashboardProductServicesView ---" });
        }
    }

    async dashboardProductServicesNewProduct(req, res) {

        try {
            if(!req.file || !req.body.nome || !req.body.preco  || !req.body.codigoBarras || !req.body.status || !req.body.categoria || req.body.estoque === null) return res.status(400).json({ ok: false });

            const uploaded = await uploadToCloudinary(req.file.buffer, "products");
            const imagem = uploaded.secure_url;

            const banco = new ProductService();
            const proID = await banco.joinProductInStock(req.body, imagem);
            
            res.status(201).json({
                sucesso: true,
                pro_id: proID,
                ok: true
            });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status 400 - possivelmente erro com banco de dados. --- dashboardProductServicesNewProduct ---" });
        }
    }

    async dashboardProductsDelete(req, res) {

        try {
            const id = req.body.obj;

            if(!id) return res.status(400).json({ ok: false });

            const banco = new ProductModel();
            const result = await banco.deletarProduto(id);

            if(result) return res.status(200).json({ ok: true });
            return res.status(500).jso({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status 400 - possivelmente erro com banco de dados. --- dashboardProductsDelete ---" });
        }
    }

    async dashboardProductsAlterView(req, res) {

        try {
            const id = req.params.id;
            const banco = new ProductModel();
            const bancoCategoria = new CategoriaModel();
            const bancoEstoque = new EstoqueModel();

            const lista = await banco.listarProdutosPorID(id);
            const listaCat = await bancoCategoria.listarCategorias();
            const listaEstoque = await bancoEstoque.procurarEstoqueID(id);

            if(lista) return res.render('Dashboard/productServicesAlterPage', { layout: "Dashboard/layoutDashboard", lista: lista, listaCat: listaCat, listaEstoque: listaEstoque });
            return res.status(500).json({ err: "Erro na lista retornada do banco!" })
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status 400 - possivelmente erro com banco de dados. --- dashboardProductsAlterView ---" });
        }
    }

    async dashboardProductsAlter(req, res) {

        try {
            const id = req.params.id;
            

        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status 400 - possivelmente erro com banco de dados. --- dashboardProductsAlter ---" });
        }
    }
}

