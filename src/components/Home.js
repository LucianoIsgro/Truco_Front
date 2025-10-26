import React from 'react';
import '../styles/components/Home.css';
import LogIn from './auth/Login';
import SignUp from './auth/Signup';

function Home({ current_player, current, setCurrent_player }) {
  return (
    <>
      <div className="home">
        <h1>Home</h1>
        <div className="login">
          <LogIn
            current_player={current_player}
            current={current}
            setCurrent_player={setCurrent_player}
          />
        </div>
        <br />
        <div className="signup">
          <SignUp />
        </div>
      </div>
    </>
  );
}
export default Home;
