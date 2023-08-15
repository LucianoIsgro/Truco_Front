import React, { useEffect, useState } from "react";
import axios from "axios";
import JoinGame from "./JoinGame";
//import {useNavigate} from "react-router";
import {useNavigate, redirect} from 'react-router-dom';

function CreateGame(){


  const navigate = useNavigate()
  const history = useNavigate()

  
    
    const [game,setGame]=useState({
        nombre: "",
        token: "",
      
    })

    const create_game = (event) => {
        
        axios.post("http://localhost:3001/games",{
    
            nombre: game.nombre,
            token: game.token,
          
        },
        {
          headers: {
            Accept: "*/*"
          },
          withCredentials: true
        }
            
        ).then(response => {
            console.log("Create Game", response);
            alert("El juego se creo ahora ingrese con la id")
           //navigate("/games/"+response.data.id , {state:{game: game}})
            //history(`/games/${response.data.id}`)
          }).catch(error =>{
            console.log("Create Game",error);
          }) 
        event.preventDefault();
    }


    return(
        <>
        <JoinGame/>
        <h1>Crear Juego</h1>
        <form onSubmit={create_game}>
        <div>
          <label htmlFor="NombreJuego">Nombre: </label>
          <input
            type="text"
            id="NombreJuego"
            name="NombreJuego"
            placeholder="requiered"
            required
            value={game.nombre}
            onChange={(event) => {
              setGame({...game, nombre: event.target.value});
            }}
          />
          </div>
          <br/>
          
          <div>
        <label htmlFor="TokenJuego">Token: </label>
        <input
          type="text"
          id="token"
          name="token"
          placeholder="requiered"
          required
          value={game.token}
          onChange={(event) => {
            setGame({...game,token: event.target.value});
          }}
        />
        </div>
        <button type="submit" value="Submit" >Crear</button>
        </form>
        
        
        </>


    )

}
export default CreateGame;