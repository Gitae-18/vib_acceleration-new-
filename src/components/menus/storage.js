/* eslint-disable */
import React, {useEffect, useState, useCa }from "react";
import Menu from "../menu";
import '../../style/body.css';
import styled from "styled-components";
import DeleteModal from "../modals/deletemodals";
const Storage = () => {
    const [deleteModal, setDeleteModal] = useState(false);
    const openDeleteModal = () => {
        setDeleteModal(true);
    }
    const closeDeleteModal = () => {
        setDeleteModal(false);
    }
    return(
        <>
            <div>
                <Menu/>
            </div>
            <div className="body">
                <div className="sec_title">        
                    <label>|</label>
                    <h3>STORAGE INFORMATION</h3>            
                </div>
                <div className="group_devinfo">
                    <div className="form-group labels">            
                        <div className="storage-display">
                            <div className="storage-amount">
                            <span>1.16 / 4.00 GB</span>
                            </div>
                            <div className="storage-bars">
                            <div className="storage-bar storage-used" style={{ width: '35%', justifyContent:'center', alignContent:'center' }}>
                                <span>2.84 GB</span>
                            </div>
                            <div className="storage-bar storage-free" style={{ width: '65%', justifyContent:'center', alignContent:'center' }}>
                                <span style={{color:'white'}}>1.16 GB</span>
                            </div>
                            </div>
                           {/*  <div className="storage-total">
                            <span>총 용량: 400,000,000,000 바이트</span>
                            <span>4.00 GB</span>
                            </div> */}
                        </div>
                    </div>
                    <div style={{width:'100px'}}/>
                    <div className="form-group contents table">
                        <table className="storage-table" style={{border:'none'}}>
                            <tbody>
                            <tr>
                                <td><div className="avail_storage"/></td>
                                <td><label class="storage-label fst">사용 가능:</label></td>
                                <td><label class="storage-label snd">284,000,000,000</label></td>
                                <td><label class="storage-label thd">바이트</label></td>
                                <td><span class="storage-size">2.84 GB</span></td>
                            </tr>
                            <tr>
                                <td><div className="used_storage"/></td>
                                <td><label class="storage-label fst">사 용 중:</label></td>
                                <td><label class="storage-label snd"> 116,000,000,000 </label></td>
                                <td><label class="storage-label thd"> 바이트 </label></td>
                                <td><span class="storage-size">1.16 GB</span></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><span class="storage-label fst">총 용 량:</span></td>
                                <td><label class="storage-label snd"> 400,000,000,000 </label></td>
                                <td><label class="storage-label thd"> 바이트 </label></td>
                                <td><span class="storage-size">4.00 GB</span></td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="form-group contents button">            
                           <CustomButton onClick={openDeleteModal}>Data Delete</CustomButton>
                           {deleteModal && <DeleteModal close={closeDeleteModal} visible={deleteModal} maskClosable={true}/>}
                    </div>
                </div>
                <CustomLine/>
                <div className="sec_title">        
                    <label>|</label>
                    <h3>FILE EXPORT</h3>            
                </div>
                <div className="group_devinfo">
                <div className="form-group labels">
                    <label>* File Export</label>
                </div>

                <div className="form-group blank"/>

                <div className="form-group contents">            
                    <div className="form-group contents date">
                        <div>                        
                        <input type="date" id="start_date" name="start_date" />
                        <label style={{marginLeft:'20px'}}> ~ </label>
                        <input type="date" id="start_time" name="start_time" />
                        </div>                        
                        <CustomButton style={{position:'relative',bottom:'40px'}}>Data Export</CustomButton>                       
                    </div>
                </div>
            </div>  
            <div style={{height:'200px'}}/>                   
            <CustomLine/>
                <div className="form-group contents">
                        <BottomButton>Save</BottomButton>
                </div>
             </div>
        </>
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