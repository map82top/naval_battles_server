import {check} from "express-validator";

export default
[
    check("name")
        .notEmpty()
        .isLength({ min: 5 }),
    check("cost")
        .isInt()
]