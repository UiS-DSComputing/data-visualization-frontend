import React from "react";
import { useState, useEffect } from "react";
import dm from "../DataMarket/index.module.css";
import md from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/bert.JPG";
import Table from "../common/Table";

import axios from "axios";

function ModelMarket() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://localhost:8000";
  // tmpdata
  const dh = [
    {field:"index",value:""},
    {
      field: "id",
      value: "Id",
      type:"link",
      page:"model"
    },
    {
      field: "description",
      value: "description",
    },
    {
      field: "type",
      value: "Type",
    },
    {
      field: "task",
      value: "Task",
    },
    {
      field:"training",
      value:"Training Data"
    },
    {
      field: "create",
      value: "Create Time",
    },
    {
      field: "hash",
      value: "Hash",
    },
  ];
  const tmpdata=[{
    id:"m01",
    type:"ResNet",
    description:"text",
    task:"Image Classification",
    training:"TNBC",
    create:"2022-11-10",
  },
  {
    id:"m02",
    type:"VGG",
    description:"text",
    task:"Image Classification",
    training:"HR-NMIBC",
    create:"2022-11-11",
  },
  {
    id:"m03",
    type:"UNet",
    description:"text",
    task:"Image Classification",
    training:"SML",
    create:"2022-11-10",
  }
]
  const [lists, setLists] = useState();
  const [showList, setShowList] = useState([
    {
      dataset: "tmp",
    },
  ]);

  const getList = async () => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/models/all`, config)
        .then((res) => {
          setLists(res.data);
          setShowList(res.data);
          let tmp = res.data;
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };


  useEffect(() => {
    getList();
  }, []);

  return (
    <div className={dm.layout}>
      <div className={dm.tools}>
        <div className={dm.searchs}>
          <label>
            Type:
            <input></input>
          </label>
          <label>
            Task:
            <input></input>
          </label>
          <label>
            Training Data:
            <input></input>
          </label>
          <button className="normal_btn">Search</button>
        </div>
        <Link to={"/uploadmd"}>
          <button className="normal_btn">Add Model</button>
        </Link>
      </div>
      {lists && <Table th={dh} data={tmpdata} />}
    </div>
  );
}

export default ModelMarket;
