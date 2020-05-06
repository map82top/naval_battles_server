import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {PacksController, ShipsController, UsersController} from "./controllers";
import mongoose from "mongoose";
import {checkAutorization} from "./middlewares";
import {createPackValidation, loginValidation, registrationValidation} from "./utils/validation";

const app = express();
dotenv.config();

const userController = new UsersController();
const shipsController = new ShipsController();
const packsController = new PacksController();

//middleware
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(checkAutorization)


mongoose.connect('mongodb://localhost:27017/naval_battles', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

app.post('/signup', registrationValidation, userController.create);
app.post('/signin', loginValidation, userController.login);
app.get('/user/get_data', userController.getData);
app.get('/packs/get_all_user_packs', packsController.getUserPacks);
app.post('/packs/get_pack', packsController.getPack);
app.post('/packs/save_pack', createPackValidation, packsController.savePack);
app.post('/packs/delete_pack', packsController.deletePack);

//filling
app.post('/ships/create', shipsController.create);

const PORT =  process.env.PORT || 3003;
app.listen(PORT, () => {
    console.log(`Server: http://localhost:${process.env.PORT}`);
})