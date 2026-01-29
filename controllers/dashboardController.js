
import AddressModel from "../models/addressModel.js";
import UserModel from "../models/userModel.js";

export default class DashboardController {
    async dashboardView(req, res) {
        
        try {
            const banco = new UserModel();
            const lista = await banco.listarUsuarios();

            if(lista === null) return res.status(400).json({ mensage: "Erro na lista retornada!" });
            return res.render('Dashboard/dashboardPage', { layout: false, lista: lista });
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
            return res.render('Dashboard/addressPage', { layout: false, lista: lista });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardEnderecoView ---" });
        }
    }

    async dashboardUserServiceView(req, res) {
        
        try {

            const banco = new UserModel();
            const lista = await banco.listarUsuarioPeloID(req.params.id);

            if(lista === null) return res.status(400).json({ mensage: "Erro na lista retornada!", ok: false });
            return res.render('Dashboard/userServicesPage.ejs', { layout: false, lista: lista });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardUserUpdateView ---" });
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
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardUserServiceDelete ---" })
        }
    }

    async dashboardUserServiceAlter(req, res) {
        
        try {
            let idUserServices = req.params.id;
            const {nome, email, genero, numero} = req.body;
            if(!idUserServices) return res.status(500).json({ mensage: "Erro params inexistente ou invalido!", ok: false }); 

            const banco = new UserModel();
            banco.usuNome = nome;
            banco.usuEmail = email;
            banco.usuGenero = genero;
            banco.usuNumero = numero;

            const result = await banco.alterarUser(idUserServices);

            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Erro na controladora com status: 400 - possivelmente erro com o banco de dados. --- dashboardUserServiceAlter ---" })
        }
    }
}

