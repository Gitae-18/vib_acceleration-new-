import React, {useEffect, useState, useCa }from "react";
import Menu from "../menu";
import '../../style/body.css';
import styled from "styled-components";
const Measurements = () => {
    return(
        <>
        <div>
            <Menu/>
        </div>
        <div className="body">
        <div className="sec_title">        
            <label>|</label>
            <h3>40g DC ACCELERATION</h3>            
        </div>
            <div className="group_devinfo">
                <div className="form-group labels">
                <label>* Accleration Sensor USE or NOT</label>
                <label>* Sample Rate</label>
                <label>* Measurement Options</label>
                </div>
                <div className="form-group blank"/>
                <div className="form-group contents">            
                <CustomSelect>
                    <option value="use">USE</option>
                    <option value="not">NOT</option>
                </CustomSelect>
                <CustomSelect>
                    <option value="1">1,000 hz</option>
                    <option value="2">2,000 hz</option>
                    <option value="3">3,000 hz</option>
                    <option value="4">4,000 hz</option>
                </CustomSelect>
                <CustomSelect>
                    <option value="avg">Average</option>
                    <option value="sum">Sum</option>
                </CustomSelect>
                </div>
            </div>
            <CustomLine/>
    
            <div className="date_title">        
                <label>|</label>
                <h3>TEMPERATURE</h3>            
            </div>
            <div className="group_devinfo">
                <div className="form-group labels">
                    <label>* Temperature Sensor USE or NOT</label>
                    <label>* Sample Rate</label>
                </div> 
                <div className="form-group blank"/>    
                <div className="form-group contents">            
                    <CustomSelect>
                        <option value="use">USE</option>
                        <option value="not">NOT</option>
                    </CustomSelect>
                    <CustomSelect>
                        <option value="10">10 hz</option>
                        <option value="20">20 hz</option>
                        <option value="30">30 hz</option>
                    </CustomSelect>
                </div>                       
            </div>        
        </div>
        </>
     )
}

export default Measurements;

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
width: calc(90%); /* padding 값을 고려한 너비 설정 */
margin-top: 20px; /* 선 위 간격 */
margin-bottom: 20px; 
margin-left: 100px;
`