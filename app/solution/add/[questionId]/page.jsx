'use client';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import toast , { Toaster } from 'react-hot-toast'
import Loader from '@/components/Loader'

const SolutionFormPage = () => {
  const {data : session} = useSession()
  const { questionId } = useParams();
  const [question , setQuestion] = useState('')
  const [loading , setLoading] = useState(true)
  const [submitting , setSubmitting] = useState(false)

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
          } else {
            toast.error(data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error("An error occurred");
        }
        finally{
          setLoading(false)
        }
      }
    };

    fetchQuestionData()
  } , [])

  
  // State to capture form data
  const [formData, setFormData] = useState({
    heading: '',
    acceptedCodeLink: '',
    solutionHints: [],
    hintsCount: 0, // New field to capture number of hints
    solutionText: '',
    additionalLinks: '',
  });
  
  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'hintsCount') {
      const count = parseInt(value, 10);
      setFormData((prevState) => ({
        ...prevState,
        hintsCount: count,
        solutionHints: Array(count).fill(''), // Initialize the number of hint fields dynamically
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };
  
  // Handle hint input changes dynamically
  const handleHintChange = (index, value) => {
    const updatedHints = [...formData.solutionHints];
    updatedHints[index] = value;
    setFormData((prevState) => ({
      ...prevState,
      solutionHints: updatedHints,
    }));
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true)
    // Process the form data here
    console.log('Form submitted:', formData);
    try {
      const res = await fetch(`/api/solution/add/${questionId}` , {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          User : session?.username,
          heading : formData.heading,
          solutionHints : formData.solutionHints,
          solutionText : formData.solutionText,
          additionalLinks : formData.additionalLinks,
          acceptedCodeLink : formData.acceptedCodeLink
        }),
      })

      const data = await res.json()
      if(data.ok){
        toast.success('Successfully added the solution')
      }
      else{
        console.log(data.message)
        toast.error(data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred')
    }
    finally{
      setSubmitting(false)
    }
  };
  
  if(loading || !question || !questionId){
    return <Loader/>
  }
  return (
    <div className="flex justify-center items-center md:mt-8">
      <Toaster/>
      <div className="bg-gray-900 p-10 text-white w-full md:w-4/5 max-w-9/10 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Submit Your Solution</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Heading Field */}
          <div>
            <label htmlFor="heading" className="block text-sm font-medium">
              Heading
            </label>
            <input
              type="text"
              id="heading"
              name="heading"
              value={formData.heading}
              onChange={handleChange}
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
              required
            />
          </div>

          {/* Number of Solution Hints */}
          <div>
            <label htmlFor="hintsCount" className="block text-sm font-medium">
              Number of Hints
            </label>
            <select
              id="hintsCount"
              name="hintsCount"
              value={formData.hintsCount}
              onChange={handleChange}
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
            >
              <option value="0">None</option>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
            </select>
          </div>

          {/* Dynamic Solution Hints */}
          {Array.from({ length: formData.hintsCount }, (_, index) => (
            <div key={index}>
              <label htmlFor={`hint-${index}`} className="block text-sm font-medium">
                Hint {index + 1}
              </label>
              <input
                type="text"
                id={`hint-${index}`}
                name={`hint-${index}`}
                value={formData.solutionHints[index] || ''}
                onChange={(e) => handleHintChange(index, e.target.value)}
                className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
              />
            </div>
          ))}

          {/* Solution Text */}
          <div>
            <label htmlFor="solutionText" className="block text-sm font-medium">
              Solution Text
            </label>
            <textarea
              id="solutionText"
              name="solutionText"
              value={formData.solutionText}
              onChange={handleChange}
              rows="6"
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
              required
            />
          </div>

          {/* Accepted Code Link */}
          <div>
            <label htmlFor="acceptedCodeLink" className="block text-sm font-medium">
              Accepted Code Link
            </label>
            <input
              type="url"
              id="acceptedCodeLink"
              name="acceptedCodeLink"
              value={formData.acceptedCodeLink}
              onChange={handleChange}
              placeholder="(Optional)"
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
            />
          </div>

          {/* Additional Links */}
          <div>
            <label htmlFor="additionalLinks" className="block text-sm font-medium">
              Additional Links
            </label>
            <input
              type="url"
              id="additionalLinks"
              name="additionalLinks"
              value={formData.additionalLinks}
              onChange={handleChange}
              placeholder="(Optional)"
              className="mt-1 block w-full p-2 bg-gray-700 text-white border border-gray-700 rounded"
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-white text-black font-semibold py-3 rounded-md hover:bg-amber-200 transition"
              disabled={submitting}
            >
              {submitting ? 'Loading' : 'Submit Solution'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SolutionFormPage;
