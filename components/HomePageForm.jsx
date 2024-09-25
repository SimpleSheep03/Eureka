"use client";
import { useEffect, useState } from "react";
import ComboBoxForContest from "./ComboBoxForContest";
import { useRouter } from "next/navigation";
import Loader from '@/components/Loader'

const ContestForm = () => {
  const [platform, setPlatform] = useState(localStorage.getItem("platform") || "codeforces"); // Default platform
  const [contests, setContests] = useState([]);
  const [fetchingContests, setFetchingContests] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);
  const [submitting , setSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchContests = async () => {
      setFetchingContests(true);
      try {
        const res = await fetch("/api/fetch-contests", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            platform,
          }),
        });

        const data = await res.json();
        if (data.ok) {
          console.log(data.message);
          setContests(data.contestArr);
        } else {
          console.log(data.message);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setFetchingContests(false);
      }
    };

    fetchContests();
  }, [platform]);

  const handleSelectedOption = (option) => {
    setSelectedValue(option);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true)
    router.push(`/contest/${selectedValue.value}`)
    setSubmitting(false)
  };

  if(fetchingContests){
    return <Loader/>
  }

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-900 p-8 rounded-lg shadow-md w-full sm:w-4/5 md:w-3/5 md:mt-9 "
      >
        <h2 className="text-2xl font-semibold mb-6 text-center text-white">
          Search Solutions for Contest
        </h2>

        {/* Select input for platform */}
        <label htmlFor="platform" className="text-white font-medium">
          Platform
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => {
            setPlatform(e.target.value);
            localStorage.setItem("platform" , e.target.value)
          }}
          className="w-full p-[6.5px] border border-gray-300 rounded-md mb-5 focus:outline-none focus:ring-2 focus:ring-blue-500 mt-2 font-medium"
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

        <label className="block text-white font-medium mb-2">Contest</label>

        <div className="mb-9">
          <ComboBoxForContest
            fetchColourOptions={contests}
            platform={platform}
            onOptionSelect={handleSelectedOption}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-white text-black font-semibold py-[6.5px] rounded-md hover:bg-amber-200 transition"
          disabled={submitting}
        >
          {submitting ? 'Loading' : 'Submit'}
        </button>
      </form>
    </div>
  );
};

export default ContestForm;
