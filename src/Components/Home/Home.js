import React, { useRef, useEffect } from 'react';

import './home.css'

//Material UI
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';
import { makeStyles } from '@material-ui/core/styles';


//images
import logo from './img/logo.png'
import HomePageImage from './img/boo.PNG'



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
      <Link className="links" to="/game">
        <Button className="startBtn" classes={{ root: classes.root, label: classes.label }}>
          Let's Start
        </Button>
      </Link>
      <h3 className="happyHal">happy halloween</h3>


    </div>
  )
}

export default Home
