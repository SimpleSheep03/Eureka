import { Schema , models , model } from "mongoose";

const UserSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    image : {
        type : String,
        required : true
    },
    username : {
        type : String ,
    },
    popularity : {
        type : Number,
        default : 0
    }
},{
    timestamps : true
})

UserSchema.index({ username : 1 })

const User = models.User || model('User' , UserSchema)

export default User