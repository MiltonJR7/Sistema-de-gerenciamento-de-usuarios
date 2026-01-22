import AddressModel from "../models/addressModel.js";
import UserModel from "../models/userModel.js";

export default class HomeController {
    async homeView(req, res) {
        let id = null;
        let perID = null;

        if(req.user) id = req.user.id;
        if(req.user) perID = req.user.perID;
        res.render('Home/homePage', { user: id, perfil: perID });
    }

    async perfilView(req, res) {
        let id = null;
        let perID = null;

        if(req.user) id = req.user.id; 
        if(req.user) perID = req.user.perID;

        const banco = new UserModel();
        const lista = await banco.listarUsuarioPeloID(id);
        res.render('Home/perfilPage', { user: id, perfil: perID, lista: lista });
    }

    async perfilAddress(req, res) {
        let id = null;
        let perID = null;

        if(req.user) id = req.user.id; 
        if(req.user) perID = req.user.perID;

        const banco = new UserModel();
        const lista = await banco.listarUsuarioPeloID(id);

        try {
            const {cep, logradouro, numero, complemento, bairro, cidade, uf, pais} = req.body;
            if(!cep || !logradouro || !numero || !complemento || !bairro || !cidade || !uf || !pais) return res.status(400).json({ ok: false });

            const dbAddress = new AddressModel();
            dbAddress.endCep = cep;
            dbAddress.endLogradouro = logradouro;
            dbAddress.endNumero = numero;
            dbAddress.endComplemento = complemento;
            dbAddress.endBairro = bairro;
            dbAddress.endCidade = cidade;
            dbAddress.endEstado = uf;
            dbAddress.endPais = pais;

            const result = await dbAddress.registrarEndereco();
            if(result) return res.json({ ok: true, lista: lista });
            return res.status(400).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ ok: false });
        }
    }
}