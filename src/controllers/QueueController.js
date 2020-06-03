import Timer from "easytimer.js"
import crypto from "crypto";

export default class QueueController {
    constructor(io, gamesController) {
        this.gamesController = gamesController
        io
           .of('/queue')
           .on('connection', (socket) => {
               socket.on('JOIN', data => {
                   if (this.currentUserData !== undefined && this.currentUserData.user._id !== data.user._id) {
                       let id = crypto.randomBytes(20).toString('hex')
                       const callback_create_battle = () => {
                           io.of('/queue').emit('CREATE_BATTLE', id)
                           this.currentUserData = undefined
                           this.currentWaitTimer && this.currentWaitTimer.pause()
                           this.currentWaitTimer = undefined
                       }

                       this.gamesController.push({
                           id: id,
                           initData: {
                               oneClient: data,
                               twoClient: this.currentUserData
                           }
                       }, callback_create_battle)

                   } else if (this.currentUserData === undefined) {
                       this.currentUserData = data;
                       this.currentWaitTimer = new Timer()
                       this.currentWaitTimer.start({
                           callback: () => {
                               let time = this.currentWaitTimer.getTimeValues().toString(['minutes', 'seconds'])
                               io.of('/queue').emit("TIME", time)
                           }
                       })
                   }
               })

               socket.on('EXIT', () => {
                   this.currentUserData = undefined;
                   this.currentWaitTimer && this.currentWaitTimer.stop()
                   this.currentWaitTimer = undefined
                   socket.emit('ALLOW_EXIT')
               })
           })
    }
}