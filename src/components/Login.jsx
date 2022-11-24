import axios from "axios";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { authActions } from "../store";
const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";

const Login = () => {
  return (
    <>
      <div className="box">
        <div className="org">
          <h2>Organization Login</h2>
          <InfoBox />
          <p style={{ marginTop: "1rem" }}>
            <a>
              {" "}
              <Link to="/registration">
                {" "}
                Not a User? Go to Registration page.{" "}
              </Link>{" "}
            </a>
          </p>
        </div>
        <div className="line"></div>
        <div className="usr">
          <h2>User Login</h2>
          <InfoBox />
        </div>
      </div>
    </>
  );
};

function InfoBox() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState({
    username: "",
    password: "",
  });

  const [errMsg, setErrMsg] = useState("");

  const handleChange = (e) => {
    setInputVal((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    setErrMsg("");
    e.preventDefault();
    axios
      .post(`${BACKEND_API_PREFIX}/login`, inputVal)
      .then((res) => {
        console.log("hello world", res);
        if (res.status === 200) {
          dispatch(authActions.login(res.data));
        }
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        // setErrMsg(err.response.data.detail)
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="input-box">
        <input
          style={{ fontSize: "0.8rem" }}
          onChange={handleChange}
          name="username"
          id="user-name"
          type="text"
          required=""
        />
        <label>Username</label>
      </div>
      <div className="input-box">
        <input
          onChange={handleChange}
          name="password"
          id="user-pass"
          type="password"
          required=""
        />
        <label>Password</label>
      </div>

      {errMsg.length ? <div className="error-message">{errMsg}</div> : <></>}

      <input id="submit" type="submit" name="" value="Submit" />
    </form>
  );
}
export default Login;
