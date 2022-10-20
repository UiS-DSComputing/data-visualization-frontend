import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import sp from "./index.module.css";
import { MdContentCopy } from "react-icons/md";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";

const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

function AddTrainRequest(props) {
  const { addRequest, updateTask, handleClose } = props;
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const [taskName, setTaskName] = useState("task");
  const [model, setModel] = useState("");
  const [dataset, setDataset] = useState("");
  const [agr, setAgr] = useState("");
  const models = ["CNN", "ResNet18", "ResNet", "50", "VGG19"];
  const dbs = ["MINIST", "CIFAR10", "CIFAR100"];
  const agrs = ["FedSGD", "FedAVG"];
  const [clients, setClients] = useState([]);
  const [np, setNp] = useState(0);
  const [cmd, setCmd] = useState("");

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "NAME":
        setTaskName(action.value);
        return { ...state };
      case "MODEL":
        setModel(action.value);
        return { ...state };
      case "DATASET":
        setDataset(action.value);
        return { ...state };
      case "AGR":
        setAgr(action.value);
        return { ...state };
      case "NUM":
        setNp(action.value);
        return { ...state };
      case "CLIENT":
        let tmp = clients;
        tmp.push(action.value);
        setClients(tmp);
        console.log(clients);
        return { ...state };
      default:
        return { ...state };
    }
  });

  const addNewRequest = async (newTask) => {
    try {
      let date = new Date();
      await axios({
        method: "post",
        url: `${BACKEND_API_PREFIX}/start/training/server`,
        timeout: 300000,
        data: JSON.stringify(newTask),
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        newTask.id = res.data.id;
        newTask.link = res.data.link;
        newTask.ip = res.data.ip;
        newTask.port = res.data.port;
        newTask.updateTask =
          date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        console.log("update send");
        addRequest(1, newTask);
      });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  function onConfirm() {
    let date = new Date();
    let showid = nanoid();
    // initial status : waiting
    let newTask = {
      showId: showid,
      task: taskName,
      rounds: np,
      clients: clients,
      model: model,
      status: "waiting",
      metrics: dataset,
      agr: agr,
      lastUpdate:
        date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds(),
    };
    addRequest(0, newTask);
    addNewRequest(newTask);
    handleClose(false);
  }

  const [copied, setCopied] = useState(false);

  function handleCopy(e) {
    navigator.clipboard.writeText(cmd);
    setCopied(true);
  }

  return (
    <div className={sp.layout}>
      <div className={sp.title}>Add New Request</div>
      <div>
        Task Name: &nbsp; &nbsp;
        <input
          type="text"
          placeholder={taskName}
          onKeyUp={(e) => dispatch({ type: "NAME", value: e.target.value })}
          className={sp.enter}
        />
      </div>
      <div>
        Number of communication epochs: &nbsp; &nbsp;
        <input
          className={sp.enter}
          type="text"
          placeholder={np}
          onKeyUp={(e) => dispatch({ type: "NUM", value: e.target.value })}
        />
      </div>
      <div className={sp.radio_toolbar} name="model" id="model">
        <div>Model: &nbsp;</div>
        {models.map((item) => {
          return (
            <label
              key={item}
              className={item === model ? sp.checked : sp.normal}
            >
              <input
                type="radio"
                value={item}
                name="model"
                onClick={(e) => dispatch({ type: "MODEL", value: item })}
              />
              {item}
            </label>
          );
        })}
      </div>
      <div className={sp.radio_toolbar} name="dataset" id="dataset">
        <div>Dataset: &nbsp;</div>
        {dbs.map((item) => {
          return (
            <label
              key={item}
              className={item === dataset ? sp.checked : sp.normal}
            >
              <input
                type="radio"
                value={item}
                name="dataset"
                onClick={(e) => dispatch({ type: "DATASET", value: item })}
              />
              {item}
            </label>
          );
        })}
      </div>
      <div className={sp.radio_toolbar} name="agr" id="agr">
        <div>Aggregation approach: &nbsp;</div>
        {agrs.map((item) => {
          return (
            <label key={item} className={item === agr ? sp.checked : sp.normal}>
              <input
                type="radio"
                value={item}
                name="agr"
                onClick={(e) => dispatch({ type: "AGR", value: item })}
              />
              {item}
            </label>
          );
        })}
      </div>
      <div className={sp.clientsrow}>
        <div>Client(s): &nbsp;</div>
        <div className={sp.grid}>
          <label>
            <input
              onClick={() => dispatch({ type: "CLIENT", value: "client1" })}
              type="checkbox"
              id="client1"
              name="client1"
            />
             &nbsp;Client(1), Norway
          </label>
          <label>
            <input
              onClick={() => dispatch({ type: "CLIENT", value: "client2" })}
              type="checkbox"
              id="client2"
              name="client2"
            />
             &nbsp;Client(2), Norway
          </label>
          <label>
            <input
              onClick={() => dispatch({ type: "CLIENT", value: "client2" })}
              type="checkbox"
              id="client3"
              name="client3"
            />
             &nbsp;Client(3), Germany
          </label>
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <button className={sp.btn} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default AddTrainRequest;
