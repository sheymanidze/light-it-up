import React, { useRef, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';

import './game.css'

//Material UI components
import Box from '@material-ui/core/Box';
import { Fab } from '@material-ui/core';
import { Slider } from '@material-ui/core';
import { VolumeDown } from '@mui/icons-material';
import { VolumeUp } from '@mui/icons-material';

//Img
import logo from '../Home/img/logo.png';
import Background from './img/background.png';

//Sprites
import Player1 from './img/player1.png';
import AimsforPoints from './img/aims_for_points.png';
//Animated sprites
import Obstacles from './img/obstacles.png';


//Audio
import HitSound from './sounds/hit_sound.ogg';
import BackgroundMusic from './sounds/background_music.mp3';
import Obstacle1Sound from './sounds/obstacle1_sound.ogg';



const Game = () => {

  //grabbing HTML elements from the DOM
  const canvasRef = useRef(null)

  //Audio
  const backgroundMusic = document.createElement('audio');
  backgroundMusic.src = BackgroundMusic;
  const obstacle1Sound = document.createElement('audio');
  obstacle1Sound.src = Obstacle1Sound;
  const hitSound = document.createElement('audio');
  hitSound.src = HitSound;

  //link to home page
  let history = useHistory();

  //Canvas produces "side effects". the way to introduce side effects into components through useEffect
  useEffect(() => {

    // setting up canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;

    let score = 0;
    let gameFrame = 0;
    ctx.font = '50px Georgia';
    let gameOver = false;

    //will measure current size and position of canvas element instaed of measure browser size
    let canvasPosition = canvas.getBoundingClientRect();


    //mouse interactivity
    const mouse = {
      x: canvas.width / 2,
      y: canvas.height / 2,
      click: false
    }

    canvas.addEventListener('mousedown', function (event) {
      mouse.click = true;
      //offsetting mouse position based on canvasPosition
      mouse.x = event.x - canvasPosition.left;
      mouse.y = event.y - canvasPosition.top;
    });

    canvas.addEventListener('mouseup', function (event) {
      mouse.click = false;
    });


    //background music
    backgroundMusic.play();


    //player

    const player1 = new Image();
    player1.src = Player1;


    class Player {
      constructor() {
        //user starts in the middle
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
      //updates player position to move the player towards the mouse
      update() {
        //d=distance
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;

        //theta counterclockwise angle between x-axis and any point. It will recalculate the angle and the img always will be facing the mouse
        let theta = Math.atan2(dy, dx);
        this.angle = theta;

        //dont need else statement since we want both of them to run at the same time. 
        // /20 to slow down player to move to mouse position, so we can actually see player on the screen
        if (mouse.x !== this.x) {
          this.x -= dx / 20;
        }
        if (mouse.y !== this.y) {
          this.y -= dy / 20;
        }
      }
      draw() {

        //saves current canvas settings
        ctx.save();
        //to move rotation center point where th player currently is
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        ctx.drawImage(player1, 0 - 50, 0 - 55, this.spriteWidth / 1.2, this.spriteHeight / 1.2);

        //resetting all translate cores to how they were
        ctx.restore();


      }
    }

    const player = new Player();


    //Pumpkins/aims for points
    const aimsArray = [];
    const aimsImage = new Image();
    aimsImage.src = AimsforPoints;
    class Aim {
      constructor() {
        this.x = Math.random() * canvas.width;
        //need to add 100 to hide pumpkins on the bottom
        this.y = canvas.height + 100;
        this.radius = 50;
        this.speed = Math.random() * 5 + 1;
        //keep track of distance, triggers score and burn the pumpkins
        this.distance = 0;
        this.counted = false;
        this.sound = 'sound';
      }
      //moves pumpkins up in negative direction on vertical y axis dpending on individual speed value. Every pumpkin will rize at a slightly different speed
      update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        //to calculate actual distance
        this.distance = Math.sqrt(dx * dx + dy * dy);
      }

      draw() {
        ctx.drawImage(aimsImage, this.x - 50, this.y - 60, this.radius * 2, this.radius * 2);

      }
    }

    function handleAims() {
      //if game frame vlue is divisible by 50 with 0 reminder, will be true at 50, 100, 150..
      if (gameFrame % 50 === 0) {
        aimsArray.push(new Aim());
      }

      //get rid off blinking
      for (let i = 0; i < aimsArray.length; i++) {
        aimsArray[i].update();
        aimsArray[i].draw();
        //stop aimsArray to grow endlessly. 0-aimsArray[i].radius*2 added so pumpkins dont disappear to early before fully disapear on the top of canvas. Cheks if pumpkin has disappear over the top
        if (aimsArray[i].y < 0 - aimsArray[i].radius * 2) {
          //if so remove the pumpkin
          aimsArray.splice(i, 1);
          i--;
        } else if (aimsArray[i]) {
          //checking distance by calculating 2 points of canvas 1st centre point of the circle for aims and the secons id centre point fo rthe circle for player
          if (aimsArray[i].distance < aimsArray[i].radius + player.radius) {

            if (!aimsArray[i].counted) {
              if (aimsArray[i].sound === 'sound') {
                hitSound.play();
              }
              score++;
              aimsArray[i].counted = true;
              //remove the pumpkin
              aimsArray.splice(i, 1);
              //-1 correcting index value for the missing pumpkins that were just removed from the array
              i--;

            }
          }
        }
      }
    }

    //Background
    const background = new Image();
    background.src = Background;

    const BG = {
      x: 0,
      y: 0,
      width: canvas.width,
      height: canvas.height
    }

    function handleBackground() {
      ctx.drawImage(background, BG.x, BG.y, BG.width, BG.height);

    }

    //Obstacles
    const obstaclesImage = new Image();
    obstaclesImage.src = Obstacles;

    class Obstacle {
      constructor() {
        //+300 gives couple sec for player to escape
        this.x = canvas.width + 300;
        //stop obstacle to appear to high or too low on the canvas
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
        //resseting. Once disappear on the left edge, ressets at the right again
        if (this.x < 0 - this.radius * 2) {
          this.x = canvas.width + 300;
          this.y = Math.random() * (canvas.height - 150) + 90;
          this.speed = Math.random() * 2 + 2;
        }
        //true every 5 frames
        if (gameFrame % 5 === 0) {
          this.frame++;
          //cycling through frames horizontaly
          if (this.frame >= 12) this.frame = 0;
          if (this.frame === 3 || this.frame === 7 || this.frame || 11) {
            this.frameX = 0;
          } else {
            this.frame++;
          }
          //evaluating statements in particular order, 0 for the first raw, 1 for the sec and 2 for the 3rd one
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

    function handleEnemies() {
      obstacle1.draw();
      obstacle1.update();
    }




    function handleGameOver() {
      ctx.fillStyle = 'white';
      ctx.fillText('GOT YOU', 280, 100);
      ctx.fillStyle = '#d32f2f';
      ctx.fillText('Your score is ...' + score, 240, 450);
      gameOver = true;
      obstacle1Sound.play();
      backgroundMusic.src = "";
    }

    // Animation Loop
    function animate() {
      //clear old paint
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleBackground();
      handleAims();
      player.update();
      player.draw();
      handleEnemies();
      ctx.fillStyle = 'yellow';
      ctx.fillText('score: ' + score, 10, 50);
      gameFrame++;
      if (!gameOver) requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', function () {
      //measures a position of canvas from the edges of browser window, distance of canvas from the top and left edge
      canvasPosition = canvas.getBoundingClientRect();
    });

    //screenshot
    const elem = document.querySelector('#screenshot');
    elem.addEventListener('click', () => {
      canvas.toBlob((blob) => {
        saveBlob(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
      });
    });

    const saveBlob = (function () {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      return function saveData(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
      };
    }());

    const element = document.querySelector('#screenshot2');
    element.addEventListener('click', () => {
      canvas.toBlob((blob) => {
        saveBlob2(blob, `screencapture-${canvas.width}x${canvas.height}.png`);
      });
    });

    const saveBlob2 = (function () {
      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      return function saveData(blob, fileName) {
        const url = window.URL.createObjectURL(blob);
        a.href = url;
        a.download = fileName;
        a.click();
      };
    }());

  }, [backgroundMusic, hitSound, obstacle1Sound])


  function refreshPage() {
    window.location.reload(false);
  }

  function navigateToHomePage() {
    backgroundMusic.src = '';
    obstacle1Sound.src = '';
    hitSound.src = '';

    history.push('/'); // navigate to home
  }


  function rules() {
    alert("1. Burn all pumpkins and recieve points. 2. Try to avoid the ghost or game will be over. 3. Happy Halloween 👻")
  }

  return (
    <div className="flex-center-column" id="game">
      <Box className="logoGame">
        <img className="logoGame" src={logo} alt="logo"></img>
      </Box>
      <div id="innerContainer">
        <Box className="flex-center-column" sx={{ m: "3rem" }}>
          <Link className="links firstRestart" to="/game">
            <Fab data-testid="testRestart" variant="extended" onClick={refreshPage}> Restart
            </Fab>
          </Link>
          <Box className="firstHome">
            <Fab variant="extended" onClick={() => navigateToHomePage()}> Home
            </Fab>
          </Box>
          <Box>
            <Fab variant="extended" id="screenshot" > Screenshot
            </Fab>
          </Box>
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
            <Fab variant="extended" onClick={refreshPage}> Restart
            </Fab>
          </Link>
          <Fab variant="extended" onClick={() => navigateToHomePage()}> Home
          </Fab>
          <Box>
            <Fab variant="extended" id="screenshot2" > Screenshot
            </Fab>
          </Box>
          <Fab variant="extended" onClick={rules}> Game Rules
          </Fab>
        </Box>
      </div>
      <Box className="musicControl">
        <h4>Music</h4>
        <VolumeDown />
        <Slider aria-label="Volume" />
        <VolumeUp />
        <h4 className="soundEff">Sound Effects</h4>
        <VolumeDown />
        <Slider aria-label="Volume" />
        <VolumeUp />
      </Box>
    </div >
  )
}

export default Game
