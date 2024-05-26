import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IMG from "./assets/profile.png";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [editMode, seteditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState({
    color: "",
    dateTime: "",
    tags: [],
    data: "",
  });
  const [Dateselected, setDateSelected] = useState();

  function getDayName(dateString) {
    const date = new Date(dateString);
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const dayIndex = date.getDay();
    return daysOfWeek[dayIndex];
  }

  useEffect(() => {
    const accessToken = localStorage.getItem("Diary_accessToken");
    axios
      .get("http://localhost:3001/dashboard", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => {
        const sortedEntries = response.data.entries.sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
        setEntries(sortedEntries);
        setUserInfo(response.data.userInfo);
        console.log(response.data);
      })
      .catch((e) => {
        localStorage.removeItem("Diary_accessToken");
        navigate("/login");
      });
  }, [navigate]);

  const CardDesign = ({ date, day, bgColor, entry, tags, _id }) => {
    return (
      <div className="pt-5 mr-3">
        <div className="date">
          <span className="font-semibold text-4xl">{date} </span>
          <span className="font-thin">{day}</span>
        </div>
        <div
          className={`card ${
            bgColor == 1
            ? "bg-[#F2F3E9]" 
            : bgColor == 2
            ? "bg-[#E9FDDD]"  
            : bgColor == 3
            ? "bg-[#F8DDFD]"  
            : bgColor == 4
            ? "bg-[#DFFFD6]"  
            : bgColor == 5
            ? "bg-[#FFD5E9]"  
            : bgColor == 6
            ? "bg-[#D6EFFF]"  
            : bgColor == 7
            ? "bg-[#FFF2CC]"  
            : bgColor == 8
            ? "bg-[#D6FFFA]"
            : "bg-[#DAF0FF]"      
          } rounded-lg p-2 my-2`}
        >
          <div className="headOfCard flex justify-between">
            <ul className="tags flex">
              {tags.map((tag, index) => (
                <li
                  key={index}
                  className="bg-[#c3c3c3] text-white px-3 py-1 text-xs rounded-xl mx-1"
                >
                  {tag}
                </li>
              ))}
            </ul>
            <div className="cardEdit">
              <button className="cardEdit mr-1">✏️</button>
              <button
                className="cardDelete ml-1"
                onClick={() => handleDelete(_id)}
              >
                ❌
              </button>
            </div>
          </div>
          <div className="cardData text-[#4d4c4c] mt-2">{entry}</div>
        </div>
      </div>
    );
  };

  const handleDelete = async (entryId) => {
    try {
      const accessToken = localStorage.getItem("Diary_accessToken");
      const response = await axios.delete(
        `http://localhost:3001/entry/${entryId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Entry deleted successfully:", response.data);
      setEntries(entries.filter((entry) => entry._id !== entryId));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("Diary_accessToken");
      const response = await axios.post(
        "http://localhost:3001/Entry",
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Data posted successfully:", response.data);
      setEntries([...entries, response.data.entry].sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)));
    } catch (error) {
      console.error("Error posting data:", error);
    }
    handleMode();
  };
  const handleMode = () => {
    seteditMode(!editMode);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const logout = (e) => {
    localStorage.removeItem("Diary_accessToken");
    navigate("/login");
  };

  return (
    <>
      <div
        className={
          !editMode
            ? "bg-black flex items-center justify-center h-screen "
            : "hidden"
        }
      >
        <div className="bg-gradient-to-b from-[#005DB3] to-[#00D1FF] grid grid-cols-5 w-[70vw] h-[85vh] rounded-[30px]">
          <div className="sidebar flex items-center justify-between flex-col py-6">
            <div className="profile flex items-center justify-center flex-col">
              <img
                src={IMG}
                alt=""
                className="h-[9rem] rounded-full border-4"
              />
              <div className="username text-white text-2xl p-2">Adarsh</div>
            </div>
            <div className="score bg-slate-50 h-60 w-40 flex items-center justify-around flex-col rounded-lg">
              <div className="text-xl underline mt-2">Your Record</div>
              <ul className="flex items-center justify-around flex-col h-[80%]">
                <li>Words: 98</li>
                <li>Entries: 445</li>
                <li>Streak: 54</li>
                <li>Tags Used: 12</li>
              </ul>
            </div>
            <button
              className="logout text-white bg-[#003470] px-8 py-3 rounded-2xl"
              onClick={() => logout()}
            >
              Log out
            </button>
          </div>
          <div className="main col-span-4 bg-white rounded-3xl my-6 mr-6 grid grid-cols-5 overflow-hidden">
            <div className="entrypage bg-[#EEF6FF] col-span-3 pl-5 overflow-y-scroll custom-scrollbar">
              <div className="block">
                {entries.map((entry, index) => (
                  <CardDesign
                    key={index}
                    date={
                      entry.dateTime.slice(8, 10) +
                      "/" +
                      entry.dateTime.slice(5, 7)
                    }
                    day={getDayName(entry.dateTime)}
                    bgColor={entry.color}
                    entry={entry.data}
                    tags={entry.tags}
                    _id={entry._id}
                  />
                ))}
              </div>
            </div>
            <div className="sideMain flex flex-col items-center col-span-2 justify-between">
              <div className="cal rounded-lg">
                <DayPicker
                  captionLayout="dropdown-buttons"
                  fromYear={2010}
                  toYear={2024}
                  mode="single"
                  selected={Dateselected}
                  onSelect={setDateSelected}
                />
                <button className="py-2 w-full bg-teal-200 mb-5 rounded-lg">
                  Reset
                </button>
                <div className="relative flex mx-6">
                  <input
                    type="search"
                    className="relative m-0 block flex-auto rounded border border-solid border-blue-400 bg-transparent bg-clip-padding px-3 py-[0.25rem] text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-neutral-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none"
                    placeholder="Search"
                    aria-label="Search"
                    id="exampleFormControlInput2"
                    aria-describedby="button-addon2"
                  />
                  <span
                    className="flex items-center whitespace-nowrap px-3 py-[0.25rem] text-surface text-blue-500 [&>svg]:h-5 [&>svg]:w-5"
                    id="button-addon2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="2"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                      />
                    </svg>
                  </span>
                </div>
              </div>
              <button
                onClick={handleMode}
                className="newEntry m-10 py-3 px-11 bg-[#c8fff5] text-gray-600 rounded-xl text-2xl"
              >
                New Entry
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className={editMode ? "block" : "hidden"}>
        <h1>Create New Entry</h1>

        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="color">Color:</label>
            <input
              type="text"
              id="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="dateTime">Date:</label>
            <input
              type="text"
              id="dateTime"
              name="dateTime"
              value={formData.dateTime}
              onChange={handleChange}
            />
          </div>

          <div>
            <label htmlFor="tags">Tags:</label>
            <input
              type="text"
              id="tags"
              name="tags"
              value={formData.tags.join(",")}
              onChange={(e) =>
                setFormData({ ...formData, tags: e.target.value.split(",") })
              }
            />
          </div>

          <div>
            <label htmlFor="data">Data:</label>
            <textarea
              id="data"
              name="data"
              value={formData.data}
              onChange={handleChange}
            />
          </div>

          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};

export default Dashboard;
