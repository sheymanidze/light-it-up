import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

//Material UI components
import Box from '@material-ui/core/Box';
import { Fab } from '@material-ui/core';


import './game.css';


//img
import logo from '../Home/img/logo.png';
import Background from './img/background.png';

//sprites
import Player1 from './img/player1.png';
import AimsforPoints from './img/aims_for_points.png';
//animated sprites
import Obstacles from './img/obstacles.png';

//Audio
import HitSound from './sounds/hit_sound.ogg';
import BackgroundMusic from './sounds/background_music.mp3';
import Obstacle1Sound from './sounds/obstacle1_sound.ogg'

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

    //background audio
    const backgroundMusic = document.createElement('audio');
    backgroundMusic.src = BackgroundMusic;
    backgroundMusic.play()

    //background img
    const background = new Image();
    background.src = Background;
    const BG = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    };
    function handleBackground() {
      ctx.drawImage(background, BG.x, BG.y, BG.width, BG.height);
    };

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


    //Pumpkins
    const aimsArray = [];
    const aimsImage = new Image();
    aimsImage.src = AimsforPoints;

    class Aims {
      constructor() {
        this.x = Math.random() * canvas.width;
        //need to add 100 to hide pumpkins on the bottom
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        this.distance = 0;
        this.counted = false;
        this.sound = 'sound';
      }
      update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);
      }

      draw() {
        ctx.drawImage(aimsImage, this.x - 50, this.y - 60, this.radius * 2, this.radius * 2);

      }
    }

    const aimsHit = document.createElement('audio');
    aimsHit.src = HitSound;

    function handleAims() {
      if (gameFrame % 50 == 0) {
        aimsArray.push(new Aims());
      }

      //get rid off blinking
      for (let i = 0; i < aimsArray.length; i++) {
        aimsArray[i].update();
        aimsArray[i].draw();
        if (aimsArray[i].y < 0 - aimsArray[i].radius * 2) {
          aimsArray.splice(i, 1);
          i--;
        } else if (aimsArray[i]) {
          if (aimsArray[i].distance < aimsArray[i].radius + player.radius) {
            if (!aimsArray[i].counted) {
              if (aimsArray[i].sound == 'sound') {
                aimsHit.play();
              }
              score++;
              aimsArray[i].counted = true;
              aimsArray.splice(i, 1);
              i--;

            }

          }

        }

      }
      for (let i = 0; i < aimsArray.length; i++) {

      }
    }

    //Obstacles
    const obstaclesImage = new Image();
    obstaclesImage.src = Obstacles;

    class Obstacle {
      constructor() {
        this.x = canvas.width + 300;
        this.y = Math.random() * (canvas.height - 150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 1087;
        this.spriteHeight = 995;
      }
      draw() {
        ctx.drawImage(obstaclesImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 70, this.y - 70, this.spriteWidth / 8, this.spriteHeight / 8);

      }
      update() {
        this.x -= this.speed;
        if (this.x < 0 - this.radius * 2) {
          this.x = canvas.width + 200;
          this.y = Math.random() * (canvas.height - 150) + 90;
          this.speed = Math.random() * 2 + 2;
        }
        if (gameFrame % 5 == 0) {
          this.frame++;
          if (this.frame >= 12) this.frame = 0;
          if (this.frame == 3 || this.frame == 7 || this.frame || 11) {
            this.frameX = 0;
          } else {
            this.frame++;
          }
          if (this.frame < 3) this.frameY = 0;
          else if (this.frame < 7) this.frameY = 1;
          else if (this.frame < 11) this.frameY = 2;
          else this.frameY = 0;
        }

        //collision detection
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radius) {

          handleGameOver();
        }


      }
    }

    const obstacle1 = new Obstacle();

    function handleObstacle() {
      obstacle1.draw();
      obstacle1.update();
    }

    const obstacle1Sound = document.createElement('audio');
    obstacle1Sound.src = Obstacle1Sound;

    function handleGameOver() {
      ctx.fillStyle = 'white';
      ctx.shadowBlur = 4;
      ctx.fillText('GOT YOU', 280, 100);
      ctx.fillStyle = '#d32f2f';
      ctx.fillText('Your score is ...' + score, 240, 450);
      gameOver = true;
      obstacle1Sound.play();
      backgroundMusic.src = "";
    }





    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleBackground();
      handleAims();
      player.update();
      player.draw();
      handleObstacle();
      ctx.fillStyle = 'yellow';
      ctx.fillText('score: ' + score, 10, 50);
      gameFrame++;
      if (!gameOver) requestAnimationFrame(animate);

    }

    animate();


    //keeps game same size
    window.addEventListener('resize', function () {
      canvasPosition = canvas.getBoundingClientRect();
    });


  }, [])

  return (
    <div className="flex-center-column" id="game">
      <Box className="logoGame">
        <img className="logo" src={logo} alt="logo"></img>
      </Box>
      <Box className="flex-center-column" sx={{ m: "3rem" }}>
        <Link className="links" to="/game">
          <Fab variant="extended"> Restart
          </Fab>
        </Link>
        <Link className="links" to="/">
          <Fab variant="extended" > Home
          </Fab>
        </Link>
        <Fab variant="extended" id="screenshot"> Screenshot
        </Fab>
      </Box>
      <Box className="borderBox">
        <canvas
          className="canvas1"
          id="canvas"
          ref={canvasRef}>
        </canvas>
      </Box>
      <Box className="flex-center-column allButtons" sx={{ m: "3rem" }}>
        <Link className="links" to="/game">
          <Fab variant="extended" > Restart
          </Fab>
        </Link>
        <Link className="links" to="/">
          <Fab variant="extended" > Home
          </Fab>
        </Link>
        <Fab variant="extended" id="screenshot" > Screenshot
        </Fab>
      </Box>
    </div>
  )
}

export default Game
