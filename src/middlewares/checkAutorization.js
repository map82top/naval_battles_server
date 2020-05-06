import {verifyJWTToken} from "../utils";

export default (req, res, next) => {
    if (
        req.path === "/signin" ||
        req.path === "/signup"
    ) {
        return next();
    }

    const token = req.headers.token;

    if(!token) {
        res.status(404);
    }

    verifyJWTToken(token)
        .then(user => {
            req.user = user.data._doc;
            next();
        })
        .catch(err => {
            res.status(403).json({ description: "Вы не прошли авторизацию" });
        });
};