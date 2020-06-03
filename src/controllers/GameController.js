import {Actions, Packs, Ships} from "../models";
import Timer from "easytimer.js"
import {randomInt} from "../utils/random";
import GameStatuses from "../utils/GameStatuses";
import crypto from "crypto";

export default class GameController {

    constructor(io, id, initData, callback) {
        if(initData === undefined) return;

        this.io = io
        this.id = id
        this.gameStatus = GameStatuses.PLACING
        let oneId = initData.oneClient ? initData.oneClient.user._id : undefined
        let twoId = initData.twoClient ? initData.twoClient.user._id : undefined
        this.clients = {}
        this.gameState = {}

        this.initializeUser(oneId, initData.oneClient)
        this.initializeUser(twoId, initData.twoClient)
        this.loadActions()

        io
            .of('/battle/' + this.id)
            .on('connection', (socket) => {
                console.log("connection")
                if(this.gameStatus === GameStatuses.PLACING) {
                    socket.emit('PLACING_START')
                }

                socket.on('LOAD_BATTLE', ({userId, battleId}) => {
                    if(userId in this.clients) {
                        this.addSocketToClient(userId, socket)
                        this.sendSnapshotToUser(userId)
                    }
                })

                socket.on('MOVE_SHIP_CARD', data => {
                    if((data.userId in this.clients)){
                        if(data.from.name === data.to.name) return;

                        if(this.moveShipIsAvailable(this.gameState[data.userId], data)) {
                            const resultMove = this.moveCard(data)
                            if(this.allShipCardIsPlaced()) {
                                this.timer.stop()
                                this.sendBroadcastSnapshot()
                                this.initializeBattle()
                            }

                            this.sendAllowMoveMessage(socket, data, resultMove)

                        } else {
                            this.sendAllowMoveMessage(socket, data,{
                                from_array: this.gameState[data.userId][data.from.name],
                                to_array: this.gameState[data.userId][data.to.name]
                            })
                        }
                    }
                })

                socket.on('ATTACK_MOVE_CARD', (data) => {
                    data.to.name = data.to.name.substr(6)
                    const {userId, from, to} = data
                    if(userId in this.clients && this.currentClient.user._id === userId) {
                        const userState = this.gameState[data.userId]
                        const handsActions = userState[data.from.name]

                        if(handsActions === undefined) {
                            this.sendMoveAttackReject(socket, data)
                            return
                        }
                        const action  =  handsActions[data.from.index]
                        if(action === undefined) {
                            this.sendMoveAttackReject(socket, data)
                            return
                        }

                        if(this.actionIsAvailable(action, data.to.name)) {
                            const enemyState = this.gameState[this.nextClient.user._id]
                            if(enemyState === undefined) {
                                this.sendMoveAttackReject(socket, data)
                                return
                            }

                            const enemyShipRow = enemyState[data.to.name]
                            if(enemyShipRow === undefined) {
                                this.sendMoveAttackReject(socket, data)
                                return
                            }
                            const enemyShip = enemyShipRow[data.to.index]
                            if(enemyShip === undefined) {
                                this.sendMoveAttackReject(socket, data)
                                return
                            }

                            if(enemyShip.defence_actions && enemyShip.defence_actions.length > 0 ) {
                                const actionsRow = enemyState["actions_row"]
                                if(this.haveEqualAction(actionsRow, enemyShip.defence_actions, action.calibre)) {
                                    this.sendMoveAttackReject(socket, data)
                                    return
                                }
                            }

                            enemyShip.hp -= action.damage
                            handsActions.splice(data.from.index, 1)

                            if(enemyShip.hp <= 0) {
                                const [removed] = enemyShipRow.splice(data.to.index, 1)
                                userState.points += removed.cost
                                if(removed.defence_actions) {
                                    for(let defence_action of removed.defence_actions) {
                                        this.removeFromActions(defence_action)
                                    }
                                }
                            }

                            if(enemyShipRow.length === 0) {
                                if(data.to.name === "row_1") {
                                    enemyState["row_1"] =  enemyState["row_2"]
                                    enemyState["row_2"] =  enemyState["row_3"]
                                    enemyState["row_3"] =  []

                                } else if(data.to.name === "row_2") {
                                    enemyState["row_2"] =  enemyState["row_3"]
                                    enemyState["row_3"] =  []

                                }

                                this.sendBroadcastSnapshot()

                            } else {
                                this.sendAllowAttack(socket, action, data, {
                                    from_array: handsActions,
                                    to_array: enemyShipRow,
                                    points: userState.points,
                                    enemy_actions_row: enemyState["actions_row"]
                                })
                            }

                            if(userState.points >= 20) {
                                this.clients = {}
                                this.gameState = {}

                                socket.emit('YOU_WIN')
                                socket.broadcast.emit('YOU_LOSE')
                            }

                            console.log("send action")

                        } else {
                            this.sendMoveAttackReject(socket, data)
                        }

                    } else {
                        this.sendMoveAttackReject(socket, data)
                    }
                })

                socket.on('DEFENCE_MOVE_CARD', (data) => {
                    const {userId, from, to} = data
                    if(userId in this.clients && this.currentClient.user._id === userId) {
                        const userState = this.gameState[data.userId]
                        const handsActions = userState[data.from.name]

                        if(handsActions === undefined) {
                            this.sendMoveDefenceReject(socket, data)
                            return
                        }
                        const action  =  handsActions[data.from.index]
                        if(action === undefined) {
                            this.sendMoveDefenceReject(socket, data)
                            return
                        }
                        if(this.actionIsAvailable(action, to.name)) {
                            const shipRow = userState[data.to.name]
                            if(shipRow === undefined) {
                                this.sendMoveDefenceReject(socket, data)
                                return
                            }

                            const userShip = shipRow[data.to.index]
                            if(userShip === undefined) {
                                this.sendMoveDefenceReject(socket, data)
                                return
                            }

                            if(userShip.defence_actions === undefined) {
                                userShip.defence_actions = [action.hash]
                            } else {
                                userShip.defence_actions.push(action.hash)
                            }

                            const [removed] = handsActions.splice(from.index, 1)
                            const actionsRow = userState["actions_row"]
                            actionsRow.splice(actionsRow.length, 0, removed)

                            this.sendAllowMoveDefenceCard(socket, data, {
                                from_array: handsActions,
                                to_array: actionsRow,
                                start_element_hash: action.hash,
                                end_element_hash: userShip.hash
                            })
                        }
                    } else {
                        this.sendMoveAttackReject(socket, data)
                    }
                })

                socket.on('END_TURN', ({userId}) => {

                    if(userId in this.clients && this.gameStatus === GameStatuses.BATTLE && this.currentClient.user._id === userId) {
                        this.changeTurn()
                    }
                })
            })


        this.timer = new Timer()
        this.timer.start({countdown: true, startValues: {seconds: 90}, callback: timer => {
                let time = timer.getTimeValues().toString(['minutes', 'seconds'])
                this.io.of('/battle/' + this.id).emit("TIME", time)
                if(this.timeIsEnd(timer)) {
                    this.timer.stop()
                    this.randomPlacePlacingCards()
                    this.sendBroadcastSnapshot()
                    this.initializeBattle()
                }
            }});

        callback()
    }

    removeFromActions(action_hash) {
        const userAction = this.gameState[this.nextClient.user._id]
        for(let action of userAction.actions_row) {
            if(action.hash === action_hash) {
                let indexElement =  userAction.actions_row.indexOf(action)
                userAction.actions_row.splice(indexElement, 1)
            }
        }
    }

    allShipCardIsPlaced() {
        for(let clientId in this.gameState) {
            if(!this.gameState[clientId].placing_ships_row) {
                return false
            }

            if(this.gameState[clientId].placing_ships_row.length !== 0) {
                return false
            }
        }

        return true
    }

    haveEqualAction(actionsRows, defenceActions, calibre) {
        for(let hash of defenceActions) {
            let action = this.findAction(actionsRows, hash)
            if(action.calibre === "ALL" || action.calibre === calibre) return true
        }

        return false
    }

    findAction(actionsRows, hash) {
        for(let action of actionsRows) {
            if(action.hash === hash) return action
        }

        return undefined
    }

    moveCard(data) {
        let from_array = Array.from(this.gameState[data.userId][data.from.name])
        let to_array =  Array.from(this.gameState[data.userId][data.to.name])

        const [removed] = from_array.splice(data.from.index, 1);
        to_array.splice(data.to.index, 0, removed);

        this.gameState[data.userId][data.from.name] = from_array
        this.gameState[data.userId][data.to.name] = to_array

        if(this.gameStatus === GameStatuses.BATTLE) {
            removed.blocked = true
        }

        return {
            from_array: from_array,
            to_array: to_array
        }
    }

    sendMoveAttackReject(socket, data) {
        socket.emit('ALLOW_ATTACK', {
            from: {
                name: data.from.name,
                index: data.from.index,
                state: this.mapActionToSendUser(this.gameState[this.currentClient.user._id][data.from.name])
            },
            to: {
                name: "enemy_" + data.to.name,
                index: data.to.index,
                state: this.mapShipToSendUser(this.gameState[this.nextClient.user._id][data.to.name])
            }
        })
    }

    sendMoveDefenceReject(socket, data) {
        socket.emit('ALLOW_DEFENCE_CARD', {
            from: {
                name: data.from.name,
                state: this.mapActionToSendUser(this.gameState[this.currentClient.user._id][data.from.name]),
                index: data.from.index
            },
            to: {
                name: "actions_row",
                state: this.mapActionToSendUser(this.gameState[this.currentClient.user._id][data.from.name]),
                index: data.to.index
            },
        })
    }

    sendAllowMoveDefenceCard(socket, data, result) {
        socket.emit('ALLOW_DEFENCE_CARD', {
            from: {
                name: data.from.name,
                state: this.mapActionToSendUser(result.from_array),
                index: data.from.index
            },
            to: {
                name: "actions_row",
                state: this.mapActionToSendUser(result.to_array),
                index: result.to_array.length - 1
            },
            protected: {
                name: data.to.name,
                index: data.to.index,
            }
        })

        socket.broadcast.emit('ALLOW_DEFENCE_CARD', {
            from: {
                name: "enemy_" + data.from.name,
                state: this.mapActionToSendUser(result.from_array),
                index: data.from.index
            },
            to: {
                name: "enemy_actions_row",
                state: this.mapActionToSendUser(result.to_array),
                index: result.to_array.length - 1
            },
            protected: {
                name: "enemy_" + data.to.name,
                index: data.to.index,
            }
        })
    }

    sendAllowAttack(socket, action, data, result) {
        socket.emit('ALLOW_ATTACK', {
            action: action,
            from: {
                name: data.from.name,
                state: this.mapActionToSendUser(result.from_array)
            },
            to: {
                name: "enemy_" + data.to.name,
                index: data.to.index,
                state: this.mapShipToSendEnemy(result.to_array)
            },
            enemy_actions_row: this.mapActionToSendUser(result.enemy_actions_row),
            user_points: result.points
        })

        socket.broadcast.emit('ALLOW_ATTACK', {
            action: action,
            from: {
                name: "enemy_" + data.from.name,
                state: this.mapActionToSendEnemy( "enemy_" + data.from.name, result.from_array)
            },
            to: {
                name: data.to.name,
                index: data.to.index,
                state: this.mapShipToSendUser(result.to_array)
            },
            enemy_points: result.points,
            actions_row: this.mapActionToSendEnemy("actions_row", result.enemy_actions_row),
        })
    }

    sendAllowMoveMessage(socket, data, result) {
        socket.emit('ALLOW_MOVE_SHIP_CARD', {
            from: {
                name: data.from.name,
                state: this.mapShipToSendUser(result.from_array)
            },
            to: {
                name: data.to.name,
                state: this.mapShipToSendUser(result.to_array)
            }
        })
        socket.broadcast.emit('ALLOW_MOVE_SHIP_CARD', {
            from: {
                name: "enemy_" + data.from.name,
                state: this.mapShipToSendEnemy(result.from_array)
            },
            to: {
                name: "enemy_" + data.to.name,
                state: this.mapShipToSendEnemy(result.to_array)
            }
        })
    }

    initializeBattle() {
        let clientsArray = []
        for(let user_game_state_name in this.clients) {
            if(this.gameState.hasOwnProperty(user_game_state_name)) {
                let userId = this.clients[user_game_state_name].user._id
                this.fillHandsActions(userId)
                clientsArray.push(this.clients[user_game_state_name])
            }
        }

        this.currentClient = clientsArray[0]
        this.nextClient = clientsArray[1]
        this.gameStatus = "BATTLE"
        this.io.of('/battle/' + this.id).emit('START_BATTLE')
        setTimeout(() => {
            this.currentClient.socket.emit('YOUR_TURN')
            this.currentClient.socket.broadcast.emit('ENEMY_TURN')
        }, 2000)

        this.sendBroadcastSnapshot()

        this.timer = new Timer()
        this.timer.start({countdown: true, startValues: {seconds: 180}, callback: timer => {
                let time = timer.getTimeValues().toString(['minutes', 'seconds'])
                this.io.of('/battle/' + this.id).emit("TIME", time)
                if(this.timeIsEnd(timer)) {
                    this.changeTurn()
                }
            }});
    }

    changeTurn() {
        const client = this.currentClient

        this.currentClient = this.nextClient
        this.nextClient = client;
        this.fillHandsActions(this.currentClient.user._id)
        this.fillHandsActions(this.nextClient.user._id)
        this.resetTurnState(this.currentClient.user._id)

        this.sendBroadcastSnapshot()
        this.currentClient.socket.emit('YOUR_TURN')
        this.currentClient.socket.broadcast.emit('ENEMY_TURN')

        this.timer.stop()
        this.timer = new Timer()
        this.timer.start({countdown: true, startValues: {seconds: 180}, callback: timer => {
                let time = timer.getTimeValues().toString(['minutes', 'seconds'])
                this.io.of('/battle/' + this.id).emit("TIME", time)
                if(this.timeIsEnd(timer)) {
                    this.changeTurn()
                }
            }});
    }

    resetTurnState(userId) {
        const userState = this.gameState[userId]
        userState["actions_row"] = []
        for(let ship of userState["row_1"]) {
            ship.blocked = false
            ship.defence_actions = []
        }

        for(let ship of userState["row_2"]) {
            ship.blocked = false
            ship.defence_actions = []
        }

        for(let ship of userState["row_3"]) {
            ship.blocked = false
            ship.defence_actions = []
        }

    }

    fillHandsActions(userId) {
        let handsActions = this.gameState[userId].hands_actions
        if(handsActions !== undefined) {
            let actions_in_hand = handsActions.length
            for(; actions_in_hand < 7; actions_in_hand++) {
                let indexAction = randomInt(0, this.actions.length)
                let action = this.actions[indexAction]
                handsActions.push({
                    hash: this.generateHash(),
                    _id: action._id,
                    damage: action.damage,
                    image: action.image,
                    levels: action.levels,
                    type: action.type,
                    calibre: action.calibre
                })
            }
        }
    }

    randomPlacePlacingCards() {
        for(let user_game_state_name in this.gameState) {
            let user_game_state = this.gameState[user_game_state_name]
            if(user_game_state.placing_ships_row.length !== 0) {
                for(let ship of user_game_state.placing_ships_row) {
                    this.moveShipToShortestRow(ship, user_game_state)
                }
                user_game_state["placing_ships_row"] = []
            }
        }
    }

    sendBroadcastSnapshot() {
        for(let user_state_name in this.clients) {
            if(this.clients.hasOwnProperty(user_state_name)) {
                this.sendSnapshotToUser(this.clients[user_state_name].user._id)
            }
        }
    }

    sendSnapshotToUser(userId) {
        let sendingState = {}
        for(let user_id_in_state in this.gameState) {
            if(this.gameState.hasOwnProperty(user_id_in_state)) {
                if(user_id_in_state === userId) {
                    sendingState = {...sendingState, ...this.getUserState(this.gameState[user_id_in_state])}
                } else {
                    sendingState = {...sendingState, ...this.getEnemyState(this.gameState[user_id_in_state])}
                }
            }
        }

        this.clients[userId].socket.emit('GAME_SNAPSHOT', sendingState)

    }

    getUserState(user_game_state) {
        let mappingState = {}
        mappingState.user_points = user_game_state.points
        for(let row_name in user_game_state) {
            if(user_game_state.hasOwnProperty(row_name)) {
                let row = user_game_state[row_name]

                if(this.isShipRow(row_name)) {
                    mappingState[row_name] = this.mapShipToSendUser(row)

                } else if(this.isActionRow(row_name)) {
                    mappingState[row_name] = this.mapActionToSendUser(row)
                }
            }
        }

        return mappingState
    }

    mapShipToSendUser(ship_row) {
        if(!ship_row) return []
        return ship_row.map(ship => ({
            _id: ship._id,
            image: ship.image,
            hp: ship.hp,
            blocked: ship.blocked,
            hash: ship.hash
        })) }

    mapActionToSendUser(actions_row) {
        if(!actions_row) return []
        return actions_row.map(action => ({
            _id: action._id,
            image: action.image,
            hash: action.hash,
            levels: action.levels,
            type: action.type
        }))
    }

    getEnemyState(enemy_game_state) {
        let mappingState = {}
        mappingState.enemy_points = enemy_game_state.points
        for(let row_name in enemy_game_state) {
            if(enemy_game_state.hasOwnProperty(row_name)) {
                let row = enemy_game_state[row_name]
                if(this.isShipRow(row_name)) {
                    mappingState["enemy_" + row_name] = this.mapShipToSendEnemy(row)
                } else if(this.isActionRow(row_name)) {
                    mappingState["enemy_" + row_name] = this.mapActionToSendEnemy(row_name, row)
                }
            }
        }
        return mappingState
    }

    mapShipToSendEnemy(ship_row) {
        if(!ship_row) return []
        return ship_row.map(ship => ({
            _id: ship._id,
            image: ship.image,
            hp: ship.hp,
            hash: ship.hash
        }))
    }
    mapActionToSendEnemy(row_name, action_row) {
        if(!action_row) return []
        if(row_name === "actions_row") {
            return action_row.map(action => ({
                _id: action._id,
                image: action.image,
                hash: action.hash
            }))

        } else if(row_name === "hands_actions") {
           return  action_row.map(action => ({
                _id: action._id,
                image: "action_empty.png",
                hash: action.hash
            }))
        }

        return []
    }

    initializeUser(userId, initData) {
        if(userId !== undefined) {
            this.clients[userId] = initData
            this.gameState[userId] = this.initializeUserState()

            if(initData.pack !== undefined) {
                this.getPlacingShips(initData.pack._id)
                    .then(ships => {
                        this.gameState[userId].placing_ships_row = ships.map(ship => ({
                            ...ship,
                            blocked: false,
                            hash: this.generateHash()
                        }))
                    })
            }
        }
    }

    initializeUserState() {
        return {
            points: 0,
            row_1: [],
            row_2: [],
            row_3: [],
            hands_actions: [],
            actions_row: [],
            placing_ships_row: []
        }
    }

     addSocketToClient(userId, socket) {
        this.clients[userId].socket = socket
    }

    isShipRow(row_name) {
        return ["row_1", "row_2", "row_3", "placing_ships_row"].indexOf(row_name) !== -1
    }

    isActionRow(row_name) {
        return ["hands_actions", "actions_row"].indexOf(row_name) !== -1
    }

    moveShipToShortestRow(ship, user_game_state) {
        let rows = [user_game_state.row_1, user_game_state.row_2, user_game_state.row_3]
        let rows_length = [user_game_state.row_1.length, user_game_state.row_2.length, user_game_state.row_3.length]
        let minIndex = rows_length.reduce((iMin, x, i, arr) => x < arr[iMin] ? i : iMin, 0)
        rows[minIndex].push(ship)
    }

    moveShipIsAvailable(ships, data_move) {
        if(data_move.from.index !== undefined && data_move.from.name !== undefined) {
            const ship = ships[data_move.from.name][data_move.from.index]
            if(!ship) {
                return false;
            }

            if(!ship.blocked) {
                if(data_move.to.name === "row_1") {
                    return this.isAvailableMoveToFirstRow(ships, data_move.from.name)
                } else if(data_move.to.name === "row_2") {
                    return this.isAvailableMoveToSecondRow(ships, data_move.from.name)
                } else if(data_move.to.name === "row_3") {
                    return this.isAvailableMoveToThirdRow(ships, data_move.from.name)
                }
            }
        }

        return false
    }

    actionIsAvailable(action, destinationRowName) {
        const availableLevels = []
        for(let level of action.levels) {
            // eslint-disable-next-line default-case
            switch (level) {
                case 0:
                    availableLevels.push("row_1")
                    availableLevels.push("row_2")
                    availableLevels.push("row_3")
                    break;
                case 1:
                    availableLevels.push("row_1")
                    break;
                case 2:
                    availableLevels.push("row_2")
                    break
                case 3:
                    availableLevels.push("row_3")
                    break
            }
        }

        return availableLevels.includes(destinationRowName)
    }

    isAvailableMoveToFirstRow(ships, source_name) {
        let minValue = (source_name === "row_2" &&  ships.row_3.length !== 0) ? 1 : 0
        return ships["row_2"].length > minValue || ships["row_2"].length === 0
    }

    isAvailableMoveToSecondRow(ships, source_name) {
        let minValue = (source_name === "row_1") ? 1 : 0
        return ships["row_1"].length > minValue
    }

    isAvailableMoveToThirdRow(ships, source_name) {
        let minFirstValue = source_name === "row_1" ? 1 : 0
        let minSecondValue = source_name === "row_2" ? 1 : 0

        return ships["row_1"].length > minFirstValue && ships["row_2"].length > minSecondValue
    }

    getPlacingShips(packId) {
        return new Promise(((resolve, reject) => {
            if(packId === undefined) return []

            Packs.findById(packId, (err, result) => {
                if(err || !result) {
                    resolve([])
                }

                Ships.find({_id: { $in: result.main }}, (err, result) => {
                    if(err || !result) {
                        resolve([])
                    }

                    resolve(result.map(ship => {
                        return {
                            _id: ship._id,
                            image: ship.image,
                            cost: ship.cost,
                            hp: ship.hp,
                        }
                    }))
                })
            })
        }))
    }

    timeIsEnd(timer) {
        return timer.getTimeValues().minutes === 0 && timer.getTimeValues().seconds === 0
    }

    loadActions() {
        Actions.find({}, (err, actions) => {
            if(err || !actions) {
                this.actions = []
            }

            this.actions = actions
        })
    }

    generateHash() {
       return crypto.randomBytes(20).toString('hex')
    }
}

