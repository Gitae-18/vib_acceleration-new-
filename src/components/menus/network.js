/* eslint-disable */
import React, {useEffect, useState, useCallback, useRef }from "react";
import Menu from "../menu";
import '../../style/body.css';
import styled from "styled-components";
const Network = ({devId}) => {
    const [netInfo, setNetInfo] = useState({
        IP_Address:'',
        SubnetMask:'',
        Default_Gateway:'',
        Mode:'',
        SSID:'',
    });
    const isMounted = useRef(true);

    const getDefaultNetworkInfo = useCallback(async() => {
        try {
            const res = await fetch(`http://192.168.10.14:3000/net_information?devId=${devId}`, {
                method: 'GET'
            });

            if (!res.ok) {
                console.log('잘못된 아이디 입니다.');
                return;
            }

            const json = await res.json();

            if (isMounted.current) {
                setNetInfo(netinfo => ({
                    ...netinfo, 
                    IP_Address: json,
                    SubnetMask:json,
                    Default_Gateway:json,
                    Mode:json,
                    SSID:json,
                }));
            }
            
        } catch (error) {
            console.error('Failed to fetch device info:', error);
        }
    },[/* devId, */netInfo])

    useEffect(() => {
        getDefaultNetworkInfo();
        return () => {
            isMounted.current = false;
        };
    },[getDefaultNetworkInfo])

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
                            <input value={netInfo.IP_Address} type="text" readOnly/>
                            <input value={netInfo.SubnetMask}type="text" readOnly/>
                            <input value={netInfo.Default_Gateway} type="text" readOnly/>
                            <input value={netInfo.Mode} type="text" readOnly/>
                            <input value={netInfo.SSID} type="text" readOnly/>
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
border-top: 2px solid #ccc; 
width: calc(95%); 
margin-top: 20px; 
margin-bottom: 20px; 
margin-left: 100px;
`