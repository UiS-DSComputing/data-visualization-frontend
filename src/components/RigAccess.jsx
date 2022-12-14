import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://localhost:8000";
const RigAccess = () => {

  const user_id = useSelector((state) => state.user_id);
  const user_name = useSelector((state) => state.user_name);
  const token = useSelector(state => state.accessToken);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

	const [allUsers, setAllUsers] = useState([])
	const [allFiles, setAllFiles] = useState([])
	const [selectedUser, setSelectedUser] = useState(null)

	const handleUserChange = (e) => {
		setSelectedUser(e.target.value)
	}

	const getUserName = id => {
		if(id === user_id) {
			return user_name
		} else {
			return allUsers.filter(user => user.id === id)[0].name
		}
	}

	const getFileName = id => {
		return allFiles.filter(file => file.id === id)[0].filename
	}

	const loadAllusers = async () => {

	  try {
		await axios
		.get(`${BACKEND_API_PREFIX}/users`, config)
		.then((res) => {
		  setAllUsers(res.data);
		});
      }
      catch(err) {
        if (err.response.status === 401) {
          dispatch(authActions.logout())
          navigate("/login")
        }
      }
  };

  const loadAllFiles = async () => {
    await axios
      .get(`${BACKEND_API_PREFIX}/file-collection`, config)
      .then((res) => {
        setAllFiles(res.data);
      });
  };

	useEffect(() => {
		loadAllusers();
		loadAllFiles();
	}, [])

	useEffect(() => {
		allUsers.length && setSelectedUser(allUsers[0].id);
	}, [allUsers])

  return <>
		<div className="rig-select-container">
        <select value={selectedUser} onChange={handleUserChange}>
          {allUsers.length &&
            allUsers.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              );
            })}
        </select>

		<select value={selectedUser} onChange={handleUserChange}>
          {allUsers.length &&
            allUsers.map((user) => {
              return (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              );
            })}
        </select>
      </div>

			{/*  */}

		{/* <div className="file-access-container">
			<div>
			<div className="sub-header" >File Collection for Request Access</div>
				<div class="table-responsive" style={{marginTop: '3rem'}}>
					<table class="table table-striped mg-b-0">
						<thead>
							<tr>
								<th>File ID</th>
								<th>File Name</th>
								<th>File Size</th>
								<th>Uploaded By</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{
								fileListForRequest.length && fileListForRequest.map(file => {
									return (
										<tr>
											<th scope="row">{file.file_id}</th>
											<td>{file.file_name}</td>
											<td>{file.file_size !== '' ? file.file_size : 'N/A'}</td>
											<td>{allUsers.length ? getUserName(file.file_owner) : file.file_owner}</td>
											<td>
												{
													file.status === 0 ? 
													<button className="btn btn-primary border-raduis-10" onClick={() => { handleRequestForAccess(file)}}>Request For Access</button> : 
													(file.status === 1 ? <button className="btn btn-primary border-raduis-10" >Request Sent</button> :
													<button className="btn btn-info border-raduis-10">Accessed</button> )
												}
											</td>
										</tr>
									)
								})
							}
						</tbody>
					</table>
				</div>
			</div>
			
			<div className="sub-header" >Control Your File Access</div>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
			
				<div style={{flexBasis: '48%'}}>
					<div className="sub-title" >File Access Requested</div>
					<div class="table-responsive" style={{marginTop: '3rem'}}>
						<table class="table table-striped mg-b-0">
							<thead>
								<tr>
									<th>File ID</th>
									<th>File Name</th>
									<th>Sender</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									fileListForAccept.length && fileListForAccept.map(file => {
										return (
											<tr>
												<th scope="row">{file.id}</th>
												<td>{allFiles.length ? getFileName(file.id) : file.id}</td>
												<td>{allUsers.length ? getUserName(file.sender) : file.sender}</td>
												<td>
												<div style={{display: 'flex', gap: '1rem'}}>
													<button className="btn btn-success border-raduis-10" onClick={() => { handleRequestAccept(file)}}>Accept</button>
													<button className="btn btn-danger border-raduis-10" onClick={() => { handleRequestDecline(file)}}>Decline</button>
													</div>
												</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
				</div>
				
				<div style={{flexBasis: '48%'}}>
					<div className="sub-title" >File Access Given</div>
					<div class="table-responsive" style={{marginTop: '3rem'}}>
						<table class="table table-striped mg-b-0">
							<thead>
								<tr>
									<th>File ID</th>
									<th>File Name</th>
									<th>Sender</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									fileListForRemove.length && fileListForRemove.map(file => {
										return (
											<tr>
												<th scope="row">{file.file_id}</th>
												<td>{allFiles.length ? getFileName(file.id) : file.id}</td>
												<td>{allUsers.length ? getUserName(file.sender) : file.sender}</td>
												<td>
												<button className="btn btn-danger border-raduis-10" onClick={() => { handleRequestDecline(file)}}>Remove Access</button>
												</td>
											</tr>
										)
									})
								}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div> */}
	</>;
};

export default RigAccess;
