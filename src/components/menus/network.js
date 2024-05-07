/* eslint-disable */
import React, {useEffect, useState, useCallback, useRef }from "react";
import Menu from "../menu";
import '../../style/body.css';
import styled from "styled-components";
const Network = ({}) => {
    const [netInfo, setNetInfo] = useState({
        IP_Address:'',
        SubnetMask:'',
        Default_Gateway:'',
        Mode:'',
        SSID:'',
    });
    const [handleAP, setHandleAP] = useState(false);
    const isMounted = useRef(true);
    const devId = 'D000001';
    const getDefaultNetworkInfo = useCallback(async() => {
        try {
            const res = await fetch(`http://192.168.10.14:5001/network`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Server responded with status:', res.status);
            } else {
                const text = await res.text();
                const json = JSON.parse(text);
                const data = await res.json();
                console.log(json);
            }
            
                /* setNetInfo(netinfo => ({
                    ...netinfo, 
                    IP_Address: json.IP_Address,
                    SubnetMask:json.SubnetMask,
                    Default_Gateway:json.Default_Gateway,
                    Mode:json.Mode,
                    SSID:json.SSID,
                })); */
            
            
        } catch (error) {
            console.error('Failed to fetch device info:', error);
        }
    },[devId])
    console.log(netInfo);
    useEffect(() => {
        getDefaultNetworkInfo();
        return () => {
            isMounted.current = false;
        };
    },[getDefaultNetworkInfo])
    const handleApMode = async() => {
        try {
            const res = await fetch(`http://192.168.10.14:5001/handle_ap?devId=${devId}`, {
                method: 'post',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    param: handleAP,
                })            
            });

            if (!res.ok) {
                console.log('오류가 발생했습니다.');
                return;
            }
            if (isMounted) {
                setMessage("AP Mode has been successfully updated.");
            }           
        } catch (error) {
            console.error('Failed to handle apmode :', error);
        }
    }
    useEffect(() => {
        let isMounted = true;
        

        //handleApMode();

        return () => {
            isMounted = false;
        }
    },[handleAP])
    

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
                            <input value={netInfo.Mode === 'NoActive' ? '비활성화' : '활성화' } type="text" readOnly/>
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
                            <CustomButton onClick={()=> {setHandleAP(!handleAP)}}>SETUP Mode Stop</CustomButton>                             
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