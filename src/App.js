import './styles/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';

import Home from './components/Home';
import Dashboard from './components/Dashboard';
import Game from './components/Game';
import Board from './components/Board';
import { GetCurrentPlayer } from './api/games';

function App() {
  const storedPlayer = sessionStorage.getItem('current_player');
  const initialPlayer = storedPlayer ? JSON.parse(storedPlayer) : null;

  const [currentPlayer, setCurrentPlayer] = useState(initialPlayer);

  const fetchCurrentPlayer = useCallback(async () => {
    const res = await GetCurrentPlayer();
    if (res) {
      setCurrentPlayer(res);
    }
  }, []);

  useEffect(() => {
    if (!currentPlayer) {
      fetchCurrentPlayer();
    }
  }, [currentPlayer, fetchCurrentPlayer]);

  useEffect(() => {
    if (currentPlayer) {
      sessionStorage.setItem('current_player', JSON.stringify(currentPlayer));
    } else {
      sessionStorage.removeItem('current_player');
    }
  }, [currentPlayer]);

  console.log(currentPlayer);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route
            path={'/'}
            element={
              <Home
                current_player={currentPlayer}
                current={fetchCurrentPlayer}
                setCurrent_player={setCurrentPlayer}
              />
            }
          />
          <Route
            path={'/dashboard/*'}
            element={
              <Dashboard current_player={currentPlayer} setCurrent_player={setCurrentPlayer} />
            }
          />
          <Route path={'games/:id'} element={<Game current_player={currentPlayer} />} />
          <Route path={'games/:id/board'} element={<Board current_player={currentPlayer} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
