import React, {useEffect, useState, useCa }from "react";
import Menu from "../menu";
import '../../style/body.css';
import styled from "styled-components";
import Calendar from 'react-calendar';
import '../../style/Calendar.css';
const General = () => {
 const [devInfo, setDevInfo] = useState("Select Device ID");


 const handleDevInfo = (e) => {
    const value = e.target.value;
    switch(value) {
        case 'NO1' :
            setDevInfo('SENSOR NO 01 TEST');
        break;
        case 'NO2' :
            setDevInfo('SENSOR NO 02 TEST');
        break;
        case 'NO3' :
            setDevInfo('SENSOR NO 03 TEST');
        break;
        default:
            break;
    }
 }
 return(
    <>
    <div className="header">
        <Menu/>
    </div>
    <div className="body">
    <div className="sec_title">        
        <label>|</label>
        <h3>DEVICE INFORMATION</h3>            
    </div>
        <div className="group_devinfo">
            <div className="form-group labels">
            <label>* DEVICE ID</label>
            <label>* DEVICE NOTES</label>
            </div>
            <div className="form-group blank"/>
            <div className="form-group contents">            
            <CustomSelect  onChange={handleDevInfo}>
                <option value="NO1">VS_FEELINK_01</option>
                <option value="NO2">VS_FEELINK_02</option>
                <option value="NO3">VS_FEELINK_03</option>
            </CustomSelect>
            <textarea value={devInfo} name="dev_info" readOnly/>
            </div>
        </div>
        <CustomLine/>

        <div className="date_title">        
            <label>|</label>
            <h3>DEVICE INFORMATION</h3>            
        </div>
        <div className="group_dateinfo">
            <div className="form-group date">
                <label>* DATE</label>
                <div className="form-group blank"/>
                <Calendar
                    locale="ko"
                    formatDay={(locale, date) =>
                        date.toLocaleString('en', { day: 'numeric' })
                    }
                />
                
            </div>        
            <div className="form-group time">  
                 <label>* TIME</label>
                 <div className="form-group blank"/>
                    <TimeSelect>
                        <option>AM</option>
                        <option>PM</option>
                    </TimeSelect>
                    <TimeSelect>
                        <option>14</option>
                        <option>15</option>
                    </TimeSelect>
                    <TimeSelect>
                        <option>45</option>
                        <option>46</option>
                    </TimeSelect>
            </div>
        </div>        
    </div>
    </>
 )
}
const CustomSelect = styled.select`
border: 1px solid #bbb;
width: 300px;
border-radius: 2%;
flex-grow:1;
margin-bottom:20px;
margin-right: 20px;
`
const CustomLine = styled.div`
border-top: 2px solid #ccc; /* 상단 테두리 설정 */
width: calc(95%); /* padding 값을 고려한 너비 설정 */
margin-top: 20px; /* 선 위 간격 */
margin-bottom: 20px; 
margin-left: 100px;
`
const TimeSelect = styled.select`
border: 1px solid #bbb;
width: 150px;
border-radius: 2%;
margin-bottom:20px;
margin-right: 20px;
`
export default General;