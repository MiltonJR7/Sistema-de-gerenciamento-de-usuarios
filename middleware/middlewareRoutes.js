
import JWT from 'jsonwebtoken';

export default function auth(req, res, next) {
    const token = req.cookies.token;
    
    if(!token) return res.status(201).redirect('/login');

    try {   
        const payload = JWT.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    } catch(err) {
        return res.status(401).redirect('/login');
    }
}

