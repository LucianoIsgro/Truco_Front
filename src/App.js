
import './App.css';
import { BrowserRouter,Routes,Route, useNavigate } from 'react-router-dom';




import Home from "./components/Home"
import Dashboard from './components/Dashboard';
import CreateGame from './components/CreateGame';
import Game from './components/Game';
import Board from './components/Board';
import Header from './components/Header';
import { GetCurrentPlayer } from './api/games';


function App() {

 
  
  return (
    <>
    <BrowserRouter>
    
    <Routes>
    
    <Route path={"/"} Component={Home} />
    <Route path={"/dashboard/*"} Component={Dashboard}/>
    <Route path={"games/:id"} Component={Game}/>
    <Route path={"games/:id/board"} Component={Board}/>
    
    </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
