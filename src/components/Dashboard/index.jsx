import React, { useEffect, useRef, useState, useReducer } from "react";
import db from "./index.module.css";
import axios from "axios";

function Dashboard() {
  const [search, setSearch] = useState("");
  const [result,setResult]=useState([])
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
  const sendSearch = async (keyword) => {
    await axios
      .get(`${BACKEND_API_PREFIX}/training/status/${keyword}`)
      .then((res) => {
        setResult(res.data)
      });
  };

  function handleInput(e) {
    setSearch(e.target.value);
  }
  function handleSearch() {
    console.log(search);
    sendSearch(search)
  }
  return (
    <div>
      <div className={db.search}>
        <input
          placeholder="search a dataset"
          onKeyUp={(e) => handleInput(e)}
        ></input>
        <button onClick={handleSearch}>Search</button>
      </div>
      <div>
        {
          result!==null && result.map((item,i)=>{return <div key={i}>{item}</div>})
        }
      </div>
    </div>
  );
}

export default Dashboard;
