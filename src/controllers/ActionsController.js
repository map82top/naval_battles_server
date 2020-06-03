import {Actions} from "../models";

export default class ShipsController {
    create(req, res) {
        const postData = {
            image: req.query.image,
            damage: req.query.damage,
        }
        console.log(postData)
        const action = new Actions(postData);
        action
            .save()
            .then((obj) => {
                return res.json({status: "success", description: "действие создан!"});
            })
            .catch((reason) => {
                // console.log(reason);
                return res.status(500).json({ description: reason});
            });
    }

}