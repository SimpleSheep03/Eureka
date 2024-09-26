import Solution from "@/models/Solution";
import User from "@/models/User";
import { getSessionUser } from "@/utils/getSessionUser";

export const POST = async (request) => {
  try {
    const session = await getSessionUser();
    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized", ok: false }),
        { status: 401 }
      );
    }
    const data = await request.json();
    const { solutionId, value, handle } = data;
    if (!solutionId || !value || !handle || ![1, -1].includes(value)) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }
    const solution = await Solution.findById(solutionId);
    let user = await User.find({ username: handle });
    if (!solution || !user || user.length != 1) {
      return new Response(
        JSON.stringify({ message: "Incorrect input", ok: false }),
        { status: 400 }
      );
    }

    user = user[0];

    let reactions = user.reactions;

    let flag = 0;
    for (const reaction of reactions) {
      console.log(reaction, reaction._id);
      if (reaction._id.toString() === solutionId.toString()) {
        flag = 1; // Set flag if a matching reaction is found
      }
    }

    if (flag) {
      // Filter out the reaction and update the reactions array
      reactions = reactions.filter(
        (reaction) => reaction._id.toString() !== solutionId.toString()
      );
      solution.netUpvotes = solution.netUpvotes - 1; // Decrement the net upvotes
    } else {
      reactions.push({ _id: solutionId, value });
      solution.netUpvotes = solution.netUpvotes + 1;
    }

    user.reactions = reactions;

    await user.save();
    await solution.save();
    return new Response(
      JSON.stringify({
        message: "Successfully updated the reaction",
        ok: true,
        solution,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not update the reaction", ok: false }),
      { status: 500 }
    );
  }
};
