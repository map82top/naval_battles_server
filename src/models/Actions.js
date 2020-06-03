import mongoose, {Schema} from "mongoose";

const ActionsSchema = Schema(
    {
        image: {
            type: String,
            required: true
        },
        damage: {
            type: Number,
            default: 0
        },
        levels: {
            type: [Number],
            required: true
        },
        type: {
            type: String,
            required: true
        },
        calibre: {
            type: String,
            required: false
        }
    }
)

const Actions = mongoose.model("Actions", ActionsSchema);
export default Actions;