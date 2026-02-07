import AddressModel from "../models/addressModel.js";
import UserModel from "../models/userModel.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

export default class HomeController {
    async homeView(req, res) {
        let id = null;
        let perID = null;

        if(req.user) id = req.user.id;
        if(req.user) perID = req.user.perID;
        
        const banco = new UserModel();
        const lista = await banco.listarUsuarioPeloID(id);

        res.render('Home/homePage', { user: id, perfil: perID, layoutDashboard: false, lista: lista });
    }

    async perfilView(req, res) {
        let id = null;
        let perID = null;

        if(req.user) id = req.user.id; 
        if(req.user) perID = req.user.perID;

        const banco = new UserModel();
        const lista = await banco.listarUsuarioPeloID(id);

        const bancoEndereco = new AddressModel();
        const listaEndereco = await bancoEndereco.listarEnderecos(id);

        res.render('Home/perfilPage', { user: id, perfil: perID, lista: lista, listaEndereco: listaEndereco });
    }

    async perfilAddress(req, res) {
        let id = null;
        let perID = null

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
            dbAddress.usuID = id;

            const result = await dbAddress.registrarEndereco();
            if(result) return res.json({ ok: true, lista: lista });
            return res.status(400).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ ok: false });
        }
    }

    async perfilAlterarDados(req, res) {
        let id = null;
        if(req.user) id = req.user.id;
        
        try {
            const { nome, email, genero, cleanNumber } = req.body;

            const banco = new UserModel();
            if (nome) banco.usuNome = nome;
            if (email) banco.usuEmail = email;
            if (genero) banco.usuGenero = genero;
            if (cleanNumber) banco.usuNumero = cleanNumber;

            if (req.file) {
                const uploaded = await uploadToCloudinary(req.file.buffer, "users");
                banco.usuUrlImagem = uploaded.secure_url;
            }

            const result = await banco.alterarUserPerfil(id);

            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
        } catch(err) {
            console.log(err);
            return err;
        }
    }

    async profileDeleteAddress(req, res) {

        try {
            let idAddress = req.body.obj;
                        
            if(!idAddress) return res.status(400).json({ message: "Erro: id não encontrado", ok: false });
            const banco = new AddressModel();
            const result = await banco.deleteAddress(idAddress);

            if(result) return res.status(200).json({ ok: true });
            return res.status(500).json({ ok: false });
        } catch(err) {
            console.log(err);
            return err;
        }
    }
}