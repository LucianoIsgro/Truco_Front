
import './App.css';
import { BrowserRouter,Routes,Route, useNavigate } from 'react-router-dom';




import Home from "./components/Home"
import Dashboard from './components/Dashboard';
import CreateGame from './components/CreateGame';
import Game from './components/Game';
import Board from './components/Board';
import Header from './components/Header';
import { GetCurrentPlayer } from './api/games';
import {useState,useEffect} from "react";
function App() {

 const [current_player, setCurrent_player] = useState(null);
    
  useEffect(()=>{
     
     !current_player && current();
      
    },[current_player])

 console.log(current_player);
 const current= async ()=>{
    const res = await GetCurrentPlayer()
	 //if(res.error){
        //console.log("NO");
        //return;
	 //}
	 if(res==null){
	return;
	 }else{
     setCurrent_player(res);
	 }

 }
  return (
    <>
    <BrowserRouter>
    
    
    <Routes>

    <Route path={"/"} element={<Home current_player={current_player} />}/>
    <Route path={"/dashboard/*"} element={<Dashboard current_player={current_player}/>}/>
    <Route path={"games/:id"} element={<Game current_player={current_player} current={current} />}/>
    <Route path={"games/:id/board"} element={<Board current_player={current_player} current={current}/>}/>
    
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
