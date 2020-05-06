import mongoose, {Schema} from "mongoose";
import {generatePasswordHash} from "../utils";

const UserSchema =  new Schema(
    {
        username: {
            type: String,
            required: [true, "Username required"]
        },
        email: {
            type: String,
            required: [true, "Email required"],
            unique: true
        },
        password: {
            type: String,
            required: [true, "Password required"]
        },
    },
    {
        timestamps: true
    }
);

UserSchema.pre('save', async function(next) {
    const user = this;

    if (!user.isModified('password')) {
        return next();
    }

    user.password = await generatePasswordHash(user.password);
});

const Users = mongoose.model("Users", UserSchema)
export default Users;