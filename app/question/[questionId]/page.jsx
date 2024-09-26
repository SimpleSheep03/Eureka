"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/Loader";
import { IoMdPerson } from "react-icons/io";
import { AiFillLike } from "react-icons/ai";
import { AiFillDislike } from "react-icons/ai";

const page = () => {
  const [question, setQuestion] = useState();
  const [solutions, setSolutions] = useState([]);
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [contestName, setContestName] = useState("");

  useEffect(() => {
    const fetchQuestionData = async () => {
      if (questionId) {
        try {
          const res = await fetch("/api/questionData", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              questionId,
            }),
          });
          const data = await res.json();
          if (data.ok) {
            setQuestion(data.question);
            setContestName(data.contestName);
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error("An error occurred");
        }
      }
    };

    const fetchSolutions = async () => {
      try {
        const res = await fetch("/api/fetchSolutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            questionId,
            size: 10,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setSolutions(data.solutions);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred");
      }
    };
    fetchQuestionData();
    fetchSolutions();
    setLoading(false);
  }, []);

  if (loading || !question || !contestName) {
    return <Loader />;
  }
  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <div className="bg-gray-900 p-10 text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <Toaster />

        {/* Display question details */}
        {question && (
          <>
            <h2 className="text-3xl font-bold mb-5 text-center">
              {question.title}
            </h2>

            <div className="mb-10 text-center">
              <span className="text-2xl">
                <Link href={`/contest/${question.contest}`}>{contestName}</Link>
              </span>
            </div>

            <div className="mb-5">
              <span className="font-semibold">Question Link: </span>
              <Link
                href={question.questionLink}
                target="_blank"
                className="text-white font-bold underline"
              >
                {question.questionLink}
              </Link>
            </div>

            <div className="mb-4 flex items-center">
              <span className="font-semibold">Requested By: </span>
              <span className="ml-2">{question.requestedBy}</span>
              <IoMdPerson className="text-white ml-2" />
            </div>

            <div className="text-center flex items-center max-sm:mb-10">
              <span className="font-semibold text-xl">
                Have a solution? You can share it
              </span>
              <Link
                href={`/solution/add/${question._id}`}
                className="ml-1 underline font-semibold text-xl"
              >
                here
              </Link>
            </div>

            {/* Display solutions */}
            <div className="mt-6">
              <h3 className="text-2xl font-semibold mb-4 text-center">
                Solutions:
              </h3>
              {solutions.length > 0 ? (
                <ul>
                  {solutions.map((solution, index) => (
                    <li
                      key={index}
                      className="mb-6 p-4 border-b border-gray-600"
                    >
                      <h4 className="text-xl font-semibold underline">
                        {solution.heading}
                      </h4>
                      <p className="text-sm mt-2 max-sm:mt-3 underline text-gray-300">
                        {solution.User}
                      </p>
                      <p className="text-sm mt-4 max-sm:mt-5 flex items-center">
                        <AiFillLike className="mr-2" />{" "}
                        <div
                          className={
                            solution.netUpvotes > 0
                              ? "text-green-500"
                              : solution.netUpvotes < 0
                              ? "text-orange-200"
                              : "text-white"
                          }
                        >
                          {solution.netUpvotes > 0
                            ? `+${solution.netUpvotes}`
                            : solution.netUpvotes}
                        </div>{" "}
                        <AiFillDislike className="ml-2" />
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No solutions available for this question.</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default page;
