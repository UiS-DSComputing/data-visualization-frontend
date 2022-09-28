import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { authActions } from "../store";
const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
const ModelAccess = () => {

  const user_id = useSelector((state) => state.user_id);
  const user_name = useSelector((state) => state.user_name);
  const token = useSelector(state => state.accessToken);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const config = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const pythonCode = String.raw`
  	> if not right_file_format(filename, '.csv'):
	> 	return {'error': 'Wrong file format. .csv file required'}
	> with open(filename) as f:
	> 	feature_data = get_feature_mean_std(f)
	> model = test(feature_data)
	> model = model.to_dict('list')
	> return model
`

	const [allUsers, setAllUsers] = useState([])
	const [selectedUser, setSelectedUser] = useState(null)

	const handleUserChange = (e) => {
		setSelectedUser(e.target.value)
	}

	const getUserName = id => {
		if(id === user_id) {
			return user_name
		} else {
			return user_name
		}
	}

	const model_samples = [
		{
			id: 1,
			name: 'Model 1',
			uploaded_by: 3
		},
		{
			id: 3,
			name: 'Model 3',
			uploaded_by: 3
		},
		{
			id: 2,
			name: 'Model 2',
			uploaded_by: 3
		},
		{
			id: 4,
			name: 'Model 4',
			uploaded_by: 3
		},
	]

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


	useEffect(() => {
		loadAllusers();
	}, [])

	useEffect(() => {
		allUsers.length && setSelectedUser(allUsers[0].id);
	}, [allUsers])


  return <>
		<div className="select-container">
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
		<div className="file-access-container">
			<div style={{display: 'flex'}}>
			<div style={{width: '60%'}}>
			<div className="sub-header" >Model for Request Access</div>
				<div class="table-responsive" style={{marginTop: '3rem'}}>
					<table class="table table-striped mg-b-0">
						<thead>
							<tr>
								<th>Model ID</th>
								<th>Model Name</th>
								<th>Uploaded By</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
							{
								model_samples.length && model_samples.map(model => {
									return (
										<tr>
											<th scope="row">{model.id}</th>
											<td>{model.name}</td>
											<td>{allUsers.length ? getUserName(model.uploaded_by) : model.uploaded_by}</td>
											<td style={{display: 'flex', justifyContent: 'space-around'}}>
												<button className="btn btn-primary border-raduis-10" onClick={() => { console.log(model.id)}}>Sample File For Model</button>
												<button className="btn btn-primary border-raduis-10" onClick={() => { console.log(model.id)}}>Model Code Base</button>
												<button className="btn btn-primary border-raduis-10" onClick={() => { console.log(model.id)}}>Request For Access</button>
											</td>
										</tr>
									)
								})
							}
						</tbody>
					</table>
				</div>
			</div>
			<div className="code-container">
				<pre style={{color: "#f7f7f7", backgroundColor: 'rgb(38 67 118)', height: '100%'}}>{pythonCode}</pre>
			</div>
			</div>
			
			<div className="sub-header" >Control Your Model Access</div>
			<div style={{display: 'flex', justifyContent: 'space-between'}}>
			
				<div style={{flexBasis: '48%'}}>
					<div className="sub-title" >Model Access Requested</div>
					<div class="table-responsive" style={{marginTop: '3rem'}}>
						<table class="table table-striped mg-b-0">
							<thead>
								<tr>
									<th>Model ID</th>
									<th>Model Name</th>
									<th>Sender</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									model_samples.length && model_samples.map(file => {
										return (
											<tr>
												<th scope="row">{file.id}</th>
												<td>{file.id}</td>
												<td>{allUsers.length ? getUserName(file.uploaded_by) : file.uploaded_by}</td>
												<td>
												<div style={{display: 'flex', gap: '1rem'}}>
													<button className="btn btn-success border-raduis-10" >Accept</button>
													<button className="btn btn-danger border-raduis-10">Decline</button>
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
					<div className="sub-title" >Model Access Given</div>
					<div class="table-responsive" style={{marginTop: '3rem'}}>
						<table class="table table-striped mg-b-0">
							<thead>
								<tr>
									<th>Model ID</th>
									<th>Model Name</th>
									<th>Sender</th>
									<th>Action</th>
								</tr>
							</thead>
							<tbody>
								{
									model_samples.length && model_samples.map(file => {
										return (
											<tr>
												<th scope="row">{file.id}</th>
												<td>{file.id}</td>
												<td>{allUsers.length ? getUserName(file.uploaded_by) : file.uploaded_by}</td>
												<td>
												<button className="btn btn-danger border-raduis-10">Remove Access</button>
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
		</div>
	</>;
};

export default ModelAccess;
