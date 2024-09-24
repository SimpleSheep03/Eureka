import connectDB from "@/config/database";
import Contest from "@/models/Contest";
import Question from "@/models/Question";
import { getSessionUser } from "@/utils/getSessionUser";


export const POST = async(request) => {
    try{
        const session = await getSessionUser();

        if (!session || session.username != 'simplesheep03') {
            return new Response(JSON.stringify({
                message: 'Unauthorized', ok: false
            }), { status: 401 });
        }

        const data = await request.json()
        const {platform , contestName , numQuestions , questions} = data

        if(!platform ||  !contestName || contestName == '' ||!numQuestions || !questions || questions.length == 0 || numQuestions != questions.length){
            return new Response(JSON.stringify({ message : 'Fill all the field' , ok : false}) , { status : 400 })
        }

        await connectDB()

        let contest = new Contest({
            platform ,
            title : contestName
        })

        await contest.save()

        let questionIds = []

        for(let i = 0 ; i < questions.length ; i ++){

            const question = new Question({
                contest : contest._id,
                questionLink : questions[i].link,
                title : questions[i].title
            })

            await question.save()
            questionIds.push(question._id)
        }

        contest.questions = questionIds

        await contest.save()

        return new Response(JSON.stringify({ message : 'Contest created successfully' , ok : true }) , { status : 200 })

    }
    catch(error){
        console.log(error)
        return new Response(JSON.stringify({ message : 'Could not add the contest' , ok : false }), { status : 500 })
    }
}