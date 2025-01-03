/* eslint-disable */
import React, {useEffect, useState, useCallback, useRef}from "react";
import Menu from "../menu";
import styled from "styled-components";
import Calendar from 'react-calendar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../../style/Calendar.css';
import moment from "moment";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import MaintenanceModal from "./MaintenanceModal";
import axios from 'axios'
const General = () => {        
    const [selectedSSID, setSelectedSSID] = useState('');
    //const [ssid, setSsid] = useState('');
    const [ssidList, setSSIDList] = useState([]);
    const [password, setPassword] = useState('');
    const [isApMode, setIsApMode] = useState(false);    
    const [method, setMethod] = useState('auto');
    const [ipAddress, setIpAddress] = useState('');
    const [subnetMask, setSubnetMask] = useState('');
    const [gateway, setGateway] = useState('');
    const isMounted = useRef(true);
    const API_URL = isApMode
    ? process.env.REACT_APP_API_URL_AP
    : process.env.REACT_APP_API_URL;

    /* const fetchDevInfo = useCallback(async () => {
        try {
            const res = await fetch(`http://192.168.10.14:3000/dev_information?devId=${devId}`, {
                method: 'GET'
            });

            if (!res.ok) {
                console.log('잘못된 아이디 입니다.');
                return;
            }

            const json = await res.json();

            if (json) {
                setDevInfo(json);
            }
        } catch (error) {
            console.error('Failed to fetch device info:', error);
        }
    }, [devId]); */
    useEffect(() => {
        async function fetchApMode() {
          try {
            const response = await axios.get('http://192.168.0.12/api/network/check_ap');
            console.log(response.data.is_ap)
            setIsApMode(response.data.is_ap);
          } catch (error) {
            console.error('Error fetching AP mode:', error);
          }
        }
    
        fetchApMode();
      }, []);
    
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
                //sessionStorage.setItem('ssids', JSON.stringify(json));                
        } catch (error) {
            console.error('Failed to fetch device info:', error);
        }
    },[]);
    /* const handleSsid = (e) => {
        setSsid(e.target.value);
    } */
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
    const handleSubmit = async () => {
        try {
            const params = {
                param: 'set_network',
                method,
            };

            // Include manual settings only if method is 'manual'
            if (method === 'manual') {
                params.set_ip = ipAddress;
                params.set_subnet = subnetMask;
                params.set_gateway = gateway;
            }

            const response = await axios.get('/api/network/setup', { params });

            if (response.status === 200) {
                alert('Network setup successful!');
            } else {
                alert('Network setup failed!');
            }
        } catch (error) {
            console.error('Error during network setup:', error);
            alert('An error occurred while setting up the network.');
        }
    };
    return (
        <body>
        <div className="wrap WiFi">
            <div>
                <Menu />
            </div>
            <main className="mainArea">
            <section>
                <div className="contIn">
                    <div className="cont_Tit mb23">
                        <img src="images/setup_icon.png"/>
                        <h2>WIFI SETUP </h2>
                    </div>
                    <div className="contBox"> 
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                SetUp IP By Auto   
                                <input type="radio" name="ip-setting" value="auto" style={{marginLeft:'40px'}} checked={method === 'auto'}
                                onChange={(e) => setMethod(e.target.value)}/>                                                                                                                                
                            </li>                                                          
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                SetUp IP By  Manual
                                <input type="radio" name="ip-setting" value="manual" style={{marginLeft:'20px'}}  checked={method === 'manual'}
                                onChange={(e) => setMethod(e.target.value)}/>
                            </li>                                                                              
                        </ul>
                        <ul className="d-flex mb35">
                            <li>
                                <label htmlFor="ip-address">Config IP</label>                                
                            </li>
                            <li>
                                <input type="text" id="ip-address" name="ip-address" className="disabledInput" placeholder="IP" value={ipAddress}  onChange={(e) => setIpAddress(e.target.value)}
                        disabled={method !== 'manual'}/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li>
                                <label htmlFor="subnet-mask">Config Subnet Mask</label>                                
                            </li>
                            <li>
                                <input type="text" id="subnet-mask" name="subnet-mask" className="disabledInput" placeholder="SUBNET MASK" value={subnetMask}
                                onChange={(e) => setSubnetMask(e.target.value)}
                                disabled={method !== 'manual'}/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li>
                                <label htmlFor="gateway">Config Gateway</label>                                
                            </li>                            
                            <li>
                                <input type="text" id="gateway" name="gateway" className="disabledInput" placeholder="Gateway" value={gateway}
                                onChange={(e) => setGateway(e.target.value)}
                                disabled={method !== 'manual'}/>
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

                                {ssidList.map((ssid, index) => (
                                    <tr key={index}>
                                        <td>WIFI ({index})</td>
                                        <td>
                                            <ul className="d-flex mb15 justify-center gap20">
                                                <li>SSID</li>
                                                <li onClick={() => setSelectedSSID(ssid)} // 클릭 이벤트로 SSID 값을 설정
                                                style={{ cursor: 'pointer', color: 'blue' }}>
                                                    {/* <input
                                                        type="text"
                                                        id="tableInput"
                                                        className="tableInput"
                                                        value={ssid || ""}
                                                        readOnly
                                                    /> */}
                                                    {ssid}
                                                </li>                                                
                                            </ul>
                                        </td>
                                        <td>
                                            <li><FaWifi style={{ color: 'white' }}/></li>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
            
            <div className="common_button d-flex">
                <button className="save_btn" onClick={handleSubmit}>Save</button>
                <button className="cancel_btn">Cancel</button>
            </div>
        </main>        
        </div>
        </body>
    );
};

export default General;

const CustomButton = styled.button`
    border: 1px solid #000;
    width: 300px;
    height: 30px;
    border-radius: 8px;
    flex-grow: 1;
    margin: 0 auto;
    margin-top: 25px;
    background-color: #c8c8c8;
    box-shadow: inset 0 0 8px rgba(0,0,0,0.5);
`;

const CustomSelect = styled.select`
    border: 1px solid #bbb;
    width: 300px;
    border-radius: 2%;
    flex-grow: 1;
    margin-bottom: 20px;
    margin-right: 20px;
`;

const CustomLine = styled.div`
    border-top: 2px solid #ccc;
    width: calc(95%);
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 100px;
`;

const TimeSelect = styled.select`
    border: 1px solid #bbb;
    width: 150px;
    border-radius: 2%;
    margin-bottom: 20px;
    margin-right: 20px;
`;