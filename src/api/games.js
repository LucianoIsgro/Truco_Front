import axios from "axios";

export async function Logout() {
  try {
    const req = await axios.delete("http://localhost:3001/logout", {
      headers: {
        Accept: "*/*",
      },
      withCredentials: true,
    });
    return req.data;
  } catch (e) {
    console.log("e  ", e);
  }
}

export async function getGame(id) {
  try {
    const req = await axios.get("http://localhost:3001/games/" + id, {
      headers: {
        Accept: "*/*",
      },
      withCredentials: true,
    });
    return req.data;
  } catch (e) {
    console.log("e  ", e);
  }
}

export async function getGamePlayers(id) {
  try {
    const req = await axios.get(
      "http://localhost:3001/games/" + id + "/players",
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}

export async function StartGame(id) {
  try {
    const req = await axios.put(
      "http://localhost:3001/games/" + id,
      {
        estado: "en_curso",
      },
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}
export async function DeleteGame(id) {
  try {
    const req = await axios.delete(
      "http://localhost:3001/games/"+ id,
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}

export async function DeletePlayerGame(id) {
  try {
    const req = await axios.delete(
      "http://localhost:3001/games/"+id+"/leave",
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}

export async function DropCard(card_id,player_id,order) {
  try {
    const req = await axios.put(
      "http://localhost:3001/cards/"+ card_id +"/drop" ,
      {
        dropped: true,
        order: order
      },
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}

export async function DealCards(game_id, player_id) {
  try {
    const req = await axios.post(
      "http://localhost:3001/games/"+game_id+"/player_cards/"+player_id,
      {},
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}

export async function DeleteCard(id) {
  try {
    const req = await axios.delete(
      "http://localhost:3001/cards/" + id + "/player_card",
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}



export async function GetPlayerCards(id) {
  try {
    const req = await axios.get(
      "http://localhost:3001/players/"+id+"/player_cards",
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}

export async function GetDroppedCards(id) {
  try {
    const req = await axios.get(
      "http://localhost:3001/players/" + id + "/dropped_player_cards",
      {
        headers: {
          Accept: "*/*",
        },
        withCredentials: true,
      }
    );
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}



export async function GetOnePlayerCard(id) {
  try {
    const req = await axios.get("http://localhost:3001/player_cards/" + id, {
      headers: {
        Accept: "*/*",
      },
      withCredentials: true,
    });
    return req.data;
  } catch (e) {
    console.log("e ", e);
  }
}

export async function GetCurrentPlayer(){
  try{
    const req = await axios.get("http://localhost:3001/current_player", {
      headers: {
        Accept: "*/*",
      },
      withCredentials: true,
    });
    return req.data;
  } catch (e){
    console.log("e", e);
  }

}
