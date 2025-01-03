/* eslint-disable */
import React from "react";
import '../style/main.css';
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
    const history = useNavigate();
    const handleMenu = (menu) => {
        const url = menu;
        history(`/${url}`);
    }
    return(
        <div id="header" className="header">
            <div className="headerIn">
                <h1>
                    <span className="logo">설정소프트웨어</span>
                </h1>
                <nav className="gnb topmenu">
                    <ul>
                        
                        {/* <li className="Measurements" id="measurement">
                            <span onClick={() => handleMenu("measurement")}>Measurements</span>
                        </li> */}
                        <li className="Network" id="network" >
                            <span onClick={() => handleMenu("network")}>Network</span>
                        </li>
                        <li className="WiFi" id="wifi" >
                            <span onClick={() =>handleMenu('general')}>WiFi</span>
                        </li>
                        <li className="Server" id="server">
                            <span onClick={() => handleMenu("server")}>Server</span>
                        </li>
                        {/* <li className="Triggers" id="trigger">
                            <span onClick={() => handleMenu("trigger")}>Triggers</span>
                        </li>
                        <li className="Storage" id="storage">
                            <span onClick={() => handleMenu("storage")}>Storage</span>
                        </li> */}
                    </ul>
                </nav>                
            </div>
        </div>
    )
}
export default Menu;