import axios from "axios";
import React, { useEffect, useState } from "react";
import { IoDownloadOutline } from "react-icons/io5";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import fl from "./index.module.css";
import PopBox from "../PopBox";
import { GrClose, GrServers } from "react-icons/gr";
import { AiFillRightSquare } from "react-icons/ai";
import tf from "../../assets/tf.png";
import Dashboard from "./preDashboard";
import Container from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import { Spacer } from "@nextui-org/react";
import { Text } from "@nextui-org/react";
import DemoTask from "../DemoTask";

function Demo() {
  return (
    <Container>
      <Container>
        <Stack direction="row" spacing={2} style={{ alignItems: "flex-end" }}>
          <Text>Partners</Text>
          <FormGroup row={true}>
            <FormControlLabel control={<Checkbox />} label="Client 1" />
            <FormControlLabel control={<Checkbox />} label="Client 2" />
            <FormControlLabel control={<Checkbox />} label="Client 3" />
          </FormGroup>
        </Stack>
      </Container>
      <Spacer y={2} />
      <Container>
        <Dashboard />
      </Container>
      <Container></Container>
      <Container>
        <DemoTask />
        <MyTimeline />
        <Table />
      </Container>
    </Container>
  );
}
function Table() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);

  const [locateId, setLocateId] = useState("");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
  const [pop, setPop] = useState(false);
  // all the tasks
  const [allTasks, setAllTasks] = useState([]);
  // tasks for filter
  // const [showTasks, setShowTasks] = useState([]);
  const colors = {
    running: { color: "#278327", show: "Running" },
    stopped: { color: "#a34242", show: "Stopped" },
    finished: { color: "#f1ca58", show: "Finished" },
    waiting: { color: "#888", show: "Waiting" },
  };
  const status = [
    {
      id: 0,
      value: "all",
      show: "All",
      color: "black",
    },
    {
      id: 1,
      show: "Running",
      value: "running",
      color: "#278327",
    },
    {
      id: 2,
      show: "Stopped",
      value: "stopped",
      color: "#a34242",
    },
    {
      id: 3,
      value: "finished",
      show: "Finished",
      color: "#f1ca58",
    },
    {
      id: 4,
      show: "Waiting",
      value: "waiting",
      color: "#888",
    },
  ];
  const [showCmd, setShowCmd] = useState(false);
  const [cmdTask, setCmdTask] = useState({});
  const [popType, setPopType] = useState("cmd");

  function PopUp(is) {
    setPop(is);
  }
  function handlePopcmd(is) {
    setShowCmd(is);
  }
  function handleCheck(task) {
    setShowCmd(true);
    setPopType("cmd");
    setCmdTask(task);
  }

  function showMap(is, id) {
    setPopType("map");
    setShowCmd(is);
    setLocateId(id);
  }

  function addRequest(type, task) {
    getAllTrainings();
  }

  const getAllTrainings = async () => {
    try {
      await axios.get(`${BACKEND_API_PREFIX}/trainings`, config).then((res) => {
        // update all tasks
        let date = new Date();
        let tmp = res.data;
        let tmpp = tmp.map((item) => {
          item.lastUpdate =
            date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
          if (
            item.status === "running" ||
            item.status === "exited" ||
            item.status === "stopped"
          ) {
            item.code = 20000;
            if (item.status === "exited") {
              item.status = "finished";
            }
          } else {
            item.code = 30000;
            item.status = "waiting";
          }
          return item;
        });
        setAllTasks(tmpp);
        return 1;
      });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  const updateStatus = async (task) => {
    //update single unbuild
    let date = new Date();
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/training/status/${task.id}`, config)
        .then((res) => {
          // update tasks in axios
          console.log("single");
          if (res.data.code === 20000) {
            let tmpTasks = allTasks.map((item) => {
              if (item.id === task.id) {
                task.status = item.status;
                task.lastUpdate =
                  date.getHours() +
                  ":" +
                  date.getMinutes() +
                  ":" +
                  date.getSeconds();
                task.code = 20000;
                return task;
              } else {
                return item;
              }
            });
            setAllTasks(tmpTasks);
          }
          return 0;
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  const updateAllStatus = async () => {
    let date = new Date();
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/training/all/status`, config)
        .then((res) => {
          // update tasks
          let tmp = res.data;
          let tmpTasks = allTasks.map((task) => {
            for (let item of tmp) {
              if (item.id === task.id) {
                task.status = item.status;
                if (item.status === "exited") {
                  item.status = "finished";
                }
                task.lastUpdate =
                  date.getHours() +
                  ":" +
                  date.getMinutes() +
                  ":" +
                  date.getSeconds();
              }
            }
            return task;
          });
          setAllTasks(tmpTasks);
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getAllTrainings();
    const interval = setInterval(() => {
      console.log(allTasks.length);
      // if (allTasks.length === 0) {
      //   getAllTrainings();
      // }
      if (allTasks.length > 0) {
        // update builded tasks
        let builded = allTasks.filter((item) => item.code === 20000);
        let notBuilded = allTasks.filter((item) => item.code !== 20000);
        console.log(notBuilded);
        if (notBuilded.length !== 0) {
          let tmp = notBuilded.map((item) => updateStatus(item));
        }
        if (builded.length !== 0) {
          updateAllStatus();
        }
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleDownload = async (item) => {
    try {
      await axios({
        type: "get",
        url: `${BACKEND_API_PREFIX}${item.download}`,
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
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

  const Del = async (id) => {
    try {
      await axios
        .delete(`${BACKEND_API_PREFIX}/training/delete/${id}`, config)
        .then((res) => {});
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  function handleDel(item) {
    Del(item.id);
    let tmp = allTasks.filter((task) => task.id !== item.id);
    setAllTasks(tmp);
  }

  return (
    <div>
      <div className={fl.tools}></div>
      <table className={fl.tasks}>
        <thead>
          <tr>
            <th>No.</th>
            <th>JOB ID</th>
            <th>Task</th>
            <th>Rounds</th>
            <th>Cur. Status</th>
            <th>Global Model</th>
            <th>Metrics</th>
            <th>Last Update</th>
            <th>Download</th>
            <th>Commands</th>
            <th>Model Path</th>
            <th>Tensor Board</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {allTasks.map((item, i) => {
            return (
              <tr key={i}>
                <td>{i + 1}</td>
                {item.status !== "waiting" && (
                  <td onClick={() => showMap(true, item.id)}>{item.job_id}</td>
                )}
                {item.status === "waiting" && <td>{item.job_id}</td>}
                <td>{item.task}</td>
                <td>{item.rounds}</td>
                <td
                  style={{
                    backgroundColor: colors[item.status].color,
                    color: "white",
                  }}
                >
                  {colors[item.status].show}
                </td>
                <td>{item.global_model}</td>
                <td>{item.metrics}</td>
                <td>{item.lastUpdate}</td>
                {item.status !== "waiting" && (
                  <td onClick={() => handleDownload(item)}>
                    {" "}
                    <IoDownloadOutline />
                  </td>
                )}
                {item.status === "waiting" && (
                  <td style={{ color: "#888" }}>
                    {" "}
                    <IoDownloadOutline />
                  </td>
                )}
                {item.status !== "waiting" && (
                  <td onClick={() => handleCheck(item)}>check commands</td>
                )}
                {item.status === "waiting" && (
                  <td style={{ color: "#888" }}>check commands</td>
                )}
                {item.status !== "waiting" && (
                  <td>
                    <a
                      href={
                        "http://161.97.133.43:" + item.global_model_port + "/"
                      }
                      target="_blank"
                    >
                      models
                    </a>
                  </td>
                )}
                {item.status === "waiting" && (
                  <td>
                    <a style={{ color: "#888" }} target="_blank">
                      models
                    </a>
                  </td>
                )}
                {item.status !== "waiting" && (
                  <td>
                    <a
                      href={
                        "http://161.97.133.43:" + item.tensorboard_port + "/"
                      }
                      target="_blank"
                    >
                      <img src={tf} style={{ width: "20px" }}></img>
                    </a>
                  </td>
                )}
                {item.status === "waiting" && (
                  <td>
                    <a target="_blank">
                      <img src={tf} style={{ width: "20px" }}></img>
                    </a>
                  </td>
                )}
                <td>
                  <MdDeleteForever onClick={() => handleDel(item)} />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pop && <PopBox PopUp={PopUp} type={"request"} addRequest={addRequest} />}
      {showCmd && (
        <PopCmd
          handlePopcmd={handlePopcmd}
          cmdTask={cmdTask}
          type={popType}
          locateId={locateId}
        />
      )}
    </div>
  );
}

function PopCmd(props) {
  const { handlePopcmd, cmdTask, type, locateId } = props;

  function handleClose() {
    handlePopcmd(false);
  }

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
        {type === "cmd" ? (
          <CMD cmdTask={cmdTask} />
        ) : (
          <Map locateId={locateId} />
        )}
      </div>
    </div>
  );
}

function CMD(props) {
  const { cmdTask } = props;
  const client = `python client.py --task ${cmdTask.task} --dataset ${cmdTask.metrics} --model ${cmdTask.global_model} --aggr ${cmdTask.appr} --num_com ${cmdTask.rounds}`;

  const win = `./run.ps1 -ip ${cmdTask.ip} -port ${cmdTask.port}`;
  const unix = `bash run.sh -h ${cmdTask.ip} -p ${cmdTask.port}`;
  return (
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
          <span>-v</span>data volume, could be volume name or local path, eg. -v
          /data
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
          <span>-volume</span>data volume, could be volume name or local path,
          eg. -volume /data
        </p>
        <p>
          <span>-image</span>image name, eg. -image image_name
        </p>
        <p>
          <span>-container</span>container name, eg. -container container_name
        </p>
        <p>
          <span>-help</span>help
        </p>
      </div>
    </div>
  );
}

function Map(props) {
  const { locateId } = props;
  const [has, setHas] = useState(false);
  const msg = "No Client connected to server.";
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const getLocation = async () => {
    await axios
      .get(`${BACKEND_API_PREFIX}/training/connections/${locateId}`, config)
      .then((res) => {
        console.log(res.data);
        setHas(true);
      });
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className={fl.cmdlayout}>
      {has && (
        <div>
          <h3>Locations:</h3>
          <div>
            <GrServers />
            &nbsp;&nbsp;Server: Germany
          </div>
          <div className={fl.clients}>
            <div>
              <AiFillRightSquare />
              &nbsp;&nbsp;Client (1), Norway
            </div>
            <div>
              <AiFillRightSquare />
              &nbsp;&nbsp;Client (2), Norway
            </div>
          </div>
        </div>
      )}
      {!has && <div>{msg}</div>}
    </div>
  );
}

function MyTimeline() {
  const texts = [
    {
      text:"Client 1 created",
      time:"16:10:56",
      date:"2022/11/11"
    },
    {
      text:"Client 2 created",
      time:"16:12:32",
      date:"2022/11/11"
    },
    {
      text:"Client 1 running",
      time:"16:40:23",
      date:"2022/11/11"
    },
    {
      text:"Client 2 running",
      time:"16:40:36",
      date:"2022/11/11"
    },
    {
      text:"Client 1 finished",
      time:"20:11:17",
      date:"2022/11/11"
    },
    {
      text:"Client 1 finished",
      time:"20:11:25",
      date:"2022/11/11"
    },
  ];
  return (
    <div className={fl.timeline}>
      <ul>
        {texts.map((item, i) => {
          if (i === texts.length - 1) {
            return <Line key={i} item={item} show={false} />;
          } else return <Line key={i} item={item} show={true} />;
        })}
      </ul>
    </div>
  );
}

function Line(props) {
  const { item, show } = props;

  return (
    <li className={fl.tl_item}>
      <div>{item.text}</div>
      <div className={fl.line}>
        <span>&#9679;</span>
        {show && <span>&nbsp;</span>}
      </div>
      <div>
        {item.time}
      </div>
      <div>{item.date}</div>
    </li>
  );
}
function Base() {
  return (
    <div className={fl.line}>
      <span>&#9679;</span>
      <span>&nbsp;</span>
    </div>
  );
}
export default Demo;
