import React,{ useState,useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, setMonth, parseISO } from "date-fns";
import Popup from "./Popup";
import axios from "axios"
import "./Calender.css"
import { useLocation} from "react-router-dom"
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [userdata, setUserdata] = useState(null);
    const [items,setitems] = useState(null);
    const [leave,setleave] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation()
    const code = location.state.id;
  
    const [selectedMonth, setSelectedMonth] = useState(new Date()); // Initialize with the current month
    const monthStart = startOfMonth(selectedMonth);
    const monthEnd = endOfMonth(selectedMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "yyyy-MM-dd";
    const days = [];
    let day = startDate;
    
  
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        days.push(day);
        day = addDays(day, 1);
      }
    }

    useEffect(() => {
        async function fetchData() {
          try {
            const response = await axios.get("/get123", {
              params: {
                code, // Passcode as a query parameter
              },
            });
    
            if (response.data === "notexist") {
              alert("Cannot get user data");
            } else {
              const tempjson = response.data
              setUserdata(tempjson);
              setitems(tempjson.dates)
              setleave(tempjson.leave)
              console.log(tempjson)
              
            }
          } catch (error) {
            alert("Cannot get");
            console.log(error);
          }finally {
            setLoading(false);
          }
        }
    
        fetchData();
      }, [code, selectedMonth]);
  
      const isDateInJsonArray = (dateToCheck) => {
        return items.some((item) => isSameDay(new Date(item.date), dateToCheck));
      };
      
      const renderDay = (day) => {
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isInJsonArray = isDateInJsonArray(day);
      
        const handleDayClick = () => {
          setSelectedDate(day);
          setShowPopup(true);
        };
      
        return (
          <div
            key={day}
            className={`day ${isCurrentMonth ? "current-month" : "other-month"} ${isToday ? "today" : ""} ${
              isInJsonArray ? "highlighted" : ""
            }`}
            onClick={handleDayClick}
          >
            <span className="day-number">{format(day, "d")}</span>
          </div>
        );
      };
  
    const handleClosePopup = () => {
      setShowPopup(false);
      
    };

    const handleMonthChange = (event) => {
      const selectedMonthIndex = event.target.value;
      const newSelectedMonth = setMonth(selectedMonth, selectedMonthIndex);
      setSelectedMonth(newSelectedMonth);
      //console.log(monthname)
    };
  
    const handlePopupSubmit = async (date, inputValue, option) => {

        if (option === "OT"){


          try {
            const response = await axios.post("/savedateOT", {
              date,
              inputValue,
              code,
            });
        
            if (response.data === "success") {
              alert("Saved to database");
  
              if (inputValue > 0){
              const existingItemIndex = items.findIndex((item) => item.date === date);
  
                if (existingItemIndex !== -1) {
                  // Date exists, update the hours
                  const updatedItems = [...items];
                  updatedItems[existingItemIndex].Hours = inputValue;
                  setitems(updatedItems);
                } else {
                // Date does not exist, add it as a new date
                const newitem = { date: date, Hours: inputValue };
                const updatedItems = [...items, newitem];
                setitems(updatedItems);
                }
              }else if(inputValue === 0){
                const existingItemIndex = items.findIndex((item) => item.date === date);
  
                if (existingItemIndex !== -1) {
                  // Date exists, update the hours
                  const updatedItems = [...items];
                  updatedItems.splice(existingItemIndex,1)
                  setitems(updatedItems);
                } 
              }
  
            } else if (response.data === "fail") {
              alert("Cannot save to database: fail");
            }
          } catch (error) {
            // Handle errors if any
            console.log(error);
            alert("Cannot save to database: error");
          }


        }else if (option === "Leave"){

          try {
            const response = await axios.post("/savedateLeave", {
              date,
              inputValue,
              code,
            });
        
            if (response.data === "success") {
              alert("Saved to database");
  
              if (inputValue > 0){
              const existingItemIndex = leave.findIndex((item) => item.date === date);
  
                if (existingItemIndex !== -1) {
                  // Date exists, update the hours
                  const updatedItems = [...leave];
                  updatedItems[existingItemIndex].Hours = inputValue;
                  setleave(updatedItems);
                } else {
                // Date does not exist, add it as a new date
                const newitem = { date: date, Hours: inputValue };
                const updatedItems = [...leave, newitem];
                setleave(updatedItems);
                }
              }else if(inputValue === 0){
                const existingItemIndex = leave.findIndex((item) => item.date === date);
  
                if (existingItemIndex !== -1) {
                  // Date exists, update the hours
                  const updatedItems = [...leave];
                  updatedItems.splice(existingItemIndex,1)
                  setleave(updatedItems);
                } 
              }
  
            } else if (response.data === "fail") {
              alert("Cannot save to database: fail");
            }
          } catch (error) {
            // Handle errors if any
            console.log(error);
            alert("Cannot save to database: error");
          }
        }
        };


        

    const getTotalWorkedHoursForCurrentMonth = () => {
        let totalHours = 0;
        items.forEach((item) => {
          // Convert the date string from the item to a Date object
          const itemDate = new Date(item.date);
    
          // Check if the item's date is within the current month
          if (isSameMonth(itemDate, monthStart) || isSameMonth(itemDate, monthEnd)) {
            // If the date is within the current month, add the worked hours to the total
            totalHours += parseInt(item.Hours, 10);
          }
        });
    
        return totalHours;
      };


  
    const renderWeek = (startDay) => {
      const week = [];
      for (let i = 0; i < 7; i++) {
        week.push(startDay);
        startDay = addDays(startDay, 1);
      }
      return week.map((day) => <td key={day}>{renderDay(day)}</td>);
    };
  
    const renderCalendar = () => {
      const rows = [];
      let startDay = startDate;
  
      while (startDay <= endDate) {
        rows.push(<tr key={startDay} className="daycell">{renderWeek(startDay)}</tr>);
        startDay = addDays(startDay, 7);
      }
  
      return rows;
    };
    if (loading) {
        return <div><h1>Loading...</h1></div>;
      }
  
    return (
      <div className="calendar">
            <header className="clheader">TO DO List By {userdata.Name}</header>
        {showPopup && (
          <Popup date={format(selectedDate, dateFormat)} onClose={handleClosePopup} onSubmit={handlePopupSubmit} />
        )}
        <div className="headercl">
        <select
          className="month-selector"
          //value={format(selectedMonth, "MMMM yyyy")}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select>
      </div>
        <table className="table">
          <thead>
            <tr>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <th key={day} className="weekday">
                  {day}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{renderCalendar()}</tbody>
        </table>
        <h3>Total OT hours in this month</h3><h3 className="hoursdisplay">{getTotalWorkedHoursForCurrentMonth()}</h3><br></br>
        <h3>Total Leave days in this month</h3><h3 className="leavedisplay">Hours</h3><br></br>
        <footer className="clfooter">
        <h2>COPYRIGHT &copy; 2023</h2>
      </footer>
      </div>
    );
  };
  
  export default Calendar;