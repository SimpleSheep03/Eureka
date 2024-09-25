import connectDB from "@/config/database"
import Question from "@/models/Question"
import Solution from "@/models/Solution"


export const POST = async (request) => {
    try {
        const data = await request.json()
        const {questionId , size} = data
        const actualSize = size || 5
        
        await connectDB()
        if(questionId){
            const question = await Question.findById(questionId)
            if(!question){
                return new Response(JSON.stringify({ message : 'Incorrect input' , ok : false}) , { status : 400 })
            }
            const solutions = await Solution.find({ question : questionId }).sort({ netUpvotes : -1 }).limit(actualSize)

            return new Response(JSON.stringify({ message : 'Solutions fetched successfully' , ok : true , solutions}) , { status : 200 })
        }
        const solutions = await Solution.find().sort({ netUpvotes : -1 }).limit(actualSize)

        return new Response(JSON.stringify({ message : 'Solutions fetched successfully' , ok : true , solutions}) , { status : 200 })

    } catch (error) {
        console.log(error)
        return new Response(JSON.stringify({ message : 'Could not fetch solutions' , ok : false}) , { status : 500 })
    }
}