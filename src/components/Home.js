import React from "react";
import "./Home.css" 
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";


import LogIn from "./auth/Login";
import SignUp from "./auth/Signup";
import Board from "./Board";
import { Logout } from '../api/games';

function Home(current) {
   
    console.log(current)
    return (
    <>
        
      <div className="home">
        <h1>Home</h1>
        <div className="login">
            <LogIn />
        </div>
        <br />
        <div className="signup">
            <SignUp/>
        </div>
      </div>
    </>
  );
}
export default Home;
