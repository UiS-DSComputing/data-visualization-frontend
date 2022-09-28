import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { authActions } from '../store';
import FileUpload from "./common/file-upload/file-upload.component";
const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
function Upload() {
  const user_id = useSelector((state) => state.user_id);
  const token = useSelector(state => state.accessToken);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };
  const childRef = useRef(null);
  const [allFiles, setAllFiles] = useState([]);

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

  useEffect(() => {
    loadAllFiles();
  }, []);

  const [inputVal, setInputVal] = useState('');

  const handleChange = (files) => {
    console.log('2',files)
    setInputVal( 
      files[0]
    );
  }
  
  const handleSubmit = async(e) => {
    e.preventDefault();

    var formData = new FormData();

    formData.append(
        "file",inputVal,inputVal.name
    );

    console.log('1', formData)

		await axios.post(`${BACKEND_API_PREFIX}/upload`, formData, config).then(() => {
      loadAllFiles();
      childRef.current.removeFiles();
    })
  }

  return (
    <>
    
    <div>
      <form onSubmit={handleSubmit}>
        <FileUpload
          ref={childRef}
          // accept=".csv"
          handleChange={handleChange}
          updateFilesCb={handleChange}
        />
        <button style={{borderRadius: '5px', float: 'right', fontSize: '1rem', fontWeight: 'bold'}} className='btn btn-primary' type="submit">Submit File</button>
      </form>
    </div>
    <div style={{textAlign: 'center'}}>
      <h5>File List</h5>
    </div>
    <div class="table-responsive" style={{marginTop: '3rem'}}>
    <table class="table table-striped mg-b-0">
      <thead>
        <tr>
          <th>ID</th>
          <th>File Name</th>
          <th>File Size</th>
          <th>Uploaded By</th>
        </tr>
      </thead>
      <tbody>
        {
          allFiles.length && allFiles.map(file => {
            return (
              <tr>
                <th scope="row">{file.id}</th>
                <td>{file.filename}</td>
                <td>{file.filesize !== '' ? file.filesize : 'N/A'}</td>
                <td>{file.uploaded_by.name}</td>
              </tr>
            )
          })
        }
      </tbody>
    </table>
    </div>
    
    </>

  );
}

export default Upload;
