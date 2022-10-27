import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import FileUpload from "../common/file-upload/file-upload.component";
import sp from "./index.module.css";
import { useNavigate } from "react-router-dom";

function Upload() {
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  };
  const childRef = useRef(null);

  const [dataset, setDataset] = useState("");
  const [datatype, setDatatype] = useState("");
  const datatypes = ["CV", "NLP", "ASR"];
  const [filetype, setFiletype] = useState("");
  const files = ["image", "audio", "video", "text", "csv"];
  const [aff, setAff] = useState("");
  const [desc, setDesc] = useState("");

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
      case "AFF":
        setAff(action.value);
        return { ...state };
      case "DESC":
        setDesc(action.value);
        return { ...state };
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
    formData.append("dataset", dataset);
    formData.append("datatype", datatype);
    formData.append("file_type", filetype);
    formData.append("affil", aff);
    formData.append("desc", desc);
    await axios
      .post(`${BACKEND_API_PREFIX}/upload/dataset`, formData, config)
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
            <div className={sp.title}>Add New DataSet</div>
            <div>
              Name: &nbsp; &nbsp;
              <input
                type="text"
                placeholder=""
                onKeyUp={(e) =>
                  dispatch({ type: "DATASET", value: e.target.value })
                }
                className={sp.enter}
              />
            </div>
            <div>
              Affiliation: &nbsp; &nbsp;
              <input
                className={sp.enter}
                type="text"
                placeholder=""
                onKeyUp={(e) =>
                  dispatch({ type: "AFF", value: e.target.value })
                }
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
            <div className={sp.radio_toolbar} name="datatype" id="datatype">
              <div>Dataset Type: &nbsp;</div>
              {datatypes.map((item) => {
                return (
                  <label
                    key={item}
                    className={item === datatype ? sp.checked : sp.normal}
                  >
                    <input
                      type="radio"
                      defaultValue={item}
                      name="datatype"
                      onClick={(e) => dispatch({ type: "TYPE", value: item })}
                    />
                    {item}
                  </label>
                );
              })}
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
