import React from 'react';

export default function DarkThemeTest() {
  return (
    <div className="min-h-screen bg-game-bg p-8">
      <div className="space-y-4">
        <h1 className="text-game-text text-4xl font-bold">Dark Theme Test</h1>
        
        {/* Test if dark theme is applied */}
        <div className="bg-game-panel p-4 rounded-lg border border-game-border">
          <p className="text-game-text">This should be a game panel with game text</p>
          <p className="text-white">This should be white text</p>
        </div>
        
        {/* Test background color */}
        <div className="p-4 rounded-lg" style={{ backgroundColor: 'hsl(250 60% 15%)' }}>
          <p className="text-white">Direct HSL background test</p>
        </div>
        
        {/* Test if HTML has dark class */}
        <div className="p-4 rounded-lg bg-gray-800">
          <p className="text-white">Gray background test</p>
        </div>
        
        {/* Debug info */}
        <div className="bg-white p-4 rounded-lg text-black">
          <h3 className="font-bold">Debug Info:</h3>
          <p>HTML class: {document.documentElement.className}</p>
          <p>Body class: {document.body.className}</p>
        </div>
      </div>
    </div>
  );
}


