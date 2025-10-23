import React from 'react';

export default function ColorTest() {
  return (
    <div className="min-h-screen bg-game-bg p-8">
      <div className="space-y-4">
        <h1 className="text-game-text text-4xl font-bold">Color Test</h1>
        <div className="bg-game-panel p-4 rounded-lg border border-game-border">
          <p className="text-game-text">This should be a game panel with game text</p>
        </div>
        <div className="bg-game-panel-light p-4 rounded-lg">
          <p className="text-game-text">This should be a light game panel</p>
        </div>
        <div className="bg-module-green p-4 rounded-lg text-white">
          <p>This should be green module color</p>
        </div>
        <div className="bg-module-blue p-4 rounded-lg text-white">
          <p>This should be blue module color</p>
        </div>
        <div className="bg-module-purple p-4 rounded-lg text-white">
          <p>This should be purple module color</p>
        </div>
        <div className="bg-module-orange p-4 rounded-lg text-white">
          <p>This should be orange module color</p>
        </div>
      </div>
    </div>
  );
}


