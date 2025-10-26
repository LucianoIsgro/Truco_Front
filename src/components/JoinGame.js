import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { joinGame } from '../api/games';

function JoinGame() {
  const navigate = useNavigate();

  const [game_id, setGame_id] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await joinGame(game_id);
      console.log('Join', response);
      navigate(`/games/${game_id}`);
    } catch (error) {
      console.log('Join', error);
    }
  };

  return (
    <>
      <h1>Unirse a Juego</h1>
      <form onSubmit={handleSubmit}>
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
        <button type="submit" value="Submit">
          Unirse
        </button>
      </form>
    </>
  );
}
export default JoinGame;
