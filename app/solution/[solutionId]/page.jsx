"use client";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import Loader from "@/components/Loader";
import { FaExternalLinkAlt } from "react-icons/fa";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import { useSession } from "next-auth/react";
import {
  Accordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from "react-accessible-accordion";
import "react-accessible-accordion/dist/fancy-example.css";

const Page = () => {
  const [solution, setSolution] = useState({});
  const [questionName, setQuestionName] = useState("");
  const { solutionId } = useParams();
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const [reacted, setReacted] = useState(0);
  const handle = session?.username;

  const [openStates, setOpenStates] = useState([]);
  const [solutionOpen, setSolutionOpen] = useState(
    !localStorage?.getItem("solution")
      ? true
      : localStorage?.getItem("solution") == "true"
      ? true
      : false
  );

  console.log(localStorage.getItem("solution"));

  useEffect(() => {
    const fetchSolution = async () => {
      try {
        const res = await fetch("/api/fetchSolutions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ solutionId, handle }),
        });

        const data = await res.json();
        if (data.ok) {
          setSolution(data.solution);
          setQuestionName(data.questionName);
          setOpenStates(
            new Array(data.solution.solutionHints?.length || 0).fill(false)
          );
          for (const reaction of data.reactions) {
            if (reaction._id.toString() === solutionId.toString()) {
              setReacted(reaction.value);
            }
          }
        } else {
          console.log(data.message);
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error("An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchSolution();
  }, [solutionId, handle]);

  const toggleAccordion = (index) => {
    setOpenStates((prevOpenStates) => {
      const newState = [...prevOpenStates];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleSolutionAccordion = () => {
    setSolutionOpen(!solutionOpen);
    localStorage.setItem("solution", !solutionOpen);
  };

  const handleReaction = async (solutionId, reaction) => {
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
      const res = await fetch("/api/reactToSolution", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ solutionId, value: reaction, handle }),
      });

      const data = await res.json();
      if (data.ok) {
        setReacted(reacted === reaction ? 0 : reaction);
        setSolution((prevSolution) => ({
          ...prevSolution,
          netUpvotes: data.solution.netUpvotes,
        }));
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while updating reaction");
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="flex justify-center items-center md:mt-6 md:p-10">
      <div className="bg-gray-900 p-10 text-white w-full rounded-lg max-w-9/10">
        <Toaster />
        {questionName && (
          <>
            <Link href={`/question/${solution.question}`}>
              <h2 className="text-3xl font-bold mb-5 text-center underline">
                {questionName}
              </h2>
            </Link>
            <Link href={`/profile/${solution.User}`} className="mb-4">
              <h3 className="text-lg mb-5 text-center underline">
                - {solution.User}
              </h3>
            </Link>

            {solution.solutionHints?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Hints:</h4>
                <Accordion
                  allowMultipleExpanded={true}
                  allowZeroExpanded={true}
                >
                  {solution.solutionHints.map((hint, index) => {
                    return (
                      <AccordionItem key={index} className="mb-2">
                        <AccordionItemHeading
                          onClick={() => toggleAccordion(index)}
                        >
                          <AccordionItemButton className="flex items-center mb-1 w-[75px]">
                            {/* Dropdown indicator */}
                            <span className="mr-2">
                              {openStates[index] ? "▼" : "▶"}
                            </span>
                            Hint {index + 1}
                          </AccordionItemButton>
                        </AccordionItemHeading>
                        <AccordionItemPanel className="rounded-sm">
                          <div className="bg-gray-700 py-1 px-3 rounded-md">
                            <p className="text-white">{hint}</p>
                          </div>
                        </AccordionItemPanel>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </div>
            )}

            <div className="mt-6">
              <h3
                className="text-[22px] font-semibold mb-4 flex items-center cursor-pointer"
                onClick={toggleSolutionAccordion}
              >
                <span className="mr-2">{solutionOpen ? "▼" : "▶"}</span>
                <span className="underline">Solution :</span>
              </h3>
              {solutionOpen && (
                <div className="bg-gray-700 py-2 px-3 rounded-md">
                  <p>{solution.solutionText || "No solution text available"}</p>
                </div>
              )}
            </div>

            {solution.acceptedCodeLink && (
              <div className="mt-6 flex items-center flex-wrap">
                <Link
                  href={solution.acceptedCodeLink}
                  target="__blank"
                  className="text-white underline flex items-center"
                  rel="noopener noreferrer"
                >
                  <h4 className="text-lg font-semibold mr-2">
                    Accepted Code Link:
                  </h4>
                  <FaExternalLinkAlt className="ml-1" />
                </Link>
              </div>
            )}

            {solution.additionalLinks?.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Additional Links:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {solution.additionalLinks.map((link, index) => (
                    <li key={index}>
                      <a
                        href={link}
                        target="_blank"
                        className="text-blue-500 underline"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="mt-6 flex items-center">
              <AiFillLike
                className={`mr-2 cursor-pointer ${
                  reacted == 1 ? "text-green-500" : ""
                }`}
                onClick={() => handleReaction(solution._id, 1)}
                size={19}
              />

              <p
                className={`text-base mx-2 ${
                  solution.netUpvotes > 0
                    ? "text-green-500"
                    : solution.netUpvotes < 0
                    ? "text-red-500"
                    : "text-white"
                }`}
              >
                {solution.netUpvotes <= 0
                  ? solution.netUpvotes
                  : `+${solution.netUpvotes}`}
              </p>

              <AiFillDislike
                className={`ml-2 cursor-pointer ${
                  reacted === -1 ? "text-red-500" : ""
                }`}
                onClick={() => handleReaction(solution._id, -1)}
                size={19}
              />
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-semibold">Comments:</h4>
              {solution.comments && solution.comments.length > 0 ? (
                <ul className="space-y-2">
                  {solution.comments.map((comment, index) => (
                    <li key={index} className="p-3 bg-gray-800 rounded-lg">
                      <p>{comment.content || "No content"}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 mt-2">No comments available</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
