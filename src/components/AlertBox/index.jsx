import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { IoAddCircleOutline, IoDownloadOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import { BsCircleFill} from "react-icons/bs";
import ab from "./index.module.css"

function AlertBox() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const [has, setHas] = useState(false);

  const getNotification = async () => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/message/notice`, config)
        .then((res) => {
          let tmp=res.data;
          let tmp2=tmp.filter(item=>item.have_read===0);
          if(tmp2.length!==0){
            setHas(true)
          }else{
            setHas(false)
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
    getNotification() 
    const interval = setInterval(() => {
      getNotification()      
    }, 10000);
    return () => clearInterval(interval);
  }, [])
  
  
  return (
    <div className={ab.main}>
      {has&&<BsCircleFill color="orange"/>}
    </div>
  );
}

export default AlertBox;
