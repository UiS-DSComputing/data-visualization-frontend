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

import axios from "axios";

function ModelMarket() {
  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

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
    <div className={md.layout}>
      <div className={md.searchbar}>
        <div className={dm.search}>
          <input></input>
          <FiSearch />
        </div>
        <select name="sort" className={dm.sort}>
          <option>Best Match</option>
          <option>Most cited</option>
          <option>Newest</option>
        </select>
      </div>

      <div className={md.results}>
        <h3 style={{textAlign:"left"}}>{showList.length} model results</h3>
        {showList.map((item,i) => {
          return <Row key={i} data={item} />;
        })}
      </div>
    </div>
  );
}

function Row(props) {
  const { data } = props;
  return (
    <div className={dm.row}>
      <img src={logo} style={{ width: "135px" }}></img>
      <div className={dm.row_info}>
        <Link to={"/model/" + data.id}>
          <h3 className={dm.row_title} style={{textAlign:"left"}}>{data.task}</h3>
        </Link>
        <div className={dm.desc}>{data.description}</div>
      </div>
    </div>
  );
}

export default ModelMarket;
