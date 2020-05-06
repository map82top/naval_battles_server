import {check} from "express-validator";

export default
[
    check("email")
        .notEmpty()
        .isEmail(),
    check("password")
        .notEmpty()
        .isLength({ min: 6 })
        .matches("(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z])[0-9!@#$%^&*a-zA-Z]{6,}", "g")
]