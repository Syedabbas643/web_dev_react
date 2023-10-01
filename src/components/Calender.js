import React,{ useState,useEffect } from "react";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, setMonth } from "date-fns";
import Popup from "./Popup";
import axios from "axios"
import "./Calender.css"
import logo from "../logo.svg"
import { useLocation} from "react-router-dom"
const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const Calendar = () => {
    const [showPopup, setShowPopup] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selecteddateot,setselecteddateot] = useState("0");
    const [selecteddateleave,setselecteddateleave] = useState("0");
    const [userdata, setUserdata] = useState(null);
    const [items,setitems] = useState(null);
    const [leave,setleave] = useState(null);
    const [loading, setLoading] = useState(true);
    const [salary,setsalary] = useState(null);
    const [pf,setpf] = useState(null);
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
              setsalary(parseInt(tempjson.salary,10))
              setpf(tempjson.pf)
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

      const isDateInleaveArray = (dateToCheck) => {
        return leave.some((item) => isSameDay(new Date(item.date), dateToCheck));
      };

      const findValueot = (dateToCheck) => {
        const itemWithDate = items.find((item) => isSameDay(new Date(item.date), dateToCheck));
        return itemWithDate ? itemWithDate.Hours : "0"; 
      };

      const findValueleave = (dateToCheck) => {
        const itemWithDate = leave.find((item) => isSameDay(new Date(item.date), dateToCheck));
        return itemWithDate ? itemWithDate.Hours : "0"; 
      };
      
      const renderDay = (day) => {
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isInJsonArray = isDateInJsonArray(day);
        const isinleavearray = isDateInleaveArray(day);
      
        const handleDayClick = () => {
          setSelectedDate(day);
          setselecteddateot(findValueot(day))
          setselecteddateleave(findValueleave(day))
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
            <span className={`day-number ${isinleavearray ? "highlightedleave" : ""}`}>{format(day, "d")}</span>
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

    const gettotalleavedays = () =>{
          let totalHours = 0
          let totaldays = 0
          leave.forEach((item) =>{
            const itemleave = new Date(item.date);
            if (isSameMonth(itemleave, monthStart) || isSameMonth(itemleave, monthEnd)) {
              // If the date is within the current month, add the worked hours to the total
              totalHours += parseInt(item.Hours, 10);
            }
            totaldays = totalHours/8
          })
          return totaldays
      };

    const otsalary = () =>{
        let days = format(monthEnd, "dd")
        let onehoursalary = salary / days / 8;
        let totalothours = (parseInt(getTotalWorkedHoursForCurrentMonth(),10) / 2) + parseInt(getTotalWorkedHoursForCurrentMonth(),10)
        let otsalary = onehoursalary * totalothours
        return Math.ceil(otsalary)
      }

    const getdeductsalary = () =>{
        let days = format(monthEnd, "dd")
        let amount = 0
        if (pf){
            let commonpf = salary>= 15000 ? 1800 : salary*0.12
            let onedaypf = commonpf / days
            let attendance = days - gettotalleavedays()
            let pfamount = (onedaypf * attendance) + 6

            let total = salary + otsalary()
            let esi = total*0.0075
            amount = pfamount + esi
        }else{
          let total = salary + otsalary()
            let esi = total*0.0075
            amount = esi
        }
        return Math.ceil(amount)
      }

    const getsalary = () =>{
        let totalHours = 0
        leave.forEach((item) =>{
          const itemleave = new Date(item.date);
            if (isSameMonth(itemleave, monthStart) || isSameMonth(itemleave, monthEnd)) {
              // If the date is within the current month, add the worked hours to the total
              totalHours += parseInt(item.Hours, 10);
            }
          })
        let days = format(monthEnd, "dd")
        let onehoursalary = salary / days / 8;
        let debitsalary = totalHours * onehoursalary
        let totalsalary = salary + otsalary() - debitsalary - getdeductsalary()
        return Math.ceil(totalsalary)
      }

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
        return <div className="App-header">
                  <img src={logo} className="App-logo" alt="logo" />
                <p>
                  Loading...
                </p>
            </div>;
      }
  
    return (
      <div className="calendar">
            <header className="clheader">Welcome Back, &gt; {userdata.Name.toUpperCase()} &lt;</header>
        {showPopup && (
          <Popup date={format(selectedDate, dateFormat)} ot ={selecteddateot} lea={selecteddateleave} onClose={handleClosePopup} onSubmit={handlePopupSubmit} />
        )}
        <div className="headercl">
          <div>
        <span className="month-name">{format(selectedMonth, "MMMM yyyy")}</span>
        </div>
        <div>
        <select
          className="month-selector"
          //value={format(selectedMonth, "MMMM")}
          onChange={handleMonthChange}
        >
          {months.map((month, index) => (
            <option key={index} value={index}>
              {month}
            </option>
          ))}
        </select></div>
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
        <div className="grid-container">
            <div className="ddisplay">
                <h3>Total OT hours</h3>
                <h3 className="hoursdisplay">{getTotalWorkedHoursForCurrentMonth()} Hours</h3>
              </div>
              <div className="lvdisplay">
                <h3>Total Leave days</h3>
                <h3 className="leavedisplay">{gettotalleavedays()} Days</h3>
              </div>
              <div className="sdisplay">
                <h3>OT hours salary</h3>
                <h3 className="otsalarydisplay">Rs {otsalary()}</h3>
              </div>
              <div className="pdisplay">
                <h3>PF and ESI</h3>
                <h3 className="pfdisplay">Rs {getdeductsalary()}</h3>
              </div>
            <div className="totalsalarydisplay">
                <h3>Expected salary</h3>
                <h3 className="amountdisplay">Rs {getsalary()}</h3>
            </div>
          </div>
        <footer className="clfooter">
        <h2>GaMeR &copy; 2023</h2>
      </footer>
      </div>
    );
  };
  
  export default Calendar;