import React, { useEffect, useRef, useState, useReducer } from "react";
import lst from "./index.module.css";

function LogFL(props) {
  const { changeLogStatus } = props;
  const [userInfo, setUserInfo] = useState({
    username: "",
    pw: "",
  });
  const [errMsg, setErrMsg] = useState("");
  function handleSubmit() {
    changeLogStatus(true, userInfo);
  }
  function handleUsername(e) {
    let name = e.target.value;
    setUserInfo({ ...userInfo, username: name });
  }
  function handlePw(e) {
    let pw = e.target.value;
    setUserInfo({ ...userInfo, pw: pw });
  }

  return (
    <div className={lst.bg}>
      <div className={lst.layout}>
        <h2 className={lst.h}>STATION REGISTRY</h2>
        <form onSubmit={handleSubmit} className={lst.table}>
          <div className={lst.title}>Sign In to your account</div>
          <div className={lst.box}>
            <label>Username</label>
            <input
              onKeyUp={(e) => handleUsername(e)}
              name="username"
              id="user-name"
              type="text"
              required=""
            />
          </div>
          <div className={lst.box}>
            <label>Password</label>
            <input
              onKeyUp={(e) => handlePw(e)}
              name="password"
              id="user-pass"
              type="password"
              required=""
            />
          </div>

          {errMsg.length ? (
            <div className="error-message">{errMsg}</div>
          ) : (
            <></>
          )}

          <input
            className={lst.submit}
            id="submit"
            type="submit"
            name=""
            value="Sign In"
          />
        </form>
      </div>
    </div>
  );
}

export default LogFL;
