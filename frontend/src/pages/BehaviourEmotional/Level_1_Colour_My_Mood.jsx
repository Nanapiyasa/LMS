import React, { useState, useEffect } from 'react';

export default function App() {
  // State for selected colour and animation
  const [selectedColour, setSelectedColour] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);

  // Colour palette with emotions and messages
  const colours = [
    {
      id: 'red',
      name: 'Red',
      hex: '#FF6B6B',
      message: "You're feeling strong and bold!",
      emoji: '💪'
    },
    {
      id: 'yellow',
      name: 'Yellow',
      hex: '#FFD93D',
      message: "That's a lovely happy yellow!",
      emoji: '😊'
    },
    {
      id: 'blue',
      name: 'Blue',
      hex: '#6BCB77',
      message: "Such a calm and peaceful blue!",
      emoji: '😌'
    },
    {
      id: 'green',
      name: 'Green',
      hex: '#4D96FF',
      message: "Feeling fresh and relaxed!",
      emoji: '🌿'
    },
    {
      id: 'pink',
      name: 'Pink',
      hex: '#FFB6D9',
      message: "That's a sweet and kind colour!",
      emoji: '💕'
    },
    {
      id: 'purple',
      name: 'Purple',
      hex: '#B565D8',
      message: "So creative and magical!",
      emoji: '✨'
    }
  ];

  // Speech synthesis function
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      setTimeout(() => {
        window.speechSynthesis.speak(utterance);
      }, 100);
    }
  };

  // Play sound effect using Web Audio API
  const playSound = (frequency = 800, duration = 150) => {
    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';
      
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration / 1000);
    } catch (error) {
      console.log('Audio not supported');
    }
  };

  // Initial narration on component mount
  useEffect(() => {
    if (!hasStarted) {
      setTimeout(() => {
        speak("Pick a colour that shows how you feel!");
        setHasStarted(true);
      }, 500);
    }
    
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [hasStarted]);

  // Handle colour selection
  const handleColourSelect = (colour) => {
    playSound(600 + Math.random() * 400, 200);
    setSelectedColour(colour);
    setIsAnimating(true);
    
    setTimeout(() => {
      speak(colour.message);
    }, 300);
    
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);
  };

  // Reset selection
  const handleReset = () => {
    playSound(500, 150);
    setSelectedColour(null);
    setIsAnimating(false);
    setTimeout(() => {
      speak("Pick another colour!");
    }, 200);
  };

  return (
    <div style={styles.container}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Poppins', 'Comic Sans MS', sans-serif;
          overflow-x: hidden;
        }
        
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        @keyframes bounce {
          0%, 100% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          75% { transform: scale(1.1) rotate(5deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        
        .bounce {
          animation: bounce 0.6s ease;
        }
        
        .pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        
        .wiggle {
          animation: wiggle 0.5s ease-in-out;
        }
      `}</style>
      
      {/* Main Content */}
      <div style={styles.content}>
        
        {/* Title */}
        <h1 style={styles.title}>
          🎨 Colour My Mood! 🎨
        </h1>
        
        {/* Instruction Text */}
        {!selectedColour && (
          <p style={styles.instruction}>
            Pick a colour that shows how you feel!
          </p>
        )}
        
        {/* Face Display */}
        <div style={styles.faceContainer}>
          <div 
            className={isAnimating ? 'bounce' : (selectedColour ? 'pulse' : '')}
            style={{
              ...styles.face,
              backgroundColor: selectedColour ? selectedColour.hex : '#FFFFFF',
              border: selectedColour ? `8px solid ${selectedColour.hex}` : '8px solid #E0E0E0',
              filter: selectedColour ? 'drop-shadow(0 10px 30px rgba(0,0,0,0.2))' : 'drop-shadow(0 5px 15px rgba(0,0,0,0.1))'
            }}
          >
            <span style={styles.faceEmoji}>
              {selectedColour ? selectedColour.emoji : '😊'}
            </span>
          </div>
        </div>
        
        {/* Feedback Message */}
        {selectedColour && (
          <div style={styles.messageContainer}>
            <p style={styles.message}>
              {selectedColour.message}
            </p>
          </div>
        )}
        
        {/* Colour Palette */}
        {!selectedColour && (
          <div style={styles.colourGrid}>
            {colours.map((colour) => (
              <button
                key={colour.id}
                onClick={() => handleColourSelect(colour)}
                style={{
                  ...styles.colourButton,
                  backgroundColor: colour.hex
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)';
                  playSound(400, 50);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
                aria-label={`Select ${colour.name}`}
              >
                <span style={styles.colourName}>{colour.name}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Reset Button */}
        {selectedColour && (
          <button
            onClick={handleReset}
            style={styles.resetButton}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.1)';
              e.currentTarget.style.backgroundColor = '#9333EA';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = '#A855F7';
            }}
          >
            🔄 Try Another Colour!
          </button>
        )}
      </div>
    </div>
  );
}

// Inline styles object
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(-45deg, #FFF5E1, #FFE5EC, #E5F3FF, #F0E5FF)',
    backgroundSize: '400% 400%',
    animation: 'gradientShift 15s ease infinite',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: "'Poppins', 'Comic Sans MS', sans-serif"
  },
  content: {
    maxWidth: '900px',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '30px'
  },
  title: {
    fontSize: 'clamp(2rem, 5vw, 3.5rem)',
    fontWeight: '800',
    color: '#6B21A8',
    textAlign: 'center',
    textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
    margin: '0'
  },
  instruction: {
    fontSize: 'clamp(1.3rem, 3vw, 2rem)',
    fontWeight: '600',
    color: '#7C3AED',
    textAlign: 'center',
    margin: '0'
  },
  faceContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0'
  },
  face: {
    width: 'clamp(200px, 40vw, 320px)',
    height: 'clamp(200px, 40vw, 320px)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.5s ease',
    boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
  },
  faceEmoji: {
    fontSize: 'clamp(5rem, 15vw, 8rem)',
    lineHeight: 1
  },
  messageContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '30px',
    padding: '20px 40px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
    maxWidth: '600px'
  },
  message: {
    fontSize: 'clamp(1.3rem, 3vw, 2rem)',
    fontWeight: '700',
    color: '#6B21A8',
    textAlign: 'center',
    margin: '0'
  },
  colourGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '20px',
    width: '100%',
    maxWidth: '700px',
    padding: '20px'
  },
  colourButton: {
    width: '100%',
    aspectRatio: '1',
    minHeight: '120px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
    fontSize: 'clamp(1.1rem, 2.5vw, 1.5rem)',
    fontWeight: '700',
    color: '#FFFFFF',
    textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outline: 'none',
    fontFamily: 'inherit'
  },
  colourName: {
    pointerEvents: 'none'
  },
  resetButton: {
    backgroundColor: '#A855F7',
    color: '#FFFFFF',
    fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
    fontWeight: '700',
    padding: '18px 40px',
    border: 'none',
    borderRadius: '50px',
    cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(168, 85, 247, 0.4)',
    transition: 'all 0.3s ease',
    outline: 'none',
    fontFamily: 'inherit',
    marginTop: '10px'
  }
};