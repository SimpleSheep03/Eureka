import ContestForm from '@/components/HomePageForm'
import RecentAnswers from '@/components/RecentAnswers'
import React from 'react'

const page = async () => {


  return (
    <div>
      <ContestForm/>
      <RecentAnswers/>
    </div>
  )
}

export default page