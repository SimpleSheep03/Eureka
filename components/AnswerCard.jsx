import React from "react";
import Link from "next/link";
import { FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

const AnswerCard = ({ answer, edit }) => {
  return (
    <li className="bg-gray-800 md:py-4 md:px-5 max-sm:p-7 rounded-md">
      <div className="flex justify-between items-center mb-5">
        <Link
          href={`/solution/${answer._id}`}
          className="text-xl flex items-center"
        >
          <span className="underline">{answer.heading}</span>
          <FaExternalLinkAlt className="ml-2 text-[15px]" />
        </Link>
      </div>

      <div className="mb-2">
        <Link className="text-[17px]" href={`/question/${answer.question._id}`}>
          {answer.question.title}
        </Link>
      </div>
      <div className="flex justify-between items-center">
        <Link
          href={`/profile/${answer.User}`}
          className="text-sm text-gray-400 block mb-3"
        >
          - {answer.User}
        </Link>
        {/* Display Edit Icon if edit is true */}
        {edit && (
          <Link href={`/solution/${answer._id}/edit`}>
            <button className="text-gray-400 hover:text-gray-200 transition">
              <FaEdit className="text-xl" title="Edit Answer" />
            </button>
          </Link>
        )}
      </div>

      <div className="mt-2 flex items-center">
        {answer.netUpvotes > 0 ? (
          <AiFillLike className="text mr-1" />
        ) : answer.netUpvotes < 0 ? (
          <AiFillDislike className="text mr-1" />
        ) : null}
        <span className={`mx-2 ${answer.netUpvotes > 0 ? 'text-green-500' : answer.netUpvotes < 0 ? 'text-red-500' : ''}`}>
          {answer.netUpvotes <= 0 ? answer.netUpvotes : `+${answer.netUpvotes}`}
        </span>
      </div>
    </li>
  );
};

export default AnswerCard;
