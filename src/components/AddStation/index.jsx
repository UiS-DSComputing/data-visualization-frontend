import React, { useEffect, useRef, useState, useReducer } from "react";
import { MdContentCopy, MdOutlinePrivateConnectivity } from "react-icons/md";
import { nanoid } from "nanoid";
import sp from "../AddTrainQuest/index.module.css";

function AddStation(props) {
  const { addStation,handleClose,user } = props;

  const [dataset, setDataset] = useState("");
  const [datatype, setDatatype] = useState("");
  const datatypes=["CV", "NLP", "ASR"]
  const [filetype, setFiletype] = useState("");
  const files=[
    "image",
    "audio",
    "video",
    "text",
    "csv",
  ]
  const [owner, setOwner] = useState("");
  const [email, setEmail] = useState("");
  const [aff, setAff] = useState("");
  const [desc, setDesc] = useState("");
  const [path, setPath] = useState("");

  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "TYPE":
        setDatatype(action.value);
        return { ...state };
      case "FILE":
        setFiletype(action.value);
        return { ...state };
      case "DATASET":
        setDataset(action.value);
        return { ...state };
      case "OWNER":
        setOwner(action.value);
        return { ...state };
      case "EMAIL":
        setEmail(action.value);
        return { ...state };
      case "AFF":
        setAff(action.value);
        return { ...state };
      case "DESC":
        setDesc(action.value);
        return { ...state };
      case "PATH":
        setPath(action.value);
        return { ...state };
      default:
        return { ...state };
    }
  });
useEffect(() => {
  setOwner(user.username)

  return () => {
  }
}, [])

  function onConfirm() {
    let new_id = nanoid();
    const newStation = {
        id:new_id,
        dataset:dataset, 
        datatype:datatype, 
        filetype:filetype, 
        owner:owner, 
        email:email, 
        affiliation:aff, 
        description:desc
    };
    addStation(newStation);
    handleClose(false)
  }


  return (
    <div className={sp.layout}>
      <div className={sp.title}>Add New Station</div>
      <div>
        DataSet: &nbsp; &nbsp;
        <input
          type="text"
          placeholder=""
          onKeyUp={(e) => dispatch({ type: "DATASET", value: e.target.value })}
          className={sp.enter}
        />
      </div>
      <div>
        Owner: &nbsp; &nbsp;
        <input
          className={sp.enter}
          type="text"
          value={owner}
          onKeyUp={(e) => dispatch({ type: "OWNER", value: e.target.value })}
        />
      </div>
      <div>
        Email: &nbsp; &nbsp;
        <input
          className={sp.enter}
          type="text"
          placeholder=""
          onKeyUp={(e) => dispatch({ type: "EMAIL", value: e.target.value })}
        />
      </div>
      <div>
        Description: &nbsp; &nbsp;
        <input
          className={sp.enter}
          type="text"
          placeholder=""
          onKeyUp={(e) => dispatch({ type: "DESC", value: e.target.value })}
        />
      </div>
      <div>
        Affiliation: &nbsp; &nbsp;
        <input
          className={sp.enter}
          type="text"
          placeholder=""
          onKeyUp={(e) => dispatch({ type: "AFF", value: e.target.value })}
        />
      </div>
      <div className={sp.radio_toolbar} name="file" id="file">
        <div>File Type: &nbsp;</div>
        {files.map((item) => {
          return (
            <label
              key={item}
              className={item === filetype ? sp.checked : sp.normal}
            >
              <input
                type="radio"
                value={item}
                name="model"
                onClick={(e) => dispatch({ type: "FILE", value: item })}
              />
              {item}
            </label>
          );
        })}
      </div>
      <div>
        File Path: &nbsp; &nbsp;
        <input
          className={sp.enter}
          type="text"
          placeholder=""
          onKeyUp={(e) => dispatch({ type: "PATH", value: e.target.value })}
        />
      </div>
      <div className={sp.radio_toolbar} name="datatype" id="datatype">
        <div>Dataset: &nbsp;</div>
        {datatypes.map((item) => {
          return (
            <label
              key={item}
              className={item === datatype ? sp.checked : sp.normal}
            >
              <input
                type="radio"
                value={item}
                name="datatype"
                onClick={(e) => dispatch({ type: "TYPE", value: item })}
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

export default AddStation;
