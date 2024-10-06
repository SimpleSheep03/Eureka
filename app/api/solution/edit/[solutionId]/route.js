import Solution from "@/models/Solution";
import { getSessionUser } from "@/utils/getSessionUser";

export const POST = async (request , { params }) => {
  try {

    const { solutionId } = params

    const session = await getSessionUser();
    const data = await request.json();
    const {
      User,
      heading,
      solutionHints,
      solutionText,
      additionalLinks,
      acceptedCodeLink,
      preRequisites,
    } = data;

    if (!User || !heading || solutionHints.length > 5 || !solutionText) {
      return new Response(
        JSON.stringify({ message: "Fill all the fields", ok: false }),
        { status: 400 }
      );
    }

    if (!session || User != session.username) {
      return new Response(
        JSON.stringify({
          message: "Unauthorized",
          ok: false,
        }),
        { status: 401 }
      );
    }

    const solution = await Solution.findById(solutionId)
    solution.heading = heading
    solution.preRequisites = preRequisites
    solution.solutionHints = solutionHints
    solution.solutionText = solutionText
    solution.acceptedCodeLink = acceptedCodeLink 
    solution.additionalLinks = additionalLinks

    await solution.save()

    return new Response(JSON.stringify({ message : 'Updated the message successfully' , ok : true }) , { status : 200 })
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Could not update the answer", ok: false }),
      { status: 500 }
    );
  }
};
