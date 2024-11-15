/* eslint-disable */
import React, {useEffect, useState, useCa }from "react";
import Menu from "../menu";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import styled from "styled-components";
const Server = () => {
    const [sub_addr, setSubAddr] = useState('5555');
    const [push_addr, setPushAddr] = useState('5557');
    const [req_addr, setReqAddr] = useState('5559');

    const handleChange = (e) => {
        const { name, value } = e.target;
    
        switch (name) {
          case 'sub_addr':
            setSubAddr(value);
            break;
          case 'push_addr':
            setPushAddr(value);
            break;
          case 'req_addr':
            setReqAddr(value);
            break;
          default:
            break;
        }
    }
    return(
        <body>
        <div className="wrap Network">
            <div>
                <Menu />
            </div>
            <main className="mainArea">
            <section>
                <div className="contIn">
                    <div className="cont_Tit mb23">
                        <img src="/images/server_icon.png"/>
                        <h2>SERVER CONNECT INFORMATION</h2>
                    </div>
                    <div className="contBox">
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Server IP address
                            </li>
                            <li>
                                <input type="text" id="" className="commonInput" placeholder="192.168.0.10"/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Push Port
                            </li>
                            <li>
                                <input type="text" id="" className="commonInput" placeholder="5557"/>
                            </li>
                        </ul>
                        <ul className="d-flex">
                            <li className="contBoxtit">
                                Req Port
                            </li>
                            <li>
                                <input type="text" id="" className="commonInput" placeholder="5559"/>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <div className="common_button d-flex">
                <button className="save_btn">Save</button>
                <button className="cancel_btn">Cancel</button>
            </div>
            </main>
        </div>
        </body>
     )
}

export default Server;

const InputPort = styled.input`
width:280px !important; 
height: 15px !important;
border: 1px solid #ccc; 
border-radius: 4px; 
padding: 5px 10px; 
font-size: 16px; 
margin-bottom:20px !important;
box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3); 
background-color: #ffffff;
margin-left:50%;
`
const CustomInput = styled.input`
width:280px !important; 
height: 15px !important;
border: 1px solid #ccc; 
border-radius: 4px; 
padding: 5px 10px; 
font-size: 16px; 
margin-bottom:20px !important;
box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.3); 
background-color: #ebebeb;
margin-left:50%;
`
const CustomLine = styled.div`
border-top: 2px solid #ccc; /* 상단 테두리 설정 */
width: calc(95%); /* padding 값을 고려한 너비 설정 */
margin-top: 20px; /* 선 위 간격 */
margin-bottom: 20px; 
margin-left: 100px;
`
const CustomButton = styled.button`
border: 1px solid #000;
width: 180px;
height:30px;
border-radius: 8px;
flex-grow:1;
margin-bottom:20px;
margin-left:70%;
background-color: #c8c8c8;
box-shadow: inset 0 0 8px rgba(0,0,0,0.5); 
`