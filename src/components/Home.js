import React from "react";
import "./Home.css" 
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";


import LogIn from "./auth/Login";
import SignUp from "./auth/Signup";
import Board from "./Board";
import { Logout } from '../api/games';

function Home({current_player,current}) {
   
    //console.log(current_player)
    return (
    <>
        
      <div className="home">
        <h1>Home</h1>
        <div className="login">
            <LogIn current_player={current_player} current={current} />
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
