import GameController from "./GameController";

export default class GamesController {
    constructor(io) {
        this.io = io
        this.games = {}
    }

    push({ id, initData }, callback) {
        let gameController = new GameController(this.io, id, initData, callback, this.delete)
        this.games[id] = gameController
    }

    delete(id) {
        this.games && delete this.games[id]

    }

}