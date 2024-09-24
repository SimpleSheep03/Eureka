import React, { useEffect, useState } from "react";
import Select from "react-select";

const SelectComponent = ({ fetchColourOptions, platform, onOptionSelect }) => {
  const [colourOptions, setColourOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (fetchColourOptions.length > 0) {
      setColourOptions(fetchColourOptions);
      setSelectedOption(fetchColourOptions[0]); // Set default option
      setLoading(false);
    }
  }, [fetchColourOptions]);

  const handleSelectChange = (selected) => {
    setSelectedOption(selected);
    onOptionSelect(selected); // Communicate with parent
  };

  if (loading) {
    return (
      <div>
        <input
          type="text"
          className="w-full p-[6.5px] border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          placeholder="Loading..."
        />
      </div>
    );
  }

  return (
    <>
      <Select
        className="basic-single font-medium"
        classNamePrefix="select"
        placeholder={
          platform === "codechef"
            ? "Starters 153"
            : platform === "codeforces"
            ? "Codeforces Round 975 (Div. 2)"
            : "Weekly Contest 417"
        }
        value={selectedOption} // Controlled input
        onChange={handleSelectChange} // Call handler on change
        isClearable={true}
        isSearchable={true}
        isDisabled={!colourOptions.length}
        name="contest"
        options={colourOptions}
      />
    </>
  );
};

export default SelectComponent;
