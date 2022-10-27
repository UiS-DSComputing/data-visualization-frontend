import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import logo from "../../assets/a1.JPG";
import dp from "./index.module.css";
import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/";

function DatasetPage(props) {
  let { id } = useParams();

  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const [mine, setMine] = useState(false)
  const [data, setData] = useState({
    dataset:"tmp"
  });
  const getDB = async (id) => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/dataset/${id}`, config)
        .then((res) => {
          console.log(res.data);
          setData(res.data);
          if(res.data.url.includes("permission/apply")){
            setMine(false)
          }else{
            setMine(true)
          }
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getDB(id);
  }, []);

  function handleRV() {
    //send request for view
  }

  function handleRD() {
    // send request for Using
    window.alert("Request sended.")
    // console.log(id)
    sendREQ(id)
  }

  const sendREQ = async (id) => {
      await axios
        .get(`${BACKEND_API_PREFIX}/dataset/permission/apply/${id}`, config)
        .then((res) => {
        });
  };


  const handleDw = async () => {
    try {
      await axios({
        type: "get",
        url: `${BACKEND_API_PREFIX}${data.url}`,
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "dataset.zip"); //or any other extension
        document.body.appendChild(link);
        link.click();
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };
  return (
    <div className={dp.layout}>
      <button className={dp.back} onClick={() => navigate(-1)}>
        <BsArrowLeft size={"1.2em"} />
        &nbsp;&nbsp;Go back to market
      </button>
      <div className={dp.main}>
        <div className={dp.tags}>
          <div className={dp.tag}>#{data.datatype}</div>
          <div className={dp.tag}>#{data.filetype}</div>
        </div>
        <h1>{data.dataset}</h1>
        <div>Owner: {data.name}</div>
        <div className={dp.info}>
          <div className={dp.desc}>{data.description}</div>
          <img src={logo} className={dp.img}></img>
        </div>
        {(!mine)&&<div>
          <button className={dp.apply} onClick={() => handleRV()}>
            Request Sample
          </button>
          <button className={dp.apply} onClick={() => handleRD()}>
            Buy the dataset
          </button>
          <button className={dp.apply}>
            Rent the dataset
          </button>
        </div>}
        {mine&&<button className={dp.apply} onClick={()=>handleDw()}>Download Dataset</button>}
        {/* <div className={dp.other}>
          <h3 className={dp.stitle}>Dataset Users</h3>
          <div>UiS</div>
        </div> */}
      </div>
    </div>
  );
}

export default DatasetPage;
