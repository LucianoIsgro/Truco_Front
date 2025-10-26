import React, { useState } from 'react';
import axios from 'axios';
import JoinGame from './JoinGame';
import { useNavigate } from 'react-router-dom';
import { joinGame } from '../api/games';

function CreateGame() {
  const navigate = useNavigate();

  const [game, setGame] = useState({
    nombre: '',
    token: '',
  });

  const handleChange = (field) => (event) => {
    setGame((prevGame) => ({
      ...prevGame,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        'http://localhost:3001/games',
        {
          nombre: game.nombre,
          token: game.token,
        },
        {
          headers: {
            Accept: '*/*',
          },
          withCredentials: true,
        },
      );

      const newGameId = response?.data?.id;
      alert('El juego se creó. Redirigiendo a la sala...');

      if (newGameId) {
        await joinGame(newGameId);
        navigate(`/games/${newGameId}`, { state: { game: response.data } });
      }
    } catch (error) {
      console.log('Create Game', error);
    }
  };

  return (
    <>
      <JoinGame />
      <h1>Crear Juego</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="NombreJuego">Nombre: </label>
          <input
            type="text"
            id="NombreJuego"
            name="NombreJuego"
            placeholder="requiered"
            required
            value={game.nombre}
            onChange={handleChange('nombre')}
          />
        </div>
        <br />

        <div>
          <label htmlFor="TokenJuego">Token: </label>
          <input
            type="text"
            id="token"
            name="token"
            placeholder="requiered"
            required
            value={game.token}
            onChange={handleChange('token')}
          />
        </div>
        <button type="submit" value="Submit">
          Crear
        </button>
      </form>
    </>
  );
}
export default CreateGame;
