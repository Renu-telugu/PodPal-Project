import React from "react";
import styled from "styled-components";
import { useTheme } from "../context/ThemeContext";

// Styled components for a more attractive toggle
const ToggleContainer = styled.button`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme, isDarkMode }) =>
    isDarkMode
      ? "linear-gradient(to right, #4834d4, #111)"
      : "linear-gradient(to right, #3498db, #fff)"};
  width: 65px;
  height: 32px;
  border-radius: 50px;
  border: 2px solid
    ${({ theme, isDarkMode }) =>
      isDarkMode ? theme.colors.secondary : theme.colors.primary};
  padding: 4px;
  overflow: hidden;
  cursor: pointer;
  box-shadow: ${({ theme, isDarkMode }) =>
    isDarkMode
      ? "0 0 5px rgba(108, 99, 255, 0.5)"
      : "0 0 5px rgba(52, 152, 219, 0.5)"};
  transition: all 0.3s ease;

  &:hover {
    box-shadow: ${({ theme, isDarkMode }) =>
      isDarkMode
        ? "0 0 8px rgba(108, 99, 255, 0.8)"
        : "0 0 8px rgba(52, 152, 219, 0.8)"};
  }

  &:focus {
    outline: none;
    box-shadow: ${({ theme, isDarkMode }) =>
      isDarkMode
        ? "0 0 8px rgba(108, 99, 255, 0.8)"
        : "0 0 8px rgba(52, 152, 219, 0.8)"};
  }
`;

const ToggleButton = styled.span`
  position: absolute;
  top: 2px;
  left: ${({ isDarkMode }) => (isDarkMode ? "calc(100% - 28px)" : "2px")};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${({ isDarkMode }) => (isDarkMode ? "#fff" : "#f39c12")};
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55);
`;

const IconContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 5px;
  font-size: 14px;
`;

const Icon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  width: 20px;
  color: ${({ active }) => (active ? "#fff" : "rgba(255, 255, 255, 0.5)")};
  z-index: 1;
  opacity: ${({ visible }) => (visible ? 1 : 0.5)};
  transition: opacity 0.3s ease;
`;

// Theme toggle component
const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  console.log("Current Theme:", theme);

  const isDarkMode = theme === "dark";

  return (
    <ToggleContainer
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      isDarkMode={isDarkMode}
    >
      <IconContainer>
        <Icon visible={!isDarkMode} active={!isDarkMode}>
          ☀️
        </Icon>
        <Icon visible={isDarkMode} active={isDarkMode}>
          🌙
        </Icon>
      </IconContainer>
      <ToggleButton isDarkMode={isDarkMode} />
    </ToggleContainer>
  );
};

export default ThemeToggle;
