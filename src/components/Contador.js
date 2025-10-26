import React from 'react';
import '../styles/components/Contador.css';
function Contador({ value1, value2, sumar1, sumar2, restar1, restar2 }) {
  return (
    <>
      <div className="JugadoresContainer">
        <h1>Contador</h1>
        <div className="JugadorContainer">
          <h2 id="Nos">Nosotros</h2>
          <div className="buttons">
            <button onClick={sumar1}>+</button>
            <button onClick={restar1}>-</button>
          </div>
          <p>{value1}</p>
        </div>
        <div className="JugadorContainer">
          <h2 id="ellos">Ellos</h2>
          <div className="buttons">
            <button onClick={sumar2}>+</button>
            <button onClick={restar2}>-</button>
          </div>
          <p>{value2}</p>
        </div>
      </div>
    </>
  );
}
export default Contador;
