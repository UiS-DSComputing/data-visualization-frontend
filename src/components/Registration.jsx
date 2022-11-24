import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
const Registration = () => {
  // const dispatch = useDispatch();

  return (
    <>
      <div className="box">
        <div className="org">
        <h2>Organization Registration</h2>
        <Infobox />
        <p style={{ marginTop: "1rem" }}>
          <a>
            {" "}
            <Link to="/login"> Already an user? Go to Login page. </Link>{" "}
          </a>
        </p>
        </div>
        <div className="line"></div>
        <div className="usr">
          <h2>User Registration</h2>
          <Infobox />
        </div>
      </div>
    </>
  );
};

function Infobox() {
  const navigate = useNavigate();
  const [inputVal, setInputVal] = useState({
    id: 0,
    name: "",
    password: "",
    email: "",
  });

  const handleChange = (e) => {
    setInputVal((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post(`${BACKEND_API_PREFIX}/user`, inputVal)
      .then((res) => {
        navigate("/login");
      })
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <form onSubmit={handleSubmit}>
      <div className="input-box">
        <input
          onChange={handleChange}
          name="name"
          id="user-name"
          type="text"
          required=""
        />
        <label>Name</label>
      </div>
      <div className="input-box">
        <input
          onChange={handleChange}
          name="email"
          id="user-memail"
          type="email"
          required=""
        />
        <label>Email</label>
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
      <input id="submit" type="submit" name="" value="Submit" />
    </form>
  );
}

export default Registration;
