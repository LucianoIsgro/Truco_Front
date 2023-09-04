import  {useState,useEffect} from "react";
import { useLocation, useNavigate, useParams } from "react-router";
import axios from "axios";
import {DeleteGame, GetCurrentPlayer, getGame} from "../api/games";
import {getGamePlayers,DeletePlayerGame} from "../api/games";
import {StartGame} from "../api/games";


import "./Game.css"

function Game({current_player,current}){

    const navigate = useNavigate();
    const location = useLocation()
    
    const {id} = useParams();
   
    //console.log( location.state.game);
    const [game,setGame] = useState(null);
    const [players,setPlayers] = useState([])

    let interv;

    useEffect(()=>{
        !game && show_game(id);
        //!current_player && current();
         startWaiting();
        return () => {
            clearIntervals()
        }
        
        //show_players(id);
    },[players])

//hacer la validacion no es necesario, solo conviene cuando escala mucho

    const show_game = async (id) => {
        const res = await getGame(id)  
        if (res.error) {
            console.log("NO");
            return;
        }

        setGame(res);
    
    }
    const show_players = async (id) => {
        const res = await getGamePlayers(id)
        if(res.error){
            console.log("NO");
            return;
        }
        setPlayers(res);

    }

    function handleBoton(){
    const res =  StartGame(id)
        if(res.error){
            console.log("NO");
            return;
        }
        console.log("empezo");
        

        navigate("/games/"+id+"/board",{state:{game: game}});

    }

    function deleteGame(){
        const res = DeleteGame(id)
        if (res.error){
            console.log("NO");
            return;
        }

        console.log("se cancelo el juego");
        navigate("/dashboard")

    }

    function SalirSala(){
        const res =  DeletePlayerGame(id)
        if (res.error){
            console.log("NO");
            return;
        }

        console.log("Me fui");
        navigate("/dashboard")
    }



    //console.log(players);

    function startWaiting(){
        clearIntervals()
        const tmp = setInterval(
            ()=> show_players(id),
             1000
        )
        interv= tmp
    }

   function clearIntervals(){
    clearInterval(interv)
    interv=undefined
   }
   
  

     
   
    //console.log(current_player)


    return(
        
        <>
        <br/>
        <div className="room">
        <h1>{game?.id}</h1>  
        <h1>{game?.nombre}</h1>
        <h2>Juego: {game?.estado}</h2>
        <h2>Admin: {players[0]?.username}</h2>
    
       <h2 className="players">Players:</h2>
       
        {
            players?.map(player=>
                <p key={player?.id}>
                    {player?.username}
                </p>
                )
        }
        
        {
            current_player?.id == game?.player_id ? 
            <>
            <button onClick={handleBoton}>Empezar Juego</button>
            <button onClick={deleteGame}>Cancelar Juego</button>
            </>
            :
            <>
            <p>Esperando a que el admin empiece la partida</p>
            <button onClick={SalirSala}> Salirse de la Sala </button>
            </>
        }
       
       
        </div>
        
        </>


    )



}
export default Game;
