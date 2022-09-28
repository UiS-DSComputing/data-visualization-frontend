import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import sp from "./index.module.css";
import { MdContentCopy } from "react-icons/md";
import { nanoid } from "nanoid";
// import { set } from "immer/dist/internal";

const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
function AddTrainRequest(props) {
  const {addRequest,updateTask}=props

  const [taskName, setTaskName] = useState("task1");
  const [model, setModel] = useState("");
  const [dataset, setDataset] = useState("");
  const [agr, setAgr] = useState("");
  const models = ["CNN", "ResNet18", "ResNet", "50", "VGG19"];
  const dbs = ["MINIST", "CIFAR10", "CIFAR100"];
  const agrs = ["FedSGD", "FedAVG"];
  const [client, setClient] = useState("org1");
  const [np, setNp] = useState(0);
  const clients = ["org1", "org2", "org3"];
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
        setClient(action.value);
        return { ...state };
      default:
        return { ...state };
    }
  });

  function onConfirm() {
    let c = `python client.py --task ${taskName} --dataset ${dataset} --model ${model} --aggr ${agr} --num_com ${np}`;
    setCmd(c);
    let date = new Date();
    let showid=nanoid()
    // initial status : waiting
    let newTask = {
      showId:showid,
      task: taskName,
      rounds: np,
      client: client,
      model:model,
      status:3,
      metrics: dataset,
      agr:agr,
      lastUpdate:date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds()
    };
    
    // post 
		axios({ method: 'post',
      url:`${BACKEND_API_PREFIX}/start/training/server`, 
      timeout:3000000,
      data:newTask
    })
		.then((res) => {
      newTask.id=res.data.id
      newTask.link=res.data.link
      newTask.ip=res.data.ip
      newTask.port=res.data.port
      console.log(newTask)
      updateTask(newTask)
		})
    addRequest(newTask)
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
      <div className={sp.radio_toolbar}>
        <div>Client: &nbsp;</div>
        <select
          name="client"
          id="client"
          onChange={(e) => dispatch({ type: "CLIENT", value: e.target.value })}
          className={sp.select}
        >
          {clients.map((item) => {
            return (
              <option key={item} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </div>
      <div style={{ textAlign: "right" }}>
        <button className={sp.btn} onClick={onConfirm}>
          Confirm
        </button>
      </div>
      {cmd != "" && (
        <div className={sp.cmd}>
          {cmd}{" "}
          <MdContentCopy
            style={{ float: "right" }}
            onClick={(e) => handleCopy(e)}
          />
        </div>
      )}
      {copied && <div className={sp.copy}>Copied!</div>}
    </div>
  );
}

export default AddTrainRequest;
