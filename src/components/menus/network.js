import React, {useEffect, useState, useCa }from "react";
import Menu from "../menu";
import '../../style/body.css';
import styled from "styled-components";
const Network = () => {
    return(
        <>
                <div>
                    <Menu/>
                </div>
                <div className="body">
                <div className="sec_title">        
                    <label>|</label>
                    <h3>Network Information</h3>            
                </div>
                    <div className="group_devinfo">
                        <div className="form-group labels">
                        <label>* IP Address</label>
                        <label>* Subnet Mask</label>
                        <label>* Default Gateway</label>
                        <label>* Setup Mode</label>
                        <label>* SSID Name</label>
                        </div>
                        <div className="form-group blank"/>
                        <div className="form-group contents ip">            
                            <input type="text" readOnly/>
                            <input type="text" readOnly/>
                            <input type="text" readOnly/>
                            <input type="text" readOnly/>
                            <input type="text" readOnly/>
                            <input type="text" readOnly/>
                        </div>
                    </div>
                    <CustomLine/>
            
                    <div className="date_title">        
                        <label>|</label>
                        <h3>SETUP Mode</h3>            
                    </div>
                    <div className="group_devinfo">
                        <div className="form-group labels">
                            <label>* AP Mode USE or NOT</label>
                        </div> 
                        <div className="form-group blank"/>    
                        <div className="form-group contents">       
                            <CustomButton>SETUP Mode Stop</CustomButton>                             
                        </div>                       
                    </div>
                    <CustomLine/>        
                    <div className="date_title">        
                        <label>|</label>
                        <h3>Wi-Fi Network</h3>            
                    </div>
                    <div className="group_devinfo">
                        <div className="form-group labels">
                            <label>* Wi-Fi Network Scan</label>
                        </div> 
                        <div className="form-group blank"/>    
                        <div className="form-group contents">            
                            <CustomButton>Rescan</CustomButton> 
                        </div>                       
                    </div>
                    <div className="form-group contents">            
                    <table>
                        <thead>
                            <tr>
                            <th>Wi-Fi Network Name</th>
                            <th>Status</th>
                            <th>Connect</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                            <td className="first">C&C_ring_2.4G</td>
                            <td className="second">Not Connected</td>
                            <td className="button-cell"><button>Connect</button></td>
                            </tr>
                            <tr>
                            <td className="first">FEELINK_2.4G</td>
                            <td className="second">Not Connected</td>
                            <td className="button-cell"><button>Connect</button></td>
                            </tr>
                            <tr>
                            <td className="first">Vibnet_a2:22:bb:cc:dd</td>
                            <td className="second">Connected</td>
                            <td className="button-cell"><button>Disconnect</button></td>
                            </tr>
                        </tbody>
                    </table>
                    </div>  
                </div>
                </>
     )
}

export default Network;

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
const CustomLine = styled.div`
border-top: 2px solid #ccc; /* 상단 테두리 설정 */
width: calc(100%); /* padding 값을 고려한 너비 설정 */
margin-top: 20px; /* 선 위 간격 */
margin-bottom: 20px; 
margin-left: 100px;
`