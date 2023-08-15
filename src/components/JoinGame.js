import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";


function JoinGame(){

const navigate = useNavigate()

const [game_id,setGame_id]=useState("")

const join_game = (event) => {
        
    axios.post("http://localhost:3001/player_games",{

        game_id: game_id,
      
    },
    {
      headers: {
        Accept: "*/*"
      },
      withCredentials: true
    }
        
    ).then(response => {
        console.log("Join", response); 
        navigate("/games/"+ game_id)
        
      }).catch(error =>{
        console.log("Join",error);
      }) 
    event.preventDefault();
}


    return(
        <>
         <h1>Unirse a Juego</h1>
            <form onSubmit={join_game}>
         <div>
          <label htmlFor="Token_para_jugar">Token: </label>
          <input
            type="text"
            id="TokenJuego"
            name="TokenJuego"
            placeholder="requiered"
            required
            value={game_id}
            onChange={(event) => {
              setGame_id(event.target.value);
            }}
          />
          </div>
          <button type="submit" value="Submit" >Unirse</button>
          </form>
        

        </>  
    )

}
export default JoinGame;