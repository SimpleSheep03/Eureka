'use client'
import { useState } from "react";

const ContestForm = () => {
  const [platform, setPlatform] = useState("codeforces"); // Default platform
  const [fieldName, setFieldName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`Platform: ${platform}, Field Name: ${fieldName}`);
    // Handle form submission logic
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-full sm:w-4/5 md:w-3/5 mt-9"
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Enter Contest Details
        </h2>

        {/* Select input for platform */}
        <label htmlFor="platform" className="text-white font-medium">
          Platform
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 font-medium"
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

        {/* Text input for field name */}
        <label htmlFor="fieldName" className="block text-white font-medium mb-2">
          Contest
        </label>
        <input
          id="fieldName"
          type="text"
          value={fieldName}
          onChange={(e) => setFieldName(e.target.value)}
          placeholder="Enter field name"
          className="w-full p-3 border border-gray-300 rounded-md mb-8 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-amber-200 transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default ContestForm;
