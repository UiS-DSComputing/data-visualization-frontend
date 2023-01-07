import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import logo from "../../assets/bert.JPG";
import dp from "../DatasetPage/index.module.css";
import axios from "axios";
import React, { useEffect, useRef, useState, useReducer } from "react";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../store/";

function ModelPage(props) {
  let { id } = useParams();

  const dispatch1 = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.accessToken);
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const BACKEND_API_PREFIX =
    process.env["BACKEND_API_PREFIX"] || "http://localhost:8000";

  const [mine, setMine] = useState(false)
  const [data, setData] = useState({
    dataset:"tmp"
  });
  const longD=`BERT, or Bidirectional Encoder Representations from Transformers, improves upon standard Transformers by removing the unidirectionality constraint by using a masked language model (MLM) pre-training objective. The masked language model randomly masks some of the tokens from the input, and the objective is to predict the original vocabulary id of the masked word based only on its context. Unlike left-to-right language model pre-training, the MLM objective enables the representation to fuse the left and the right context, which allows us to pre-train a deep bidirectional Transformer.In addition to the masked language model, BERT uses a next sentence prediction task that jointly pre-trains text-pair representations.
  There are two steps in BERT: pre-training and fine-tuning. During pre-training, the model is trained on unlabeled data over different pre-training tasks. For fine-tuning, the BERT model is first initialized with the pre-trained parameters, and all of the parameters are fine-tuned using labeled data from the downstream tasks. Each downstream task has separate fine-tuned models, even though they are initialized with the same pre-trained parameters.`
  const getDB = async (id) => {
    try {
      await axios
        .get(`${BACKEND_API_PREFIX}/model/${id}`, config)
        .then((res) => {
          console.log(res.data);
          setData(res.data);
          if(res.data.url==="url to application"){
            setMine(false)
          }else{
            setMine(true)
          }
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
    // send request for Download
  }

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
      <div className={dp.main}>
        <div className={dp.tags}>
          <div className={dp.tag}>#{data.training_set}</div>
          <div className={dp.tag}>#{data.architecture}</div>
        </div>
        <h1>{data.task}</h1>
        <div>Owner: {data.name}</div>
        <div className={dp.info}>
          <div className={dp.desc}>{data.description}</div>
          <img src={logo} className={dp.img}></img>
        </div>
        {(!mine)&&<div>
          <button className={dp.apply} onClick={() => handleRV()}>
            Request Sample
          </button>
          <button className={dp.apply} onClick={() => handleRD()}>
            Buy the Model
          </button>
          <button className={dp.apply}>
            Rent the Model
          </button>
        </div>}
        {mine&&<button className={dp.apply} onClick={()=>handleDw()}>Download Model</button>}
        {/* <div className={dp.other}>
          <h3 className={dp.stitle}>Dataset Users</h3>
          <div>UiS</div>
        </div> */}
      </div>
    </div>
  );
}

export default ModelPage;