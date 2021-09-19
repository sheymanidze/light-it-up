import React, { useRef, useEffect, useState } from 'react';

//Material UI components
import Box from '@material-ui/core/Box';

import './game.css'

import logo from '../Home/img/logo.png'

const Game = () => {

  //canvas
  const canvasRef = useRef(null)

  useEffect(() => {


    // setting up canvas
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = 800;
    canvas.height = 500;
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
