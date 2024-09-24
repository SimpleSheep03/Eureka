"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const ContestForm = () => {
  const [platform, setPlatform] = useState("codeforces");
  const [contestName, setContestName] = useState("");
  const [contestDate, setContestDate] = useState(""); // New state for contestDate
  const [numQuestions, setNumQuestions] = useState(1);
  const [questions, setQuestions] = useState([{ title: "", link: "" }]);
  const { data: session } = useSession();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!session || session.username !== "simplesheep03") {
        router.push("/");
      }
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [session]);

  const handleQuestionChange = (index, field, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const handleNumQuestionsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setNumQuestions(value);

    const updatedQuestions = [...questions];
    if (value > questions.length) {
      for (let i = questions.length; i < value; i++) {
        updatedQuestions.push({ title: "", link: "" });
      }
    } else {
      updatedQuestions.length = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log({ platform, contestName, contestDate, questions });
    setSubmitting(true);
    // Handle form submission logic
    try {
      const res = await fetch("/api/cdkpsu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          platform,
          contestName,
          contestDate, // Add contestDate to submission payload
          questions,
          numQuestions,
        }),
      });

      const data = await res.json();
      if (!data.ok) {
        console.log(data.message);
      } else {
        console.log(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-full sm:w-4/5 md:w-3/5 lg:w-4/5 xl:w-4/5 mt-10"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Contest Form
        </h2>

        {/* Select input for platform */}
        <label htmlFor="platform" className="text-white font-medium">
          Platform
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 font-medium bg-gray-400"
        >
          <option value="codeforces" className="font-medium">
            Codeforces
          </option>
          <option value="codechef" className="font-medium">
            Codechef
          </option>
          <option value="leetcode" className="font-medium">
            Leetcode
          </option>
        </select>

        {/* Input for contest name */}
        <label htmlFor="contestName" className="text-white font-medium">
          Contest Name
        </label>
        <input
          id="contestName"
          type="text"
          value={contestName}
          onChange={(e) => setContestName(e.target.value)}
          placeholder="Enter contest name"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400"
        />

        {/* Input for contest date */}
        <label htmlFor="contestDate" className="text-white font-medium">
          Contest Date
        </label>
        <input
          id="contestDate"
          type="text"
          value={contestDate}
          onChange={(e) => setContestDate(e.target.value)}
          placeholder="Enter contest date (e.g., YYYY-MM-DD)"
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400"
        />

        {/* Dropdown for number of questions */}
        <label htmlFor="numQuestions" className="text-white font-medium">
          Number of Questions
        </label>
        <select
          id="numQuestions"
          value={numQuestions}
          onChange={handleNumQuestionsChange}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400"
        >
          {Array.from({ length: 15 }, (_, i) => i + 1).map((num) => (
            <option key={num} value={num}>
              {num}
            </option>
          ))}
        </select>

        {/* Dynamically generated question inputs */}
        {questions.map((question, index) => (
          <div key={index} className="mb-6">
            <h3 className="text-lg font-semibold text-white">
              Question {index + 1}
            </h3>

            <label
              htmlFor={`title-${index}`}
              className="block text-white font-medium mb-1"
            >
              Title
            </label>
            <input
              id={`title-${index}`}
              type="text"
              value={question.title}
              onChange={(e) =>
                handleQuestionChange(index, "title", e.target.value)
              }
              placeholder="Enter question title"
              className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400"
            />

            <label
              htmlFor={`link-${index}`}
              className="block text-white font-medium mb-1"
            >
              Link
            </label>
            <input
              id={`link-${index}`}
              type="url"
              value={question.link}
              onChange={(e) =>
                handleQuestionChange(index, "link", e.target.value)
              }
              placeholder="Enter question link"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-400"
            />
          </div>
        ))}

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-amber-200 transition"
          disabled={submitting}
        >
          {submitting ? "Loading" : "Create"}
        </button>
      </form>
    </div>
  );
};

export default ContestForm;
