import { useRef, useState } from 'react';
import './App.css';
import DuelCanvas from './Canvas/DuelCanvas';
import Controls from './Controls/Controls';

function App() {
  const radius = 60;
  const width = 1200;
  const height = 800;
  const player1Ref = useRef({
    x: radius * 1.1,
    y: radius * 1.1,
    radius: radius,
    speedY: 3,
    shootingFrequency: 1,
    bulletSpeed: 8,
    lastShot: 0,
    score: 0,
    spell: 'Fire',
    color: 'darkred'
  }); // keeps track of the position
  const player2Ref = useRef({
    x: width - radius * 1.1,
    y: radius * 1.1,
    radius: radius,
    speedY: 3,
    shootingFrequency: 0.1,
    bulletSpeed: 5,
    lastShot: 0,
    score: 0,
    spell: 'Water',
    color: 'purple'
  }); // keeps track of the position

  const spellColors = {
    'Fire': 'rgb(233, 85, 27)',
    'Water': 'rgb(80, 162, 255)',
    'Earth': 'rgb(109, 53, 0)',
    'Air': 'rgb(185, 178, 77)'
  };

  const [menuVisibility, setMenuVisibility] = useState({ controls1: false, controls2: false });
  const toggleMenu1 = () => {
    setMenuVisibility(prevState => ({
      ...prevState,
      controls1: !prevState.controls1
    }));
  };

  const toggleMenu2 = () => {
    setMenuVisibility(prevState => ({
      ...prevState,
      controls2: !prevState.controls2
    }));
  };

  return (
    <div className="app">
      <div className='controls-wrapper'>
        {menuVisibility.controls1 ? 
          <Controls
            toggleMenu={toggleMenu1}
            playerTarget={player1Ref}
            spellColors={spellColors}
          />
        : null}
      </div>
      <DuelCanvas
        players={{ player1Ref, player2Ref }}
        toggles={{ toggleMenu1, toggleMenu2 }}
        spellColors={spellColors}
        width={width}
        height={height}
      />
      <div className='controls-wrapper'>
        {menuVisibility.controls2 ? 
          <Controls
            toggleMenu={toggleMenu2}
            playerTarget={player2Ref}
            spellColors={spellColors}
          />
        : null}
      </div>
    </div>
  );
}

export default App;
