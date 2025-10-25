import React, { useState, useEffect } from 'react';

export default function App() {
  // State management
  const [selectedMood, setSelectedMood] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [confettiPieces, setConfettiPieces] = useState([]);

  // Mood data
  const moods = [
    {
      id: 'happy',
      name: 'Happy',
      color: 'bg-yellow-400',
      borderColor: 'border-yellow-400',
      emoji: '💛',
      feedback: "Wow, you chose happy yellow! 😊",
      bgGradient: 'from-yellow-300 to-yellow-500'
    },
    {
      id: 'calm',
      name: 'Calm',
      color: 'bg-blue-400',
      borderColor: 'border-blue-400',
      emoji: '💙',
      feedback: "That's a lovely calm blue! 😌",
      bgGradient: 'from-blue-300 to-blue-500'
    },
    {
      id: 'angry',
      name: 'Angry',
      color: 'bg-red-400',
      borderColor: 'border-red-400',
      emoji: '❤️',
      feedback: "Red means angry — it's okay to feel that way! 😠",
      bgGradient: 'from-red-300 to-red-500'
    },
    {
      id: 'relaxed',
      name: 'Relaxed',
      color: 'bg-green-400',
      borderColor: 'border-green-400',
      emoji: '💚',
      feedback: "Green is so peaceful! 😊",
      bgGradient: 'from-green-300 to-green-500'
    }
  ];

  // Voice narration function
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Generate confetti pieces
  const generateConfetti = () => {
    const pieces = [];
    for (let i = 0; i < 30; i++) {
      pieces.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 0.3,
        duration: 1 + Math.random() * 0.5,
        color: ['bg-yellow-400', 'bg-blue-400', 'bg-red-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400'][Math.floor(Math.random() * 6)]
      });
    }
    return pieces;
  };

  // Handle mood selection
  const handleMoodSelect = (mood) => {
    setSelectedMood(mood);
    setIsAnimating(true);
    setShowConfetti(true);
    setConfettiPieces(generateConfetti());
    
    // Speak feedback
    speak(mood.feedback);

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, 600);

    // Hide confetti
    setTimeout(() => {
      setShowConfetti(false);
    }, 2000);
  };

  // Handle reset
  const handleReset = () => {
    setSelectedMood(null);
    setIsAnimating(false);
    setShowConfetti(false);
    window.speechSynthesis.cancel();
  };

  // Cleanup speech on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      {/* Confetti animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className={`absolute w-3 h-3 ${piece.color} rounded-full animate-fall`}
              style={{
                left: `${piece.left}%`,
                top: '-20px',
                animationDelay: `${piece.delay}s`,
                animationDuration: `${piece.duration}s`,
                animationName: 'fall',
                animationTimingFunction: 'ease-in',
                animationFillMode: 'forwards'
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
        .animate-fall {
          animation: fall 1.5s ease-in forwards;
        }
      `}</style>

      {/* Main container */}
      <div className="w-full max-w-2xl mx-auto">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-center mb-8 text-purple-700">
          🎨 Colour My Mood! 🎨
        </h1>

        {/* Instruction text */}
        {!selectedMood && (
          <p className="text-2xl md:text-3xl text-center mb-8 text-gray-700 font-semibold">
            Choose a colour for your mood!
          </p>
        )}

        {/* Face display */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div
            className={`relative w-64 h-64 md:w-80 md:h-80 rounded-full flex items-center justify-center transition-all duration-500 ${
              isAnimating ? 'scale-110' : 'scale-100'
            } ${
              selectedMood
                ? `bg-gradient-to-br ${selectedMood.bgGradient} border-8 ${selectedMood.borderColor}`
                : 'bg-white border-8 border-gray-300'
            } shadow-2xl`}
          >
            {/* Face emoji */}
            <div className="text-8xl md:text-9xl">
              {selectedMood ? selectedMood.emoji : '😀'}
            </div>
          </div>

          {/* Feedback text */}
          {selectedMood && (
            <div className="mt-6 text-center animate-bounce">
              <p className="text-2xl md:text-3xl font-bold text-gray-800 px-4">
                {selectedMood.feedback}
              </p>
            </div>
          )}
        </div>

        {/* Mood colour buttons */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8 px-4">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              className={`${mood.color} rounded-3xl p-6 md:p-8 shadow-lg transform transition-all duration-200 hover:scale-110 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400`}
              aria-label={`Select ${mood.name} mood`}
            >
              <div className="text-5xl md:text-6xl mb-2">{mood.emoji}</div>
              <div className="text-xl md:text-2xl font-bold text-white drop-shadow-lg">
                {mood.name}
              </div>
            </button>
          ))}
        </div>

        {/* Reset button */}
        {selectedMood && (
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="bg-purple-600 hover:bg-purple-700 text-white text-xl md:text-2xl font-bold py-4 px-8 rounded-full shadow-lg transform transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-4 focus:ring-purple-400"
            >
              🔄 Choose Again!
            </button>
          </div>
        )}
      </div>
    </div>
  );
}