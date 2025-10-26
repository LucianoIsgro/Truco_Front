import React, { useState } from 'react';
import axios from 'axios';

function SignUp() {
  const [player, setPlayer] = useState({
    username: '',
    password: '',
    password_confirmation: '',
  });

  const signUp = (event) => {
    axios
      .post(
        'http://localhost:3001/signups',
        {
          username: player.username,
          password: player.password,
          password_confirmation: player.password_confirmation,
        },
        {
          headers: {
            Accept: '*/*',
          },
          withCredentials: true,
        },
      )
      .then((response) => {
        console.log('Registration res', response);
      })
      .catch((error) => {
        console.log('Registration error', error);
      });

    event.preventDefault();
  };
  return (
    <form onSubmit={signUp}>
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
      <br />
      <div>
        <label htmlFor="Password_Confirmation">Password Confirmation: </label>
        <input
          type="text"
          id="password_confirm"
          name="password_confirm"
          placeholder="requiered"
          required
          value={player.password_confirmation}
          onChange={(event) => {
            setPlayer({ ...player, password_confirmation: event.target.value });
          }}
        />
      </div>

      <button type="submit" value="Submit">
        SignUp
      </button>
    </form>
  );
}

export default SignUp;
