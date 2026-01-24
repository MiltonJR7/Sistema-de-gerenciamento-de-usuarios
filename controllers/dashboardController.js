
import AddressModel from "../models/addressModel.js";
import UserModel from "../models/userModel.js";

export default class DashboardController {
    async dashboardView(req, res) {
        
        try {
            const banco = new UserModel();
            const lista = await banco.listarUsuarios();

            if(lista === null) return res.status(400).json({ mensage: "Erro na lista retornada!" });
            res.render('Dashboard/dashboardPage', { layout: false, lista: lista });
        } catch(err) {
            console.log(err);
            res.status(500).json({ menssage: "Erro em try lista" });
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
            res.status(500).json({ message: "Erro: em try delete", ok: false });
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
            res.status(500).json({ message: "Erro: em try delete", ok: false });
        }
    }

    async dashboardEnderecoView(req, res) {

        try {

            const banco = new AddressModel();
            const lista = await banco.listarEnderecosDashboard();
            
            if(lista === null) return res.status(400).json({ mensage: "Erro na lista retornada!" });
            res.render('Dashboard/enderecoPage', { layout: false, lista: lista });
        } catch(err) {
            console.log(err);
            return res.status(400).json({ err: "Error in try. /controllers/dashboardControler.js" });
        }
    }
}

