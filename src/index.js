import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import {
    ActionsController,
    GamesController,
    PacksController,
    QueueController,
    ShipsController,
    UsersController
} from "./controllers";
import mongoose from "mongoose";
import {checkAutorization} from "./middlewares";
import {createServer} from "http"
import {createPackValidation, loginValidation, registrationValidation} from "./utils/validation";
import socket from "socket.io";
import cors from "cors"

const app = express();

let http =  createServer(app);
let io = socket(http, { origins: '*:*'})

dotenv.config();
const userController = new UsersController();
const shipsController = new ShipsController();
const actionsController = new ActionsController();
const packsController = new PacksController();
const gamesController = new GamesController(io);
const queueController = new QueueController(io, gamesController);

//middleware
app.use(cors({
    origin: true,
    credentials: true
}));
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
app.post('/ships/update', shipsController.update);
app.post("/actions/create", actionsController.create);

const PORT =  process.env.PORT || 30100;
http.listen(PORT, () => {
    console.log(`Server: http://loclhost:${process.env.PORT}`);
})