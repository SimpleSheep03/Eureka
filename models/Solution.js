import { Schema, models, model } from "mongoose";

const SolutionSchema = new Schema(
  {
    question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    acceptedCodeLink: {
      type: String,
    },
    additionalLinks : {
      type : String,
    },
    heading: {
      type: String,
      required: true,
    },
    solutionText: {
      type: String,
      required: true,
    },
    solutionHints: [
      {
        type: String,
      },
    ],
    netUpvotes: {
      type: Number,
      default: 0,
    },
    User: {
      type: String,
      required : true,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
    contestDate : {
      type : String,
      required : true
    }

  },
  {
    timestamps: true,
  }
);

SolutionSchema.index({ question : 1 })

const Solution = models.Solution || model("Solution", SolutionSchema);

export default Solution;
