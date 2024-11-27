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
    const [handleAP, setHandleAP] = useState();
    const [ssidList, setSSIDList] = useState([{ssid:'none', connceted:'none'}]);
    const [modalPosition, setModalPosition] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [selectedSSID, setSelectedSSID] = useState('');
    const [password, setPassword] = useState('');
  
  
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
            } 
                const json = await res.json();
                setNetInfo(netinfo => ({
                    ...netinfo, 
                    IP_Address: json.IP_Address,
                    SubnetMask:json.SubnetMask,
                    Default_Gateway:json.Default_Gateway,
                    Mode:json.Mode,
                    SSID:json.SSID,
                }));

        } catch (error) {
            console.error('Failed to fetch device info:', error);
        }
        try {
            const res = await fetch(`http://192.168.10.14:5001/network/getapmode?devId=${devId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                throw new Error(`Server responded with status: ${response.status}`);        
            } 
                const json = await res.json(); 
                console.log(json);   
                setHandleAP(json.ap_status);                               
        } catch (error) {
            console.error('Failed to fetch device info:', error);
        }
    },[devId])

    useEffect(() => {
        getDefaultNetworkInfo();
        return () => {
            isMounted.current = false;
        };
    },[getDefaultNetworkInfo])

    

    const openModal = (ssid) => {
        const buttonRect = event.target.getBoundingClientRect();
        setSelectedSSID(ssid);
        setShowModal(true);
        setModalPosition({
            top: buttonRect.top + window.scrollY - 110,  // 스크롤에 따라 조정
            left: buttonRect.right + 10,
          });
      };
    
      const connect = () => {
        handleConnectWiFi(selectedSSID, password);
        setShowModal(false);
        setPassword('');  // 비밀번호 필드 초기화
      };
         
    const scanSsidList = useCallback(async() => {
        try {
            const res = await fetch(`http://192.168.10.14:5001/network/getssid`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Server responded with status:', res.status);
            } 
                const json = await res.json();                            
                setSSIDList(json);                        
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

    const handleModeChange = useCallback(async () => {
        const newHandleAP = !handleAP; 
        setHandleAP(newHandleAP); 
    
        try {
            const res = await fetch('http://192.168.10.14:5001/network/setapmode', {
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
    }, [handleAP]);
     
    const handleConnectWiFi = async(network) => {
        console.log(network);
        console.log(password);
        try {
            const res = await fetch(`http://192.168.10.14:5001/network/connection`, {
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
                                IP Address
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" placeholder="192.168.0.1" disabled/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Sample Rate
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" placeholder="4,000" disabled/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                Measurement Option
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" placeholder="192.168.0.1" disabled/>
                            </li>
                        </ul>
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                AP Mode Status
                            </li>
                            <li className="c-red">
                                <input type="text" id="" className="disabledInput" placeholder="Active" disabled/>
                            </li>
                        </ul>
                        <ul className="d-flex">
                            <li className="contBoxtit">
                                SSID
                            </li>
                            <li>
                                <input type="text" id="" className="disabledInput" placeholder="Vib-d8:31:dd:2e:sa:31" disabled/>
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
                            <colgroup>
                                <col /> 
                                <col style={{ width: '25%' }} />
                                <col style={{ width: '35%' }} />
                            </colgroup>
                            <thead id="listTh">
                                <tr className="mobH">
                                    <th>Wi-Fi Network Name</th>
                                    <th>Network Info</th>
                                    <th>Connect</th>
                                </tr>
                            </thead>
                            <tbody id="listForm">
                                {ssidList.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            WIFI ({index})
                                        </td>
                                        <td>
                                            <ul className="d-flex mb15 justify-center gap20">
                                                <li>SSID</li>
                                                <li>
                                                    <input
                                                        type="text"
                                                        id="tableInput"
                                                        className="tableInput"
                                                        value={item.ssid || ""}
                                                        placeholder="SSID"
                                                        readOnly
                                                    />
                                                </li>
                                            </ul>
                                            <ul className="d-flex justify-center gap20">
                                                <li>PWD</li>
                                                <li>
                                                    <input
                                                        type="text"
                                                        id="tableInput"
                                                        className="tableInput"
                                                        placeholder="Enter Password"
                                                        onChange={(e) => {
                                                            const updatedList = [...ssidList];
                                                            updatedList[index].password = e.target.value;
                                                            setSSIDList(updatedList);
                                                        }}
                                                    />
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <button
                                                className={`table_button ${item.connected ? 'disconnect_btn' : ''}`}
                                                onClick={() =>
                                                    handleWiFiAction(item.ssid, item.connected ? 'disconnect' : 'connect')
                                                }
                                            >
                                                {item.connected ? 'Disconnect' : 'Connect'}
                                            </button>
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