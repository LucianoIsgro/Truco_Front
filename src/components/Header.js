import React from "react";
import { useNavigate } from "react-router";
import { Logout } from "../api/games";

function Header({current_player, setCurrent_player}) {
  const navigate = useNavigate();

  const logout = () => {
    const res = Logout();
    if (res.error) {
      console.log("NO");
      return;
    }
    console.log("Logout exitoso")
    sessionStorage.removeItem('current_player')
    setCurrent_player(null);
    console.log(current_player)
    navigate("/");

  };

  return (
    <header>
      TRUCO
      <button className="logout" onClick={logout}>
        LogOut
      </button>
    </header>
  );
}
export default Header;
