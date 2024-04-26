import React, {useEffect, useState }from "react";
import Menu from "../menu";
import { Portal } from "react-portal";
import '../../style/body.css';
import '../../style/delete.css';
import styled from "styled-components";

const DeleteModal = ({close,visible,className}) => {
    return(
        <>
      <Portal elementId="modal-root">
      <ModalOverlay visible={visible} />
      <ModalWrapper
        className={className}
        //onClick={maskClosable ? onMaskClick : null}
        tabIndex="-1"
        visible={visible}
      >
        
        <ModalInner tabIndex="0" className="modal-inner">        
          <ModalInner2>
            <CloseStyle>
                <Close className="modal-close" onClick={close}>
                    x
                </Close>
            </CloseStyle>
            <ImgStyle>
              {/* main */}
              <div className="date-container">
                <CustomInput type="date" id="start_date" name="start_date"/>
                <label>~</label>
                <CustomInput type="date" id="start_date" name="start_date"/>
              </div>
              <div className="btn-container fst">
                <CustomButton>Delete</CustomButton>            
              </div>
              <div className="btn-container snd">
                <CustomButton onClick={close}>cancel</CustomButton>            
              </div>           
            </ImgStyle>        
          </ModalInner2>
        </ModalInner>
      </ModalWrapper>
    </Portal>
    </>
    )
}
export default DeleteModal;

const ModalInner2 = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  font-weight: 500;
  font-size: 15px;
  background-color: none;
  position: relative;
  left:100px; 
  top:0;
  width:auto;
`;
const ImgStyle = styled.div`
  background-color: #ffffff;
  width: 1000px;
  height: 500px;
  box-sizing: border-box;
  border: solid #000000 2px;
`;
const CloseStyle = styled.div`
background-color : transparent;
border-radius: 10px;
position:relative;
margin-top:30px;
top:45px;
left:480px;
right:0;
bottom:0;
border:1px soild #000;
text-decoration: none;
padding: 5px 10px;
width: 40px;
height: 40px;
display : flex;
justify-content : center;
align-items : center;
`;

const Close = styled.span`
  cursor: pointer;
  margin:0 auto;
  font-weight:bold;
  font-size:1.5em;
`;

const ModalWrapper = styled.div`  
  display: ${(props) => (props.visible ? "block" : "none")};
  position: absolute;
  justify-contents:center;
  align-items:flex-start;
  width:40%;
  top: 10%;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 200;
  //overflow: auto;
  outline: 0;
  
`;

const ModalOverlay = styled.div`
  box-sizing: border-box;
  display: ${(props) => (props.visible ? "block" : "none")};
  position: fixed;
  z-index: 1;
  right: 0;
`;

const ModalInner = styled.div`
  box-sizing: border-box;
  position: relative;
  width: auto;
  max-width: 800px;
  height: 100px;
  top: 30px;
  transform: translateY(-50%);
  transform: translateX(50%);
  margin: 0 auto;
  padding: 40px 20px;
  left:500px;
  position:relative;
`;

const CustomButton = styled.button`
border: 1px solid #000;
width: 120px;
height:30px;
border-radius: 8px;
flex-grow:1;
background-color: #c8c8c8;
box-shadow: inset 0 0 8px rgba(0,0,0,0.5); 
display:inline-block;
`
const CustomInput = styled.input`
width: 30%;
display:flex;
justify-content: center;
align-items: center;
`