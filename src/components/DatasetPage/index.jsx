import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import dp from "./index.module.css";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/";
import tb from "../common/Table/index.module.css";
import { AiFillDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { GiConfirmed } from "react-icons/gi";

function DatasetPage(props) {
  let { id } = useParams();

  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

  const dh = [
    {
      field: "id",
      value: "Id",
      type: "link",
      page: "dataset",
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
  const [mine, setMine] = useState(true);
  const [data, setData] = useState();
  const getDB = async (id) => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/dataset/${id}`, config)
        .then((res) => {
          res.data["id"] = id;
          setData(res.data);
          // operation permission?
          // if (res.data.name===) {
          //   setMine(false);
          // } else {
          //   setMine(true);
          // }
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  useEffect(() => {
    getDB(id);
  }, []);

  function handleRV() {
    //send request for view
  }

  function handleRD() {
    // send request for Using
    window.alert("Request sended.");
    // console.log(id)
    sendREQ(id);
  }
  const delDB = async (id) => {
    try {
      await axios
        .delete(`${BACKEND_API_PREFIX}/dataset/delete/${id}`, config)
        .then((res) => {
          navigate("/");
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };
  function handleDel() {
    if (window.confirm("Are you sure to delete this dataset?") == true) {
      delDB();
    }
  }

  function handleEdit() {}

  const sendREQ = async (id) => {
    await axios
      .get(`${BACKEND_API_PREFIX}/dataset/permission/apply/${id}`, config)
      .then((res) => {});
  };

  const handleDw = async () => {
    try {
      await axios({
        type: "get",
        url: `${BACKEND_API_PREFIX}${data.url}`,
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      }).then((res) => {
        const href = URL.createObjectURL(res.data);
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute("download", "dataset.zip"); //or any other extension
        document.body.appendChild(link);
        link.click();
        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }
  };

  return (
    <div className={dp.layout}>
      <button className={dp.back} onClick={() => navigate(-1)}>
        <BsArrowLeft size={"1.2em"} />
        &nbsp;&nbsp;Go back to market
      </button>
      {data && (
        <table className={tb.tasks}>
          <thead>
            <tr>
              {dh.map((item, i) => {
                return <th key={i}>{item.value}</th>;
              })}
              {mine && <th>Operation</th>}
            </tr>
          </thead>
          <tbody>
            <tr>
              {dh.map((item, i) => {
                return (
                  <td
                    key={item.field + i}
                    className={item.field === "description" ? tb.desc : ""}
                  >
                    {data[item.field]}
                  </td>
                );
              })}
              {mine && (
                <td>
                  <AiFillDelete onClick={() => handleDel(id)} />
                  <FaRegEdit onClick={() => handleEdit(id)} />
                </td>
              )}
            </tr>
          </tbody>
        </table>
      )}
      <AccessControl mine={mine} />
    </div>
  );
}

function AccessControl(props) {
  const { mine } = props;
  const th = ["name", "view", "update", "download"];
  const [orgs, setOrgs] = useState([
    {
      name: "org1",
      view: true,
      update: true,
      download: false,
    },
    {
      name: "org2",
      view: true,
      update: true,
      download: false,
    },
    {
      name: "org3",
      view: true,
      update: false,
      download: false,
    },
  ]);

  function handleChange(name, field) {
    console.log(name);
    console.log(field);
    let tmp = orgs.map((item) => {
      if (item.name === name) {
        item[field] = !item[field];
      }
      return item;
    });
    setOrgs(tmp);
  }

  function handleConfirm() {
    console.log(orgs);
  }

  return (
    <div>
      <div className={dp.access}>
        <h3>Access Control by Chaincode </h3>
        {mine && (
          <button className={dp.cbtn} onClick={() => handleConfirm()}>
            <GiConfirmed color="green" /> Confirm
          </button>
        )}
      </div>
      <table className={tb.tasks}>
        <thead>
          <tr>
            <th></th>
            <th>View</th>
            <th>Update</th>
            <th>Download</th>
          </tr>
        </thead>
        <tbody>
          {orgs.map((item) => {
            return (
              <tr key={item.name}>
                {th.map((field) => {
                  if (field === "name") {
                    return <td key={item.name + field}>{item[field]}</td>;
                  } else {
                    return (
                      <td key={item.name + field}>
                        <input
                          disabled={!mine}
                          type="checkbox"
                          id={field}
                          checked={item[field]}
                          name={item.name}
                          onChange={() => handleChange(item.name, field)}
                        />
                      </td>
                    );
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default DatasetPage;
