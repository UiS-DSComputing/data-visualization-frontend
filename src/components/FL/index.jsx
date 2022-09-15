import axios from "axios";
import { map } from "jquery";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { GrAddCircle } from "react-icons/gr";
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

  const [pop, setPop] = useState(false);
  const date = new Date();
  const [testTasks,setTask] = useState([
    {
      id: "sygak7319731g12ygdak82",
      task: "task1",
      rounds: 1,
      status: 1,
      client: "client1",
      model: "a",
      metrics: "m1",
      lastUpdate:
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
    },
    {
      id: "2371gdjaskygd879234",
      task: "task2",
      rounds: 1,
      status: 0,
      client: "client1",
      model: "a",
      metrics: "m1",
      lastUpdate:
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
    },
    {
      id: "3178413yhdkasfhliasd22",
      task: "task3",
      rounds: 3,
      status: 2,
      client: "client1",
      model: "a",
      metrics: "m1",
      lastUpdate:
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
    },
  ]);
  const status = [
    {
      id: 0,
      value: "running",
      color: "#278327",
    },
    {
      id: 1,
      value: "stopped",
      color: "#a34242",
    },
    {
      id: 2,
      value: "waiting",
      color: "#f1ca58",
    },
  ];
  function PopUp(is) {
    setPop(is);
  }
  function addRequest(r){
    let tmptasks=testTasks
    tmptasks.push(r)
    setTask(tmptasks)
  }
  return (
    <div>
      <div className={fl.tools}>
        <div className={fl.switch}>
          <div style={{ border: "none", fontSize: "1.2em" }}>
            Requested Trains
          </div>
          <div className={fl.checked_sw}>All</div>
          <div>Finished</div>
          <div>Running</div>
        </div>
        <div className={fl.newbtn} onClick={() => PopUp(true)}>
          <GrAddCircle color="white" />
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
            <th>Last Updates </th>
          </tr>
        </thead>
        <tbody>
          {testTasks.map((item, i) => {
            return (
              <tr key={i}>
                <td>{i}</td>
                <td>{item.id}</td>
                <td>{item.task}</td>
                <td>{item.rounds}</td>
                <td style={{ backgroundColor: status[item.status].color, color:"white" }}>
                  {status[item.status].value}
                </td>
                <td>{item.client}</td>
                <td>{item.model}</td>
                <td>{item.metrics}</td>
                <td>{item.lastUpdate}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pop && <PopBox PopUp={PopUp} addRequest={addRequest}/>}
    </div>
  );
}

export default FL;
