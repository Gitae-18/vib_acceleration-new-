/* eslint-disable */
import React, {useEffect, useState, useCallback, useRef }from "react";
import Menu from "../menu";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import styled from "styled-components";
import { useDispatch } from 'react-redux';
import { setWifiInfo, setDeviceInfo } from '../../store/store';
import { FaWifi } from "react-icons/fa";
import SetIpModal from "../SetIpModal";
const Network = ({}) => {
    const [netInfo, setNetInfo] = useState({
        IP_Address:'',
        SubnetMask:'',
        Default_Gateway:'',
        Mode:'',
        SSID:'',
    });
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
    const [ipModal, setIpModal] = useState(false);
    const [apiUrl, setApiUrl] = useState('http://127.0.0.1:5000'); // 기본 URI
    const [isApMode, setIsApMode] = useState(false);
    
    const API_URL = isApMode
    ? process.env.REACT_APP_API_URL_AP
    : process.env.REACT_APP_API_URL;

    const isMounted = useRef(true);
    
    const dispatch = useDispatch();
    
    const updateNetworkInfo = useCallback(async () => {
        try {
            const res = await fetch(`/api/network/update`, { method: 'POST' });
            const data = await res.json();
            console.log('Network info updated:', data);
        } catch (error) {
            console.error('Failed to update network info:', error);
        }
    },[]);    
    const fetchNetworkInfo = useCallback(async () => {
        try {
            const res = await fetch(`/api/network`, { method: 'GET' });
            const data = await res.json();
            if (!data || !data.wifi_info || !data.dev_info) {
                console.error('Invalid data received:', data);
                return;
            }

            setNetInfo({
                IP_Address: data.wifi_info.ip || "N/A",
                SubnetMask: data.wifi_info.netmask || "N/A",
                Default_Gateway: data.wifi_info.gateway || "N/A",
                SSID: data.wifi_info.mac || "N/A",
            });
            setIsApMode(data.wifi_info.ap_mode ? true : false);
                    
        } catch (error) {
            console.error('Failed to fetch network info:', error);
        }        
    }, [isEditing]);
    useEffect(() => {
        if (netInfo || devInfo) {
            if (netInfo) {
                dispatch(setWifiInfo({
                    ip: netInfo.IP_Address,
                    netmask: netInfo.SubnetMask,
                    gateway: netInfo.Default_Gateway,
                    mac: netInfo.SSID,
                    ap_mode: false, // netInfo에 ap_mode가 없으므로 false로 기본값 설정
                }));
            }    
            if (devInfo) {
                dispatch(setDeviceInfo({
                    dev_id: devInfo.deviceId,
                    ip: devInfo.IP,
                    sub_port: devInfo.SubPort,
                    push_port: devInfo.PushPort,
                    req_port: devInfo.ReqPort,
                }));
            }
        }
    }, [netInfo, devInfo, dispatch]);

    useEffect(() => {        
        updateNetworkInfo();
        fetchNetworkInfo();
        return () => {
            isMounted.current = false;
        };
    },[ updateNetworkInfo, fetchNetworkInfo])

    const onEditIp = () => {

    }
   /*  const handleSsid = (e) => {
        setSsid(e.target.value);
    }
    
   
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInputDeviceInfo((prevState) => ({
            ...prevState,
            [name]: value,
        }))
        setIsEditing(true);
    } */
         
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
                        <img src="images/Network_icon.png"/>
                        <h2>Network Information</h2>     
                    </div>
                    
                    <div className="contBox">      
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                IP
                            </li>
                            <li>                                
                                <input type="text" id="" className="disabledInput" value={netInfo.IP_Address} disabled/>
                            </li>                                                        
                        </ul>                     
                        <ul className="d-flex mb23">
                            <li>                                
                            </li>
                            <li>
                                <button onClick={() => setIpModal(true)}>Edit IP</button>                            
                            </li>
                        </ul>                                   
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                SubnetMask
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" value={netInfo.SubnetMask} disabled/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Default GateWay
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" value={netInfo.Default_Gateway} disabled/>                                
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                AP_Mode Status
                            </li>
                            <li className="c-red">
                                <input type="text" id="" className="disabledInput" value={isApMode? 'Active' : 'Non-Active'}  disabled/>                                
                            </li>
                        </ul>
                        <ul className="d-flex">
                            <li className="contBoxtit">
                                SSID
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" value={"vib-" + netInfo.SSID} disabled/>
                            </li>
                        </ul>
                    </div>
                </div>
                {ipModal && <SetIpModal isOpen={ipModal} onClose={() => setIpModal(false)}/> }
            </section>                        
            {/* <div className="common_button d-flex">
                <button className="save_btn">Save</button>
                <button className="cancel_btn">Cancel</button>
            </div> */}
            </main>
        </div>
        </body>
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


 /* useEffect(() => {
        const savedSSIDs = sessionStorage.getItem('ssids');
        if (savedSSIDs) {
            setSSIDList(JSON.parse(savedSSIDs));
        }
    }, []); */

    /* const handleModeChange = useCallback(async () => {
        const newHandleAP = !handleAP; 
        setHandleAP(newHandleAP); 
    
        try {
            const res = await fetch('http://192.168.10.21:5001/network/setapmode', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ap_mode: newHandleAP, 
                    id: devId
                })
            });
            if (!res.ok) {
                console.error('Server responded with status:', res.status);
            }
            const json = await res.json();
        } catch (error) {
            console.error('Failed to fetch AP Mode:', error);
        }
    
        console.log('mode : ' + newHandleAP); 
    }, [handleAP]); */