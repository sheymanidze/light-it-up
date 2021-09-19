import React from 'react'

import './home.css'

//Material UI
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import Box from '@material-ui/core/Box';


//images
import logo from './img/logo.png'
import HomePageImage from './img/boo.PNG'

const Home = () => {
  return (
    <div className="homePage flex-center-column">

      <Box className="logoHome">
        <img className="logo" src={logo} alt="logo"></img>
      </Box>

      <Box className="gameWarning">
        <h2>DON'T let THE GHOST to GET YOU </h2>

      </Box>

      <Box>
        <img className="boo" src={HomePageImage} alt="Ghost"></img>
      </Box>






      <Link className="links" to="/game">
        <Button className="startBtn">
          Let's Start
        </Button>
      </Link>
      <h3 className="happyHal">happy halloween</h3>


    </div>
  )
}

export default Home
