/* eslint-disable */
import React, {useEffect, useState, useCallback, useRef }from "react";
import Menu from "../menu";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import styled from "styled-components";
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
    const [handleAP, setHandleAP] = useState();
    const [ssidList, setSSIDList] = useState([]);
    const [selectedSSID, setSelectedSSID] = useState('');
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [apiUrl, setApiUrl] = useState('http://127.0.0.1:5000'); // 기본 URI
    const [isApMode, setIsApMode] = useState(false);
    const API_URL = isApMode
    ? process.env.REACT_APP_API_URL_AP
    : process.env.REACT_APP_API_URL;

    const isMounted = useRef(true);
    const devId = 'D000001';
    
    
    const updateNetworkInfo = useCallback(async () => {
        try {
            const res = await fetch(`/api/network/update`, { method: 'POST' });
            const data = await res.json();
            console.log('Network info updated:', data);
        } catch (error) {
            console.error('Failed to update network info:', error);
        }
    },[]);
    /* const fetchNetworkInfo = async () => {
        try {
            const res = await fetch(`/api/network`, { method: 'GET' });
            const data = await res.json();
            if (!data || !data.wifi_info || !data.dev_info) {
                console.error('Invalid data received:', data);
                return;
            }
            setNetInfo(netinfo => ({
                ...netinfo,
                IP_Address: data.wifi_info.ip || "N/A",
                SubnetMask: data.wifi_info.netmask || "N/A",
                Default_Gateway: data.wifi_info.gateway || "N/A",
                SSID: data.wifi_info.mac || "N/A",
            }));
    
            setDevInfo(devinfo => ({
                ...devinfo, 
                deviceId: data.dev_info.dev_id || "N/A",
                IP: data.dev_info.ip || "N/A",
                SubPort: data.dev_info.sub_port || "N/A",
                PushPort: data.dev_info.push_port || "N/A",
                ReqPort: data.dev_info.req_port || "N/A",
            }));
        } catch (error) {
            console.error('Failed to fetch network info:', error);
        }        
    }; */
    const fetchNetworkInfo = useCallback(async () => {
        try {
            const res = await fetch(`/api/network`, { method: 'GET' });
            const data = await res.json();
            if (!data || !data.wifi_info || !data.dev_info) {
                console.error('Invalid data received:', data);
                return;
            }
            console.log(data);
            setNetInfo({
                IP_Address: data.wifi_info.ip || "N/A",
                SubnetMask: data.wifi_info.netmask || "N/A",
                Default_Gateway: data.wifi_info.gateway || "N/A",
                SSID: data.wifi_info.mac || "N/A",
            });

            setDevInfo({
                deviceId: data.dev_info.device_id || "N/A",
                IP: data.wifi_info.ip || "N/A",
                SubPort: data.dev_info.sub_port || "N/A",
                PushPort: data.dev_info.push_port || "N/A",
                ReqPort: data.dev_info.req_port || "N/A",
            });
        } catch (error) {
            console.error('Failed to fetch network info:', error);
        }        
    }, []);
    useEffect(() => {        
        updateNetworkInfo();
        fetchNetworkInfo();
        return () => {
            isMounted.current = false;
        };
    },[ updateNetworkInfo, fetchNetworkInfo])
    /* const openModal = (ssid) => {
        const buttonRect = event.target.getBoundingClientRect();
        setSelectedSSID(ssid);
        setShowModal(true);
        setModalPosition({
            top: buttonRect.top + window.scrollY - 110,  // 스크롤에 따라 조정
            left: buttonRect.right + 10,
          });
      }; */
      
    const handleSsid = (e) => {
        setSsid(e.target.value);
    }
    const scanSsidList = useCallback(async() => {
        try {
            const res = await fetch(`/api/network/scan`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Server responded with status:', res.status);
            } 
                const json = await res.json();                       
                if (json) {
                    setSSIDList(json.ssid_list || []); 
                } else {
                    console.error('Invalid data received:', data);
                }                        
                sessionStorage.setItem('ssids', JSON.stringify(json));                
        } catch (error) {
            console.error('Failed to fetch device info:', error);
        }
    },[]);
    useEffect(() => {
        const savedSSIDs = sessionStorage.getItem('ssids');
        if (savedSSIDs) {
            setSSIDList(JSON.parse(savedSSIDs));
        }
    }, []);

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
     
    const handleConnectWiFi = async(network) => {
        console.log(network);
        console.log(password);
        try {
            const res = await fetch(`/api/network/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ssid: network,
                    password: password, 
                    action: network.connected ? 'disconnect' : 'connect'
                }),
            });

            if (!res.ok) {
                console.error('Server responded with status:', res.status);
            } 
                const json = await res.json();                                                  
        } catch (error) {
            console.error('Failed to fetch device info:', error);
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
                        <img src="images/Network_icon.png"/>
                        <h2>Network Information</h2>
                    </div>
                    <div className="contBox">
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Device ID
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" value={devInfo.deviceId} disabled/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                IP Address
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" value={devInfo.IP} disabled/>
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
                                <input type="text" id="" className="disabledInput" value={isApMode? 'Active' : 'Non-Active'} disabled/>                                
                            </li>
                        </ul>
                        <ul className="d-flex">
                            <li className="contBoxtit">
                                SSID
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" value={netInfo.SSID} disabled/>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="mt50">
                <div className="contIn">
                    <div className="cont_Tit mb23">
                        <img src="images/setup_icon.png"/>
                        <h2>SETUP Mode </h2>
                    </div>
                    <div className="contBox">
                        <ul className="d-flex">
                            <li className="contBoxtit">
                                Temperature Sensor USE or NOT
                            </li>
                            <li>
                                <button className="default_button">SETUP Mode Stop</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="mt50">
                <div className="contIn">
                    <div className="d-flex justify-between">
                        <div className="cont_Tit mb23">
                            <img src="images/wifi_icon.png"/>
                            <h2>Wi-Fi Network</h2>
                        </div>
                        <button className="default_button Rescan_btn" onClick={scanSsidList}>Rescan</button>
                    </div>
                    <div className="contBox">
                        <h4 className="tableTit mb25">
                            Wi-Fi Network Scan
                        </h4>
                        <table className="table_normal mt0">
                            <thead>
                                <tr>
                                    <th>Wi-Fi Network Name</th>
                                    <th>Network Info</th>
                                    <th>Connect</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/* 입력 필드와 버튼이 있는 행 */}
                                <tr>
                                    <td>
                                        <input
                                            type="text"
                                            className="tableInput"
                                            placeholder="Enter SSID"
                                            value={selectedSSID}
                                            onChange={(e) => setSelectedSSID(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            className="tableInput"
                                            placeholder="Enter Password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <button
                                            className="table_button"
                                            onClick={() => handleConnectWiFi(selectedSSID, password)}
                                        >
                                            Connect
                                        </button>
                                    </td>
                                </tr>

                                {/* 서버에서 가져온 ssidList로 행 생성 */}
                                {ssidList.map((ssid, index) => (
                                    <tr key={index}>
                                        <td>WIFI ({index})</td>
                                        <td>
                                            <ul className="d-flex mb15 justify-center gap20">
                                                <li>SSID</li>
                                                <li>
                                                    <input
                                                        type="text"
                                                        id="tableInput"
                                                        className="tableInput"
                                                        value={ssid || ""}
                                                        readOnly
                                                    />
                                                </li>
                                                <li>                                                    
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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