import React from "react";
import { useState,useEffect } from "react";
import dm from "./index.module.css";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../../store/";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import logo from "../../assets/uis.png";
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
  const taskTypes = [
    { name: "Question Answering", number: 293 },
    { name: "Semantic Segmentation", number: 223 },
    { name: "Object Detection", number: 213 },
    { name: "Speech Recognition", number: 184 },
    { name: "Image Classification", number: 113 },
  ];
  const langTypes = [
    { name: "English", number: 1767 },
    { name: "Chinese", number: 267 },
    { name: "German", number: 133 },
    { name: "French", number: 108 },
    { name: "Spanish", number: 91 },
  ];
  const datas = [
    {
      id: 1,
      img: logo,
      title: "CIFAR10",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images. The images are labelled with one of 10 mutually exclusive classes: airplane, automobile (but not truck or pickup truck), bird, cat, deer, dog, frog, horse, ship, and truck (but not pickup truck). There are 6000 images per class with 5000 training and 1000 testing images per class.",
      mod: "Images",
      lang: "Chinese",
    },
    {
      id: 2,
      img: logo,
      title: "CIFAR10",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images. The images are labelled with one of 10 mutually exclusive classes: airplane, automobile (but not truck or pickup truck), bird, cat, deer, dog, frog, horse, ship, and truck (but not pickup truck). There are 6000 images per class with 5000 training and 1000 testing images per class.",
      mod: "Texts",
      lang: "English",
    },
    {
      id: 3,
      img: logo,
      title: "IMAGEnet",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images. The images are labelled with one of 10 mutually exclusive classes: airplane, automobile (but not truck or pickup truck), bird, cat, deer, dog, frog, horse, ship, and truck (but not pickup truck). There are 6000 images per class with 5000 training and 1000 testing images per class.",
      mod: "Images",
      lang: "English",
    },
    {
      id: 4,
      img: logo,
      title: "COCO",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images. The images are labelled with one of 10 mutually exclusive classes: airplane, automobile (but not truck or pickup truck), bird, cat, deer, dog, frog, horse, ship, and truck (but not pickup truck). There are 6000 images per class with 5000 training and 1000 testing images per class.",
      mod: "Video",
      lang: "German",
    },
    {
      id: 5,
      img: logo,
      title: "VIDEO",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images. The images are labelled with one of 10 mutually exclusive classes: airplane, automobile (but not truck or pickup truck), bird, cat, deer, dog, frog, horse, ship, and truck (but not pickup truck). There are 6000 images per class with 5000 training and 1000 testing images per class.",
      mod: "Texts",
      lang: "French",
    },
  ];
  const [lists, setLists] = useState([])
  const [dataShow, setdataShow] = useState(datas)

  function handleFilter(type,title){
    let tmp=[]
    if(title==="Modality"){
      tmp=datas.filter(item=>item.mod===type)
    }else if(title==="Task"){
      tmp=datas.filter(item=>item.mod===type)
    }else{
      tmp=datas.filter(item=>item.lang===type)
    }
    setdataShow(tmp)
    console.log(type);
    console.log(tmp);
  }
  const getList = async () => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/file-collection`,config)
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
    getList()
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
        <Filter title="Task" types={taskTypes} handleFilter={handleFilter} />
        <Filter title="Language" types={langTypes} handleFilter={handleFilter} />
      </div>
      <div className={dm.results}>
        <h3>{dataShow.length} dataset results</h3>
        {lists.map((item)=>{
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
          <h3 className={dm.row_title}>{data.filename}</h3>
        </Link>
        <div>desc</div>
      </div>
    </div>
  );
}

export default DataMarket;
