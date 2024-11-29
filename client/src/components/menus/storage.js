/* eslint-disable */
import React, {useEffect, useState, useCallback }from "react";
import Menu from "../menu";
import '../../style/font.css';
import '../../style/contents.css';
import '../../style/common.css';
import styled from "styled-components";
import DeleteModal from "../modals/deletemodals";
const Storage = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const [storage, setStorage] = useState({
        total : '',
        used : '',
        free : '',

    })
    const openDeleteModal = () => {
        setDeleteModal(true);
    }
    const closeDeleteModal = () => {
        setDeleteModal(false);
    }
    const getUsableStorage = useCallback(async () =>  {
        try {
            const res = await fetch(`/api/storage`, { method: 'GET' });
            const data = await res.json();
            console.log(data);
            setStorage(storage => ({
                ...storage,
                total: data.total,
                used: data.used,
                free: data.free,
            }));
        }
        catch(error) {
            console.error('Failed to fetch storage info:', error);    
        }
    },[])

    useEffect(() => {
        getUsableStorage();
    },[getUsableStorage])
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
                        <img src="/images/storage_icon.png"/>
                        <h2>STORAGE INFORMATION</h2>
                    </div>
                    <div className="contBox">
                        <ul className="d-flex">
                            <li className="progress">
                                <h4>STORAGE</h4>
                                <div id="progress-container">
                                    <progress id="progress-bar" value="75" max="100"></progress>
                                </div>
                                <div className="progress-info">
                                    <span>1.16 GB</span> ㅣ 4.00 GB
                                </div>
                            </li>
                            <li className="progress-txt">
                                <div className="item">
                                    <div className="color-box available"></div>
                                    <div className="text">사용 가능&nbsp; :</div>
                                    <div className="value">284,000,000,000 바이트</div>
                                    <div className="value">{storage.free}GB</div>
                                </div>
                                <div className="item">
                                    <div className="color-box used"></div>
                                    <div className="text">사 &nbsp;용 &nbsp;중 &nbsp; :</div>
                                    <div className="value">116,000,000,000 바이트</div>
                                    <div className="value">{storage.used} GB</div>
                                </div>
                                <div className="item">
                                    <div className="text" style={{marginLeft:'36px'}}>총  &nbsp;용  &nbsp;량 &nbsp; :</div>
                                    <div className="value">400,000,000,000 바이트</div>
                                    <div className="value">{storage.total} GB</div>
                                </div>
                                <div className="d-flex justify-between">
                                    <div></div>
                                    <button className="default_button Data_btn" onClick={openDeleteModal}>Data Delete</button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
            <section className="mt50">
                <div className="contIn">
                    <div className="cont_Tit mb23">
                        <img src="/images/file_icon.png"/>
                        <h2>FILE EXPORT</h2>
                    </div>
                    <div className="contBox">
                        <ul className="d-flex mb35">
                            <li className="contBoxtit">FILE EXPORT</li>
                            <li className="date d-flex">
                                <input type="text" id="startDate2" placeholder="시작 날짜를 선택하세요"/>
                                -
                                <input type="text" id="endDate2" placeholder="종료 날짜를 선택하세요"/>
                            </li>
                        </ul>
                        <div className="d-flex justify-between">
                            <div></div>
                            <button className="default_button Data_btn">Data Export</button>
                        </div>
                    </div>
                </div>
            </section>
            <div className="common_button d-flex">
                <button className="save_btn">Save</button>
                <button className="cancel_btn">Cancel</button>
            </div>
            {deleteModal && (
                    <div className="pop-wrap pop-up active" id="modal_data_delete">
                        <div className="pop-in middle pop_01">
                            <div className="modal_wrap">
                                <div className="confirm_container">
                                    <p className="modal_title">
                                        <button className="close-btn cancel_button" onClick={closeDeleteModal}></button>
                                    </p>
                                    <div className="description">
                                        <div className="date d-flex">
                                            <input type="text" id="startDate" placeholder="시작 날짜를 선택하세요" />
                                            -
                                            <input type="text" id="endDate" placeholder="종료 날짜를 선택하세요" />
                                        </div>
                                    </div>
                                    <div className="modal_buttons">
                                        <button type="button" className="Delete_button">Delete</button>
                                        <button 
                                            type="button" 
                                            className="cancel_button" 
                                            onClick={closeDeleteModal}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dim"></div>
                    </div>
            )}
        </main>
        </div>
        </body>
     )

}

export default Storage;
const CustomLine = styled.div`
border-top: 2px solid #ccc; 
width: calc(90%); 
margin-top: 20px; 
margin-bottom: 20px; 
margin-left: 100px;
`
const CustomButton = styled.button`
border: 1px solid #000;
width: 180px;
height:30px;
border-radius: 8px;
flex-grow:1;
margin-left:40%;
background-color: #c8c8c8;
box-shadow: inset 0 0 8px rgba(0,0,0,0.5); 
`
const BottomButton = styled.button`
border: 1px solid #000;
width: 180px;
height:30px;
border-radius: 8px;
flex-grow:1;
margin-top:20px;
margin-left:40%;
background-color: #c8c8c8;
box-shadow: inset 0 0 8px rgba(0,0,0,0.5); 
`