import React, { useEffect, useState } from "react";
import "./Board.css";
import Card from "./Card";
import Contador from "./Contador";
import { useLocation, useParams } from "react-router";
import {
  DealCards,
  getGamePlayers,
  GetPlayerCards,
  DeleteCard,
} from "../api/games";

function Board({current_player,current}) {
  const location = useLocation();

  //console.log(location.state.game);

  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [cards, setCards] = useState([[], []]);
  const [cards2, setCards2] = useState([[], []]);

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  let interv;



  useEffect(() => {
    
   
    //!game && show_game(id);
   
    show_players(id);
   
    //cards.length===0 && show_cards()
     !current_player && startWaiting()
    return () => {
      clearIntervals()
    }
        

  }, [current_player]);

  //console.log(current_player);

  const sumarc1=()=>{
    setCount1(count1+1)

  }
  const sumarc2=()=>{
    setCount2(count2+1)

  }
  const restarc1=()=>{
    setCount1(count1-1)

  }
  const restarc2=()=>{
    setCount2(count2-1)
  }

  const show_players = async (id) => {
    const res = await getGamePlayers(id);
    if (res.error) {
      console.log("NO");
      return;
    }
    setPlayers(res);
  };

  function handleBoton(i, player_number, player_id) {
    if (cards[player_number].length <= 3) {
      darCarta(i, player_number, player_id);
    } else {  
      alert("Ya tiene las 3 cartas");
    }
  }

  const darCarta = async (i, player_number, player_id) => {
    const PlayerCards = cards.slice();

    const card = PlayerCards.slice();

    const res = await DealCards(id, player_id);
    if (res?.error) {
      console.log("NO");
      return;
    }
    console.log("Se repartió una carta");

    card[i] = res;

    PlayerCards[player_number]?.push(card[i]);

    setCards(PlayerCards);
  };

  const show_cards = async (player_id) => {
    const res = await GetPlayerCards(player_id);

    // if (res.error) {
    //   console.log("NO");
    //   return;
    // }
    
    
  };

  const startDrag = (event, item) => {
    event.dataTransfer.setData("card", item.id);
    console.log(item);
  };
  const draggingOver = (event) => {
    event.preventDefault();
  };
  const onDrop = (event, player_number, i) => {
    const cardId = event.dataTransfer.getData("card");
    const item = cards[player_number]?.find((item) => item?.id == cardId);

    const PlayerCards2 = cards2.slice();
    const c2 = PlayerCards2.slice();
    c2[i] = cards[player_number][i];
    deleteCard(cards[player_number][i].id);
    cards[player_number][i] = {};
    PlayerCards2[player_number]?.push(c2[i]);
    setCards2(PlayerCards2);
    console.log(cards);
  };

  const deleteCard = async (id) => {
    const res = await DeleteCard(id);

    if (res.error) {
      console.log("NO");
      return;
    }
    console.log("Se elimino la carta");
  };



  function startWaiting(){
    
    clearIntervals()
    const tmp = setInterval(
      ()=> show_cards(current_player?.id),
      2000
    )
    interv = tmp
}

function clearIntervals(){
clearInterval(interv)
interv=undefined
}

  return (
    <>
      {players?.map((player) => (
        <div
          key={player?.id}
          className={"Player " + "otro" + players?.indexOf(player)}
        >
          {player?.username}

          <table id="my_cards">
            <Card
              card={cards[players?.indexOf(player)][0]}
              onCardClick={() =>
                handleBoton(0, players?.indexOf(player), player?.id)
              }
              drag={(event) =>
                startDrag(event, cards[players?.indexOf(player)][0].id)
              }
            ></Card>

            <Card
              card={cards[players?.indexOf(player)][1]}
              onCardClick={() =>
                handleBoton(1, players?.indexOf(player), player?.id)
              }
              drag={(event) =>
                startDrag(event, cards[players?.indexOf(player)][1].id)
              }
            />

            <Card
              card={cards[players?.indexOf(player)][2]}
              onCardClick={() =>
                handleBoton(2, players?.indexOf(player), player?.id)
              }
              drag={(event) =>
                startDrag(event, cards[players?.indexOf(player)][2].id)
              }
            />
          </table>
        </div>
      ))}

      <div className="board">
        {players?.map((player) => (
          <div
            key={player?.id}
            className={
              "BoardPlayer " + "otroBoardPlayer" + players?.indexOf(player)
            }
          >
            <table id="board_cards">
              <Card
                card={cards2[players?.indexOf(player)][0]}
                onCardClick={null}
                drag={null}
                droppable="true"
                onDragOver={(event) => draggingOver(event)}
                onDrop={(event) => onDrop(event, players?.indexOf(player), 0)}
              />

              <Card
                card={cards2[players?.indexOf(player)][1]}
                onCardClick={null}
                drag={null}
                droppable="true"
                onDragOver={(event) => draggingOver(event)}
                onDrop={(event) => onDrop(event, players?.indexOf(player), 1)}
              />

              <Card
                card={cards2[players?.indexOf(player)][2]}
                onCardClick={null}
                drag={null}
                droppable="true"
                onDragOver={(event) => draggingOver(event)}
                onDrop={(event) => onDrop(event, players?.indexOf(player), 2)}
              />
            </table>
          </div>
        ))}
      </div>

      <div className="contador">
        <Contador value1={count1} value2={count2} sumar1={sumarc1} sumar2={sumarc2} restar1={restarc1} restar2={restarc2}/>
      </div>

      <br />
    </>
  );
}
export default Board;
