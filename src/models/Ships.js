import mongoose, {Schema} from "mongoose";

const ShipsSchema = Schema(
    {
        image: {
            type: String,
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
        cost: {
            type: Number,
            required: true
        },
        hp: {
            type: Number,
            required: true
        }
    }
)

const Ships = mongoose.model("Ships", ShipsSchema);
export default Ships;