import React, { Component, useState, useEffect, useReducer } from "react";
import { GrClose } from "react-icons/gr";
import pop from "./index.module.css";
import { nanoid } from "nanoid";
import AddTrainRequest from "../AddTrainQuest";
import AddStation from "../AddStation";

export default function PopBox(props) {
  const {PopUp,addRequest,type,addStation,user}=props
  function handleClose(is){
    PopUp(is)
  }
  return (
    <div className={pop.popup_box}>
      <div className={pop.box}>
        <div className={pop.closediv}>
          <span
            className="icofont-close icofont-2x"
            style={{ color: "#ff8200" }}
            onClick={(e) => handleClose(false)}
            children={<GrClose />}
          ></span>
        </div>
        {
          type=="station"?<AddStation addStation={addStation} handleClose={handleClose} user={user}/>:<AddTrainRequest addRequest={addRequest} />
        }
      </div>
    </div>
  );
}
