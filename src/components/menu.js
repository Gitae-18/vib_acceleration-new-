import React from "react";
import '../style/main.css';
import { Link, useNavigate } from "react-router-dom";

const Menu = () => {
    const history = useNavigate();
    const handleMenu = (e) => {
        const url = e.target.id;
        history(`/${url}`);
    }
    const Logout = (e) => {
        history('/');
    }
    return(
        <div className="menulist">
            <ul className="menulist__left">
                <li id="general" onClick={handleMenu}>General</li>
                <li id="measurement" onClick={handleMenu}>Measurements</li>
                <li id="network" onClick={handleMenu}>Network</li>
                <li id="server" onClick={handleMenu}>Server</li>
                <li id="trigger" onClick={handleMenu}>Triggers</li>
                <li id="storage" onClick={handleMenu}>Storage</li>
            </ul>
            <ul className="menulist__right">
                <li onClick={Logout}>Logout</li>
                <li>MyPage</li>
            </ul>
        </div>
    )
}
export default Menu;