
import AddressModel from "../models/addressModel.js";
import CategoriaModel from "../models/categoriaModel.js";
import ProductModel from "../models/productModel.js";
import UserModel from "../models/userModel.js";

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
            console.log(req.body)
            if(!idUserServices) return res.status(500).json({ mensage: "Erro params inexistente ou invalido!", ok: false }); 

            const banco = new UserModel();
            if(nome) banco.usuNome = nome;
            if(email) banco.usuEmail = email;
            if(genero) banco.usuGenero = genero;
            if(senha) banco.usuSenha = nome;
            if(cleanNumber) banco.usuNumero = cleanNumber;
            if(req.file) banco.usuUrlImagem = req.file.filename;

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

            const { nome, descricao, preco, codigoBarras, status, categoria } = req.body;
            const imagem = req.file.filename;
            if(!nome || !preco || !codigoBarras || !status || !categoria) return res.status(400).json({ ok: false });

            const banco = new ProductModel();
            banco.proNome = nome;
            banco.proDescricao = descricao;
            banco.proPreco = preco;
            banco.proImagem = imagem;
            banco.proCodigoBarras = codigoBarras;
            banco.proStatus = status;
            banco.catID = categoria;

            const result = await banco.cadastrarProduto();
            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
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
}

