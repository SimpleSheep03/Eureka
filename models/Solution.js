import { Schema, models, model } from "mongoose";

const QuestionSchema = new Schema(
  {
    Question: {
      type: Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    acceptedCodeLink: {
      type: String,
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
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

  },
  {
    timestamps: true,
  }
);

const Question = models.Question || model("Question", QuestionSchema);

export default Question;
