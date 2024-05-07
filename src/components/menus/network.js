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
            const res = await fetch(`http://192.168.10.14:5001/network/ssidlist`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });

            if (!res.ok) {
                console.error('Server responded with status:', res.status);
            } 
                const json = await res.json();  
                //setSSIDList(json);                                      
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
    const handleConnectWiFi = async(network) => {
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
                            <CustomButton onClick={scanSsidList}>Rescan</CustomButton> 
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
                            {ssidList.map((network, index) => (
                                <tr key={index}>
                                    <td className="first">{network.ssid}</td>
                                    <td className="second">{network.connected ? "Connected" : "Not Connected"}</td>
                                    <td className="button-cell">
                                    {network.connected ? (
                                        <button onClick={() => handleConnectWiFi(network.ssid, '')}>Disconnect</button>
                                        ) : (
                                        <button onClick={() => openModal(network.ssid)}>Connect</button>
                                    )}
                                    </td>
                                </tr>
                             ))}
                        </tbody>
                    </table>
                        {showModal && (
                            <div className="modal" style={{ position: 'absolute', top: modalPosition.top + 'px', left: modalPosition.left + 'px' }}>
                            <div className="modal-content">
                                <h3>Enter Password for {selectedSSID}</h3>
                                <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Password"
                                />
                                <button onClick={connect}>Connect</button>
                                <button onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                            </div>
                        )}
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