import React from "react";
import pl from "./index.module.css";
import logo from "../../assets/uis.png";
import { Link } from "react-router-dom";

function Panel() {
  const datas = [
    {
      id: 1,
      img: logo,
      name: "CIFAR10",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images.",
      ftype: "Images",
      dtype: "CV",
    },
  ];
  const models = [
    {
      name: "Language Model",
      arc: "Bert",
      ts: "Corpus",
      size: "1.3G",
    },
  ];
  return (
    <div className={pl.layout}>
      <div className={pl.datasets}>
        <div className={pl.frow}>
          <h4>My Datasets</h4>
          <Link to={"/upload"}>
            {" "}
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
            </tr>
          </thead>
          <tbody>
            {datas.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  {/* <td>{item.logo}</td> */}
                  <td className={pl.desc}>{item.desc}</td>
                  <td>{item.dtype}</td>
                  <td>{item.ftype}</td>
                  <td>{item.aff}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className={pl.datasets}>
        <div className={pl.frow}>
          <h4>My Models</h4>
          <button className={pl.addbtn}>Add Model</button>
        </div>
        <table className={pl.lists}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Task</th>
              <th>Architecture</th>
              <th>Training Set</th>
              <th>Model Size</th>
            </tr>
          </thead>
          <tbody>
            {models.map((item, i) => {
              return (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{item.name}</td>
                  <td>{item.arc}</td>
                  <td>{item.ts}</td>
                  <td>{item.size}</td>
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
