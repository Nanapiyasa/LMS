import React, { useState, useEffect, useRef } from "react";

// ============================================================================
// EMOTION MATCH GAME - LEVEL 2
// Enhanced difficulty with 5 emotions and distractor cards
// ============================================================================

const EMOTIONS = [
  {
    id: "happy",
    name: "Happy",
    emoji: "😊",
    color: "#FFD700",
    bgColor: "#FFF9C4",
  },
  {
    id: "sad",
    name: "Sad",
    emoji: "😢",
    color: "#4A90E2",
    bgColor: "#BBDEFB",
  },
  {
    id: "angry",
    name: "Angry",
    emoji: "😠",
    color: "#E74C3C",
    bgColor: "#FFCDD2",
  },
  {
    id: "surprised",
    name: "Surprised",
    emoji: "😮",
    color: "#FF69B4",
    bgColor: "#F8BBD0",
  },
  {
    id: "excited",
    name: "Excited",
    emoji: "🤩",
    color: "#9C27B0",
    bgColor: "#E1BEE7",
  },
];

export default function App() {
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  const [faceCards, setFaceCards] = useState([]);
  const [targetBubbles, setTargetBubbles] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [matchedCards, setMatchedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [wrongChoice, setWrongChoice] = useState(null);
  const [lives, setLives] = useState(5);
  const [combo, setCombo] = useState(0);

  const audioContextRef = useRef(null);
  const confettiCanvasRef = useRef(null);

  // ============================================================================
  // GAME INITIALIZATION
  // ============================================================================
  useEffect(() => {
    initializeGame();
    speak("Welcome to Level 2! Match all 5 feelings. You have 5 chances!");
  }, []);

  const initializeGame = () => {
    // Shuffle face cards for random positioning
    const shuffled = [...EMOTIONS].sort(() => Math.random() - 0.5);
    setFaceCards(shuffled);

    // Shuffle target bubbles separately
    const shuffledTargets = [...EMOTIONS].sort(() => Math.random() - 0.5);
    setTargetBubbles(shuffledTargets);

    setSelectedCard(null);
    setMatchedCards([]);
    setScore(0);
    setFeedback("");
    setGameComplete(false);
    setWrongChoice(null);
    setLives(5);
    setCombo(0);
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
        oscillator.frequency.setValueAtTime(523.25, ctx.currentTime);
        oscillator.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2);
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
      } else if (type === "combo") {
        // Special combo sound
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.setValueAtTime(1046.5, ctx.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.25, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.3);
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

      for (let i = 0; i < 150; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height - canvas.height,
          vx: (Math.random() - 0.5) * 6,
          vy: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          rotation: Math.random() * 360,
          rotationSpeed: (Math.random() - 0.5) * 15,
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
          p.vy += 0.15;

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
      const newCombo = combo + 1;
      setCombo(newCombo);

      const basePoints = 15;
      const comboBonus = newCombo > 1 ? newCombo * 5 : 0;
      const totalPoints = basePoints + comboBonus;

      playSound("correct");
      if (newCombo > 1) {
        playSound("combo");
      }

      setMatchedCards([...matchedCards, emotion.id]);
      setScore(score + totalPoints);

      const comboText = newCombo > 1 ? ` +${comboBonus} COMBO!` : "";
      setFeedback(
        `Perfect! That's ${emotion.name}! +${totalPoints} points${comboText} 🎉`
      );
      speak(`Excellent! That's ${emotion.name}!`);
      setSelectedCard(null);

      // Show confetti burst
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);

      // Check if game complete
      if (matchedCards.length === 4) {
        setTimeout(() => {
          setGameComplete(true);
          playSound("complete");
          speak(
            `Incredible! You matched all 5 feelings! Final score: ${
              score + totalPoints
            } points!`
          );
        }, 1000);
      }
    } else {
      // INCORRECT MATCH
      playSound("wrong");
      setWrongChoice(emotion.id);
      setCombo(0);

      const newLives = lives - 1;
      setLives(newLives);

      if (newLives <= 0) {
        setFeedback("Game Over! Let's try again!");
        speak("Oh no! Let's try again from the start!");
        setTimeout(() => {
          initializeGame();
        }, 2000);
        return;
      }

      setFeedback(
        `Oops! Try again! ${newLives} ${
          newLives === 1 ? "chance" : "chances"
        } left!`
      );
      speak(
        `Not quite! You have ${newLives} ${
          newLives === 1 ? "chance" : "chances"
        } left.`
      );

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
    padding: "15px",
    fontFamily: "'Comic Sans MS', 'Arial Rounded MT Bold', cursive, sans-serif",
    position: "relative",
    overflow: "auto",
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
    marginBottom: "15px",
  });

  const getTitleStyle = () => ({
    fontSize: "2.5rem",
    color: "#fff",
    textShadow: "4px 4px 8px rgba(0,0,0,0.3)",
    margin: "10px 0",
  });

  const getLevelBadgeStyle = () => ({
    display: "inline-block",
    backgroundColor: "#FF6347",
    color: "#fff",
    padding: "8px 20px",
    borderRadius: "20px",
    fontSize: "1.2rem",
    fontWeight: "bold",
    marginBottom: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
  });

  const getStatsContainerStyle = () => ({
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    marginBottom: "15px",
  });

  const getStatBoxStyle = (color) => ({
    backgroundColor: "rgba(255,255,255,0.2)",
    padding: "10px 25px",
    borderRadius: "20px",
    fontSize: "1.5rem",
    color: color || "#FFD700",
    fontWeight: "bold",
    textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
  });

  const getLivesContainerStyle = () => ({
    display: "flex",
    justifyContent: "center",
    gap: "8px",
    marginBottom: "15px",
  });

  const getHeartStyle = (active) => ({
    fontSize: "2rem",
    opacity: active ? 1 : 0.3,
    filter: active ? "none" : "grayscale(100%)",
    transition: "all 0.3s ease",
  });

  const getInstructionsStyle = () => ({
    textAlign: "center",
    marginBottom: "15px",
  });

  const getInstructionTextStyle = () => ({
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "rgba(0,0,0,0.3)",
    padding: "12px 25px",
    borderRadius: "20px",
    display: "inline-block",
    fontWeight: "bold",
  });

  const getFeedbackBoxStyle = () => ({
    textAlign: "center",
    marginBottom: "15px",
  });

  const getFeedbackTextStyle = () => ({
    fontSize: "1.5rem",
    color: "#fff",
    backgroundColor: "rgba(255,215,0,0.9)",
    padding: "15px 30px",
    borderRadius: "25px",
    display: "inline-block",
    fontWeight: "bold",
    boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
  });

  const getFaceCardsContainerStyle = () => ({
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginBottom: "40px",
    flexWrap: "wrap",
  });

  const getFaceCardStyle = (emotion) => ({
    width: "120px",
    height: "120px",
    borderRadius: "20px",
    border: `5px solid ${emotion.color}`,
    backgroundColor: emotion.bgColor,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "4.5rem",
    transition: "all 0.3s ease",
    cursor: matchedCards.includes(emotion.id) ? "not-allowed" : "pointer",
    touchAction: "manipulation",
    userSelect: "none",
    opacity: matchedCards.includes(emotion.id) ? 0.3 : 1,
    transform: selectedCard?.id === emotion.id ? "scale(1.15)" : "scale(1)",
    boxShadow:
      selectedCard?.id === emotion.id
        ? `0 0 35px ${emotion.color}`
        : "0 8px 20px rgba(0,0,0,0.2)",
  });

  const getTargetsContainerStyle = () => ({
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    flexWrap: "wrap",
    maxWidth: "900px",
    margin: "0 auto",
  });

  const getTargetBubbleStyle = (emotion) => ({
    width: "140px",
    height: "140px",
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1.5rem",
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
    top: "5px",
    right: "5px",
    fontSize: "2.5rem",
    color: "#fff",
    textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
  });

  const getCompleteScreenStyle = () => ({
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.85)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  });

  const getCompleteContentStyle = () => ({
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "30px",
    textAlign: "center",
    boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
    maxWidth: "90%",
  });

  const getStarContainerStyle = () => ({
    fontSize: "4rem",
    marginBottom: "15px",
  });

  const getBigStarStyle = () => ({
    display: "inline-block",
    margin: "0 8px",
  });

  const getCompleteTitleStyle = () => ({
    fontSize: "3.5rem",
    color: "#FF6347",
    marginBottom: "15px",
    textShadow: "3px 3px 6px rgba(0,0,0,0.2)",
  });

  const getCompleteScoreStyle = () => ({
    fontSize: "2.5rem",
    color: "#667eea",
    marginBottom: "10px",
    fontWeight: "bold",
  });

  const getCompleteMessageStyle = () => ({
    fontSize: "1.5rem",
    color: "#666",
    marginBottom: "25px",
  });

  const getPlayAgainButtonStyle = () => ({
    fontSize: "1.8rem",
    padding: "18px 50px",
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
              <span style={getBigStarStyle()}>🌟</span>
              <span style={getBigStarStyle()}>⭐</span>
            </div>
            <h1 style={getCompleteTitleStyle()}>LEVEL 2 COMPLETE!</h1>
            <p style={getCompleteScoreStyle()}>Final Score: {score} points!</p>
            <p style={getCompleteMessageStyle()}>
              You matched all 5 feelings! You're amazing! 🎉
            </p>
            <button
              style={getPlayAgainButtonStyle()}
              onClick={() => {
                initializeGame();
                speak("Let's play Level 2 again!");
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
            <div style={getLevelBadgeStyle()}>⭐ LEVEL 2 ⭐</div>
            <h1 style={getTitleStyle()}>🎨 Emotion Match Game 🎨</h1>

            {/* Stats */}
            <div style={getStatsContainerStyle()}>
              <div style={getStatBoxStyle("#FFD700")}>Score: {score}</div>
              {combo > 1 && (
                <div style={getStatBoxStyle("#FF69B4")}>🔥 {combo}x Combo!</div>
              )}
            </div>

            {/* Lives */}
            <div style={getLivesContainerStyle()}>
              {[...Array(5)].map((_, i) => (
                <span key={i} style={getHeartStyle(i < lives)}>
                  ❤️
                </span>
              ))}
            </div>
          </header>

          {/* Instructions */}
          <div style={getInstructionsStyle()}>
            <p style={getInstructionTextStyle()}>
              👆 Match all 5 feelings! Click a face, then its bubble! 👆
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
            {targetBubbles.map((emotion) => (
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
