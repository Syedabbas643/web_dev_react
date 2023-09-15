import React, { useState } from "react";

const Popup = ({ date, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [checkedOption, setCheckedOption] = useState(null);

  const handleChange = (e) => {
    setInputValue(e.target.value); // Allow only numbers in the input
  };

  const handleOptionChange = (option) => {
    setCheckedOption(option);
  };

  const handleSubmit = () => {
    if (inputValue !== "") {
      onSubmit(date,parseInt(inputValue,10),checkedOption);
    }
    onClose();
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Enter Data for {date}</h3>
        <input type="tel" value={inputValue} onKeyPress={(e) => {
                      if (!/[0-9]/.test(e.key)) {
                          e.preventDefault();
                      }
                  }} onChange={handleChange} />
          <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              checked={checkedOption === "OT"}
              onChange={() => handleOptionChange("OT")}
            />
            OT
          </label>
          <label>
            <input
              type="checkbox"
              checked={checkedOption === "Leave"}
              onChange={() => handleOptionChange("Leave")}
            />
            Leave
          </label>
        </div>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Popup;