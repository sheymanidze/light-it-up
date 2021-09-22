import React, { useRef, useEffect } from 'react';

import './home.css'

//Material UI Components
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';


//images
import logo from './img/logo.png'
import HomePageImage from './img/boo.PNG'

//sprites
import AnimatedSprites from './img/animated_torch.png';




//Custom made button
const useStyles = makeStyles({
  root: {
    background: 'linear-gradient(45deg, yellow 30%, orange 90%)',
    borderRadius: 50,
    border: 0,
    color: 'white',
    fontSize: 40,
    width: 300,
    height: 90,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 255, 0, .3)',
    marginBottom: 25,

  },
  label: {
    textTransform: 'capitalize',
  },
});

const Home = () => {

  //button
  const classes = useStyles();

  //for canvas
  const canvasRef = useRef(null)

  //create canvas
  useEffect(() => {
    // setting up canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    //creating particles 

    //undefined since we need a blank canvas before starting to interact with it
    const mouse = {
      x: undefined,
      y: undefined,
    }

    const particlesArray = [];

    canvas.addEventListener('click', function (event) {
      event.preventDefault();
      mouse.x = event.x;
      mouse.y = event.y;
      for (let i = 0; i < 10; i++) {
        particlesArray.push(new Particle());
      }

    });

    canvas.addEventListener('mousemove', function (event) {
      mouse.x = event.x;
      mouse.y = event.y;
      //creates a trail of particles when mouse moves over canvas
      for (let i = 0; i < 5; i++) {
        particlesArray.push(new Particle());
      }
    });

    //each particles one circle
    class Particle {
      constructor() {
        this.x = mouse.x;
        this.y = mouse.y;
        this.size = Math.random() * 15 + 1;

        //creates a vector of movements direction and speed, making them to move in all directions

        //left-right
        this.speedX = Math.random() * 3 - 1.5;
        //up and down
        this.speedY = Math.random() * 3 - 1.5;
      }
      //creating the behavior for particles, movement to all directions
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        //making particles shrink as they move around,value can't go below 0 we will pass this.size with negative number to arc methos we will get an error, can't draw circle wit negative radius it will break the code
        if (this.size > 0.2) this.size -= 0.1;
      }
      //taking values from constructor and draw circle on canvas representimg the particle 
      draw() {
        ctx.fillStyle = 'yellow';
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 10;
        ctx.shadowColor = 'orange';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

      }
    }

    function handleParticles() {
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
        //removing shrinked particles, 1 element
        if (particlesArray[i].size <= 0.3) {
          particlesArray.splice(i, 1);
          //need to add -1, otherwise it will skip an element, that will lead to blinking particles
          i--;
        }
      }
    }
    function animate() {
      //clear old paint
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      handleParticles();

      requestAnimationFrame(animate);
    }

    animate();

    //animation for torch sprite
    const animatedSprite = new Image();
    animatedSprite.onload = loaded;
    animatedSprite.src = AnimatedSprites;
    let imageReady = false;
    const picWidth = 128;
    const picHeight = 482;
    let frameX = 0;
    let frameY = 0;
    //to slow down the animation
    let gameFrame = 0;
    //will slow down by 8
    const staggerFrames = 8;

    function loaded() {
      imageReady = true;
      displayPic();
    }

    function displayPic() {
      if (imageReady)
        ctx.clearRect(0, 0, canvas.wigth, canvas.height);

      ctx.drawImage(animatedSprite, frameX * picWidth, frameY, picWidth, picHeight, 80, 30, picWidth, picHeight);

      //it would be true every 8 frames slowing down animation 8 times
      if (gameFrame % staggerFrames === 0) {
        //current sprite has 6 frames but 1st frame is 0
        if (frameX < 5) frameX++;
        else frameX = 0;
      }
      //to slow down the animation
      gameFrame++;

      requestAnimationFrame(displayPic)
    }


    // adding for responsiveness
    window.addEventListener('resize', function () {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

    });

  }, [])


  return (
    <div className="homePage flex-center-column">

      <Box className="logoHome">
        <img className="logo" src={logo} alt="logo"></img>
      </Box>

      <Box className="gameWarning">
        <h2>DON'T let THE GHOST to GET YOU </h2>

      </Box>

      <Box>
        <img className="homePageImg" src={HomePageImage} alt="Ghost"></img>
      </Box>
      <canvas
        id="homeCanvas"
        ref={canvasRef}>
      </canvas>
      <Link data-testid="startBtn" className="links" to="/game">
        <Button data-testid="letsStart" className="startBtn" classes={{ root: classes.root, label: classes.label }}>
          Let's Start
        </Button>
      </Link>
      <h3 className="happyHal">happy halloween</h3>


    </div>
  )
}

export default Home
