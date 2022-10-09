import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { IoAddCircleOutline, IoDownloadOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import fl from "./index.module.css";
import PopBox from "../PopBox";
import { GrClose } from "react-icons/gr";
import { Link } from "react-router-dom";

function FL() {
  // const user_id = useSelector((state) => state.user_id);
  // const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  // const [allFiles, setAllFiles] = useState([]);
  // const dispatch1 = useDispatch();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

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
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
  const [pop, setPop] = useState(false);
  // all the tasks
  const [allTasks, setAllTasks] = useState([
    // {
    //   agr: "FedSGD",
    //   client: "org1",
    //   id: "4399105c2fa697152008408bd716326b7d668cf5227341c25df2615bbed0d198",
    //   ip: "161.97.133.43",
    //   lastUpdate: "12:32:24",
    //   link: "/download/1126141801065182034.zip",
    //   metrics: "MINIST",
    //   model: "CNN",
    //   port: 54399,
    //   rounds: "1",
    //   showId: "wyOndcLKzTXzkgJnUhL3F",
    //   status: 0,
    //   task: "task1",
    //   updateTask: "12:28:34",
    // },
  ]);
  // tasks for filter
  // const [showTasks, setShowTasks] = useState([]);
  const status = [
    {
      id: 0,
      value: "All",
      color: "black",
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
    },
  ];
  const [showCmd, setShowCmd] = useState(false);
  const [cmdTask, setCmdTask] = useState({});
  const [type, setType] = useState("All");
  function PopUp(is) {
    setPop(is);
  }
  function handlePopcmd(is) {
    setShowCmd(is);
  }
  function handleCheck(task) {
    setShowCmd(true);
    setCmdTask(task);
  }

  function addRequest(type, task) {
    if (type === 0) {
      // add new request
      let tmptasksn = allTasks;
      tmptasksn.push(task);
      setAllTasks(tmptasksn);
      console.log("add");
      console.log(allTasks);
    } else {
      // update exist request
      let date = new Date();
      const tmptasks = allTasks.map((item) => {
        if (item.showId === task.showId) {
          item.id = task.id;
          item.lastUpdate =
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          item.link = task.link;
          item.ip = task.ip;
          item.port = task.port;
          return item;
        } else {
          return item;
        }
      });
      console.log("update");
      setAllTasks(tmptasks);
      console.log(allTasks);
    }
    // setShowTasks(tmptasks);
  }

  function updateTask(task) {
    let date = new Date();
    const tmptasks = allTasks.map((item) => {
      if (item.showId === task.showId) {
        item.id = task.id;
        item.lastUpdate =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        item.link = task.link;
        item.ip = task.ip;
        item.port = task.port;
        return item;
      }
    });
    console.log("update");
    setAllTasks(tmptasks);
    console.log(allTasks);
  }

  const getStatus = async (task) => {
    let date = new Date();
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/training/status/${task.id}`)
        .then((res) => {
          // string into number
          // running->0, stopped->1, finished->2
          console.log("send update status request");
          let status = res.data.status;
          if (status === "running") {
            task.status = 0;
          } else if (status === "stopped") {
            task.status = 1;
          } else {
            task.status = 2;
          }
          task.lastUpdate =
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          let tmp = allTasks.map((item) => {
            if (item.id === task.id) {
              return task;
            } else {
              return item;
            }
          });
          setAllTasks(tmp);
          console.log(allTasks);
          return task;
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    console.log(allTasks.length);
    const interval = setInterval(() => {
      if (allTasks.length > 0) {
        console.log("update status");
        const tmp = allTasks.map((task) => {
          if (task.id !== undefined) {
            console.log("update status single", task.id);
            let taskk = getStatus(task);
          } else {
          }
        });
      }
      // setShowTasks(tmp);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  function handleFilter(type) {
    let tmp = [];
    if (type === "Running") {
      tmp = allTasks.filter((task) => task.status === 0);
    } else if (type === "Stopped") {
      tmp = allTasks.filter((task) => task.status === 1);
    } else if (type === "Finished") {
      tmp = allTasks.filter((task) => task.status === 2);
    } else {
      tmp = allTasks;
    }
    // setShowTasks(tmp);
    setType(type);
  }

  const handleDownload = async (link) => {
    try {
      await axios({
        type: "get",
        url: `${BACKEND_API_PREFIX}${link}`,
        responseType: "blob",
      }).then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "file.zip"); //or any other extension
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
            <th>Commands</th>
            <th>Location</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((item, i) => {
            return (
              <tr key={i}>
                <td>{i+1}</td>
                <td>
                  <Link to={"/request/:" + item.id}> {item.showId}</Link>
                </td>
                <td>{item.task}</td>
                <td>{item.rounds}</td>
                <td
                  style={{
                    backgroundColor: status[parseInt(item.status) + 1].color,
                    color: "white",
                  }}
                >
                  {status[parseInt(item.status) + 1].value}
                </td>
                <td>{item.client}</td>
                <td>{item.model}</td>
                <td>{item.metrics}</td>
                <td>{item.lastUpdate}</td>
                <td onClick={() => handleDownload(item.link)} >
                  <IoDownloadOutline />
                </td>
                <td onClick={()=>handleCheck(item)}>check commands</td>
                <td>location</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pop && (
        <PopBox
          PopUp={PopUp}
          type={"request"}
          addRequest={addRequest}
          updateTask={updateTask}
        />
      )}
      {showCmd && <PopCmd handlePopcmd={handlePopcmd} cmdTask={cmdTask} />}
    </div>
  );
}

function PopCmd(props) {
  const { handlePopcmd, cmdTask } = props;

  function handleClose() {
    handlePopcmd(false);
  }
  const client = `python client.py --task ${cmdTask.task} --dataset ${cmdTask.metrics} --model ${cmdTask.model} --aggr ${cmdTask.agr} --num_com ${cmdTask.rounds}`;

  const win = `./run.ps1 -ip ${cmdTask.ip} -port ${cmdTask.port}`;
  const unix = `bash run.sh -h ${cmdTask.ip} -p ${cmdTask.port}`;
  return (
    <div className={fl.popup_box}>
      <div className={fl.box}>
        <div className={fl.closediv}>
          <span
            className="icofont-close icofont-2x"
            style={{ color: "#ff8200" }}
            onClick={(e) => handleClose(false)}
            children={<GrClose />}
          ></span>
        </div>
        <div className={fl.cmdlayout}>
          <div>For client:</div>
          <div className={fl.cmd}>{client}</div>
          <div>For Unix user:</div>
          <div className={fl.cmd}>
            <p>
              example: <span>{unix}</span>
            </p>
            <p>parameters:</p>
            <p>
              <span>-h</span>server ip address, eg. -h 127.0.0.1
            </p>
            <p>
              <span>-p</span>server port, eg. -p 12345
            </p>
            <p>
              <span>-v</span>data volume, could be volume name or local path,
              eg. -v /data
            </p>
            <p>
              <span>-i</span>image name, eg. -i image_name
            </p>
            <p>
              <span>-c</span>container name, eg. -c container_name
            </p>
            <p>
              <span>-H</span>help
            </p>
          </div>
          <div>For Windows user (POWERSHELL ONLY):</div>
          <div className={fl.cmd}>
            <p>
              example: <span>{win}</span>
            </p>
            <p>parameters:</p>
            <p>
              <span>-ip</span>server ip address, eg. -ip 127.0.0.1
            </p>
            <p>
              <span>-port</span>server port, eg. -port 12345
            </p>
            <p>
              <span>-volume</span>data volume, could be volume name or local
              path, eg. -volume /data
            </p>
            <p>
              <span>-image</span>image name, eg. -image image_name
            </p>
            <p>
              <span>-container</span>container name, eg. -container
              container_name
            </p>
            <p>
              <span>-help</span>help
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
export default FL;
