import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { FaRegFileAlt } from 'react-icons/fa';
import { GiFactory } from 'react-icons/gi';
import {BiTerminal} from 'react-icons/bi'
import { GrDatabase, GrPieChart, GrSettingsOption } from 'react-icons/gr';
// import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Link, Navigate, Route, Routes } from "react-router-dom";
import EquiLogo from '../../assets/logo-company.png';
import { authActions } from '../../store/';
import Dashboard from '../Dashboard';
import Projects from '../Projects';
// import FileAccess from '../FileAccess';
import Login from '../Login';
// import ModelAccess from '../ModelAccess';
import Registration from '../Registration';
// import RigAccess from '../RigAccess';
// import Upload from '../Upload';
import FL from '../FL';
import DataMarket from '../DataMarket'
import ModelMarket from '../ModelMarket';
import logo from '../../assets/uis.png'

const Layout = () => {
  // const navigate = useNavigate();
  // const isLoggedIn = useSelector(state => state.isLoggedIn);
  const isLoggedIn=true
  const user_name = useSelector(state => state.user_name);
  // const token = useSelector(state => state.accessToken);
  const dispatch = useDispatch();

  return (
    <>
    <BrowserRouter>
    <div className="az-header" style={{position: 'fixed', top: '0px', width: '100%'}}>
      <div className="container" style={{width: '90%', margin: 'auto'}}>
        <div className="az-header-left">
          <img src={logo} style={{width:"135px"}}></img>
        </div>
        { isLoggedIn && 
        <div className="az-header-menu">
          <ul className="nav">
              <li className="nav-item">
                <a className="nav-link"><GrPieChart className='ricon'/> <Link to="/"> Data Market </Link></a>
              </li>
              <li className="nav-item">
              <a className="nav-link"> <GrSettingsOption className='ricon'/> <Link to="/modelMarket"> Model Market </Link>  </a>
            </li>
            <li className="nav-item">
              <a className="nav-link"> <FaRegFileAlt className='ricon'/> <Link to="/dashboard"> Dashboard </Link>  </a>

            </li>
            <li className="nav-item">
              <a className="nav-link"> <GrDatabase className='ricon'/> <Link to="/projects"> Projects </Link>  </a>

            </li>
            {/* <li className="nav-item">
              <a className="nav-link"> <FaRegFileAlt className='ricon'/> <Link to="/file-access"> File Access </Link>  </a>

            </li>

            <li className="nav-item">
              <a className="nav-link"> <GiFactory className='ricon'/> <Link to="/rig-access"> Rig Access </Link>  </a>

            </li>
            <li className="nav-item">
              <a className="nav-link"> <AiOutlineCloudUpload className='ricon'/> <Link to="/upload"> Upload </Link></a>
            </li> */}
            <li className="nav-item">
              <a className="nav-link"> <BiTerminal className='ricon'/> <Link to="/fl"> FL </Link></a>
            </li>
          </ul>
        </div>
        }
        {isLoggedIn && 
        <div className="az-header-right">
          <a  className="az-header-search-link"><i className="fas fa-search"></i></a>
          <div className="dropdown az-profile-menu" style={{cursor: 'pointer'}}>
            <a  className="az-img-user"><img src={EquiLogo} alt=""/></a>
            <div className="dropdown-menu">
              <div className="az-dropdown-header d-sm-none">
                <a  className="az-header-arrow"><i className="icon ion-md-arrow-back"></i></a>
              </div>
              <div className="az-header-profile">
                <div className="az-img-user">
                  <img src={EquiLogo} alt="" />
                </div>
                <h6>{user_name}</h6>
                <span>Active Member</span>
              </div>
              <a className="dropdown-item"><i className="typcn typcn-user-outline"></i> Profile Info</a>
              <a className="dropdown-item"><i className="typcn typcn-edit"></i> Edit Profile</a>
              <a className="dropdown-item"><i className="typcn typcn-time"></i> Activity Logs</a>
              <a className="dropdown-item"><i className="typcn typcn-cog-outline"></i> Account Settings</a>
              <a className="dropdown-item" onClick={() => {dispatch(authActions.logout())}}><i className="typcn typcn-power-outline"></i> Sign Out</a>
            </div>
          </div>
        </div>
        }
      </div>
    </div>


    <div className="az-content pd-y-20 pd-lg-y-30 pd-xl-y-40" style={{paddingTop: '90px'}}>
        <div className="container" style={{width: '93%', margin: 'auto'}}>
            <div style={{paddingLeft: '0px'}} className="az-content-body pd-lg-l-40 d-flex flex-column">
              <Routes>
                <Route path="/" index element={ isLoggedIn ? <DataMarket/> : <Navigate to="/login" /> } />
                <Route path="/login" element={<Login/>} />
                <Route path="/registration" element={<Registration/>} />
                <Route path="/projects" index element={ isLoggedIn ? <Projects/> : <Navigate to="/login" />} />
                <Route path="/modelMarket" index element={ isLoggedIn ? <ModelMarket/> : <Navigate to="/login" />} />
                <Route path="/dashboard" element={ isLoggedIn ? <Dashboard /> : <Navigate to="/fl" />} />
                <Route path="/fl" element={ isLoggedIn ? <FL /> : <Navigate to="/fl" />} />

                {/* <Route path="/file-access" index element={ isLoggedIn ? <FileAccess/> : <Navigate to="/login" />} /> */}
                {/* <Route path="/rig-access" index element={ isLoggedIn ? <RigAccess/> : <Navigate to="/login" />} /> */}
                {/* <Route path="/upload" element={ isLoggedIn ? <Upload /> : <Navigate to="/login" />} /> */}
              </Routes>
            </div>
        </div>
    </div>
    </BrowserRouter>
    </>
  )
}

export default Layout