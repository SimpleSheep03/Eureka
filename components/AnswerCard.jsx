import React from "react";
import Link from "next/link";
import { FaExternalLinkAlt, FaEdit } from "react-icons/fa";
import { AiFillLike, AiFillDislike } from "react-icons/ai";

const AnswerCard = ({ answer, reactions, edit }) => {
  // Check if the answer has been liked or disliked
  const userReaction = reactions?.find(
    (reaction) => reaction._id === answer._id
  );
  const isLiked = userReaction && userReaction.value === 1;
  const isDisliked = userReaction && userReaction.value === -1;

  return (
    <li className="bg-gray-800 py-4 px-5 rounded-md">
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
        <AiFillLike
          className={`mr-1 ${isLiked ? "text-green-500" : "text-white"}`}
        />
        <span
          className={`mx-2 ${isLiked ? "text-green-500" : "text-white"} ${
            isDisliked ? "text-red-500" : ""
          }`}
        >
          {answer.netUpvotes <= 0 ? answer.netUpvotes : `+${answer.netUpvotes}`}
        </span>
        <AiFillDislike
          className={`ml-1 ${isDisliked ? "text-red-500" : "text-white"}`}
        />
      </div>
    </li>
  );
};

export default AnswerCard;
