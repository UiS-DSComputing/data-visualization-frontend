import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../store/';
const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
const DataCollection = () => {
  const user_id = useSelector((state) => state.user_id);
  const token = useSelector((state) => state.accessToken);

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [allFiles, setAllFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileData, setFileData] = useState([]);
  const [columnData, setColumnData] = useState([]);

  const handleDataChange = (e) => {
    setSelectedFile(e.target.value);
  };

  const loadAllFiles = async () => {
    
    
      try {
        await axios
      .get(`${BACKEND_API_PREFIX}/file-collection/${user_id}`, config)
      .then((res) => {
        setAllFiles(res.data);
      });
      }
      catch(err) {
        if (err.response.status === 401) {
          dispatch(authActions.logout())
          navigate("/login")
        }
      }
  };

  const loadSelectedFiles = () => {
    allFiles.length && setSelectedFile([allFiles[0].id]);
  };

  const loadFileData = async () => {
    
      try {
        await axios
        .get(`${BACKEND_API_PREFIX}/file-read/${selectedFile}`, config)
        .then((res) => {
          setFileData(res.data.data.slice(1));
        });
      }
      catch(err) {
        if (err.response.status === 401) {
          dispatch(authActions.logout())
          navigate("/login")
        }
      }
  };

  const loadColumn = () => {
    fileData.length && setColumnData(Object.keys(fileData[0]));
  };

  useEffect(() => {
    loadAllFiles();
  }, []);

  useEffect(() => {
    loadSelectedFiles();
  }, [allFiles]);

  useEffect(() => {
    loadFileData();
  }, [selectedFile]);

  useEffect(() => {
    loadColumn();
  }, [fileData]);

  return (
    <>
      <div className="select-container">
        <select value={selectedFile} onChange={handleDataChange}>
          {allFiles.length &&
            allFiles.map((file) => {
              return (
                <option key={file.id} value={file.id}>
                  {file.filename}
                </option>
              );
            })}
        </select>
      </div>

      <div style={{textAlign: 'center'}}>
      <h5>File List</h5>
    </div>
    <div class="table-responsive" style={{marginTop: '3rem'}}>
    <table class="table table-striped mg-b-0">
      <thead>
        <tr>
          {
            columnData.length && columnData.map(col => {
              return (
                <th>{col}</th>
              )
            })
          }
        </tr>
      </thead>
      <tbody>
        {
          fileData.length && fileData.map(file => {
            return (
              <tr>
                {
                  columnData.length && columnData.map(col => {
                    return (
                      <td>{file[col]}</td>
                    )
                  })
                }
              </tr>
            )
          })
        }
      </tbody>
    </table>
    </div>
    </>
  )
}

export default DataCollection