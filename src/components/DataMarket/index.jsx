import React from "react";
import { useState, useEffect } from "react";
import dm from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/a1.JPG";

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

  const [dataTypes, setDataTypes] = useState([
    { name: "CV", value: "CV", number: 0 },
    { name: "NLP", value: "NLP", number: 0 },
    { name: "ASR", value: "ASR", number: 0 },
  ]);
  const [fileTypes, setFileTypes] = useState([
    { name: "Image", value: "image", number: 0 },
    { name: "Video", value: "video", number: 0 },
    { name: "Texts", value: "text", number: 0 },
    { name: "Audio", value: "audio", number: 0 },
    { name: "CSV", value: "csv", number: 0 },
  ]);
  const [lists, setLists] = useState();
  const [showList, setShowList] = useState([{
    dataset:"tmp"
  }]);

  function handleFilter(type, title) {
    let tmp = [];
    if (title === "DataSet") {
      tmp = lists.filter((item) => item.datatype === type);
    } else if (title === "File") {
      tmp = lists.filter((item) => item.filetype === type);
    }
    setShowList(tmp);
  }

  const getList = async () => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/datasets/all`, config)
        .then((res) => {
          setLists(res.data);
          setShowList(res.data);
          let tmp = res.data;
          let tmpD = dataTypes.map((item) => {
            let n = tmp.filter((x) => x.datatype === item.name);
            item.number = n.length;
            return item;
          });
          setDataTypes(tmpD);
          let tmpF = fileTypes.map((item) => {
            let n = tmp.filter((x) => x.filetype === item.value);
            item.number = n.length;
            return item;
          });
          setFileTypes(tmpF);
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
      <div className={dm.filters}>
        <div className={dm.filter}>
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
        <Filter title="DataSet" types={dataTypes} handleFilter={handleFilter} />
        <Filter title="File" types={fileTypes} handleFilter={handleFilter} />
      </div>
      <div className={dm.results}>
        <h3>{showList.length} dataset results</h3>
        {showList.map((item,i) => {
          return <Row key={i} data={item} />;
        })}
      </div>
    </div>
  );
}
function Filter(props) {
  const { types, title, handleFilter } = props;

  function changeFilter(type) {
    handleFilter(type, title);
  }
  return (
    <div className={dm.filter}>
      <div className={dm.title}>Filter by {title}</div>
      <div className={dm.items}>
        {types.map((item) => {
          return (
            <div
              key={item.value}
              className={dm.item}
              onClick={() => changeFilter(item.value)}
            >
              <div className={dm.name}>{item.name}</div>
              <div className={dm.number}>{item.number}</div>
            </div>
          );
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
        <Link to={"/dataset/" + data.id}>
          <h3 className={dm.row_title} style={{textAlign:"left"}}>{data.dataset}</h3>
        </Link>
        <div className={dm.desc}>{data.description}</div>
      </div>
    </div>
  );
}

export default DataMarket;
