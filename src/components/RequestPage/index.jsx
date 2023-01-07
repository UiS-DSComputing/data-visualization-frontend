import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function RequestPage() {
  let { id } = useParams();
  const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://localhost:8000";
  const getInfo = async (id) => {
    await axios
      .get(`${BACKEND_API_PREFIX}/training/status/${id}`)
      .then((res) => {
        console.log(res.data);
      });
  };
//   useEffect(() => {
//     return () => {
//   
//     }
//   }, [])
  
  return <div>RequestPage</div>;
}

export default RequestPage;
