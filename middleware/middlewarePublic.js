
import JWT from 'jsonwebtoken';

export default function auth(req, res, next) {
    const token = req.cookies.token;

    try {   
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        if(!req.user.id) return res.status(400).redirect('/');
        return next();
    } catch(err) {
        return next();
    }
    
}

