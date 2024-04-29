import React,{useState} from "react";
import './style/new.css';
import { Link, useNavigate} from "react-router-dom";
const Login = () => {
    const history = useNavigate();
    const handleLogin = () => {
        history('/general');
    }
    return(
        <>
            <div className="login_box"> 
                <div className="title">
                   <label className="login_title"> | </label><h2>Login</h2>
                </div>
                <form action="">
                <div class="input_area_and_btn">
                <div className="input_area">
                    <div><label className="id">MEMBER ID</label> <input type="text" id="id" name="id"/></div>
                    <div><label className="pwd">PASSWORD</label> <input type="password" id="pwd" name="pwd"/></div>
                </div>
                <div className="login_btn">
                    <button onClick={handleLogin}>Login</button>
                </div>
                </div>
                <div className="chk_login">
                  <input type="checkbox" name="chksave" id="saveid"/>
                  <label>SAVE ID</label>
                </div>
                {/* <div className="reg_login">
                    <button>Register</button>
                </div> */}
                </form>
            </div>
        </>
    )
}

export default Login;