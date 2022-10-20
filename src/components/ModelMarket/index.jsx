import React from "react";
import { useState,useEffect } from "react";
import dm from "../DataMarket/index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/uis.png";

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

  const moTypes = [
    { name: "Images", number: 1289 },
    { name: "Video", number: 678 },
    { name: "Texts", number: 523 },
    { name: "Audio", number: 339 },
    { name: "Medical", number: 89 },
    { name: "Environment", number: 73 },
    { name: "3D", number: 34 },
    { name: "Graphs", number: 25 },
  ];
  const datas = [
    {
      id: 1,
      img: logo,
      title: "CIFAR10  (Norway 1)",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images. The images are labelled with one of 10 mutually exclusive classes: airplane, automobile (but not truck or pickup truck), bird, cat, deer, dog, frog, horse, ship, and truck (but not pickup truck). There are 6000 images per class with 5000 training and 1000 testing images per class.",
      mod: "Images",
      lang: "Chinese",
    },
  ];
  const [lists, setLists] = useState([])
  const [dataShow, setdataShow] = useState(datas)

  function handleFilter(type,title){

  }
  const getList = async () => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/datasets`,config)
        .then((res) => {
          console.log(res.data)
          setLists(res.data)
        });
    } catch (err) {
      if (err.response.status === 401) {
        dispatch1(authActions.logout());
        navigate("/login");
      }
    }

  }

  useEffect(() => {
    // getList()
  }, [])
  
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
        <Filter title="Modality" types={moTypes} handleFilter={handleFilter}/>
      </div>
      <div className={dm.results}>
        <h3>{dataShow.length} model results</h3>
        {datas.map((item)=>{
          return <Row key={item.id} data={item} />;
        })}
      </div>
    </div>
  );
}
function Filter(props) {
  const { types, title, handleFilter } = props;

  function changeFilter(type) {
    handleFilter(type,title)
  }
  return (
    <div className={dm.filter}>
      <div className={dm.title}>Filter by {title}</div>
      <div className={dm.items}>
        {types.map((item) => {
          return (
            <div
              key={item.name}
              className={dm.item}
              onClick={()=>changeFilter(item.name)}
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
        <Link to={"/dataset/:"+data.id}>
          <h3 className={dm.row_title}>{data.title}</h3>
        </Link>
        <div>{data.desc}</div>
      </div>
    </div>
  );
}

export default ModelMarket;