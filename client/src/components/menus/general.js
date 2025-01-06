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
import '../../style/wifi.css';
import MaintenanceModal from "./MaintenanceModal";
import axios from 'axios'
import { FaWifi } from "react-icons/fa";

const General = () => {        
    const [selectedSSID, setSelectedSSID] = useState('');
    const [isSetupVisible, setIsSetupVisible] = useState(false);
    const [ssidList, setSSIDList] = useState([]);
    const [password, setPassword] = useState('');
    const [isApMode, setIsApMode] = useState(false);    
    const [method, setMethod] = useState('auto');
    const [ipAddress, setIpAddress] = useState('');
    const [subnetMask, setSubnetMask] = useState('');
    const [gateway, setGateway] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(null);
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

    const handleConnectWiFi = async (network) => {
        try {
            const body = {
                ssid: network,
                password: password,
                method: method,  // manual 또는 auto
            };
    
            if (method === 'manual') {
                if (!ipAddress || !subnetMask || !gateway) {
                    alert("Please enter valid IP, Subnet Mask, and Gateway.");
                    return;
                }
                body.set_ip = ipAddress;
                body.set_subnet = subnetMask;
                body.set_gateway = gateway;
            }
    
            const res = await fetch(`/api/network/connect`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });
    
            if (!res.ok) {
                console.error('Server responded with status:', res.status);
            } else {
                alert('Wi-Fi connecting');
            }
    
            const json = await res.json();
            console.log(json);
        } catch (error) {
            console.error('Failed to connect Wi-Fi:', error);
        }
    };
    
    return (
        <body>
            <div className="wrap WiFi">
                <div>
                    <Menu />
                </div>
                <main className="mainArea">
                    {/* Wi-Fi Network Section */}
                    <section className="mt50">
                        <div className="contIn">
                            <div className="d-flex justify-between">
                                <div className="cont_Tit mb23">
                                    <img src="images/wifi_icon.png" />
                                    <h2>Wi-Fi Network</h2>
                                </div>
                                <button className="default_button Rescan_btn" onClick={scanSsidList}>
                                    Rescan
                                </button>
                            </div>
                            <div className="contBox">
                                <h4 className="tableTit mb25">Wi-Fi Network Scan</h4>
                                <ul className="ssid-list">
                                    {ssidList.map((ssid, index) => (
                                        <React.Fragment key={index}>
                                            <li
                                                className="ssid-item"
                                                onClick={() => {
                                                    setSelectedSSID(ssid); 
                                                    setSelectedIndex(index); 
                                                    setIsSetupVisible(true); 
                                                    setMethod('auto'); 
                                                }}
                                            >
                                                {ssid}
                                            </li>
                                            {selectedIndex === index && isSetupVisible && (
                                                <li className="ssid-item wifi-setup-container">
                                                    <section className="wifi-setup visible">
                                                        <div className="contIn">
                                                            <div className="cont_Tit mb23">
                                                                <img src="images/setup_icon.png" />
                                                                <h2>WiFi Setup for {selectedSSID}</h2>
                                                            </div>
                                                            <div className="contBox">
                                                                <div className="selected-ssid">
                                                                    <p>
                                                                        Selected SSID: <strong>{selectedSSID || "None"}</strong>
                                                                    </p>
                                                                </div>
                                                                <ul className="d-flex mb35">
                                                                    <li className="contBoxtit">
                                                                        <input
                                                                            type="radio"
                                                                            name="ip-setting"
                                                                            value="auto"
                                                                            checked={method === "auto"}
                                                                            onChange={(e) => setMethod(e.target.value)}
                                                                            disabled={isApMode}
                                                                        />
                                                                        <span style={{ marginLeft: "15px" }}>SetUp IP By Auto</span>
                                                                    </li>
                                                                </ul>
                                                                <ul className="d-flex mb35">
                                                                    <li className="contBoxtit">
                                                                        <input
                                                                            type="radio"
                                                                            name="ip-setting"
                                                                            value="manual"
                                                                            checked={method === "manual"}
                                                                            onChange={(e) => setMethod(e.target.value)}
                                                                            disabled={isApMode}
                                                                        />
                                                                        <span style={{ marginLeft: "15px" }}>SetUp IP By Manual</span>
                                                                    </li>
                                                                </ul>
                                                                <ul className="d-flex mb35">
                                                                    <li>
                                                                        <label htmlFor="ip-address">Config IP</label>
                                                                    </li>
                                                                    <li>
                                                                        <input
                                                                            type="text"
                                                                            id="ip-address"
                                                                            name="ip-address"
                                                                            className="disabledInput"
                                                                            placeholder="IP"
                                                                            value={ipAddress}
                                                                            onChange={(e) => setIpAddress(e.target.value)}
                                                                            disabled={method !== "manual"}
                                                                        />
                                                                    </li>
                                                                </ul>
                                                                <ul className="d-flex mb35">
                                                                    <li>
                                                                        <label htmlFor="subnet-mask">Config Subnet Mask</label>
                                                                    </li>
                                                                    <li>
                                                                        <input
                                                                            type="text"
                                                                            id="subnet-mask"
                                                                            name="subnet-mask"
                                                                            className="disabledInput"
                                                                            placeholder="SUBNET MASK"
                                                                            value={subnetMask}
                                                                            onChange={(e) => setSubnetMask(e.target.value)}
                                                                            disabled={method !== "manual"}
                                                                        />
                                                                    </li>
                                                                </ul>
                                                                <ul className="d-flex mb35">
                                                                    <li>
                                                                        <label htmlFor="gateway">Config Gateway</label>
                                                                    </li>
                                                                    <li>
                                                                        <input
                                                                            type="text"
                                                                            id="gateway"
                                                                            name="gateway"
                                                                            className="disabledInput"
                                                                            placeholder="Gateway"
                                                                            value={gateway}
                                                                            onChange={(e) => setGateway(e.target.value)}
                                                                            disabled={method !== "manual"}
                                                                        />
                                                                    </li>
                                                                </ul>
                                                                <ul className="d-flex mb35">
                                                                    <li>
                                                                        <label htmlFor="password">Wi-Fi Password</label>
                                                                    </li>
                                                                    <li>
                                                                        <input
                                                                            type="password"
                                                                            id="password"
                                                                            name="password"
                                                                            className="disabledInput"
                                                                            placeholder="Enter Password"
                                                                            value={password}
                                                                            onChange={(e) => setPassword(e.target.value)}
                                                                        />
                                                                    </li>
                                                                </ul>
                                                                <button
                                                                    className="default_button connect-btn"
                                                                    style={{ margin: "0 auto" }}
                                                                    onClick={() => handleConnectWiFi(selectedSSID, password)}
                                                                >
                                                                    Connect
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </section>
                                                </li>
                                            )}
                                        </React.Fragment>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </section>                    
                </main>
            </div>
        </body>
    );
};

export default General;

const Container = styled.div`
    margin: 20px;
`;

const Section = styled.section`
    margin-top: 50px;
`;

const TitleWrapper = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 23px;
`;

const TitleIcon = styled.img`
    margin-right: 10px;
`;

const Title = styled.h2`
    margin: 0;
`;

const NetworkList = styled.div`
    margin-top: 20px;
    ul {
        list-style: none;
        padding: 0;
    }
    li {
        margin-bottom: 10px;
        cursor: pointer;
        color: #00f;
        text-decoration: underline;
    }
`;

const SetupWrapper = styled.div`
    margin-top: 20px;
    max-height: ${(props) => (props.isVisible ? "300px" : "0")};
    overflow: hidden;
    transition: max-height 0.3s ease;
`;

const Input = styled.input`
    display: block;
    width: 100%;
    margin-bottom: 10px;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
`;

const Button = styled.button`
    background-color: #007bff;
    color: white;
    padding: 10px 15px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
`;