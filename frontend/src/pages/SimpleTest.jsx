import React from 'react';

export default function SimpleTest() {
  return (
    <div className="min-h-screen bg-game-bg flex items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-game-text text-4xl font-bold mb-4">Test Dashboard</h1>
        <div className="bg-game-panel p-6 rounded-xl border border-game-border">
          <p className="text-game-text">This is a test panel with game styling</p>
        </div>
      </div>
    </div>
  );
}

