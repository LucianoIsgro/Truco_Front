import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

function LogIn({ current_player, current, setCurrent_player }) {
  const navigate = useNavigate();

  const [player, setPlayer] = useState({
    username: '',
    password: '',
  });

  const login = (event) => {
    axios
      .post(
        'http://localhost:3001/logins',
        {
          username: player.username,
          password: player.password,
        },
        {
          headers: {
            Accept: '*/*',
          },
          withCredentials: true,
        },
      )
      .then((response) => {
        console.log('Login res', response);
        sessionStorage.setItem('current_player', JSON.stringify(response.data));
        setCurrent_player(response.data);
        navigate('/dashboard');
      })
      .catch((error) => {
        console.log('Login error', error);
      });

    event.preventDefault();
  };

  return (
    <>
      <form onSubmit={login}>
        <div>
          <label htmlFor="UserName">User Name: </label>
          <input
            type="text"
            id="UserName"
            name="UserName"
            placeholder="requiered"
            required
            value={player.username}
            onChange={(event) => {
              setPlayer({ ...player, username: event.target.value });
            }}
          />
        </div>
        <br />
        <br />
        <div>
          <label htmlFor="Password">Password: </label>
          <input
            type="text"
            id="password"
            name="password"
            placeholder="requiered"
            required
            value={player.password}
            onChange={(event) => {
              setPlayer({ ...player, password: event.target.value });
            }}
          />
        </div>
        <button type="submit" value="Submit">
          LogIn
        </button>
      </form>
    </>
  );
}
export default LogIn;
