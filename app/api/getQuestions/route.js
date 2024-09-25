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

    // Find the contest by its ID
    const contest = await Contest.findById(contestId);
    if (!contest) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 404 }
      );
    }

    // Fetch questions associated with the contest
    const questions = await Question.find({ contest: contestId });

    return new Response(
      JSON.stringify({
        message: "Fetched the questions",
        ok: true,
        questions,
        contestName : contest.title
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
