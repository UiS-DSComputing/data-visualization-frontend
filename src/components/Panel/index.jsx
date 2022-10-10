import React from "react";
import pl from "./index.module.css";
import logo from "../../assets/uis.png";


function Panel() {
  const datas = [
    {
      id: 1,
      img: logo,
      title: "CIFAR10",
      desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images.",
      ftype: "Images",
      dtype:"CV"
    },{
        id: 2,
        img: logo,
        title: "CIFAR10",
        desc: "The CIFAR-10 dataset (Canadian Institute for Advanced Research, 10 classes) is a subset of the Tiny Images dataset and consists of 60000 32x32 color images.", 
        ftype: "Images",
        dtype:"CV"
      },
    
  ];
  return (
    <div className={pl.layout}>
      <div className={pl.datasets}>
        <h2>My Datasets</h2>
        <table className={pl.lists}>
          <thead>
            <tr>
              <th>No.</th>
              <th>Logo</th>
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
                  <td>
                    {item.name}
                  </td>
                  <td>{item.logo}</td>
                  <td>{item.desc}</td>
                  <td>{item.dtype}</td>
                  <td>{item.ftype}</td>
                  <td>{item.aff}</td>
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
