import React, { useEffect } from "react";
import tb from "./index.module.css";
import { AiFillDelete } from "react-icons/ai";
import { FaRegEdit } from "react-icons/fa";
import { GrAddCircle } from "react-icons/gr";

function Table(props) {
  const { th, data } = props;
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
                      <a href={d[item.field].link}>{d[item.field]}</a>
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
                      <td key={d.username + item.value}>{d[item.field]}</td>
                    );
                  } else {
                    if (d["operation"].length === 1) {
                      if (d["operation"] === "delete") {
                        return (
                          <td key={d.username + item.value}>
                            <AiFillDelete />
                          </td>
                        );
                      } else if (d["operation"] === "edit") {
                        return (
                          <td key={d.username + item.value}>
                            <FaRegEdit />
                          </td>
                        );
                      } else {
                        return (
                          <td key={d.username + item.value}>
                            <GrAddCircle />
                          </td>
                        );
                      }
                    } else {
                      return (
                        <td key={d.username + item.value}>
                          <AiFillDelete />
                          <FaRegEdit />
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
