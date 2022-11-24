import React from "react";
import { useState, useEffect } from "react";
import dm from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/a1.JPG";
import Table from "../common/Table";

import axios from "axios";

function DataMarket() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const [lists, setLists] = useState();
  const [showList, setShowList] = useState([]);

  // tmpdata
  const dh = [
    {
      field: "id",
      value: "Id",
      type:"link",
      page:"dataset"
    },
    {
      field: "name",
      value: "Name",
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
      field: "disease",
      value: "Disease",
    },
    {
      field: "create",
      value: "Create Time",
    },
    {
      field: "hash",
      value: "Data Hash",
    },
  ];
  const dhData = [
    {
      index: 1,
      id: "d01",
      name: "name1",
      desc: "Description",
      type: "data",
      disease: "TNBC",
      create: "2022-1-2",
      hash: "",
    },
    {
      index: 2,
      id: "d02",
      name: "name2",
      desc: "Description",
      type: "metadata",
      disease: "TNBC",
      create: "2022-1-20",
      hash: "",
    },
    {
      index: 3,
      id: "d03",
      name: "name3",
      desc: "Description",
      type: "data",
      disease: "HR-NMIBC",
      create: "2022-1-2",
      hash: "",
    },
    {
      index: 4,
      id: "d04",
      name: "name4",
      desc: "Description",
      type: "data",
      disease: "HR-NMIBC",
      create: "2022-1-2",
      hash: "",
    },
  ];

  const getList = async () => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/datasets/all`, config)
        .then((res) => {
          setLists(res.data);
          setShowList(res.data);
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
            Name:
            <input></input>
          </label>
          <label>
            Type:
            <input></input>
          </label>
          <label>
            Disease:
            <input></input>
          </label>
          <button className="normal_btn">Search</button>
        </div>
        <Link to={"/upload"}>
          <button className="normal_btn">Add dataset</button>
        </Link>
      </div>
      {lists && <Table th={dh} data={lists} />}
    </div>
  );
}

export default DataMarket;
