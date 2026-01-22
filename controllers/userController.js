
import UserModel from "../models/userModel.js";
import JWT from  'jsonwebtoken';

export default class UserController {
    loginView(req, res) {
        res.render('Login/loginPage', { layout: false });
    }

    async login(req, res) {
        try {
            const {email, senha} = req.body || {};
            
            if(!email || !senha) return res.status(400).json({ ok: false });

            const banco = new UserModel();
            const user = await banco.logar(email, senha);

            if (!user) return res.status(400).json({ ok: false });

            const payload = ({ id: user.usu_id, perID: user.per_id })
            const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });

            res.cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: 1000 * 60 * 60
            });

            if(user) return res.json({ ok: true, id: user.usu_id, perID: user.per_id });
            return res.status(400).json({ ok: false });
        } catch(err) {
            console.log(err);
            return res.status(500).json({ ok: false });
        }
    }

    registerView(req, res) {
        res.render('Register/registerPage', { layout: false });
    }

    async register(req, res) {
        try {
            const {nome, email, senha, genero} = req.body;
            if(!nome || !email || !senha || !genero) return res.status(400).json({ ok: false });

            const user = new UserModel();
            user.usuNome = nome;
            user.usuEmail = email;
            user.usuSenha = senha;
            user.usuGenero = genero;

            const result = await user.registrarUsuario();

            if(result) return res.json({ ok: true });
            return res.status(400).json({ ok: false })
        } catch(err) {
            console.log(err);
            return res.status(500).json({ ok: false });
        }
    }

    logout(req, res) {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/"
        }).redirect('/');
    }
}