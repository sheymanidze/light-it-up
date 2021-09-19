import React, { useRef, useEffect, useState } from 'react';

//Material UI components
import Box from '@material-ui/core/Box';

import './game.css'

import logo from '../Home/img/logo.png'

//sprites
import Player1 from './img/player1.png';

const Game = () => {

  //canvas
  const canvasRef = useRef(null)

  useEffect(() => {


    // setting up canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    //game
    let score = 0;
    let gameFrame = 0;
    ctx.font = '50px Georgia';
    let gameSpeed = 1;
    let gameOver = false;

    let canvasPosition = canvas.getBoundingClientRect();

    //mouse interactivity
    const mouse = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      click: false
    }

    canvas.addEventListener('mousedown', function (event) {
      mouse.click = true;
      mouse.x = event.x - canvasPosition.left;
      mouse.y = event.y - canvasPosition.top;
      console.log(mouse.x, mouse.y);
    });

    canvas.addEventListener('mouseup', function (event) {
      mouse.click = false;
    });

    //player
    const player1 = new Image();
    player1.src = Player1;

    class Player {
      constructor() {
        this.x = canvas.width / 2;
        this.y = canvas.height / 2;
        this.radius = 50;
        this.angle = 0;
        this.frameX = 0;
        this.FrameY = 0;
        this.frame = 0;
        this.spriteWidth = 256;
        this.spriteHeight = 128;


      }
      update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        //will recalculate the angle and the img always will be facing the mouse
        let theta = Math.atan2(dy, dx);
        this.angle = theta;
        if (mouse.x != this.x) {
          this.x -= dx / 20;
        }
        if (mouse.y != this.y) {
          this.y -= dy / 20;
        }
      }
      draw() {
        if (mouse.click) {
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.stroke();
        }

        ctx.save();
        //img not showing 
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);


        ctx.drawImage(player1, 0 - 50, 0 - 55, this.spriteWidth / 1.2, this.spriteHeight / 1.2);

        ctx.restore();

      }
    }
    const player = new Player();

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      requestAnimationFrame(animate);
    }

    animate();


  }, [])

  return (
    <div className="flex-center-column" id="game">
      <Box className="logoGame">
        <img className="logo" src={logo} alt="logo"></img>
      </Box>

      <Box className="borderBox">
        <canvas
          className="canvas1"
          id="canvas"
          ref={canvasRef}>
        </canvas>
      </Box>

    </div>
  )
}

export default Game
