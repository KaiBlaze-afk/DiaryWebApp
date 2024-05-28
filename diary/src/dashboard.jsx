import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IMG from "./assets/profile.png";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [formData, setFormData] = useState({
    color: "",
    dateTime: "",
    tags: [],
    data: "",
  });
  const [Dateselected, setDateSelected] = useState(new Date());
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

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
        const sortedEntries = response.data.entries.sort(
          (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
        );
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
        { ...formData, tags },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("Data posted successfully:", response.data);
      setEntries(
        [...entries, response.data.entry].sort(
          (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
        )
      );
    } catch (error) {
      console.error("Error posting data:", error);
    }
    handleMode();
  };

  const handleMode = () => {
    setEditMode(!editMode);
    if (!editMode) {
      const today = new Date();
      setFormData((prevData) => ({
        ...prevData,
        dateTime: today.toISOString(),
      }));
      setDateSelected(today);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleDateSelect = (date) => {
    setDateSelected(date);
    setFormData((prevData) => ({
      ...prevData,
      dateTime: date.toISOString(),
    }));
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
                <li>Words: 128</li>
                <li>Entries: 2</li>
                <li>Streak: 1</li>
                <li>Tags Used: 5</li>
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
                  onSelect={handleDateSelect}
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

      <div
        className={
          editMode
            ? "bg-black flex items-center justify-center h-screen"
            : "hidden"
        }
      >
        <div className="bg-gradient-to-b from-[#005DB3] to-[#00D1FF] w-[70vw] h-[85vh] rounded-[30px] p-6">
          <div className="bg-[#EEF6FF] rounded-3xl h-full grid grid-rows-6 overflow-hidden">
            <div className="header row-span-1 flex justify-between items-center pt-4 px-6">
              <div className="date">
                <span className="text-4xl">
                  {Dateselected.getDate().toString().padStart(2, "0")}/
                  {(Dateselected.getMonth() + 1).toString().padStart(2, "0")}
                </span>{" "}
                <span>{getDayName(Dateselected)}</span>
              </div>
              <div className="banner font-ole text-6xl">It's our Secret...</div>
            </div>
            <div className="main row-span-5 bg-[#EEF6FF] grid grid-cols-7 h-full pb-6 pl-6">
              <div className="contentEntry col-span-6 border-2 border-black rounded-lg flex flex-col">
                <div className="bg-white px-6 py-2 flex justify-between">
                  <ul className="flex space-x-4">
                    {tags.map((tag, index) => (
                      <li
                        key={index}
                        className="text-xs text-white bg-[#d0d0d0] px-5 rounded-xl flex items-center cursor-pointer"
                        onClick={() => handleRemoveTag(tag)}
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <div className="relative flex mx-6">
                    <input
                      type="text"
                      className="relative m-0 block flex-auto rounded border border-solid border-blue-400 bg-transparent bg-clip-padding px-3 text-base font-normal leading-[1.6] text-surface outline-none transition duration-200 ease-in-out placeholder:text-500 focus:z-[3] focus:border-primary focus:shadow-inset focus:outline-none motion-reduce:transition-none"
                      placeholder="Enter tag"
                      aria-label="tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                    />
                    <button onClick={handleAddTag}>➕</button>
                  </div>
                </div>
                <textarea
                  name="data"
                  autoFocus
                  maxLength={9999}
                  className="outline-0 text-[#393939] resize-none flex-grow w-full rounded-md p-4 overflow-auto"
                  value={formData.data}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="options p-4 flex flex-col justify-between items-center">
                <ul className="border-2 flex flex-col justify-between items-center border-gray-600">
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#F2F3E9] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 1 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#E9FDDD] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 2 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#F8DDFD] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 3 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#DFFFD6] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 4 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#FFD5E9] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 5 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#D6EFFF] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 6 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#FFF2CC] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 7 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#D6FFFA] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 8 })}
                  ></li>
                  <li
                    className="border border-black m-2 h-3 w-[4rem] bg-[#DAF0FF] cursor-pointer"
                    onClick={() => setFormData({ ...formData, color: 9 })}
                  ></li>
                </ul>
                <div className="buttons flex flex-col justify-between w-full">
                  <button
                    className="leave border-2 border-red-800 m-2 p-1 rounded-md text-white bg-[#FF8989]"
                    onClick={handleMode}
                  >
                    Leave
                  </button>
                  <button
                    className="save border-2 border-green-700 m-2 p-1 rounded-md text-white bg-[#5af24d]"
                    onClick={handleSubmit}
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
