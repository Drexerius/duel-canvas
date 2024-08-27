import React, { useRef, useEffect, useState } from 'react';
import './DuelCanvas.css';

const DuelCanvas = ({ players: { player1Ref, player2Ref }, toggles: { toggleMenu1, toggleMenu2 }, spellColors, height, width }) => {
  const canvasRef = useRef(null);
  const requestRef = useRef(null);
  const mouseRef = useRef({ x: 0, y: 0 }); //cursor position
  const [isStarted, setIsStarted] = useState(false);


  useEffect(() => {
    if (!isStarted) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    let lastTime = 1; // time of last frame
    let fps = 0; //
    let seconds = 0;

    const player1Bullets = [];
    const player2Bullets = [];

    const draw = (currentTime) => {
        context.clearRect(0, 0, canvas.width, canvas.height); //clear the canvas
        
        //get fps and seconds
        const deltaTime = (currentTime - lastTime) / 1000; // convert to seconds
        lastTime = currentTime;
        fps = Math.round(1 / deltaTime);
        seconds = Math.round(currentTime / 1000);
        context.font = "16px Arial";
        context.fillStyle = "black";
        context.fillText(`FPS: ${fps}`, 40, 20);
        context.fillText(`Time: ${seconds} seconds`, 80, canvas.height-10);
        
        managePlayer(player1Ref, player1Bullets, currentTime)
        managePlayer(player2Ref, player2Bullets, currentTime)
        

        const blockWidth = 200;
        const blockHeight = 50;
        const blockX = (canvas.width - blockWidth) / 2;
        const blockY = 10;
  
        // block
        context.fillStyle = 'rgba(0, 0, 0, 0.6)'; // Semi-transparent background
        context.fillRect(blockX, blockY, blockWidth, blockHeight);
        // separating line 
        context.beginPath();
        context.moveTo(blockX + blockWidth/2, blockY);
        context.lineTo(blockX + blockWidth/2, blockY + blockHeight);
        context.strokeStyle = 'white';
        context.stroke();
        // player 1 score
        context.fillStyle = 'white';
        context.font = '24px Arial';
        context.textAlign = 'center';
        context.fillText(`${player1Ref.current.score}`, blockX + blockWidth / 4, blockY + 32);  
        // player 2 score
        context.fillText(`${player2Ref.current.score}`, blockX + (3 * blockWidth) / 4, blockY + 32);

        requestRef.current = requestAnimationFrame(draw); // request the next frame
    };
    
    const managePlayer = (playerRef, bullets, currentTime) => {
          //shoot
          if (currentTime - playerRef.current.lastShot > playerRef.current.shootingFrequency * 1000) {
            playerRef.current.lastShot = currentTime
            bullets.push({
              x: playerRef.current.x,
              y: playerRef.current.y,
              radius: 8,
              speed: playerRef.current.bulletSpeed,
              direction: playerRef === player1Ref ? 1 : -1, // Direction based on player
              target: playerRef === player1Ref ? player2Ref : player1Ref
            });
        }
        //move the bullets
        bullets.forEach((bullet, i) => {
            bullet.x += bullet.speed * bullet.direction;
            context.beginPath();
            context.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
            const spell = playerRef.current.spell
            context.fillStyle = spellColors[spell];
            context.fill();

            if (checkCollision(bullet, bullet.target, bullet.radius)) {
                bullets.splice(i, 1);
                playerRef.current.score += 1;
            } else if (bullet.x < 0 || bullet.x > canvas.width) {
                bullets.splice(i, 1);
            }
        });

        //draw the player
        context.beginPath();
        context.arc(
            playerRef.current.x,
            playerRef.current.y,
            playerRef.current.radius,
            0,
            2 * Math.PI
        );
        context.fillStyle = playerRef.current.color;
        context.fill();

        //check for mouse
        if (checkCollision(mouseRef.current, playerRef, 3) && playerRef.current.y < mouseRef.current.y) {
          playerRef.current.speedY = -Math.abs(playerRef.current.speedY); //speed to move up
        } else if (checkCollision(mouseRef.current, playerRef, 3) && playerRef.current.y > mouseRef.current.y) {
          playerRef.current.speedY = Math.abs(playerRef.current.speedY); //speed to move down
        }

        //check for boundaries
        if (playerRef.current.y > canvas.height - playerRef.current.radius) {
          playerRef.current.speedY = -Math.abs(playerRef.current.speedY); //speed to move up
        } else if (playerRef.current.y < playerRef.current.radius) {
          playerRef.current.speedY = Math.abs(playerRef.current.speedY); //speed to move down
        }

        //move the player
        playerRef.current.y += playerRef.current.speedY;
    };
    requestRef.current = requestAnimationFrame(draw); //start the animation

    const checkCollision = (bullet, playerRef, tolerance = 0) => {
        const dx = bullet.x - playerRef.current.x;
        const dy = bullet.y - playerRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (tolerance >= 10) {
          console.log(distance)
        }
        return distance < playerRef.current.radius + tolerance;
    };

    const updateMousePosition = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;
    };

    const checkMouseClick = (event) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = event.clientX - rect.left;
      mouseRef.current.y = event.clientY - rect.top;

      if (checkCollision(mouseRef.current, player1Ref, 40)) {
        toggleMenu1();
      } else if (checkCollision(mouseRef.current, player2Ref, 40)) {
        toggleMenu2();
      }
    }

    canvas.addEventListener("mousemove", updateMousePosition);
    canvas.addEventListener("click", checkMouseClick);
    return () => {
      cancelAnimationFrame(requestRef.current);
      canvas.removeEventListener("mousemove", updateMousePosition);
      canvas.removeEventListener("click", checkMouseClick);
    };
  }, [isStarted, player1Ref, player2Ref, spellColors, toggleMenu1, toggleMenu2]);

  return (
    <div className="wrapper">
      {!isStarted && (
        <div className="start-menu">
          <h1>Duel</h1>
          <div className='playButton' onClick={() =>setIsStarted(true)}>
            Play
          </div>
          <p>Tip: Click on the player to open control menu</p>
        </div>
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="duel-canvas"
        style={{ display: isStarted ? 'block' : 'none' }}
      ></canvas>
    </div>
  );
};

export default DuelCanvas;