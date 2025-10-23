import React from 'react';

export default function CSSDebugTest() {
  return (
    <div className="min-h-screen bg-game-bg p-8">
      <div className="space-y-8">
        <h1 className="text-game-text text-4xl font-bold">CSS Debug Test</h1>
        
        {/* Test basic Tailwind classes */}
        <div className="bg-red-500 p-4 rounded-lg">
          <p className="text-white">Basic Tailwind Test - Red Background</p>
        </div>
        
        {/* Test custom game colors */}
        <div className="bg-game-panel p-4 rounded-lg border border-game-border">
          <p className="text-game-text">Game Panel Test</p>
        </div>
        
        {/* Test grid layout */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-blue-500 p-4 rounded text-white">Card 1</div>
          <div className="bg-green-500 p-4 rounded text-white">Card 2</div>
          <div className="bg-purple-500 p-4 rounded text-white">Card 3</div>
          <div className="bg-orange-500 p-4 rounded text-white">Card 4</div>
        </div>
        
        {/* Test GamePanel structure */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          <div className="w-full max-w-sm bg-gradient-to-b from-gray-700 via-gray-600 to-gray-700 rounded-3xl p-1 shadow-2xl">
            <div className="bg-gradient-to-br from-[#C17F5A] via-[#A06744] to-[#8B5A3C] rounded-2xl p-4">
              <div className="bg-green-500 text-white p-2 rounded mb-4 text-center font-bold">
                LIFE SKILLS
              </div>
              <div className="bg-amber-50 rounded p-4 text-center">
                <div className="w-16 h-16 bg-gray-400 rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-800 mb-4">Test description</p>
                <button className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  ▶ START
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


