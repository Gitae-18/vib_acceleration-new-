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
const General = () => {
    const [devInfo, setDevInfo] = useState("Select Device ID");
    const [devId, setDevID] = useState(0);
    const [datenow, setDateNow] = useState('0000-00-00');
    const [nowtime, setNowTime] = useState('00:00');
    const [dateTime, setDateTime] = useState(moment(new Date(), "YYYY-MM-dd hh:mm:ss").format());
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const deviceRef = useRef(null);

    const fetchDevInfo = useCallback(async () => {
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
    }, [devId]);

    const setLocalDatenTime = async() => {
        // 로컬 날짜 및 시간 설정 로직 추가
    };

    useEffect(() => {
        // fetchDevInfo();
    }, [/* fetchDevInfo */]);

    const handleDevInfo = (e) => {
        const value = e.target.value;
        switch(value) {
            case 'NO1' :
                setDevInfo('SENSOR NO 01 TEST');
                setDevID('dev00001');
                break;
            case 'NO2' :
                setDevInfo('SENSOR NO 02 TEST');
                setDevID('dev00002');
                break;
            case 'NO3' :
                setDevInfo('SENSOR NO 03 TEST');
                setDevID('dev00003');
                break;
            default:
                break;
        }
    }

    return (
        <body>
        <div className="wrap general">
            <div>
                <Menu />
            </div>
            <main className="mainArea">
            <section>
                <div className="contIn">
                    <div className="cont_Tit mb23">
                        <img src="images/device_icon.png"/>
                        <h2>DEVICE INFORMATION</h2>
                    </div>
                    <div className="contBox">
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                DEVICE ID
                            </li>
                            <li>
                                <div className="select-container">
                                    <div className="select-box">
                                        <span className="selected">VS_FEELINK_01</span>
                                        <span className="arrow"></span>
                                    </div>
                                    <div className="options">
                                        <div className="option" data-value="option1">option1</div>
                                        <div className="option" data-value="option2">option2</div>
                                        <div className="option" data-value="option3">option3</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul class="flex-start">
                            <li class="contBoxtit">
                                DEVICE NOTES
                            </li>
                            <li>
                                <textarea placeholder="">SENSOR NO 01 TEST</textarea>
                            </li>
                        </ul>
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