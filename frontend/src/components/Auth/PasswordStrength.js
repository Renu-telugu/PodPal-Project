import React from 'react';
import styled from 'styled-components';
import { FaCheck, FaTimes } from 'react-icons/fa';

const PasswordRequirementsContainer = styled.div`
  margin-top: 0.5rem;
  padding: 1rem;
  border: 1px solid #e0e0e0;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const RequirementTitle = styled.h5`
  margin: 0 0 0.5rem 0;
  color: #555;
  font-size: 0.9rem;
  font-weight: 500;
`;

const RequirementsList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const RequirementItem = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 0.4rem;
  font-size: 0.85rem;
  color: ${props => props.valid ? '#388e3c' : '#7e7e7e'};
`;

const Icon = styled.span`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
`;

const StrengthMeter = styled.div`
  height: 4px;
  background-color: #e0e0e0;
  border-radius: 2px;
  margin: 8px 0;
  overflow: hidden;
`;

const StrengthProgress = styled.div`
  height: 100%;
  width: ${props => props.strength}%;
  background: ${props => {
    if (props.strength < 40) return '#f44336';
    if (props.strength < 70) return '#ff9800';
    return '#4caf50';
  }};
  transition: width 0.3s ease;
`;

const StrengthText = styled.div`
  font-size: 0.75rem;
  color: ${props => {
    if (props.strength < 40) return '#f44336';
    if (props.strength < 70) return '#ff9800';
    return '#4caf50';
  }};
  text-align: right;
  margin-bottom: 0.5rem;
`;

const PasswordStrength = ({ password = '' }) => {
  const requirements = [
    { 
      name: 'At least 8 characters', 
      valid: password.length >= 8 
    },
    { 
      name: 'At least one uppercase letter', 
      valid: /[A-Z]/.test(password) 
    },
    { 
      name: 'At least one lowercase letter', 
      valid: /[a-z]/.test(password) 
    },
    { 
      name: 'At least one number', 
      valid: /[0-9]/.test(password) 
    },
    { 
      name: 'At least one special character', 
      valid: /[!@#$%^&*(),.?":{}|<>]/.test(password) 
    }
  ];

  const validRequirements = requirements.filter(req => req.valid).length;
  const strengthPercentage = password ? (validRequirements / requirements.length) * 100 : 0;

  const getStrengthText = () => {
    if (!password) return '';
    if (strengthPercentage < 40) return 'Weak';
    if (strengthPercentage < 70) return 'Medium';
    if (strengthPercentage < 100) return 'Strong';
    return 'Very Strong';
  };

  return (
    <PasswordRequirementsContainer>
      <RequirementTitle>Password Requirements</RequirementTitle>
      
      {password && (
        <>
          <StrengthText strength={strengthPercentage}>
            {getStrengthText()}
          </StrengthText>
          <StrengthMeter>
            <StrengthProgress strength={strengthPercentage} />
          </StrengthMeter>
        </>
      )}
      
      <RequirementsList>
        {requirements.map((requirement, index) => (
          <RequirementItem key={index} valid={requirement.valid}>
            <Icon>
              {requirement.valid ? <FaCheck size={12} /> : <FaTimes size={12} />}
            </Icon>
            {requirement.name}
          </RequirementItem>
        ))}
      </RequirementsList>
    </PasswordRequirementsContainer>
  );
};

export default PasswordStrength; 