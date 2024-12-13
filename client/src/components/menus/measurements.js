/* eslint-disable */
import React, {useEffect, useState, useCallback }from "react";
import Menu from "../menu";
import styled from "styled-components";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import MaintenanceModal from "./MaintenanceModal";
const Measurements = () => {
    const [showModal, setShowModal] = useState(true);
    return (
        <body>
        <div className="wrap Measurements">
            <div>
                <Menu />
            </div>
            <main className="mainArea">
                <section>
                    <div className="contIn">
                        <div className="cont_Tit mb23">
                            <img src="/images/acceeraton_icon.png"/>
                            <h2>40g DC ACCEERATION</h2>
                        </div>
                        <div className="contBox">
                            <ul className="d-flex mb35">
                                <li className="contBoxtit">
                                    Acceleration Sensor USE or NOT
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
                            <ul className="mb35">
                                <li className="contBoxtit">
                                    Sample Rate
                                </li>
                                <li className="d-flex mr-32 gap10">
                                    <div className="select-container">
                                        <div className="select-box">
                                            <span className="selected">4,000</span>
                                            <span className="arrow"></span>
                                        </div>
                                        <div className="options">
                                            <div className="option" data-value="option1">option1</div>
                                            <div className="option" data-value="option2">option2</div>
                                            <div className="option" data-value="option3">option3</div>
                                        </div>
                                    </div>
                                    <div>Hz</div>
                                </li>
                                
                            </ul>
                            <ul>
                                <li className="contBoxtit">
                                    Measurement Option
                                </li>
                                <li className="d-flex mr-32 gap10">
                                    <div className="select-container">
                                        <div className="select-box">
                                            <span className="selected">Average</span>
                                            <span className="arrow"></span>
                                        </div>
                                        <div className="options">
                                            <div className="option" data-value="option1">option1</div>
                                            <div className="option" data-value="option2">option2</div>
                                            <div className="option" data-value="option3">option3</div>
                                        </div>
                                    </div>
                                    <div>Hz</div>
                                </li>
                                
                            </ul>
                        </div>
                    </div>
                </section>
                <section className="mt50">
                    <div className="contIn">
                        <div className="cont_Tit mb23">
                            <img src="/images/temperature_icon.png"/>
                            <h2>TEMPERATURE</h2>
                        </div>
                        <div className="contBox">
                            <ul className="d-flex mb35">
                                <li className="contBoxtit">
                                    Temperature Sensor USE or NOT
                                </li>
                                <li className="d-flex mr-32 gap10">
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
                                    <div>Hz</div>
                                </li>
                            </ul>
                            <ul>
                                <li className="contBoxtit">
                                    Sample Rate
                                </li>
                                <li className="d-flex mr-32 gap10">
                                    <div className="select-container">
                                        <div className="select-box">
                                            <span className="selected">Average</span>
                                            <span className="arrow"></span>
                                        </div>
                                        <div className="options">
                                            <div className="option" data-value="option1">option1</div>
                                            <div className="option" data-value="option2">option2</div>
                                            <div className="option" data-value="option3">option3</div>
                                        </div>
                                    </div>
                                    <div>Hz</div>
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
            {showModal && <MaintenanceModal isOpen={showModal} />}
        </div>
        </body>
    );
};

export default Measurements;

const CustomSelect = styled.select`
    border: 1px solid #bbb;
    width: 300px;
    border-radius: 2%;
    flex-grow: 1;
    margin-bottom: 20px;
    margin-left: 50%;
`;

const CustomLine = styled.div`
    border-top: 2px solid #ccc;
    width: calc(90%);
    margin-top: 20px;
    margin-bottom: 20px;
    margin-left: 100px;
`;

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