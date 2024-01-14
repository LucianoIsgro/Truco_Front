import React from "react";
import { useNavigate } from "react-router";
import { Logout } from "../api/games";
function Header() {
  const navigate = useNavigate();

  const logout = () => {
    const res = Logout();
    if (res.error) {
      console.log("NO");
      return;
    }
    console.log("Logout exitoso")
    //setCurrent_player(null);
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
