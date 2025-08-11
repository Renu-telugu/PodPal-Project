import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useTheme } from "../context/ThemeContext";
import { FaSun, FaMoon } from "react-icons/fa";

const ripple = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0.3);
    transform: scale(1);
  }
  50% {
    box-shadow: 0 0 0 10px rgba(124, 58, 237, 0);
    transform: scale(1.05);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(124, 58, 237, 0);
    transform: scale(1);
  }
`;

const spin = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const glow = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(124, 58, 237, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(124, 58, 237, 0.6);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(5px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-5px) scale(0.95);
  }
`;

const rotateIn = keyframes`
  from {
    transform: rotate(-45deg) scale(0.5);
    opacity: 0;
  }
  to {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
`;

const rotateOut = keyframes`
  from {
    transform: rotate(0) scale(1);
    opacity: 1;
  }
  to {
    transform: rotate(45deg) scale(0.5);
    opacity: 0;
  }
`;

const ToggleContainer = styled.button`
  position: relative;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: ${({ $isDarkMode }) =>
    $isDarkMode
      ? "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
      : "linear-gradient(135deg, #f9fafb 0%, #e0e7ff 100%)"};
  border: 2px solid
    ${({ $isDarkMode }) =>
      $isDarkMode ? "rgba(124, 58, 237, 0.5)" : "rgba(124, 58, 237, 0.3)"};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  padding: 0;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    transform: scale(1.1);
    animation: ${ripple} 1.5s infinite;
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    animation: ${glow} 0.8s infinite;
  }

  &::before {
    background: radial-gradient(
      circle at center,
      ${({ $isDarkMode }) =>
          $isDarkMode ? "rgba(30, 41, 59, 0.8)" : "rgba(224, 231, 255, 0.8)"}
        0%,
      transparent 70%
    );
  }

  &:hover::before {
    opacity: 1;
  }
`;

const IconWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transform: ${({ $visible }) => ($visible ? "scale(1)" : "scale(0)")};
  animation: ${({ $visible, $isDarkMode }) =>
    $visible
      ? $isDarkMode
        ? css`
            ${rotateIn} 0.4s ease
          `
        : css`
            ${fadeIn} 0.4s ease
          `
      : "none"};

  svg {
    color: ${({ $isDarkMode }) => ($isDarkMode ? "#f9fafb" : "#7c3aed")};
    font-size: 18px;
    transition: all 0.4s ease;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));

    &:hover {
      animation: ${spin} 4s linear infinite;
    }
  }
`;

const SunRays = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s ease;

  &::before,
  &::after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    background: rgba(255, 200, 60, 0.5);
    border-radius: 50%;
  }

  &::before {
    width: 120%;
    height: 120%;
    transform: translate(-50%, -50%);
    opacity: 0.1;
    filter: blur(10px);
  }

  &::after {
    width: 30%;
    height: 30%;
    transform: translate(-50%, -50%);
    opacity: 0.2;
    filter: blur(5px);
  }
`;

const MoonCraters = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: ${({ $visible }) => ($visible ? 0.5 : 0)};
  transition: opacity 0.4s ease;

  &::before,
  &::after {
    content: "";
    position: absolute;
    background: rgba(30, 41, 59, 0.9);
    border-radius: 50%;
  }

  &::before {
    width: 6px;
    height: 6px;
    top: 10px;
    right: 13px;
  }

  &::after {
    width: 4px;
    height: 4px;
    bottom: 10px;
    left: 14px;
  }
`;

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <ToggleContainer
      onClick={toggleTheme}
      aria-label="Toggle dark mode"
      $isDarkMode={isDarkMode}
      title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      <SunRays $visible={!isDarkMode} />
      <MoonCraters $visible={isDarkMode} />

      <IconWrapper $visible={!isDarkMode} $isDarkMode={false}>
        <FaSun />
      </IconWrapper>

      <IconWrapper $visible={isDarkMode} $isDarkMode={true}>
        <FaMoon />
      </IconWrapper>
    </ToggleContainer>
  );
};

export default ThemeToggle;
