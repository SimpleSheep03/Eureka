import connectDB from "@/config/database";
import Question from "@/models/Question";
import Solution from "@/models/Solution";
import User from "@/models/User";

export const POST = async (request) => {
  try {
    const data = await request.json();
    const { questionId, size, handle } = data;
    const actualSize = size || 5;

    await connectDB();

    let reactions = [];
    
    if (handle) {
      let user = await User.find({ username: handle });
      if (user.length != 1) {
        return new Response(
          JSON.stringify({ message: "Incorrect input", ok: false }),
          { status: 400 }
        );
      }

      reactions = user[0].reactions
    }
    
    if (questionId) {
      const question = await Question.findById(questionId);
      if (!question) {
        return new Response(
          JSON.stringify({ message: "Incorrect input", ok: false }),
          { status: 400 }
        );
      }
      const solutions = await Solution.find({ question: questionId })
        .sort({ netUpvotes: -1 })
        .limit(actualSize);

      return new Response(
        JSON.stringify({
          message: "Solutions fetched successfully",
          ok: true,
          solutions,
          reactions
        }),
        { status: 200 }
      );
    }

    const solutions = await Solution.find()
      .sort({ netUpvotes: -1 })
      .limit(actualSize);

    return new Response(
      JSON.stringify({
        message: "Solutions fetched successfully",
        ok: true,
        solutions,
        reactions
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not fetch solutions", ok: false }),
      { status: 500 }
    );
  }
};
