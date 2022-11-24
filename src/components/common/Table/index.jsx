import React, { useEffect } from "react";
import tb from "./index.module.css";
import { AiFillDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { GrAddCircle } from "react-icons/gr";
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";

function Table(props) {
  const { th, data,fill} = props;
  function handleDel(){

  }

  function handleEdit(){

  }

  return (
      <table className={tb.tasks}>
        <thead>
          <tr>
            {th.map((item, i) => {
              return <th key={i}>{item.value}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((d, index) => (
            <tr key={"org" + index}>
              {th.map((item) => {
                if (item.type === "link") {
                  return (
                    <td key={d.username + item.value}>
                    <Link to={"/"+item.page+"/" + d[item.field]}>{d[item.field]}</Link>
                    </td>
                  );
                } else if (item.type === "radio") {
                  return (
                    <td key={d.username + item.value}>
                      {d[item.field].map((radio) => {
                        return (
                          <label key={radio}>
                            <input type="radio" id={radio} value={radio} name={d["id"]+item.field}/>
                            {radio}
                          </label>
                        );
                      })}
                    </td>
                  );
                } else {
                  if (item.field !== "operation") {
                    return (
                      <td key={d.username + item.value} className={item.field==="description"? tb.desc_short:""}>{d[item.field]}</td>
                    );
                  } else {
                    if (d["operation"].length === 1) {
                      if (d["operation"] === "delete") {
                        return (
                          <td key={d.username + item.value}>
                            <AiFillDelete onClick={()=>handleDel(d.id)}/>
                          </td>
                        );
                      } else if (d["operation"] === "edit") {
                        return (
                          <td key={d.username + item.value}>
                            <FaRegEdit onClick={()=>handleEdit(d.id)} />
                          </td>
                        );
                      }
                    } else {
                      return (
                        <td key={d.username + item.value}>
                          <AiFillDelete  onClick={()=>handleDel(d.id, th[0].page)} />
                          <FaRegEdit onClick={()=>handleEdit(d.id,th[0].page)}/>
                        </td>
                      );
                    }
                  }
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
  );
}

export default Table;
