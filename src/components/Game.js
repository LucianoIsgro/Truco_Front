import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { DeleteGame, getGame, getGamePlayers, DeletePlayerGame, StartGame } from '../api/games';
import '../styles/components/Game.css';

// Event-driven polling constants for room view
const INITIAL_POLL_INTERVAL = 2000; // Longer for room view (less frequent changes)
const MAX_POLL_INTERVAL = 15000;
const BACKOFF_MULTIPLIER = 1.5;

function Game({ current_player }) {
  const navigate = useNavigate();

  const { id } = useParams();

  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);

  // Single polling interval with exponential backoff
  const pollRef = useRef(null);
  const pollDelayRef = useRef(INITIAL_POLL_INTERVAL);
  const noChangeCountRef = useRef(0);
  const lastGameStateRef = useRef('');
  const lastPlayersRef = useRef('');

  useEffect(() => {
    if (!id) {
      return undefined;
    }

    // Fetch initial game and player data
    show_game(id);
    show_players(id);

    // Start polling with exponential backoff
    startEventDrivenPolling(id);

    return () => {
      stopPolling();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const resetPollToFast = useCallback(() => {
    pollDelayRef.current = INITIAL_POLL_INTERVAL;
    noChangeCountRef.current = 0;
  }, []);

  const startEventDrivenPolling = useCallback((gameId) => {
    stopPolling();

    const poll = async () => {
      try {
        // Fetch both game state and players in parallel
        const [gameRes, playersRes] = await Promise.all([
          getGame(gameId),
          getGamePlayers(gameId),
        ]);

        let stateChanged = false;

        // Check if game state changed
        if (gameRes && !gameRes.error) {
          const gameString = JSON.stringify(gameRes);
          if (gameString !== lastGameStateRef.current) {
            setGame(gameRes);
            lastGameStateRef.current = gameString;
            stateChanged = true;
          }
        }

        // Check if players changed
        if (Array.isArray(playersRes)) {
          const playersString = JSON.stringify(playersRes);
          if (playersString !== lastPlayersRef.current) {
            setPlayers(playersRes);
            lastPlayersRef.current = playersString;
            stateChanged = true;
          }
        }

        // If state changed, reset backoff; otherwise increase backoff
        if (stateChanged) {
          resetPollToFast();
        } else {
          noChangeCountRef.current++;
          pollDelayRef.current = Math.min(
            INITIAL_POLL_INTERVAL * Math.pow(BACKOFF_MULTIPLIER, noChangeCountRef.current),
            MAX_POLL_INTERVAL,
          );
        }

        // Check if game started, if so, navigation will happen via useEffect watching game state
      } catch (error) {
        console.error('Room polling error:', error);
      }
    };

    // Poll immediately, then set interval with current delay
    poll();
    pollRef.current = setInterval(poll, pollDelayRef.current);
  }, [stopPolling, resetPollToFast]);

  // Watch for game state change and navigate to board if game started
  useEffect(() => {
    if (game?.estado === 'en_curso') {
      navigate(`/games/${id}/board`, { state: { game } });
    }
  }, [game?.estado, game, id, navigate]);

  const show_game = async (id) => {
    if (!id) {
      return;
    }

    const res = await getGame(id);
    if (res?.error) {
      console.log('Error fetching game:', res.error);
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
      console.log('Error fetching players:', res.error);
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
