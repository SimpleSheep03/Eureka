import connectDB from "@/config/database"
import Contest from "@/models/Contest"
import Question from "@/models/Question"


export const POST = async (request) => {

    try {
        const data = await request.json()
        const { questionId } = data
        if(!questionId){
            return new Response(JSON.stringify({ message : 'Fill all the fields' , ok : false}) , { status : 400 })
        }
        
        await connectDB()
        const question = await Question.findById(questionId)
        
        if(!question){
            return new Response(JSON.stringify({ message : 'Incorrect input' , ok : false}) , { status : 400 })
        }
        const contest = await Contest.findById(question.contest)
        return new Response(JSON.stringify({ message : 'Fetched the question data' , ok : true , question , contestName : contest.title }) , { status : 200 })

    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Could not fetch question data' , ok : false }) , { status : 500 })
    }
}