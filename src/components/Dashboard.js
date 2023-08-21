import React, { useEffect } from "react";
import CreateGame from "./CreateGame";
import "./Dashboard.css"

import Board from "./Board";
import { Route, Routes, useNavigate } from "react-router";
import Header from "./Header";

function Dashboard(){
    const navigate =useNavigate()
    const navigateToCreate=()=>{
        navigate("./create_game")
    };


    return(
        <>
    <Header></Header>
     <div className="DashBoard">
         <h1>Dashboard</h1>

         <button className="crear" onClick={navigateToCreate} >Crear Juego</button>
         
     </div>
     <Routes>
        <Route path="/create_game" Component={CreateGame} />
    </Routes>
     </>
     
     ) 
 }
 export default Dashboard;