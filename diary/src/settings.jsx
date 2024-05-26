import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const accessToken = localStorage.getItem("Diary_accessToken");
    axios
      .get("http://localhost:3001/", {
        headers: {
          Authorization: `Bearer ${accessToken}`
        },
      })
      .then((response) => {
        console.log(response.data.entries)
        console.log(response.data.userInfo)
      })
      .catch((e) => {
        localStorage.removeItem("Diary_accessToken");
        navigate("/login");
      });
  }, []);

  return (
    <div>
      <h1>Welcome</h1>
    </div>
  );
};

export default Settings;
