import React from "react";
import { IoMdPerson } from "react-icons/io";
import { AiOutlineSolution } from "react-icons/ai";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

const QuestionCard = ({ question , center }) => {
  return (
    <div className={`bg-gray-800 md:p-5 max-sm:p-6 rounded-sm shadow-lg ${center ? 'md:w-9/12' : ''} mx-auto text-white`}>
      <div className={`flex flex-wrap ${center ? 'justify-center' : 'ml-2'} items-center mb-4`}>
        {/* Question title with external link */}
        <Link
          href={`/question/${question._id}`}
          className="text-white text-[22px] underline flex items-center"
        >
          {question.title}
          <FaExternalLinkAlt className="ml-2 text-[18px]" />
        </Link>
      </div>

       {/* Requested by section */}
      <div className={`flex ${center ? 'justify-center' : 'ml-2'} items-center text-sm text-gray-400`}>
        <IoMdPerson className="mx-2 text-lg"  title="Requested by"/>
        <span>{question.requestedBy}</span>
        <AiOutlineSolution className="ml-4 text-lg" title="Answered by"/>
        <span className="ml-1">{question.solutions.length}</span>
      </div>
    </div>
  );
};

export default QuestionCard;
