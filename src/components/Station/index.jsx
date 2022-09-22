import React, { useEffect, useRef, useState, useReducer } from "react";
import { MdTrain } from "react-icons/md";
import { FaRegBuilding } from "react-icons/fa";
import {BiPlus} from "react-icons/bi"
import {BiUser} from "react-icons/bi"
import LogST from "../LogST";
import s from "./index.module.css";
import PopBox from "../PopBox";

function Station() {
  const [isLogedFL, setIsLogedFL] = useState(false);
  const [user, setUser] = useState({ username: "", password: "" });
  function changeLogStatus(status, u) {
    setIsLogedFL(status);
    setUser(u);
  }
  function handleLogout(e){
    setIsLogedFL(e)
  }
  return (
    <div>
      {!isLogedFL && <LogST changeLogStatus={changeLogStatus} />}
      {isLogedFL && (
        <div className={s.layout}>
          <UserInfo user={user} logout={handleLogout}/>
          <Table />
        </div>
      )}
    </div>
  );
}
function UserInfo(prop) {
  const { user,logout } = prop;
  function handleLogout(){
    logout(false)
  }
  return (
    <div className={s.user}>
      <div className={s.label}>STATION REGISTRY</div>
      <div className={s.profile}><BiUser size="4em" style={{top:"1em",position:"relative",color:"#337aff"}}/></div>
      <button className={s.lout} onClick={handleLogout}>Log Out</button>
      <table className={s.info}>
        <tbody>
          <tr>
            <td>
              <MdTrain />
            </td>
            <td>Stations</td>
          </tr>
          <tr>
            <td>
              <FaRegBuilding />
            </td>
            <td>Organizations</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function Table() {
  const titles = [
    "ID",
    "Dataset",
    "Datatype",
    "Filetype",
    "Owner",
    "Email",
    "Affiliation",
    "Description",
  ];
  const [testData,setTestData ]= useState([
    {
      dataset: [1, 2, 3],
      datatype: "CV",
      filetype: "image",
      owner: ["OP1", "OP2"],
      email: ["op1@op1.com", "op2@op2.com"],
      affiliation: ["test affiliation"],
      description: ["Description"],
      savepath: "./op/files",
    },
  ]);
  const [pop, setPop] = useState(false);

  function PopUp(is) {
    setPop(is);
  }
  function addStation(n) {
    let tmpStations=testData
    tmpStations.push(n)
    setTestData(tmpStations);
  }
  return (
    <div className={s.table}>
      <button className={s.add}  onClick={() => PopUp(true)}><BiPlus/>Add New</button>
      <h2>
        <MdTrain />
        Stations
      </h2>
      <table className={s.tasks}>
        <thead>
          <tr>
            <th>No.</th>
            {titles.map((item) => {
              return <th key={item}>{item}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {testData.map((item, i) => {
            return (
              <tr key={i}>
                <td>{i}</td>
                <td>{item.id}</td>
                <td>{item.dataset}</td>
                <td>{item.datatype}</td>
                <td>{item.filetype}</td>
                <td>{item.owner}</td>
                <td>{item.email}</td>
                <td>{item.affiliation}</td>
                <td>{item.description}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {pop && <PopBox PopUp={PopUp} type={"station"} addStation={addStation} />}
    </div>
  );
}
export default Station;
