/* eslint-disable */
import React, {useEffect, useState, useCallback }from "react";
import Menu from "../menu";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import styled from "styled-components";
import { useSelector } from 'react-redux';
import { FaWifi } from "react-icons/fa";
import { setWifiInfo, setDeviceInfo } from '../../store/store';

const Server = () => {
    const wifiInfo = useSelector((state) => state.network.wifi_info);
    //const devInfo = useSelector((state) => state.network.dev_info);
    const [devInfo, setDevInfo] = useState({
            deviceId: '',
            IP:'',
            SubPort:'',
            PushPort:'',
            ReqPort:'',
        })
    const [inputDeviceInfo, setInputDeviceInfo] = useState({
        deviceId: '',
        IP:'',
        SubPort:'',
        PushPort:'',
        ReqPort:'',
    })    
    const [isEditing, setIsEditing] = useState(false);
    const fetchNetworkInfo = useCallback(async () => {
            try {
                const res = await fetch(`/api/network`, { method: 'GET' });
                const data = await res.json();
                if (!data || !data.wifi_info || !data.dev_info) {
                    console.error('Invalid data received:', data);
                    return;
                }
                        
                if (!isEditing) {
                    setDevInfo({
                        deviceId: data.dev_info.dev_id || "N/A",
                        IP: data.dev_info.ip || "N/A",
                        SubPort: data.dev_info.sub_port || "N/A",
                        PushPort: data.dev_info.push_port || "N/A",
                        ReqPort: data.dev_info.req_port || "N/A",
                    });
                }                        
            } catch (error) {
                console.error('Failed to fetch network info:', error);
            }        
        }, [isEditing]);
        const updateNetworkInfo = useCallback(async () => {
                try {
                    const res = await fetch(`/api/network/update`, { method: 'POST' });
                    const data = await res.json();
                    console.log('Network info updated:', data);
                } catch (error) {
                    console.error('Failed to update network info:', error);
                }
            },[]); 
        useEffect(() => {        
            updateNetworkInfo();
            fetchNetworkInfo();
            return () => {
                isMounted.current = false;
            };
        },[ updateNetworkInfo, fetchNetworkInfo])
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputDeviceInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }))
        setIsEditing(true);
    }
    const handleReload = async() => {
        try{

            const requestData = {
                id: inputDeviceInfo.deviceId || devInfo.deviceId,
                ip: inputDeviceInfo.IP || devInfo.IP,
                push_port: inputDeviceInfo.PushPort || devInfo.PushPort,
                sub_port: inputDeviceInfo.SubPort || devInfo.SubPort,
                req_port: inputDeviceInfo.ReqPort || devInfo.ReqPort,                
            }
            const response = await fetch(`/api/reload`, {
                method:'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({   
                    param: 'edit_devinfo',                 
                    ...requestData,
                }),
            })
            if(response.ok) {
                const result = await response.json();
                console.log('response server:', result);                
            } else {
                console.error('Failed to reload device info');
            }
        }
        catch(error) {
            console.error('Invalid Port Number')
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
                                Device ID
                            </li>
                            <li>
                                <input type="text" id="" name="deviceId" className="disabledInput" value={inputDeviceInfo.deviceId || devInfo.deviceId} onChange={handleInputChange}/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                IP Address
                            </li>
                            <li>
                                <input type="text" id="" name="IP" className="disabledInput" value={inputDeviceInfo.IP || devInfo.IP} onChange={handleInputChange}/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Sub Port
                            </li>
                            <li>
                                <input type="text" id="" name="SubPort" className="disabledInput" value={inputDeviceInfo.SubPort || devInfo.SubPort} onChange={handleInputChange}/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Push Port
                            </li>
                            <li>
                                <input type="text" id="" name="PushPort" className="disabledInput" value={inputDeviceInfo.PushPort || devInfo.PushPort} onChange={handleInputChange}/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Req Port
                            </li>
                            <li>
                                <input type="text" id="" name="ReqPort" className="disabledInput" value={inputDeviceInfo.ReqPort || devInfo.ReqPort} onChange={handleInputChange}/>
                            </li>
                        </ul>                        
                    </div>
                </div>
            </section>
            <div className="common_button d-flex">
                <button className="save_btn" onClick={handleReload}>Save</button>
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