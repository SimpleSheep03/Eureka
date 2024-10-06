"use client"; // Client-side rendering in Next.js
import React, { useEffect, useState } from "react";
import QuestionComponent from "@/components/QuestionComponent"; // Assume QuestionComponent is the card component for each question
import Loader from "@/components/Loader"; // Optional loader component for loading state
import toast, { Toaster } from "react-hot-toast"; // For error messages
import { FaLongArrowAltRight, FaLongArrowAltLeft } from "react-icons/fa"; // For pagination arrows

const RequestedQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageNo, setPageNo] = useState(1); // Track current page number
  const [lastPage, setLastPage] = useState(false); // Track if it's the last page
  const [questionCount, setQuestionCount] = useState(0); // Store total question count

  // Fetch questions with pagination
  const fetchQuestions = async (page) => {
    setLoading(true);
    try {
      const response = await fetch("/api/getQuestions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pageNo: 1 , size : 10 }), // Send the current page number
      });

      const data = await response.json();
      if (data.ok) {
        setQuestions(data.questions);
        setLastPage(data.lastPage);
      } else {
        toast.error(data.message || "Failed to fetch questions");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching questions");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch for page 1
  useEffect(() => {
    fetchQuestions(pageNo);
  }, [pageNo]);

  if (loading) {
    return <Loader />; // Show loader while fetching data
  }

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <div className="bg-gray-900 md:p-10 max-sm:py-[50px] text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <Toaster />
        <h1 className="text-3xl font-bold text-center mb-10">
          Requested Questions
        </h1>

        {questions.length > 0 ? (
          <ul className="space-y-8">
            {questions.map((question) => (
              <li key={question._id}>
                <QuestionComponent question={question} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center">No questions found.</p>
        )}

        {/* Pagination Controls */}
        <div className="mt-4 flex items-center justify-center space-x-7">
          <button
            onClick={() => handlePageChange(pageNo - 1)}
            disabled={pageNo === 1}
            className={`flex items-center text-white hover:underline ${
              pageNo === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <FaLongArrowAltLeft />
            <span className="ml-2">Previous</span>
          </button>
          <span>Page {pageNo}</span>
          <button
            onClick={() => handlePageChange(pageNo + 1)}
            disabled={lastPage}
            className={`flex items-center text-white hover:underline ${
              lastPage ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="mr-2">Next</span>
            <FaLongArrowAltRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RequestedQuestions;
