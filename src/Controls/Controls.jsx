import { useEffect, useState } from 'react';
import './Controls.css'

const Controls = ({ toggleMenu, playerTarget, spellColors }) => {

    const [speed, setSpeed] = useState(Math.abs(playerTarget.current.speedY));
    const [delay, setDelay] = useState(playerTarget.current.shootingFrequency);
    const [spell, setSpell] = useState(playerTarget.current.spell);
    const handleSpellSelect = (event) => {
        const selectedSpell = event.target.value;
        setSpell(selectedSpell);
        playerTarget.current.spell = selectedSpell; 
      };
    const handleSpeedChange = (event) => {
        const newValue = Number(event.target.value);
        setSpeed(newValue);
        playerTarget.current.speedY = newValue;
        moveSlider(event);
    };
    const handleDelayChange = (event) => {
        const newValue = Number(event.target.value);
        setDelay(newValue);
        playerTarget.current.shootingFrequency = newValue;
        moveSlider(event);
    };
    const moveSlider = (event) => {
        const slider = event.target;
        const progress = (slider.value / slider.max) * 100;
        slider.style.background = `linear-gradient(to right, #f80 ${progress}%, #ccc ${progress}%)`;
    };
    
    useEffect(() => {
        const sliders = document.querySelectorAll('input[type="range"]');
        sliders.forEach(slider => {
            moveSlider({ target: slider });
        });
    }, []);
    return (
        <div className="controls">
            <select className="select-spell" value={spell} onChange={handleSpellSelect}>
                <option value="none" disabled>Select your spell</option>
                <option value="Fire">Fire</option>
                <option value="Water">Water</option>
                <option value="Earth">Earth</option>
                <option value="Air">Air</option>
            </select>
            <div>
                Movement Speed
                <input type="range" onInput={handleSpeedChange} className='speed-slider' min={0} max={10} value={speed} />
                <span className="speed-value">{speed}</span>
            </div>
            <div>
                Delay between shots
                <input type="range" onInput={handleDelayChange} className='delay-slider' min={0.1} max={2} value={delay} step={0.1}/>
                <span className="delay-value">{delay}</span>
            </div>
        </div>
    )
}

export default Controls