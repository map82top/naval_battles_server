import mongoose, {Schema} from "mongoose";

const PacksSchema = Schema(
    {
        user: {
            type: mongoose.ObjectId,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        main: {
            type: [mongoose.ObjectId],
            required: true
        },
        cost: {
            type: Number,
            required: true
        },
        reserve: {
            type: [mongoose.ObjectId],
            required: true
        }
    }
)

const Packs = mongoose.model("Packs", PacksSchema);
export default Packs;