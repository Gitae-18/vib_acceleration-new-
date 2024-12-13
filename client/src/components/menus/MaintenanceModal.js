import React from 'react';
import styled from 'styled-components';
import { FaExclamationTriangle } from 'react-icons/fa';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 30px 40px;
  box-shadow: 0 0 10px rgba(0,0,0,0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IconWrapper = styled.div`
  font-size: 48px;
  color: #f39c12;
  margin-bottom: 20px;
`;

const Message = styled.div`
  font-size: 18px;
  color: #333;
  text-align: center;
  line-height: 1.5;
`;

const MaintenanceModal = ({ isOpen }) => {
  if (!isOpen) return null;
  return (
    <ModalOverlay>
      <ModalContainer>
        <IconWrapper>
          <FaExclamationTriangle />
        </IconWrapper>
        <Message>시스템 점검중입니다.</Message>
      </ModalContainer>
    </ModalOverlay>
  );
};

export default MaintenanceModal;