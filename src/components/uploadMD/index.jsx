import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../common/file-upload/file-upload.component";
import sp from "../Upload/index.module.css";
import { useNavigate } from "react-router-dom";


function Upload() {
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://localhost:8000";
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const childRef = useRef(null);

  const [arch, setArch] = useState("");
  const [sets, setSets] = useState("");
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");


  const [state, dispatch] = useReducer((state, action) => {
    switch (action.type) {
      case "ARCH":
        setArch(action.value);
        return { ...state };
      case "SET":
        setSets(action.value);
        return { ...state };
      case "TASK":
        setTask(action.value);
        return { ...state };
      case "DESC":
        setDesc(action.value);
        return {...state}
      default:
        return { ...state };
    }
  });

  // useEffect(() => {
  // }, []);

  const [inputVal, setInputVal] = useState("");

  const handleChange = (files) => {
    console.log("2", files);
    setInputVal(files[0]);
  };
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    var formData = new FormData();

    formData.append("raw_file", inputVal, inputVal.name);
    formData.append("architecture", arch);
    formData.append("training_set", sets);
    formData.append("task", task);
    formData.append("description", desc);


    await axios
      .post(`${BACKEND_API_PREFIX}/upload/model`, formData, config)
      .then(() => {
        childRef.current.removeFiles();
        navigate("/panel");
      });
  };

  return (
    <>
      <div className={sp.board}>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={sp.layout}>
            <div className={sp.title}>Add New Model</div>
            <div>
              Name: &nbsp; &nbsp;
              <input
                type="text"
                placeholder=""
                onKeyUp={(e) =>
                  dispatch({ type: "TASK", value: e.target.value })
                }
                className={sp.enter}
              />
            </div>
            <div>
              Architecture: &nbsp; &nbsp;
              <input
                className={sp.enter}
                type="text"
                placeholder=""
                onKeyUp={(e) =>
                  dispatch({ type: "ARCH", value: e.target.value })
                }
              />
            </div>
            <div>
              Training Set: &nbsp; &nbsp;
              <input
                className={sp.enter}
                type="text"
                placeholder=""
                onKeyUp={(e) =>
                  dispatch({ type: "SET", value: e.target.value })
                }
              />
            </div>
            <div className={sp.tx}>
              Description: &nbsp; &nbsp;
              <textarea
                className={sp.enter}
                type="text"
                placeholder=""
                onKeyUp={(e) =>
                  dispatch({ type: "DESC", value: e.target.value })
                }
              />
            </div>
          </div>
          <FileUpload
            ref={childRef}
            // accept=".csv"
            handleChange={handleChange}
            updateFilesCb={handleChange}
          />
          <button
            style={{
              borderRadius: "5px",
              float: "right",
              fontSize: "1rem",
              fontWeight: "bold",
            }}
            className="btn btn-primary"
            type="submit"
          >
            Submit File
          </button>
        </form>
      </div>
    </>
  );
}

export default Upload;
