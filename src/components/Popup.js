import React, { useState } from "react";

const Popup = ({ date, onClose, onSubmit }) => {
  const [inputValue, setInputValue] = useState("");
  const [checked, setChecked] = useState(false);

  const handleChange = (e) => {
    setInputValue(e.target.value); // Allow only numbers in the input
  };

  const handleCheckboxChange = (e) => {
    setChecked(e.target.checked);
  };

  const handleSubmit = () => {
    if (checked && inputValue !== "") {
      onSubmit(date,inputValue);
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
        <label>
          <input type="checkbox" checked={checked} onChange={handleCheckboxChange} />
          Check the box to submit data
        </label>
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default Popup;