
import UserModel from "../models/userModel.js";

export default class UserController {
    loginView(req, res) {
        res.render('login/loginPage');
    }

    async login(req, res) {
        try {
            const {email, senha} = req.body || {};
            
            if(!email || !senha) return res.status(400).json({ ok: false });

            const banco = new UserModel();
            const user = await banco.logar(email, senha);

            if(user) return res.json({ ok: true });
            return res.status(400).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ ok: false });
        }
    }

    registerView(req, res) {
        res.render('register/registerPage');
    }

    async register(req, res) {
        try {
            const {nome, email, senha} = req.body;

            if(!nome || !email || !senha) return res.status(400).json({ ok: false });

            const banco = new UserModel(null, nome, email, senha);
            const result = await banco.registarUsuario();

            if(result) return res.json({ ok: true });
            return res.status(400).json({ ok: false })
        } catch(err) {
            console.log(err);
            return res.status(500).json({ ok: false });
        }
    }
}