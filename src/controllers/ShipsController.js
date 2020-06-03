import {Ships} from "../models";

export default class ShipsController {
    create(req, res) {
        const postData = {
            image: req.query.image,
            name: req.query.name,
            country: req.query.country,
            cost: req.query.cost,
            hp: req.query.hp
        }
        console.log(postData)
        const ship = new Ships(postData);
        ship
            .save()
            .then((obj) => {
                return res.json({status: "success", description: "корабль создан!"});
            })
            .catch((reason) => {
                // console.log(reason);
                return res.status(500).json({ description: reason});
            });
    }

    update(req, res) {
        const postData = {
            image: req.query.image,
            name: req.query.name,
            country: req.query.country,
            cost: req.query.cost,
            hp: req.query.hp
        }
        Ships.findOneAndUpdate({name: postData.name}, {
            ...postData
        },(err, user) => {
            if (err || !user) {
                return res.status(404).json({
                    message: 'Данные не обновлены'
                });
            }
            res.json({
                message: 'Данные обновлены'
            });
    })}
}