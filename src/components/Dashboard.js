import React from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import CreateGame from './CreateGame';
import '../styles/components/Dashboard.css';
import Header from './Header';

function Dashboard({ current_player, setCurrent_player }) {
  const navigate = useNavigate();
  const navigateToCreate = () => {
    navigate('./create_game');
  };

  //console.log(current_player);
  return (
    <>
      <Header current_player={current_player} setCurrent_player={setCurrent_player} />
      <div className="DashBoard">
        <h1>Dashboard</h1>

        <button className="crear" onClick={navigateToCreate}>
          Crear Juego
        </button>
      </div>
      <Routes>
        <Route path="/create_game" Component={CreateGame} />
      </Routes>
    </>
  );
}
export default Dashboard;
