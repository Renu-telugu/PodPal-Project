import React from "react";
import styled from "styled-components";

const TranscriptContainer = styled.div`
  line-height: 1.7;
  word-break: break-word;
  font-size: 1.1rem;
`;

const Word = styled.span`
  background: ${({ highlighted, theme }) =>
    highlighted ? theme.colors.primary || "#a3e635" : "transparent"};
  color: ${({ highlighted, theme }) => (highlighted ? "#fff" : "inherit")};
  border-radius: 4px;
  padding: 0 2px;
  transition: background 0.2s, color 0.2s;
`;

/**
 * @param {Object[]} words - Array of words with timing: [{text, start, end}]
 * @param {number} currentTime - Current audio playback time in seconds
 */
const TranscriptHighlighter = ({ words, currentTime }) => {
  if (!Array.isArray(words) || words.length === 0) return <div>Transcript unavailable.</div>;

  return (
    <TranscriptContainer>
      {words.map((word, idx) => {
        // AssemblyAI gives start/end in ms, audio.currentTime is in seconds
        const startSec = word.start / 1000;
        const endSec = word.end / 1000;
        const highlighted =
          currentTime >= startSec && currentTime < endSec;
        return (
          <Word key={idx} highlighted={highlighted}>
            {word.text + " "}
          </Word>
        );
      })}
    </TranscriptContainer>
  );
};

export default TranscriptHighlighter;
