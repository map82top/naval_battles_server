import {check} from "express-validator";

export default
    [
        check("username")
            .notEmpty()
            .isLength({ min: 5 })
            .matches("[A-z0-9]+", 'i'),
        check("email")
            .notEmpty()
            .isEmail(),
        check("password")
            .notEmpty()
            .isLength({ min: 6 })
            .matches("(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9!@#$%^&*a-zA-Z]{6,}", "g")
    ]