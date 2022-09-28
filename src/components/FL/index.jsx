import axios from "axios";
import { map } from "jquery";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { IoAddCircleOutline, IoDownloadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import fl from "./index.module.css";
import PopBox from "../PopBox";

function FL() {
  const user_id = useSelector((state) => state.user_id);
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const [allFiles, setAllFiles] = useState([]);
  const dispatch1 = useDispatch();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const loadAllFiles = async () => {
    try {
      await axios
        .get(`http://localhost:8000/file-collection/${user_id}`, config)
        .then((res) => {
          setAllFiles(res.data);
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };
  useEffect(() => {
    loadAllFiles();
  }, []);

  return (
    <div>
      <Table />
    </div>
  );
}
function Table() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://localhost:8000";
  const [pop, setPop] = useState(false);
  // all the tasks
  const [allTasks, setAllTasks] = useState([
    {
      id:"shsshs",
      task:"task1",
      status:1
    },
    {
      id:"shsshs",
      task:"task1",
      status:2
    },
    {
      id:"shsshs",
      task:"task1",
      status:3
    },
    {
      id:"shsshs",
      task:"task1",
      status:0
    }
  ]);
  // tasks for filter
  const [showTasks, setShowTasks] = useState([]);
  const status = [
    {
      id:0,
      value:"All"
    },
    {
      id: 1,
      value: "Running",
      color: "#278327",
    },
    {
      id: 2,
      value: "Stopped",
      color: "#a34242",
    },
    {
      id: 3,
      value: "Finished",
      color: "#f1ca58",
    },
    {
      id: 4,
      value: "Waiting",
      color: "#888",
    }
  ];
  const [type, setType] = useState("All")
  function PopUp(is) {
    setPop(is);
  }
  function addRequest(r) {
    let tmptasks = allTasks;
    tmptasks.push(r);
    setAllTasks(tmptasks);
    setShowTasks(tmptasks);
  }
  const getStatus = async (id) => {
    try {
      await axios.get(`${BACKEND_API_PREFIX}/training/status/${id}`).then((res) => {
        return res.data;
      });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  // useEffect(() => {
  //   let date = new Date();
  //   const interval = setInterval(() => {
  //     let tmp = allTasks.map((task) => {
  //       // string into number
  //       // running->0, stopped->1, finished->2
  //       task.status = getStatus(task.id);
  //       task.lastUpdate =
  //         date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
  //       return task;
  //     });
  //     setAllTasks(tmp);
  //     setShowTasks(tmp);
  //   }, 60000);
  //   return () => clearInterval(interval);
  // }, []);

  function handleFilter(type) {
    let tmp = [];
    if (type === "Running") {
      tmp = allTasks.filter((task) => task.status === 0);
    } else if (type === "Stopped") {
      tmp = allTasks.filter((task) => task.status === 1);
    } else if(type==="Finished"){
      tmp = allTasks.filter((task) => task.status === 2);
    }else{
      tmp=allTasks
    }
    setShowTasks(tmp);
    setType(type)
  }

  const handleDownload = async (link) => {
    try {
      await axios({
        type:'get',
        url:`${BACKEND_API_PREFIX}/download/${link}`,
        responseType: 'blob'
      }).then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement('a');
        link.href = href;
        link.setAttribute('download', 'file.zip'); //or any other extension
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
    <div>
      <div className={fl.tools}>
        <div className={fl.switch}>
          <div style={{ border: "none", fontSize: "1.2em" }}>
            Requested Trains
          </div>
          <div className={fl.radio_toolbar} name="model" id="model">
            {status.map((item) => {
              return (
                <label
                  key={item.value}
                  className={item.value === type ? fl.checked : fl.normal}
                >
                  <input
                    type="radio"
                    value={item.value}
                    name="model"
                    onClick={() => handleFilter(item.value)}
                  />
                  {item.value}
                </label>
              );
            })}
          </div>
        </div>
        <div className={fl.newbtn} onClick={() => PopUp(true)}>
          <IoAddCircleOutline color="white" />
          &nbsp;New Train Request
        </div>
      </div>
      <table className={fl.tasks}>
        <thead>
          <tr>
            <th>No.</th>
            <th>JOB ID</th>
            <th>Task</th>
            <th>Rounds</th>
            <th>Cur. Status</th>
            <th>Clients</th>
            <th>Global Model</th>
            <th>Metrics</th>
            <th>Last Update</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((item, i) => {
            return (
              <tr key={i}>
                <td>{i}</td>
                <td>{item.id}</td>
                <td>{item.task}</td>
                <td>{item.rounds}</td>
                <td
                  style={{
                    backgroundColor: status[item.status+1].color,
                    color: "white",
                  }}
                >
                  {status[item.status+1].value}
                </td>
                <td>{item.client}</td>
                <td>{item.model}</td>
                <td>{item.metrics}</td>
                <td>{item.lastUpdate}</td>
                <td onClick={handleDownload(item.id)}><IoDownloadOutline /></td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pop && <PopBox PopUp={PopUp} type={"request"} addRequest={addRequest} />}
    </div>
  );
}
export default FL;
