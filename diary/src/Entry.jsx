import React, { useEffect, useState } from "react";
import axios from "axios";

const Entry = () => {
    
  const [formData, setFormData] = useState({
    color: "",
    dateTime: "",
    tags: [],
    data: ""
  });
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const accessToken = localStorage.getItem("Diary_accessToken");
      const response = await axios.post("http://localhost:3001/Entry", formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      console.log("Data posted successfully:", response.data);
      setEntries([...entries, response.data.entry]);
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  return (
    <div className="entry">
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
            type="number"
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
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(",") })}
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
  )
}

export default Entry