import {Users} from "../models";
import {validationResult} from "express-validator";
import bcrypt from "bcrypt";
import {createJWTToken} from "../utils";


export default class UsersController {
    getData(req, res) {
        const id = req.user && req.user._id;
        Users.findById(id, (err, user) => {
            if (err || !user) {
                return res.status(404).json({
                    message: 'Данные о пользователе не найдены'
                });
            }
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email
            });
        });
    }

    create(req, res) {
        let postData = {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        };

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(500).json({ status: "error", description: "Введены некорректные данные!" });
        }

        const user = new Users(postData);
        user
            .save()
            .then((obj) => {
                return res.json({status: "success", description: "Аккаунт создан!"});
            })
            .catch((reason) => {
                console.log(reason);
                return res.status(500).json({ description: reason});
            });
    }

    login(req, res) {
        const postData = {
            email: req.body.email,
            password: req.body.password
        }

        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            return res.status(500).json({ errors: errors.array() });
        }

        Users.findOne({email: postData.email}, (err, user) => {
            if(err || !user) {
                return res.status(404).json({
                    description: 'Некорректный логин или пароль!'
                });
            }

            if(bcrypt.compareSync(postData.password, user.password)) {
                const token = createJWTToken(user);
                res.json({
                    status: "success",
                    description: "Вы успешно вошли в аккаунт!",
                    token
                });

            } else {
                return res.status(500).json({ description: 'Некорректный логин или пароль!' });
            }
        })
    }
}