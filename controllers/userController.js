
import UserModel from "../models/userModel.js";

export default class UserController {
    loginView(req, res) {
        res.render('login/loginPage');
    }

    async login(req, res) {
        let ok = true;
        
        if(req.body.email !== null && req.body.senha !== null) {
            let banco = new UserModel();
            let result = await banco.logar(req.body.email, req.body.senha);

            if(result !== null) {
                res.send({ok: ok});
            } else {
                ok = false;
                res.send({ok: ok});
            }
        } else {
            ok = false;
            res.send({ok: ok});
        }
    }

    registerView(req, res) {
        res.render('register/registerPage');
    }
}