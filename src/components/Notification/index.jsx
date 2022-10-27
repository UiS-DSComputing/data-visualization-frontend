import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import no from "./index.module.css";
import { RiUserShared2Line, RiUserReceived2Line } from "react-icons/ri";
import { BsCircleFill } from "react-icons/bs";

function Notification() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const [type, setType] = useState("receive");
  const [msgS, setMsgs] = useState([]);
  const [msgR, setMsgR] = useState([]);

  const m = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "July",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  const getNotification = async () => {
    await axios
      .get(`${BACKEND_API_PREFIX}/message/notice`, config)
      .then((res) => {
        let tmp = res.data.map((item) => {
          let date = new Date(item.send_at * 1000);
          item.send_at =
            date.getHours() +
            ":" +
            date.getMinutes() +
            "   \xa0\xa0" +
            m[date.getMonth() + 1] +
            ". " +
            date.getDate();

          return item;
        });
        setMsgR(tmp);
      });
  };

  useEffect(() => {
    getNotification();
  }, []);

  function handleChange(title) {
    setType(title);
  }

  return (
    <div className={no.layout}>
      <h1>Notification Center</h1>
      <div className={no.main}>
        <div className={no.types}>
          <div
            className={type === "send" ? no.type_active : no.type}
            onClick={() => handleChange("send")}
          >
            <RiUserShared2Line /> Sended
          </div>
          <div
            className={type === "receive" ? no.type_active : no.type}
            onClick={() => handleChange("receive")}
          >
            <RiUserReceived2Line /> Received
          </div>
        </div>
        <div className={no.msgs}>
          {type === "send" &&
            msgS.length !== 0 &&
            msgS.map((msg, i) => {
              return <Msg item={msg} key={i} type={"send"} />;
            })}
          {type === "receive" &&
            msgR.length !== 0 &&
            msgR.map((msg, i) => {
              return <Msg item={msg} key={i} type={"title"} />;
            })}
        </div>
      </div>
    </div>
  );
}

function Msg(props) {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const { item } = props;
  const [click, setClick] = useState(false);
  const [msg, setMsg] = useState({});
  const [has, setHas] = useState(item.have_read === 0);
  const [decide, setDecide] = useState(false);
  const [decision, setDecision] = useState("Accepted");
  const [type, setType] = useState("permission")

  const getMsg = async () => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/message/content/${item.id}`, config)
        .then((res) => {
          setMsg(res.data)
          if(res.data.link.includes("download")){
            setType("FL")
          }
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };


  const sendAcc = async () => {
    try {
      await axios
        .get(
          `${BACKEND_API_PREFIX}${msg.link}`,
          config
        )
        .then((res) => {});
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  function handleClick(id) {
    setClick(!click);
    getMsg();
    setHas(false);
  }

  function handlePre(type) {
    if (type === "yes") {
      sendAcc()
      window.alert("Request accepted.");
      setDecide(true);
    } else {
      window.alert("Request refused.");
      setDecide(true);
      setDecision("Refused");
    }
  }

  const handleDw = async () => {
    try {
      await axios
        .get(
          `${BACKEND_API_PREFIX}${msg.link}`,
          config
        )
        .then((res) => {});
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };
  // dangerouslySetInnerHTML={{ __html: msg }}
  return (
    <div className={no.msg}>
      <div className={no.title} onClick={() => handleClick(item.id)}>
        <div>
          {has && <BsCircleFill size="0.3em" color="red" />} {item.title}
        </div>
        <div>{item.send_at}</div>
      </div>
      {click && (
        <div className={no.msg_main}>
          <div dangerouslySetInnerHTML={{ __html: msg.content }} style={{textAlign:"left"}}></div>
          {!decide &&type==="permission"&&(
            <div className={no.btn_row}>
              <button className={no.acc} onClick={() => handlePre("yes")}>
                Accept
              </button>
              <button className={no.ref} onClick={() => handlePre("no")}>
                Refuse
              </button>
            </div>
          )}
          {decide &&type==="permission"&& <div className={no.btn}>Decision made: {decision}</div>}
          {/* {type==="FL"&&<button onClick={()=>handleDw()} className={no.fl_btn}>Click to download</button>} */}
        </div>
      )}
    </div>
  );
}

export default Notification;