'use client'
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaExternalLinkAlt } from 'react-icons/fa';
import Loader from '@/components/Loader'

const ContestQuestions = () => {
  const { contestId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contestName, setContestName] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      if (!contestId) return;

      try {
        const res = await fetch(`/api/getQuestions?contestId=${contestId}`);
        const data = await res.json();
        if (data.ok) {
          setQuestions(data.questions);
          setContestName(data.contestName);
        } else {
          setError(data.error || "Failed to load questions");
        }
      } catch {
        setError("An error occurred while fetching questions.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();

  }, [contestId]);

  if (loading) return <Loader/>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex justify-center items-center md:mt-8 md:p-10">
      <div className="bg-gray-900 p-10 text-white w-full  rounded-lg shadow-lg max-w-9/10">
        <h1 className="text-[35px] font-semibold mb-4 text-white text-center">
          {contestName} - Questions
        </h1>
        {questions.length > 0 ? (
          <ul className="mt-[60px]">
            {questions.map((question, index) => (
              <div key={index} className="flex flex-wrap mt-10 justify-center mb-7 items-center">
                <Link
                  href={`/question/${question._id}`}
                  className="text-white text-[25px] underline flex items-center text-center"
                >
                  {question.title}
                </Link>
                <FaExternalLinkAlt style={{ marginLeft: '10px', fontSize: '20px', color: 'white' }} />
              </div>
            ))}
          </ul>
        ) : (
          <p>No questions found for this contest.</p>
        )}
      </div>
    </div>
  );
};

export default ContestQuestions;
