/* eslint-disable */
import React, { useEffect, useState }from "react";
import Menu from "../menu";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import styled from "styled-components";
const Triggers = () => {
    const [timetrigger, setTimeTrigger] = useState(false);
        const [starttime, setStartTime] = useState(false);
        const [recordtime, setRecordTime] = useState(false);
    const [temptrigger, setTempTrigger] = useState(false);
       // const [lowtemp, setLowTemp] = useState();
       // const [hightemp, setHighTemp] = useState();
    const [axistrigger, setAxisTrigger] = useState(false);
        const [xaxis, setXaxis] = useState(false);
        const [yaxis, setYaxis] = useState(false);
        const [zaxis, setZaxis] = useState(false);

    const handleTimeTrigger = () => {
        setTimeTrigger(!timetrigger);
    }
    const handleAccelerationTrigger = () => {
        setAxisTrigger(!axistrigger);
    }
    const handleSubTimeTrigger = () => {
        if (timetrigger) {
            setStartTime(!starttime);
            setRecordTime(!recordtime);
        }
    }
    const handleSubAxisTrigger = () => {
        if(axistrigger) {
            setXaxis(!xaxis);
            setYaxis(!yaxis);
            setZaxis(!zaxis);
        }
    }
    const getStyle = (enabled) => ({
        color: enabled ? '#000' : '#757575', 
        /* backgroundColor: enabled ? '#fff' : '#e0e0e0', // 활성화면 흰색, 비활성화면 회색 */
        borderColor: enabled ? '#ccc' : '#a0a0a0' // 테두리 색상도 조정
    });
    return(
        <body>
        <div className="wrap Trigger">
        <div>
            <Menu/>
        </div>
        <main className="mainArea">
        <section>
            <div className="contIn">
                <div className="cont_Tit mb23">
                    <img src="/images/Triggers_icon.png"/>
                    <h2>TRIGGER SETUP INFORMATION</h2>
                </div>
                <div className="contBox">
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">
                                TRIGGER USE or NOT
                            </li>
                            <li>
                                <div className="select-container">
                                    <div className="select-box">
                                        <span className="selected">USE</span>
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
                        <ul>
                            <li className="contBoxtit">
                                TRIGGER MODE
                            </li>
                            <li>
                                <div className="select-container">
                                    <div className="select-box">
                                        <span className="selected">Delay Then Trigger</span>
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
                    </div>
            </div>
            </section>
            <section className="mt50">
                <div className="contIn">
                    <div className="cont_Tit mb23">
                        <img src="/images/condition_icon.png"/>
                        <h2>CONDITION</h2>
                    </div>
                    <div className="contBox tree">
                        <ul>
                            <li className="mb50">
                                <div className="all_check">
                                    <label className="checkbox-label">
                                        <input type="checkbox"/>
                                        <span className="custom-checkbox"></span>
                                        <span className="checkbox-text f-20">TIME TRIGGER</span>
                                    </label>
                                </div>
                                <div className="second_tree">
                                    <div className="d-flex justify-between">
                                        <label className="checkbox-label">
                                            <input type="checkbox"/>
                                            <span className="custom-checkbox"></span>
                                            <span className="checkbox-text">Start at time</span>
                                        </label>
                                        <div className="date d-flex">
                                            <input type="text" id="startDate" placeholder="시작 날짜를 선택하세요"/>
                                            -
                                            <input type="text" id="timepicker" className="timepicker" placeholder="시간을 선택하세요"/>
                                        </div>
                                    </div>
                                </div>
                                <div className="second_tree">
                                    <div className="d-flex justify-between">
                                        <label className="checkbox-label">
                                            <input type="checkbox"/>
                                            <span className="custom-checkbox"></span>
                                            <span className="checkbox-text">Start at time</span>
                                        </label>
                                        <div className="number d-flex gap10">
                                            <input type="number" className="input-num" id="SecondsDate" placeholder="34"/>
                                            <div>Seconds</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="deactivate mb50">
                                <div className="all_check">
                                    <label className="checkbox-label">
                                        <input type="checkbox"/>
                                        <span className="custom-checkbox"></span>
                                        <span className="checkbox-text f-20">TEMPERATURE TRIGGER</span>
                                    </label>
                                </div>
                                <div className="second_tree">
                                    <div className="d-flex justify-between">
                                        <label className="checkbox-label">
                                            <input type="checkbox"/>
                                            <span className="custom-checkbox"></span>
                                            <span className="checkbox-text">Temperature Trigger Low </span>
                                        </label>
                                        <div className="number d-flex gap10 mr47">
                                            <input type="number" className="input-num" id="SecondsDate" placeholder="34"/>
                                            <div>℃</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="second_tree">
                                    <div className="d-flex justify-between">
                                        <label className="checkbox-label">
                                            <input type="checkbox"/>
                                            <span className="custom-checkbox"></span>
                                            <span className="checkbox-text">Temperature Trigger High
                                            </span>
                                        </label>
                                        <div className="number d-flex gap10 mr47">
                                            <input type="number" className="input-num" id="SecondsDate" placeholder="34"/>
                                            <div>℃</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                            <li className="deactivate">
                                <div className="all_check">
                                    <label className="checkbox-label">
                                        <input type="checkbox"/>
                                        <span className="custom-checkbox"></span>
                                        <span className="checkbox-text f-20">ACCELERATION TRIGGER</span>
                                    </label>
                                </div>
                                <div className="second_tree">
                                    <div className="d-flex justify-between">
                                        <label className="checkbox-label">
                                            <input type="checkbox"/>
                                            <span className="custom-checkbox"></span>
                                            <span className="checkbox-text">X Axis Trigger</span>
                                        </label>
                                        <div className="number d-flex gap10 mr47">
                                            <input type="number" className="input-num" id="SecondsDate" placeholder="5.00"/>
                                            <div>g</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="second_tree">
                                    <div className="d-flex justify-between">
                                        <label className="checkbox-label">
                                            <input type="checkbox"/>
                                            <span className="custom-checkbox"></span>
                                            <span className="checkbox-text">Y Axis Trigger
                                            </span>
                                        </label>
                                        <div className="number d-flex gap10 mr47">
                                            <input type="number" className="input-num" id="SecondsDate" placeholder="5.00"/>
                                            <div>g</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="second_tree">
                                    <div className="d-flex justify-between">
                                        <label className="checkbox-label">
                                            <input type="checkbox"/>
                                            <span className="custom-checkbox"></span>
                                            <span className="checkbox-text">Z Axis Trigger
                                            </span>
                                        </label>
                                        <div className="number d-flex gap10 mr47">
                                            <input type="number" className="input-num" id="SecondsDate" placeholder="5.00"/>
                                            <div>g</div>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            {/* <div className="sec_title">        
                <label>|</label>
                <h3>CONDITION</h3>            
            </div>
            <div className="group_devinfo">
                <div className="form-group labels">
                    <div className="checkbox-container parent">
                        <CustomInputSelectBox type="checkbox" id="time_trigger" name="time_trigger" isEnabled={timetrigger} onClick={handleTimeTrigger}/>                                
                        <label htmlFor="time_trigger" style={getStyle(timetrigger)}>* TIME TRIGGER</label>
                    </div>
                    <div className="checkbox-container children">
                        <CustomInputSelectBox type="checkbox" id="start_at_time" name="start_at_time" isEnabled={timetrigger} onClick={handleSubTimeTrigger} disabled={!timetrigger}/>  
                        <label htmlFor="start_at_time" style={getStyle(timetrigger)}>* Start at Time</label>
                    </div>
                    <div className="checkbox-container children">
                        <CustomInputSelectBox type="checkbox" id="recording_time" name="recording_time" isEnabled={timetrigger} onClick={handleSubTimeTrigger} disabled={!timetrigger}/>  
                        <label htmlFor="recording_time_limit" style={getStyle(timetrigger)}>* Recording Time Limit</label>
                    </div>
                </div>                
                <div className="form-group blank"/>
                <div className="group_trigger">
                    <div className="form-group contents">
                        <div>                        
                        <input type="date" id="start_date" name="start_date" disabled={!timetrigger}/>
                        <input type="time" id="start_time" name="start_time" disabled={!timetrigger}/>
                        </div>
                        <div>
                        <input type="number" id="recording_time" name="recording_time"  disabled={!timetrigger}/> Sec
                        </div>
                    </div>              
                </div>
            </div>
            <div className="group_devinfo">
                <div className="form-group labels">
                    <div className="checkbox-container parent">
                        <CustomInputSelectBox type="checkbox" id="temp_trigger" name="temp_trigger" isEnabled={temptrigger} checked={temptrigger}/>                                
                        <label style={getStyle(temptrigger)}>* TEMPERATURE TRIGGER</label>
                    </div>
                    <div className="checkbox-container children">
                        <CustomInputSelectBox type="checkbox" id="low_point_temp" name="low_point_temp" isEnabled={temptrigger} checked={temptrigger}/>  
                        <label style={getStyle(temptrigger)}>* Temperature Trigger Low</label>
                    </div>
                    <div className="checkbox-container children">
                        <CustomInputSelectBox type="checkbox" id="high_point_temp" name="high_point_temp" isEnabled={temptrigger} checked={temptrigger}/>  
                        <label style={getStyle(temptrigger)}>* Temperature Trigger High</label>
                    </div>
                </div>                
                <div className="form-group blank"/>
                <div className="group_trigger">
                    <div className="form-group contents">
                        <div>
                            <input type="number" id="temp_low" name="temp_low" disabled={!temptrigger}/>℃
                        </div>
                        <div>
                            <input type="number" id="temp_high" name="temp_high" disabled={!temptrigger}/>℃
                        </div>
                    </div>              
                </div>
            </div>
            <div className="group_devinfo">
                <div className="form-group labels">
                    <div className="checkbox-container parent">
                        <CustomInputSelectBox type="checkbox" id="accel_trigger" name="accel_trigger" isEnabled={axistrigger} onClick={handleAccelerationTrigger}/>                                
                        <label style={getStyle(axistrigger)}>* ACCELERATION TRIGGER</label>
                    </div>
                    <div className="checkbox-container children">
                        <CustomInputSelectBox type="checkbox" id="x_axis_chk" name="x_axis_chk" isEnabled={axistrigger} onClick={handleSubAxisTrigger} disabled={!axistrigger}/>  
                        <label style={getStyle(axistrigger)}>* X Axis Trigger</label>
                    </div>
                    <div className="checkbox-container children">
                        <CustomInputSelectBox type="checkbox" id="y_axis_chk" name="y_axis_chk" isEnabled={axistrigger} onClick={handleSubAxisTrigger} disabled={!axistrigger}/>  
                        <label style={getStyle(axistrigger)}>* Y Axis Trigger</label>
                    </div>
                    <div className="checkbox-container children">
                        <CustomInputSelectBox type="checkbox" id="z_axis_chk" name="z_axis_chk" isEnabled={axistrigger} onClick={handleSubAxisTrigger} disabled={!axistrigger}/>  
                        <label style={getStyle(axistrigger)}>* Z Axis Trigger</label>
                    </div>
                </div>                
                <div className="form-group blank"/>
                <div className="group_trigger">
                    <div className="form-group contents">
                        <div>
                            <input type="number" id="x_axis_value" name="x_axis_value" step="0.01" disabled={!axistrigger}/>g
                        </div>
                        <div>
                            <input type="number" id="y_axis_value" name="y_axis_value" step="0.01" disabled={!axistrigger}/>g
                        </div>
                        <div>
                            <input type="number" id="z_axis_value" name="z_axis_value" step="0.01" disabled={!axistrigger}/>g
                        </div>
                    </div>              
                </div>
            </div> */}
            <div className="common_button d-flex">
                <button className="save_btn">Save</button>
                <button className="cancel_btn">Cancel</button>
            </div>
        </main>      
        </div>  
        </body>
     )
}

export default Triggers;

const CustomSelect = styled.select`
border: 1px solid #bbb;
width: 300px;
border-radius: 2%;
flex-grow:1;
margin-bottom:20px;
margin-right: 20px;
margin-left:70%;
`
const CustomLine = styled.div`
border-top: 2px solid #ccc; /* 상단 테두리 설정 */
width: calc(100%); /* padding 값을 고려한 너비 설정 */
margin-top: 20px; /* 선 위 간격 */
margin-bottom: 20px; 
margin-left: 100px;
`
const CustomInputSelectBox = styled.input`
position:absolute;
margin-left:120px;
background-color:${props => props.isEnabled ? 'grey' : 'white'};
transition: all 150ms;
color: ${props => props.isEnabled ? '#757575' : '000'};
borderColor: ${props => props.isEnabled ? '#a0a0a0' : '#ccc'};
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