import {Packs, Ships} from "../models";
import {validationResult} from "express-validator";

export default class PacksController {

    getPack(req, res) {
        const id = req.user && req.user._id;
        if(!req.body._id) {
            const fleetCountry = req.body.country
            Ships.find({country: fleetCountry}, (err, result) => {
                if(err || !result) {
                    return res.status(404).json({ description: "Ошибка создания колоды" });
                }
                const fleet = result.map(ship => ({
                    _id: ship._id,
                    image: ship.image,
                    cost: ship.cost,
                    hp: ship.hp
                }));

                res.json({
                    country: fleetCountry,
                    main: [],
                    reserve: fleet,
                    cost: 0,
                    name: ""
                });
            })
        } else {
            let real_main = [];
            Packs.findById(req.body._id, (err, result) => {
                if(err || !result) {
                    return res.status(404).json({ description: "Ошибка получения колоды" });
                }

                Promise.all([Ships.find({_id: { $in: result.reserve }}).exec(),  Ships.find({_id: { $in: result.main }}).exec()])
                        .then(
                            results => {
                                res.json({
                                    _id: result._id,
                                    country: result.country,
                                    name: result.name,
                                    cost: result.cost,
                                    main: results[1].map(ship => {
                                        return {
                                            _id: ship._id,
                                            image: ship.image,
                                            cost: ship.cost,
                                            hp: ship.hp
                                        }
                                    }),
                                    reserve: results[0].map(ship => {
                                        return {
                                            _id: ship._id,
                                            image: ship.image,
                                            cost: ship.cost,
                                            hp: ship.hp
                                        }
                                    }),
                                    user: result.user
                                });
                            },
                            error => {
                                res.status(500).json({description: "Не удалось загрузить выбранную колоду!"})
                            })
            })
        }
    }

    savePack(req, res) {
        if(!req.body) {
            res.json(500).json({description: "Не найдено тело запроса"})
        }

        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(500).json({ status: "error", description: "Получены некорректные данные!" });
        }

        let postData = {
            user:  req.user._id,
            name: req.body.name,
            country: req.body.country,
            cost: req.body.cost,
            main: req.body.main.map(card => card._id),
            reserve: req.body.reserve.map(card => card._id)
        }

        if(req.body._id) {
            Packs
                .updateOne({_id: req.body._id}, postData)
                .then(() => {
                    return res.json({status: "success", description: "Колода сохранена!"});
                })
                .catch((reason) => {
                    console.log(reason);
                    return res.status(500).json({ description: "Не удалось сохранить колоду!"});
                });
        } else {
            const pack =  new Packs(postData);
            pack
                .save()
                .then(() => {
                    return res.json({status: "success", description: "Колода сохранена!"});
                })
                .catch((reason) => {
                    console.log(reason);
                    return res.status(500).json({ description: "Не удалось сохранить колоду!"});
                });
        }
    }

    deletePack(req, res) {
        if(!req.body) {
            res.json(500).json({description: "Не найдено тело запроса"})
        }
        let id =  req.body._id;
        Packs
            .deleteOne({ _id: id})
            .then(() => {
                return res.json({status: "success", description: "Колода удалена!"});
            })
            .catch((err) => {
                console.log(err);
                return res.status(500).json({ description: "Не удалось удалить колоду!"});
            })
    }

    getUserPacks(req, res) {
        const id = req.user && req.user._id;
        Packs.find({user: id}, (err, result) => {
            if (err || !result) {
                return res.status(404).json({
                    description: 'Данные о пользователе не найдены'
                });
            }

            return res.json(result.map(pack => ({
                _id: pack._id,
                country: pack.country,
                name: pack.name
            })));
        });
    }
}