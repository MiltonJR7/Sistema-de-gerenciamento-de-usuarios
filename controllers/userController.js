
import UserModel from "../models/userModel.js";
import JWT from  'jsonwebtoken';

export default class UserController {
    loginView(req, res) {
        res.render('Login/loginPage');
    }

    async login(req, res) {
        try {
            const {email, senha} = req.body || {};
            
            if(!email || !senha) return res.status(400).json({ ok: false });

            const banco = new UserModel();
            const user = await banco.logar(email, senha);

            if (!user) return res.status(400).json({ ok: false });

            const payload = ({ id: user.usu_id })
            const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 1000 * 60 * 60
            });

            if(user) return res.json({ ok: true });
            return res.status(400).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ ok: false });
        }
    }

    registerView(req, res) {
        res.render('Register/registerPage');
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