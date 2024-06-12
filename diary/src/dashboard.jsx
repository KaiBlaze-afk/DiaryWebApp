import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import IMG from "./assets/dp.jpeg";
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
  const [uniqueTagsCount, setUniqueTagsCount] = useState(0);
  const [daysWithEntries, setDaysWithEntries] = useState(0);
  const [totalWordCount, setTotalWordCount] = useState(0);

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
        calculateUniqueTags(sortedEntries);
        calculateDaysWithEntries(sortedEntries);
        calculateTotalWordCount(sortedEntries);
        console.log(response.data);
      })
      .catch((e) => {
        localStorage.removeItem("Diary_accessToken");
        navigate("/login");
      });
  }, [navigate]);

  const calculateUniqueTags = (entries) => {
    const allTags = entries.flatMap((entry) => entry.tags);
    const uniqueTags = new Set(allTags);
    setUniqueTagsCount(uniqueTags.size);
  };

  const calculateDaysWithEntries = (entries) => {
    const uniqueDays = new Set(
      entries.map((entry) => new Date(entry.dateTime).toDateString())
    );
    setDaysWithEntries(uniqueDays.size);
  };

  const calculateTotalWordCount = (entries) => {
    const totalWords = entries.reduce(
      (acc, entry) => acc + entry.data.split(" ").length,
      0
    );
    setTotalWordCount(totalWords);
  };

  const CardDesign = ({ date, month, day, bgColor, entry, tags, _id }) => {
    return (
      <div className="pt-5 mr-2 w-[95%]">
        <div className="date">
          <span className="font-thin text-4xl">
            {date}{" "}{month}{" "}
          </span>
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
      const updatedEntries = entries.filter((entry) => entry._id !== entryId);
      setEntries(updatedEntries);
      calculateStreak(updatedEntries);
      calculateUniqueTags(updatedEntries);
      calculateDaysWithEntries(updatedEntries);
      calculateTotalWordCount(updatedEntries);
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
      const updatedEntries = [...entries, response.data.entry].sort(
        (a, b) => new Date(b.dateTime) - new Date(a.dateTime)
      );
      setEntries(updatedEntries);
      calculateStreak(updatedEntries);
      calculateUniqueTags(updatedEntries);
      calculateDaysWithEntries(updatedEntries);
      calculateTotalWordCount(updatedEntries);
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
        <div className="bg-gradient-to-b from-[#005DB3] to-[#00D1FF] grid grid-cols-5 w-[70vw] h-[85vh] rounded-[20px] overflow-hidden p-6 space-x-5">
          <div className="sidebar flex items-center justify-between flex-col py-6">
            <div className="profile flex items-center justify-center flex-col">
              <img
                src={IMG}
                alt=""
                className="h-[9rem] rounded-full border-2"
              />
              <div className="username text-white text-2xl p-2">
                {userInfo.username}
              </div>
              <div
                className="logout bg-[#015796] text-white text-sm p-2 px-6 rounded-lg cursor-pointer"
                onClick={logout}
              >
                Logout
              </div>
            </div>
            <div className="score bg-slate-50 h-60 w-40 flex items-center justify-around flex-col rounded-lg">
              <div className="text-xl underline mt-2">Your Record</div>
              <ul className="flex items-center justify-around flex-col h-[80%]">
                <li className="text-lg">Tags Used: {uniqueTagsCount}</li>
                <li className="text-lg">Days of Entry: {daysWithEntries}</li>
                <li className="text-lg">Total Words: {totalWordCount}</li>
              </ul>
            </div>
            <button
              className="bg-[#015796] text-white text-2xlrounded-full p-3 px-10"
              onClick={handleMode}
            >
              New Entry
            </button>
          </div>
          <div className=" border-2 border-black flex items-center justify-start flex-col col-span-4 bg-slate-50 overflow-y-auto p-6">
            {entries.map((entry, index) => {
              const date = new Date(entry.dateTime).toLocaleDateString(
                "en-US",
                {
                  day: "numeric",
                  month: "long",
                }
              );
              const day = getDayName(entry.dateTime);
              return (
                <CardDesign
                  key={index}
                  date={date.split(" ")[1]}
                  month={date.split(" ")[0]}
                  day={day}
                  bgColor={entry.color}
                  entry={entry.data}
                  tags={entry.tags}
                  _id={entry._id}
                />
              );
            })}
          </div>
        </div>
      </div>
      <div
        className={
          editMode
            ? "bg-black flex items-center justify-center h-screen "
            : "hidden"
        }
      >
        <div className="bg-gradient-to-b p-6 space-x-5 from-[#005DB3] to-[#00D1FF] grid grid-cols-5 w-[70vw] h-[85vh] rounded-[20px]">
          <div className="sidebar flex items-center justify-between flex-col py-6">
            <div className="profile flex items-center justify-center flex-col">
              <img
                src={IMG}
                alt=""
                className="h-[9rem] rounded-full border-2"
              />
              <div className="username text-white text-2xl p-2">
                {userInfo.username}
              </div>
              <div
                className="logout bg-[#015796] text-white text-sm p-2 px-6 rounded-lg cursor-pointer"
                onClick={logout}
              >
                Logout
              </div>
            </div>
            <div className="score bg-slate-50 h-60 w-40 flex items-center justify-around flex-col rounded-lg">
              <div className="text-xl underline mt-2">Your Record</div>
              <ul className="flex items-center justify-around flex-col h-[80%]">
                <li className="text-lg">Tags Used: {uniqueTagsCount}</li>
                <li className="text-lg">Days of Entry: {daysWithEntries}</li>
                <li className="text-lg">Total Words: {totalWordCount}</li>
              </ul>
            </div>
            <button
              className="bg-[#015796] text-white text-2xlrounded-full p-3 px-10"
              onClick={handleMode}
            >
              Close
            </button>
          </div>

          <div className="p-5 items-center border-2 border-black justify-center flex-col col-span-4 bg-slate-50 overflow-y-auto ">
            <div className="text-3xl font-bold font-ole">its our Secret...</div>
            <form onSubmit={handleSubmit} className="flex flex-col ">
              <textarea
                name="data"
                value={formData.data}
                onChange={handleChange}
                className="p-2 mb-4 border rounded-md"
                placeholder="Enter your entry..."
                rows="5"
                required
              ></textarea>
              <div className="flex mb-4">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="p-2 border rounded-md flex-1"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 bg-[#015796] text-white w-40 p-2 rounded-md"
                >
                  Add Tag
                </button>
              </div>
              <div className="tags mb-4">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-[#c3c3c3] text-white px-3 py-1 text-xs rounded-xl mx-1 cursor-pointer"
                    onClick={() => handleRemoveTag(tag)}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-around">
              <div className="w-fit bg-blue-50">
                <DayPicker
                  className="w-fit"
                  selected={Dateselected}
                  onDayClick={handleDateSelect}
                />
              </div>
              <div className="flex flex-col justify-around">
              <ul className="border-2 flex flex-col w-fit justify-between items-center border-gray-600">
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
              <button
                type="submit"
                className="bg-[#015796] text-white p-2 w-fit rounded-md"
              >
                Save Entry
              </button>
              </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
