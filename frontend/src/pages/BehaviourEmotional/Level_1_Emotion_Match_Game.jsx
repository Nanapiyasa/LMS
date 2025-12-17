import React, { useState, useEffect, useRef } from "react";

// ============================================================================
// EMOTION MATCH GAME - LEVEL 1
// A colorful, accessible emotion matching game for children with Down syndrome
// ============================================================================

const EMOTIONS = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "#FFD700",
    bgColor: "#FFF9C4",
  },
  { id: "sad", name: "Sad", emoji: "😢", color: "#4A90E2", bgColor: "#BBDEFB" },
  {
    id: "angry",
    name: "Angry",
    emoji: "😠",
    color: "#E74C3C",
    bgColor: "#FFCDD2",
  },
];

export default function App() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [faceCards, setFaceCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [wrongChoice, setWrongChoice] = useState(null);

  const audioContextRef = useRef(null);
  const confettiCanvasRef = useRef(null);

  // ============================================================================
  // GAME INITIALIZATION
  // ============================================================================
  useEffect(() => {
    initializeGame();
    speak("Welcome! Match the faces to their feelings!");
  }, []);

  const initializeGame = () => {
    // Shuffle face cards for random positioning
    const shuffled = [...EMOTIONS].sort(() => Math.random() - 0.5);
    setFaceCards(shuffled);
    setSelectedCard(null);
    setMatchedCards([]);
    setScore(0);
    setFeedback("");
    setGameComplete(false);
    setWrongChoice(null);
  };

  // ============================================================================
  // AUDIO FEEDBACK (Web Audio API)
  // ============================================================================
  const playSound = (type) => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext ||
          window.webkitAudioContext)();
      }

      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === "correct") {
        // Happy ascending tones
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
      } else if (type === "wrong") {
        // Gentle downward tone
        oscillator.frequency.setValueAtTime(400, ctx.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(
          200,
          ctx.currentTime + 0.3
        );
        gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
      } else if (type === "complete") {
        // Celebration fanfare
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.15);
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.45);
        gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.7);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.7);
      }
    } catch (error) {
      console.log("Audio not available:", error);
    }
  };

  // ============================================================================
  // VOICE NARRATION (Speech Synthesis)
  // ============================================================================
  const speak = (text) => {
    try {
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.1;
        utterance.volume = 0.8;
        window.speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.log("Speech synthesis not available:", error);
    }
  };

  // ============================================================================
  // CONFETTI ANIMATION
  // ============================================================================
  useEffect(() => {
    if (showConfetti && confettiCanvasRef.current) {
      const canvas = confettiCanvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const particles = [];
      const colors = [
        "#FFD700",
        "#FF69B4",
        "#00CED1",
        "#FF6347",
        "#32CD32",
        "#9370DB",
      ];

      for (let i = 0; i < 100; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          vx: (Math.random() - 0.5) * 4,
          vy: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 8 + 4,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 10,
        });
      }

      let animationId;
      const animate = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach((p, index) => {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.fillStyle = p.color;
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();

          p.x += p.vx;
          p.y += p.vy;
          p.rotation += p.rotationSpeed;
          p.vy += 0.1; // gravity

          if (p.y > canvas.height) {
            particles.splice(index, 1);
          }
        });

        if (particles.length > 0) {
          animationId = requestAnimationFrame(animate);
        }
      };

      animate();

      return () => {
        if (animationId) cancelAnimationFrame(animationId);
      };
    }
  }, [showConfetti]);

  // ============================================================================
  // GAME LOGIC
  // ============================================================================
  const handleCardClick = (emotion) => {
    if (matchedCards.includes(emotion.id)) return;

    setSelectedCard(emotion);
    speak(`You picked ${emotion.name}`);
    setFeedback("");
  };

  const handleTargetClick = (emotion) => {
    if (!selectedCard || matchedCards.includes(emotion.id)) return;

    if (selectedCard.id === emotion.id) {
      // CORRECT MATCH
      playSound("correct");
      setMatchedCards([...matchedCards, emotion.id]);
      setScore(score + 10);
      setFeedback(`Great job! That's ${emotion.name}! 🎉`);
      speak(`Excellent! That's ${emotion.name}!`);
      setSelectedCard(null);

      // Show confetti burst
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);

      // Check if game complete
      if (matchedCards.length === 2) {
        // Will be 3 after this match is added
        setTimeout(() => {
          setGameComplete(true);
          playSound("complete");
          speak("Amazing! You matched all the feelings! You're a star!");
        }, 1000);
      }
    } else {
      // INCORRECT MATCH
      playSound("wrong");
      setWrongChoice(emotion.id);
      setFeedback(
        `Not quite! Try the ${
          selectedCard.color === "#FFD700"
            ? "yellow"
            : selectedCard.color === "#4A90E2"
            ? "blue"
            : "red"
        } bubble!`
      );
      speak(`Oops! Try again. Look for the ${selectedCard.name} bubble.`);

      setTimeout(() => {
        setWrongChoice(null);
        setFeedback("");
      }, 1500);
    }
  };

  // ============================================================================
  // INLINE STYLES
  // ============================================================================
  const getContainerStyle = () => ({
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    padding: "20px",
    fontFamily: "'Comic Sans MS', 'Arial Rounded MT Bold', cursive, sans-serif",
    position: "relative",
    overflow: "hidden",
    boxSizing: "border-box",
  });

  const getConfettiCanvasStyle = () => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    pointerEvents: "none",
    zIndex: 1000,
  });

  const getHeaderStyle = () => ({
    textAlign: "center",
    marginBottom: "20px",
  });

  const getTitleStyle = () => ({
    fontSize: "3rem",
    color: "#fff",
    textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
    margin: "10px 0",
  });

  const getScoreBoardStyle = () => ({
    fontSize: "2rem",
    color: "#FFD700",
    fontWeight: "bold",
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "10px 30px",
    borderRadius: "30px",
    display: "inline-block",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  });

  const getInstructionsStyle = () => ({
    textAlign: "center",
    marginBottom: "20px",
  });

  const getInstructionTextStyle = () => ({
    fontSize: "1.5rem",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: "15px 30px",
    borderRadius: "20px",
    display: "inline-block",
    fontWeight: "bold",
  });

  const getFeedbackBoxStyle = () => ({
    textAlign: "center",
    marginBottom: "20px",
  });

  const getFeedbackTextStyle = () => ({
    fontSize: "2rem",
    color: "#fff",
    backgroundColor: "rgba(255,215,0,0.9)",
    padding: "20px 40px",
    borderRadius: "25px",
    display: "inline-block",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  });

  const getFaceCardsContainerStyle = () => ({
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    marginBottom: "50px",
    flexWrap: "wrap",
  });

  const getFaceCardStyle = (emotion) => ({
    width: "150px",
    height: "150px",
    borderRadius: "20px",
    border: `6px solid ${emotion.color}`,
    backgroundColor: emotion.bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "6rem",
    transition: "all 0.3s ease",
    cursor: matchedCards.includes(emotion.id) ? "not-allowed" : "pointer",
    touchAction: "manipulation",
    userSelect: "none",
    opacity: matchedCards.includes(emotion.id) ? 0.3 : 1,
    transform: selectedCard?.id === emotion.id ? "scale(1.1)" : "scale(1)",
    boxShadow:
      selectedCard?.id === emotion.id
        ? `0 0 30px ${emotion.color}`
        : "0 8px 20px rgba(0,0,0,0.2)",
  });

  const getTargetsContainerStyle = () => ({
    display: "flex",
    justifyContent: "center",
    gap: "30px",
    flexWrap: "wrap",
    maxWidth: "800px",
    margin: "0 auto",
  });

  const getTargetBubbleStyle = (emotion) => ({
    width: "180px",
    height: "180px",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2rem",
    fontWeight: "bold",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    cursor:
      !selectedCard || matchedCards.includes(emotion.id)
        ? "not-allowed"
        : "pointer",
    boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
    position: "relative",
    touchAction: "manipulation",
    userSelect: "none",
    backgroundColor: emotion.color,
    opacity: matchedCards.includes(emotion.id) ? 0.3 : 1,
    animation: wrongChoice === emotion.id ? "shake 0.5s" : "none",
  });

  const getCheckMarkStyle = () => ({
    position: "absolute",
    top: "10px",
    right: "10px",
    fontSize: "3rem",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  });

  const getCompleteScreenStyle = () => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.8)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  });

  const getCompleteContentStyle = () => ({
    backgroundColor: "#fff",
    padding: "50px",
    borderRadius: "30px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
  });

  const getStarContainerStyle = () => ({
    fontSize: "5rem",
    marginBottom: "20px",
  });

  const getBigStarStyle = () => ({
    display: "inline-block",
    margin: "0 10px",
  });

  const getCompleteTitleStyle = () => ({
    fontSize: "4rem",
    color: "#FF6347",
    marginBottom: "20px",
    textShadow: "3px 3px 6px rgba(0,0,0,0.2)",
  });

  const getCompleteScoreStyle = () => ({
    fontSize: "2.5rem",
    color: "#667eea",
    marginBottom: "30px",
    fontWeight: "bold",
  });

  const getPlayAgainButtonStyle = () => ({
    fontSize: "2rem",
    padding: "20px 60px",
    backgroundColor: "#32CD32",
    color: "#fff",
    border: "none",
    borderRadius: "50px",
    cursor: "pointer",
    fontWeight: "bold",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
    transition: "all 0.3s ease",
    touchAction: "manipulation",
    fontFamily: "inherit",
  });

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div style={getContainerStyle()}>
      {/* Confetti Canvas */}
      {showConfetti && (
        <canvas ref={confettiCanvasRef} style={getConfettiCanvasStyle()} />
      )}

      {/* Game Complete Screen */}
      {gameComplete && (
        <div style={getCompleteScreenStyle()}>
          <div style={getCompleteContentStyle()}>
            <div style={getStarContainerStyle()}>
              <span style={getBigStarStyle()}>⭐</span>
              <span style={getBigStarStyle()}>🌟</span>
              <span style={getBigStarStyle()}>⭐</span>
            </div>
            <h1 style={getCompleteTitleStyle()}>YOU DID IT!</h1>
            <p style={getCompleteScoreStyle()}>Score: {score} points!</p>
            <button
              style={getPlayAgainButtonStyle()}
              onClick={() => {
                initializeGame();
                speak("Let's play again!");
              }}
            >
              🎮 PLAY AGAIN
            </button>
          </div>
        </div>
      )}

      {/* Main Game Screen */}
      {!gameComplete && (
        <>
          {/* Header */}
          <header style={getHeaderStyle()}>
            <h1 style={getTitleStyle()}>🎨 Emotion Match Game 🎨</h1>
            <div style={getScoreBoardStyle()}>Score: {score}</div>
          </header>

          {/* Instructions */}
          <div style={getInstructionsStyle()}>
            <p style={getInstructionTextStyle()}>
              👆 Click a face, then click its matching feeling bubble! 👆
            </p>
          </div>

          {/* Feedback Message */}
          {feedback && (
            <div style={getFeedbackBoxStyle()}>
              <p style={getFeedbackTextStyle()}>{feedback}</p>
            </div>
          )}

          {/* Face Cards Section */}
          <div style={getFaceCardsContainerStyle()}>
            {faceCards.map((emotion) => (
              <button
                key={emotion.id}
                style={getFaceCardStyle(emotion)}
                onClick={() => handleCardClick(emotion)}
                disabled={matchedCards.includes(emotion.id)}
              >
                <span style={{ pointerEvents: "none" }}>{emotion.emoji}</span>
              </button>
            ))}
          </div>

          {/* Target Bubbles Section */}
          <div style={getTargetsContainerStyle()}>
            {EMOTIONS.map((emotion) => (
              <button
                key={emotion.id}
                style={getTargetBubbleStyle(emotion)}
                onClick={() => handleTargetClick(emotion)}
                disabled={!selectedCard || matchedCards.includes(emotion.id)}
              >
                <span style={{ pointerEvents: "none" }}>{emotion.name}</span>
                {matchedCards.includes(emotion.id) && (
                  <span style={getCheckMarkStyle()}>✓</span>
                )}
              </button>
            ))}
          </div>
        </>
      )}

      {/* Inline CSS for Animations */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
        
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
  );
}
