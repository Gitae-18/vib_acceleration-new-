/* eslint-disable */
import React, {useEffect, useState, useCa }from "react";
import Menu from "../menu";
import '../../style/body.css';
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
        <>
        <div>
            <Menu/>
        </div>
        <div className="body">
        <div className="sec_title">        
            <label>|</label>
            <h3>40g DC ACCELERATION</h3>            
        </div>
            <div className="group_devinfo" style={{marginBottom:'500px'}}>
                <div className="form-group labels">
                    <label>* Server IP address</label>
                    <label>* Sub Port</label>
                    <label>* Push Port</label>
                    <label>* Req Port</label>
                </div>

                <div className="form-group blank"/>

                <div className="form-group contents">            
                    <CustomInput type="text" readOnly/>
                    <InputPort defaultValue={sub_addr} name="sub" onChange={handleChange}/>
                    <InputPort defaultValue={push_addr} name="push" onChange={handleChange}/>
                    <InputPort defaultValue={req_addr} name="req" onChange={handleChange}/>

                </div>
            </div>
            <CustomLine/>
            <div className="group_devinfo">
                <div className="form-group buttons">
                    <CustomButton>Save</CustomButton>
                    <CustomButton>Cancel</CustomButton>
                </div>
            </div> 
            </div>          
        </>
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