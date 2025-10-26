import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteGame, getGame, getGamePlayers, DeletePlayerGame, StartGame } from '../api/games';
import '../styles/components/Game.css';

function Game({ current_player }) {
  const navigate = useNavigate();

  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);

  const playersIntervalRef = useRef();
  const navigationIntervalRef = useRef();
  const gameIntervalRef = useRef();

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    show_game(id);
    show_players(id);
    startWaiting();
    startWaiting2();
    startWaiting3();

    return () => {
      clearIntervals();
      clearIntervals2();
      clearIntervals3();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //hacer la validacion no es necesario, solo conviene cuando escala mucho

  const show_game = async (id) => {
    if (!id) {
      return;
    }

    const res = await getGame(id);
    if (res?.error) {
      console.log('NO');
      return;
    }

    setGame(res);
  };
  const show_players = async (id) => {
    if (!id) {
      return;
    }

    const res = await getGamePlayers(id);
    if (res?.error) {
      console.log('NO');
      return;
    }
    setPlayers(res);
  };

  async function handleBoton() {
    const res = await StartGame(id);
    if (res?.error) {
      console.log('NO');
      return;
    }

    navigate(`/games/${id}/board`, { state: { game } });
  }

  async function deleteGame() {
    const res = await DeleteGame(id);
    if (res?.error) {
      console.log('NO');
      return;
    }

    navigate('/dashboard');
  }

  async function leaveRoom() {
    const res = await DeletePlayerGame(id);
    if (res?.error) {
      console.log('NO');
      return;
    }

    navigate('/dashboard');
  }
  function GoToBoard() {
    if (game?.estado === 'en_curso') {
      navigate(`/games/${id}/board`);
    }
  }

  function startWaiting() {
    clearIntervals();
    playersIntervalRef.current = setInterval(() => show_players(id), 1000);
  }
  function startWaiting2() {
    clearIntervals2();
    navigationIntervalRef.current = setInterval(() => GoToBoard(), 1000);
  }
  function startWaiting3() {
    clearIntervals3();
    gameIntervalRef.current = setInterval(() => show_game(id), 1000);
  }

  function clearIntervals() {
    if (playersIntervalRef.current) {
      clearInterval(playersIntervalRef.current);
      playersIntervalRef.current = undefined;
    }
  }

  function clearIntervals2() {
    if (navigationIntervalRef.current) {
      clearInterval(navigationIntervalRef.current);
      navigationIntervalRef.current = undefined;
    }
  }
  function clearIntervals3() {
    if (gameIntervalRef.current) {
      clearInterval(gameIntervalRef.current);
      gameIntervalRef.current = undefined;
    }
  }

  return (
    <>
      <br />
      <div className="room">
        <h1>{game?.id}</h1>
        <h1>{game?.nombre}</h1>
        <h2>Juego: {game?.estado}</h2>
        <h2>Admin: {players[0]?.username}</h2>

        <h2 className="players">Players:</h2>

        {players?.map((player) => (
          <p key={player?.id}>{player?.username}</p>
        ))}

        {current_player?.id === game?.player_id ? (
          <>
            <button onClick={handleBoton}>Empezar Juego</button>
            <button onClick={deleteGame}>Cancelar Juego</button>
          </>
        ) : (
          <>
            <p>Esperando a que el admin empiece la partida</p>
            <button onClick={leaveRoom}> Salirse de la Sala </button>
          </>
        )}
      </div>
    </>
  );
}
export default Game;
