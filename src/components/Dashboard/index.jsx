import React, { useEffect, useRef, useState, useReducer } from "react";
import db from "./index.module.css";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../common/file-upload/file-upload.component";
import logo from "../../assets/uis.png";
import a1 from "../../assets/a1.JPG";
import a2 from "../../assets/a2.PNG";


function Dashboard() {

  const token = useSelector((state) => state.accessToken);

  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

  const [results, setResults] = useState([a1,a2])
  const sendSearch = async (keyword) => {
    await axios
      .get(`${BACKEND_API_PREFIX}/training/status/${keyword}`,config)
      .then((res) => {
        // setResult(res.data)
      });
  };

  return (
    <div>
      <div className={db.bigSearch}>
        <div>
          <FileUpload/>
        </div>
      </div>
      <h2 className={db.len}>{results.length} Results</h2>
      <div className={db.results}>
        
        {
          results.map((item,i)=>{
            return <div className={db.imgc}><img src={item} key={i}></img></div>
          })
        }
      </div>
    </div>
  );
}


export default Dashboard;
