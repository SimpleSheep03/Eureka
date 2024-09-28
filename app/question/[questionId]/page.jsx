"use client";
import { IoMdPerson } from "react-icons/io";
import { IoAddCircle } from "react-icons/io5";
import { AiFillLike, AiFillDislike } from "react-icons/ai";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import toast, { Toaster } from "react-hot-toast";
import { MdAddBox } from "react-icons/md";

const page = () => {
  const [question, setQuestion] = useState();
  const [solutions, setSolutions] = useState([]);
  const { questionId } = useParams();
  const [loading, setLoading] = useState(true);
  const [contestName, setContestName] = useState("");
  const { data: session } = useSession();
  const handle = session?.username;
  const [reactions, setReactions] = useState([])
  const [questionIsRequested , setQuestionIsRequested] = useState(false)

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
            setQuestionIsRequested(data.requested)
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
            handle,
          }),
        });
        const data = await res.json();
        if (data.ok) {
          setSolutions(data.solutions);
          setReactions(data.reactions);
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
  }, [handle , session]);

  if (loading || !question || !contestName) {
    return <Loader />;
  }

  // Function to get reaction value for a specific solution
  const getReaction = (solutionId) => {

    if (!handle || !reactions || reactions.length == 0) {
      return 0;
    }
    const reaction = reactions.find(
      (reaction) => reaction._id.toString() === solutionId.toString()
    );
    return reaction ? reaction.value : 0; // Default to 0 if no reaction found
  };

  // Function to handle like/dislike actions
  const handleReaction = async (solutionId, value) => {
    if (!session || !handle) {
      toast("Please sign in first", {
        icon: "⚠️",
        style: {
          padding: "16px",
          color: "#b45309", // Orange text color
        },
      });
      return;
    }

    try {
      const res = await fetch("/api/reactToSolution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          solutionId,
          value,
          handle, // the username of the current user
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setReactions((prevReactions) => {
          const existingReaction = prevReactions.find(
            (reaction) => reaction._id === solutionId
          );

          if (existingReaction) {
            if (existingReaction.value === value) {
              return prevReactions.filter(
                (reaction) => reaction._id !== solutionId
              );
            } else {
              return prevReactions.map((reaction) =>
                reaction._id === solutionId ? { ...reaction, value } : reaction
              );
            }
          } else {
            return [...prevReactions, { _id: solutionId, value }];
          }
        });

        setSolutions((prevSolutions) => {
          return prevSolutions.map((solution) => {
            if (solution._id === solutionId) {
              const previousReaction = reactions.find(
                (r) => r._id === solutionId
              );
              let adjustment = value;

              if (previousReaction) {
                if (previousReaction.value === value) {
                  adjustment = -value;
                } else {
                  adjustment = value - previousReaction.value;
                }
              }

              return {
                ...solution,
                netUpvotes: solution.netUpvotes + adjustment,
              };
            }
            return solution;
          });
        });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    }
  };

  // Handle "request for the question"
  const handleRequest = async () => {
    if (!session || !handle) {
      toast("Please sign in first", {
        icon: "⚠️",
        style: {
          padding: "16px",
          color: "#b45309",
        },
      });
      return;
    }

    try {
      const res = await fetch("/api/requestQuestion", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questionId,
          handle,
        }),
      });

      const data = await res.json();
      if (data.ok) {
        setQuestion(data.question)
        setQuestionIsRequested(data.requested)
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred");
    }
  };

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
                target="__blank"
                className="text-white font-bold underline"
              >
                {question.questionLink}
              </Link>
            </div>

            <div className="mb-8 flex items-center">
              <span className="font-semibold">Requested By: </span>
              <span className="ml-2">{question.requestedBy || "None"}</span>
              <IoMdPerson className={`text-white ml-2`} />
            </div>

            {/* Add the new request section here */}
            {session && (
              <div className="text-center flex items-center mb-4">
                <span className="font-semibold">
                  Need an answer? Request for the question!
                </span>
                <MdAddBox
                  onClick={handleRequest}
                  className={`ml-2 cursor-pointer ${
                    questionIsRequested
                      ? "text-blue-500"
                      : "text-white"
                  }`}
                  size={24}
                />
              </div>
            )}

            <div className="text-center flex items-center max-sm:mb-10">
              <span className="font-semibold">
                Have a solution? You can share it
              </span>
              <Link
                href={`/solution/add/${question._id}`}
                className="ml-1 underline font-semibold"
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
                  {solutions.map((solution, index) => {
                    const reactionValue = getReaction(solution._id);

                    return (
                      <li
                        key={index}
                        className="mb-6 p-4 border-b border-gray-600"
                      >
                        <h4 className="text-xl font-semibold underline">
                          <Link href={`/solution/${solution._id}`}>
                            {solution.heading}
                          </Link>
                        </h4>
                        <p className="text-sm mt-2 max-sm:mt-3 underline text-gray-300">
                          <Link href={`/profile/${solution.User}`}>
                            {solution.User}
                          </Link>
                        </p>
                        <p className="text-[15px] mt-4 max-sm:mt-5 flex items-center">
                          <AiFillLike
                            className={`mr-2 cursor-pointer ${
                              reactionValue === 1 ? "text-green-500" : ""
                            }`}
                            onClick={() => handleReaction(solution._id, 1)}
                          />
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
                          </div>
                          <AiFillDislike
                            className={`ml-2 cursor-pointer ${
                              reactionValue === -1 ? "text-red-500" : ""
                            }`}
                            onClick={() => handleReaction(solution._id, -1)}
                          />
                        </p>
                      </li>
                    );
                  })}
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
