import React from "react";
import Table from "../common/Table";
import {AiOutlineSearch} from "react-icons/ai"

function Members() {
  const orgTh = [
    {
      field: "id",
      value: "",
    },
    {
      field: "username",
      value: "Username",
    },
    {
      field: "name",
      value: "User",
    },
    {
      field: "email",
      value: "Email",
    },
    {
      field: "mobile",
      value: "Mobile",
    },
    {
      field: "role",
      value: "Role",
      type: "radio",
    },
    {
      field: "create",
      value: "Create Time",
    },
    {
      field: "operation",
      value: "Operation",
    },
  ];
  const orgData = [
    {
      id: 1,
      username: "user1",
      name: "Amy",
      email: "admin@abc.com",
      mobile: "+123445678",
      role: ["admin", "user"],
      create: "2022-1-2",
      operation: ["add"],
    }
  ];

  return (
    <div>
    <div>
        <label>
            Username:
            <input></input>
        </label>
        <button className="normal_btn" style={{marginLeft:"1em"}}><AiOutlineSearch size="1.2em"/>Search</button>
    </div>
      <Table th={orgTh} data={orgData} />
    </div>
  );
}

export default Members;
