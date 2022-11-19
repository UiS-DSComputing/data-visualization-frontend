import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import pl from "./index.module.css";
import { Link } from "react-router-dom";
import { MdDeleteForever } from "react-icons/md";
import Table from "../common/Table";

function Panel() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const [datas, setDatas] = useState([]);
  const [models, setModels] = useState([]);

  const orgTh = [
    {
      field:"id",
      value:""
    },
    {
      field: "username",
      value: "Username",
    },
    {
      field:"name",
      value:"User"
    },
    {
      field:"email",
      value:"Email"
    },
    {
      field:"mobile",
      value:"Mobile"
    },
    {
      field:"role",
      value:"Role"
    },
    {
      field:"create",
      value:"Create Time"
    },
    {
      field:"operation",
      value:"Operation"
    }
  ];
  const orgData = [
    {
      id: 1,
      username: "user1",
      name: "Amy",
      email: "admin@abc.com",
      mobile: "+123445678",
      role: "Admin",
      create: "2022-1-2",
      operation:["delete","edit"]
    },
    {
      id: 2,
      username: "user1",
      name: "Amy",
      email: "admin@abc.com",
      mobile: "+123445678",
      role: "Admin",
      create: "2022-1-2",
      operation:["delete","edit"]

    },
    {
      id: 3,
      username: "user1",
      name: "Amy",
      email: "admin@abc.com",
      mobile: "+123445678",
      role: "Admin",
      create: "2022-1-2",
      operation:["delete","edit"]

    },
  ];

  const getAllDBs = async () => {
    try {
      await axios.get(`${BACKEND_API_PREFIX}/datasets`, config).then((res) => {
        // update all tasks
        setDatas(res.data);
      });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  const getAllMDs = async () => {
    try {
      await axios.get(`${BACKEND_API_PREFIX}/models`, config).then((res) => {
        // update all tasks
        setModels(res.data);
      });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getAllDBs();
    getAllMDs();
  }, []);

  const delDB = async (id) => {
    try {
      await axios
        .delete(`${BACKEND_API_PREFIX}/dataset/delete/${id}`, config)
        .then((res) => {});
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  const delMD = async (id) => {
    try {
      await axios
        .delete(`${BACKEND_API_PREFIX}/model/delete/${id}`, config)
        .then((res) => {});
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  function handelDelDB(id) {
    delDB(id);
    let tmp = datas.filter((item) => item.id !== id);
    setDatas(tmp);
  }

  function handelDelMD(id) {
    delMD(id);
    let tmp = models.filter((item) => item.id !== id);
    setModels(tmp);
  }

  return (
    <div className={pl.layout}>
      <div>
        <div className={pl.frow}>
          <h4 style={{ width: "200px" }}>My Organization</h4>
          <Link to={"/members"}>
            <button className={pl.addbtn}>Add Member</button>
          </Link>
        </div>
        <Table th={orgTh} data={orgData} />
      </div>
      <div className={pl.datasets}>
        <div className={pl.frow}>
          <h4 style={{ width: "200px" }}>My Datasets</h4>
          <Link to={"/upload"}>
            <button className={pl.addbtn}>Add Dataset</button>
          </Link>
        </div>
        <table className={pl.lists}>
          <thead>
            <tr>
              <th>No.</th>
              {/* <th>Logo</th> */}
              <th>Name</th>
              <th>Description</th>
              <th>Data Type</th>
              <th>File Type</th>
              <th>Affiliation</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {datas.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>
                    <Link to={"/dataset/" + item.id}>{item.dataset}</Link>
                  </td>
                  <td className={pl.desc}>{item.description}</td>
                  <td>{item.datatype}</td>
                  <td>{item.filetype}</td>
                  <td>{item.affiliation}</td>
                  <td>
                    <MdDeleteForever onClick={() => handelDelDB(item.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={pl.datasets}>
        <div className={pl.frow}>
          <h4 style={{ width: "200px" }}>My Models</h4>
          <Link to="/uploadmd">
            <button className={pl.addbtn}>Add Model</button>
          </Link>
        </div>
        <table className={pl.lists}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Task</th>
              <th>Description</th>
              <th>Architecture</th>
              <th>Training Set</th>
              <th>Model Size</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {models.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.task}</td>
                  <td className={pl.desc}>{item.description}</td>
                  <td>{item.architecture}</td>
                  <td>{item.training_set}</td>
                  <td>1.3G</td>
                  <td>
                    <MdDeleteForever onClick={() => handelDelMD(item.id)} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Panel;
