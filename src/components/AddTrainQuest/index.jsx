import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import sp from "./index.module.css";
import { MdContentCopy } from "react-icons/md";
import { nanoid } from "nanoid";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";

const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://localhost:8000";

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
      await axios({
        method: "post",
        url: `${BACKEND_API_PREFIX}/start/training/server`,
        timeout: 30000,
        data: JSON.stringify(newTask),
        headers: {
          Authorization: `Bearer ${token}`,
          "content-type": "application/json",
        },
      }).then((res) => {
        // let date = new Date();
        // new training info
        // newTask.id = res.data.id;
        // newTask.code = 30000;
        // newTask.lastUpdate =
        //   date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        // newTask.clients = clients;
        // newTask.status = "waiting";
        // newTask.rounds = np;
        // newTask.id = res.data.id;
        // newTask.link = res.data.link;
        // newTask.ip = res.data.ip;
        // newTask.port = res.data.port;
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
    
    let uniId = nanoid();
    // initial status : waiting
    let newTask = {
      uniId: uniId,
      task: taskName,
      epochs: parseInt(np),
      model: model,
      dataset: dataset,
      appr: agr,
    };
    // addRequest(0, newTask);
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
      <div style={{ textAlign: "right" }}>
        <button className={sp.btn} onClick={onConfirm}>
          Confirm
        </button>
      </div>
    </div>
  );
}

export default AddTrainRequest;
