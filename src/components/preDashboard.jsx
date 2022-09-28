import axios from "axios";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, Tooltip } from 'react-leaflet';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import icon from '../../node_modules/leaflet/dist/images/marker-icon.png';
import iconShadow from '../../node_modules/leaflet/dist/images/marker-shadow.png';
import { authActions } from '../store/';
import FileDataViewer from "./FileDataViewer";
const BACKEND_API_PREFIX =
  process.env["BACKEND_API_PREFIX"] || "http://161.97.133.43:8000";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [20, 30]
});

L.Marker.prototype.options.icon = DefaultIcon;
<link href='https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.0.3/leaflet.css' rel='stylesheet'></link>
const Dashboard = () => {
  const user_id = useSelector((state) => state.user_id);
  const token = useSelector((state) => state.accessToken);
  const navigate = useNavigate();
  const [allFiles, setAllFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [rigSelected, setRigSelected] = useState(null);
  const [oilRigs, setOilRigs] = useState([
    {
      id: 1,
      name: 'oil rig 1',
      position: [58.904467894117346, 5.0451266172147315]
    },
    {
      id: 2,
      name: 'oil rig 2',
      position: [60.869732117212365, 4.161163172607339]
    },
    {
      id: 3,
      name: 'oil rig 3',
      position: [63.5233322079819, 7.000141189149409]
    }
  ]);
  const dispatch = useDispatch();

  const config = {
    headers: { Authorization: `Bearer ${token}` },
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

  

  useEffect(() => {
    loadAllFiles();
  }, []);

  // useEffect(() => {
  //   allFiles.length && setSelectedFiles([allFiles[0].id]);
  // }, [allFiles]);

  const handleFileCheckboxChange= (e) => {
    if (selectedFiles.includes(e.target.value)) {
      setSelectedFiles(selectedFiles.filter(sf => sf !== e.target.value))
    } else {
      setSelectedFiles((prevState) => ([...prevState, e.target.value]))
    }
  }

  const handleRigClick = (e) => {
    setRigSelected(e.target.options.data)
  }

  return (
    <>
      <div style={{ display: "flex" }}>
        <div className="az-content-left az-content-left-components">
        <div style={{textAlign: 'center', fontWeight: 'bold'}} >{rigSelected ? `${rigSelected.name}'s Files` : 'File list'} </div>
        <hr/>
          {rigSelected ? 
            allFiles.map(file => {
              return (
                <>
                  <div key={file.id} className="inputGroup check-input" style={file.uploaded_by.id.toString() === user_id ? {background: 'rgba(64,224,208, 0.2)'} : {background: 'rgba(255,228,225, 0.4)'}}>
                    <input className="file-list" id={file.id} value={file.id} type="checkbox" onChange={handleFileCheckboxChange}/>
                    <label className="file-list-label" htmlFor={file.id}>{file.filename}</label>
                  </div>
                </>
              )
            })
           : 
          <div className="sub-title" style={{fontSize: '0.8rem'}}>
            Select Oil Rig to show Files
          </div>
          }
        </div>

        <div style={{height: '90vh', width: '100%', overflow: 'scroll'}}>
          {selectedFiles.length ?
            selectedFiles.map(file => {
              return (
                <>
                  {/* <div key={file.id} className="sub-title" >{allFiles.filter(Afile => Afile.id.toString() === file)[0].filename}</div> */}
                  <FileDataViewer id={file}/>
                </>
              )
            }) : 
            (
            // <div style={{textAlign: 'center', display: 'block', padding: '20px', fontWeight: 'bold'}} >Select File from checkbox to visualize data</div>
            <MapContainer className="map-container" center={[61.76142272557969, 7.995615188312023]} zoom={5} scrollWheelZoom={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {oilRigs.length && 
                oilRigs.map(or => {
                  return (
                    <Marker onClick={() => {handleRigClick(or)}} key={or.id} position={or.position} eventHandlers={{
                      click: handleRigClick,
                    }} data={or}>
                      <Tooltip direction="bottom" offset={[3, 16]} opacity={1} permanent>
                        {or.name}
                      </Tooltip>
                    </Marker>
                  )
                })
              }
            </MapContainer>
            )
          }
        </div>
      </div>
    </>
  );
};

export default Dashboard;
