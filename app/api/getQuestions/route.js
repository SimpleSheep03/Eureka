import connectDB from "@/config/database";
import Contest from "@/models/Contest";
import Question from "@/models/Question";

export const GET = async (request) => {
  try {
    // Extract the query parameters from the URL
    const { searchParams } = new URL(request.url);
    const contestId = searchParams.get("contestId"); // Get 'contestId' from query params

    if (!contestId) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }

    await connectDB(); // Connect to database

    const contest = await Contest.findById(contestId).populate({
      path: "questions", // Name of the field in Contest that holds the array of question _ids
      model: "Question", // The model you're populating from (Question model)
    });

    if (!contest) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Fetched the questions",
        ok: true,
        questions: contest.questions,
        contestName: contest.title,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error occurred:", error);
    return new Response(
      JSON.stringify({ message: "An error occurred", ok: false }),
      { status: 500 }
    );
  }
};

export const POST = async (request) => {
  try {
    const data = await request.json();
    const { size, pageNo } = data;

    await connectDB();

    const actualSize = size || 3;

    // console.log(await Question.estimatedDocumentCount())

    if (pageNo) {
      const questions = await Question.find()
        .sort({ requestedBy: -1, contestDate: -1 })
        .skip((pageNo - 1) * 10)
        .limit(actualSize);

      return new Response(
        JSON.stringify({
          message: "Questions fetched successfully",
          ok: true,
          questions,
          lastPage: await Question.estimatedDocumentCount() == (pageNo - 1) * actualSize + questions.length,
        }),
        { status: 200 }
      );
    }

    const questions = await Question.find()
      .sort({ requestedBy: -1, contestDate: -1 })
      .limit(actualSize);

    return new Response(
      JSON.stringify({
        message: "Questions fetched successfully",
        ok: true,
        questions,
      }),
      { status: 200 }
    );
    
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not fetch questions", ok: false }),
      { status: 500 }
    );
  }
};
