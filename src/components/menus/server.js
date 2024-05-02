/* eslint-disable */
import React, {useEffect, useState, useCa }from "react";
import Menu from "../menu";
import '../../style/body.css';
import styled from "styled-components";
const Server = () => {
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
                    <label>* Push Port</label>
                    <label>* Reg Port</label>
                </div>

                <div className="form-group blank"/>

                <div className="form-group contents">            
                    <CustomInput type="text" readOnly/>
                    <CustomSelect>
                        <option value="1">1,000 hz</option>
                        <option value="2">2,000 hz</option>
                        <option value="3">3,000 hz</option>
                        <option value="4">4,000 hz</option>
                    </CustomSelect>
                    <CustomSelect>
                        <option value="avg">Average</option>
                        <option value="sum">Sum</option>
                    </CustomSelect>
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

const CustomSelect = styled.select`
border: 1px solid #bbb;
width: 300px;
border-radius: 2%;
flex-grow:1;
margin-bottom:20px;
margin-right: 20px;
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