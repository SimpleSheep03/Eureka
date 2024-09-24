import { Schema , models , model } from "mongoose";

const ContestSchema = new Schema({
    platform : {
        type : String,
        required : true
    },
    title : {
        type : String,
        required : true,
    },
    questions : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Question'
        }
    ]
},{
    timestamps : true
})

const Contest = models.Contest || model('Contest' , ContestSchema)

export default Contest