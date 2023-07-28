import React,{ useState,useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay } from "date-fns";
//import { Link } from "react-router-dom";
import Popup from "./Popup";
import axios from "axios"
import "./Calender.css"
import { useLocation} from "react-router-dom"

const Calendar = ({ currentDate }) => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [userdata, setUserdata] = useState(null);
    const [items,setitems] = useState(null);
    const [loading, setLoading] = useState(true);
    const location = useLocation()
    const code = location.state.id;
  
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
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
            const response = await axios.get("https://gamerserver-3e5z.onrender.com/get", {
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
              console.log(tempjson.dates)
            }
          } catch (error) {
            alert("Cannot get");
            console.log(error);
          }finally {
            setLoading(false);
          }
        }
    
        fetchData();
      }, [code]);
  
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
      //setSelectedDate(null);
      //setSelectedColor("#ffffff");
    };
  
    const handlePopupSubmit = async (date, inputValue) => {
        try {
          // Send the data to the server using axios POST request
          const response = await axios.post("https://gamerserver-3e5z.onrender.com/savedate", {
            date,
            inputValue,
            code,
          });
      
          if (response.data === "success") {
            alert("Saved to database");
            const newitem = {date : date,Hours : inputValue}
            const updateditems = [...items,newitem]
            setitems(updateditems)
          } else if (response.data === "fail") {
            alert("Cannot save to database: fail");
          }
        } catch (error) {
          // Handle errors if any
          console.log(error);
          alert("Cannot save to database: error");
        }
      };

    const getTotalWorkedHoursForCurrentMonth = () => {
        let totalHours = 0;
    
        // Loop through the items array
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
          <span className="month-name">{format(currentDate, "MMMM yyyy")}</span>
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