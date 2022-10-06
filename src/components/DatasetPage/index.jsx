import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { BsArrowLeft } from "react-icons/bs";
import logo from "../../assets/uis.png";
import dp from "./index.module.css";

function DatasetPage(props) {
  let { id } = useParams();
  const data = {
    id: 1,
    img: logo,
    owner: "uis",
    title: "CIFAR10",
    desc: `The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images. The images are labelled with one of 10 mutually exclusive classes: airplane, automobile (but not truck or pickup truck), bird, cat, deer, dog, frog, horse, ship, and truck (but not pickup truck). There are 6000 images per class with 5000 training and 1000 testing images per class.

    The criteria for deciding whether an image belongs to a class were as follows:
    
    The class name should be high on the list of likely answers to the question “What is in this picture?”
    The image should be photo-realistic. Labelers were instructed to reject line drawings.
    The image should contain only one prominent instance of the object to which the class refers. The object may be partially occluded or seen from an unusual viewpoint as long as its identity is still clear to the labeler.`,
    mod: "image",
    lang: "CN",
  };
  const navigate = useNavigate();
  return (
    <div className={dp.layout}>
      <button className={dp.back} onClick={() => navigate(-1)}>
        <BsArrowLeft size={"1.2em"} />
        &nbsp;&nbsp;Go back to market
      </button>
      <div  className={dp.main}>
        <div className={dp.tags}>
            <div className={dp.tag}>#{data.mod}</div>
            <div className={dp.tag}>#{data.lang}</div>
        </div>
        <h1>{data.title}</h1>
        <div>owner: {data.owner}</div>
        <div className={dp.info}>
          <div className={dp.desc}>{data.desc}</div>
          <img src={logo}  className={dp.img}></img>
        </div>
        <div className={dp.other}>
            <h3 className={dp.stitle}>Dataset Users</h3>
            <div>UiS</div>
        </div>
      </div>
    </div>
  );
}

export default DatasetPage;
