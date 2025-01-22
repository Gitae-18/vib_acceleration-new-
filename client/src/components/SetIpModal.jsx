import React, { useState } from 'react';
import styled from 'styled-components';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
`;

const ModalContainer = styled.div`
  background: #fff;
  border-radius: 8px;
  padding: 30px 40px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 400px;
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  color: #333;
  cursor: pointer;

  &:hover {
    color: #555;
  }
`;

const Title = styled.h2`
  font-size: 24px;
  color: #333;
  margin-bottom: 20px;
`;

const InputField = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid rgb(130, 130, 130) !important;
  border-radius: 4px;
  font-size: 16px;
  color: #000 !important;
  box-sizing: border-box;
  &::placeholder{
    color:#555;
    font-weight: bold;
    opacity:0.8;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background:rgb(61, 61, 61);
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;

  &:hover {
    background:rgb(10, 10, 10);
  }
`;

const ErrorMessage = styled.p`
  color: red;
  font-size: 14px;
  margin-top: 10px;
`;

const SetIpModal = ({ isOpen, onClose }) => {
  const [ip, setIp] = useState('');
  const [subnet, setSubnet] = useState('');
  const [gateway, setGateway] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/network/ip_change', {
        set_ip: ip,
        set_subnet: subnet,
        set_gateway: gateway,
      });

      if (response.status === 200) {
        alert(response.data.message);
        onClose(); 
      } else {
        setError(`Error: ${response.data.error}`);
      }
    } catch (error) {
      console.error('Error changing IP:', error);
      setError('An unexpected error occurred.');
    }
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <Title>Set IP Configuration</Title>
        <InputField
          type="text"
          placeholder="IP Address"
          value={ip}
          onChange={(e) => setIp(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="Subnet Mask (e.g., 24)"
          value={subnet}
          onChange={(e) => setSubnet(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="Gateway"
          value={gateway}
          onChange={(e) => setGateway(e.target.value)}
        />
        <Button onClick={handleSubmit}>Submit</Button>
        {error && <ErrorMessage>{error}</ErrorMessage>}
      </ModalContainer>
    </ModalOverlay>
  );
};

export default SetIpModal;
