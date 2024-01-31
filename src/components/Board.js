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
  DropCard,
  GetDroppedCards,
} from "../api/games";
import Board_Card from "./Board_Card";

function Board({current_player,current}) {
  const location = useLocation();

  const storedCards = localStorage.getItem('cards')
  const initialCards= storedCards? JSON.parse(storedCards) : ([[],[]])



  //console.log(location.state.game.id);
  

  const { id } = useParams();
  
  const [players, setPlayers] = useState([]);

  const [cards, setCards] = useState(initialCards);
  const PlayerCards = cards?.slice();
  const c1 = PlayerCards?.slice();
  
  const [cards2, setCards2] = useState([[],[]]);
  const PlayerCards2 = cards2?.slice();
  const c2 = PlayerCards2?.slice();

 
  const [dropOrder, setDropOrder] = useState(1);
  const [dropOrder2, setDropOrder2] = useState(1);

  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);
  
  const [playerIndex,setPlayerIndex] = useState(0);
  

  let interv;

  //let playerIndex = players?.length !== 0 ? players?.findIndex((element) => element?.id === current_player?.id) : (0)

  useEffect(() => {
    
    //!game && show_game(id);
    //players.length===0 && 

    show_players(id);
    
    //!current_player && current()
    //cards.length===0 && show_cards()
    //localStorage.setItem('cards', JSON.stringify(cards));
    startWaiting(); 
    return () => {
       clearIntervals();
     };
        
  },[]);

  

  console.log(current_player);
  console.log(players);
  console.log(cards);
  console.log(cards2)

  const sumarc1=()=>{
    setCount1(count1+1)
  };
  const sumarc2=()=>{
    setCount2(count2+1)
  };
  const restarc1=()=>{
    setCount1(count1-1)
  };
  const restarc2=()=>{
    setCount2(count2-1)
  };

  const show_players = async (id) => {
    const res = await getGamePlayers(id);
    if (res?.error) {
      console.log("NO");
      return;
    }
    console.log("llego");
    setPlayers(res);
    setPlayerIndex(res?.findIndex((element) => element?.id === current_player?.id));
    console.log(res?.findIndex((element) => element?.id === current_player?.id))
  };

  function handleBoton(i, player_number, player_id) {
    if (cards[playerIndex].length <= 3) {
      darCarta(i, player_number, player_id);
    } else {  
      alert("Ya tiene las 3 cartas");
    }
  }

  const darCarta = async (i, player_number, player_id) => {
  

    const res = await DealCards(id, player_id);
    if (res?.error) {
      console.log("NO");
      return;
    }
    console.log("Se repartió una carta");

    c1[i] = res;

    PlayerCards[playerIndex]?.push(res);

    setCards(PlayerCards);
    //console.log(cards);
  };
  
 
  
  const show_cards = async (player_id,player) => {
   
    let card = PlayerCards.slice();
  

    const res = await GetPlayerCards(player_id);
    const res2= await GetDroppedCards(player_id);

    
    
    PlayerCards[playerIndex] = res;
    setCards(PlayerCards);

    PlayerCards2[playerIndex]= res2;
    setCards2(PlayerCards2);

    

    // PlayerCards2[0]=res2;
    // setCards2(PlayerCards2);

   // PlayerCards2[0]=


    //res.forEach(element=>{
    //PlayerCards[0]?.push(element);
    // setCards(PlayerCards);

   // });   

    // if (res.error) {
    //   console.log("NO");
    //   return;
    // }
  };

  const startDrag = (event, item) => {

   let card = JSON.stringify(item);
   event.dataTransfer.setData("card", card);
    console.log(card);
  
  };
  const draggingOver = (event) => {
    
    event.preventDefault();
  
    
  };
  const onDrop =  (event,player_number,i,player_id) => { //, player_number, i,item (los otros parametros)
    
    
    let card = JSON.parse(event.dataTransfer.getData("card"));
    console.log(card);

    let order = 0

    if (player_number === 0){
      setDropOrder(dropOrder + 1)
      order = dropOrder
    }

    if(player_number === 1){
      setDropOrder2(dropOrder2+1)
      order = dropOrder2
    }
    
    c2[i] = card; 
    PlayerCards2[player_number]?.push(card);
    
    setCards2(PlayerCards2[player_number]);
    
    DropCard(card?.id,player_id,order);
    
    //deleteCard(cards[player_number][i]?.id);
    //c1[i] = {} 
    //PlayerCards[player_number]?.push(c1[i]);
    //setCards(PlayerCards)
    //console.log(cards);
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
      ()=> show_cards(current_player?.id,current_player),
      1000
    )
    interv = tmp
}

function clearIntervals(){
clearInterval(interv)
interv=undefined
}

function reset(){
  
}

if(players?.length===0){
  return (
    <div> Loading </div>


  )
}

  return (
    <>
      {//players?.map((player) => ())
       }
        
        <div
          key={current_player?.id}
          className={"Player " }//+ "otro" + players?.indexOf(player)
         >
          {current_player?.username}
    
          <> 
          <table id="my_cards">
            <Card
              card={cards[0]}
              
              onCardClick={() =>
                handleBoton(0,  playerIndex , current_player?.id)
              }
              onDragStart={(event) =>
                startDrag(event, cards[0])
              }
              
            ></Card>

            <Card
              
              card={cards[1]}
              
              onCardClick={() =>
                handleBoton(1, playerIndex , current_player?.id)
              }
              onDragStart={(event) =>
                startDrag(event, cards[1])
                
              }

            />

            <Card
              card ={cards[2]}
              onCardClick={() =>
                handleBoton(2, playerIndex , current_player?.id)
              }
              onDragStart={(event) =>
                startDrag(event, cards[2])
              }
            />
          </table>
          
          </> 
          
          
          

          
        </div>
      

      <div className="board">
        {players?.map((player) => (
          <div
            key={player?.id}
            className={
              "BoardPlayer " + "otroBoardPlayer" + players?.indexOf(player)
            }
          >
                <table id="board_cards"
                //onDragOver={(event) => draggingOver(event)}
                //onDrop={(event) => onDrop(event, players?.indexOf(player),current_player?.id)
                >
            
                <Board_Card // CAMBIAR A BOARD CARD
                  
                  card={cards2[players?.indexOf(player)][0]}
                  //card0={cards2[players?.indexOf(player)][0]}
                  //card1= {cards2[players?.indexOf(player)][1]}
                  //card2= {cards2[players?.indexOf(player)][2]}
                  
                 
                  droppable="true"
                  onDragOver={(event) => draggingOver(event)}
                  onDrop={(event) => onDrop(event, players?.indexOf(player),0, current_player?.id)}
                    
                    
                    //(event, players?.indexOf(player), 0, cards[players?.indexOf(player)][0])}
  
                 
                />
  
                <Board_Card
                 
                 card={cards2[players?.indexOf(player)][1]}
                  //card0={cards2[players?.indexOf(player)][0]}
                  //card1= {cards2[players?.indexOf(player)][1]}
                  //card2= {cards2[players?.indexOf(player)][2]}
                   //cards2[players?.indexOf(player)][1]
                 
                  droppable="true"
                  onDragOver={(event) => draggingOver(event)}
                  onDrop={(event) => onDrop(event, players?.indexOf(player),1, current_player?.id)}
                 
                />
  
                <Board_Card
                  card={cards2[players?.indexOf(player)][2]}
                  //card0={cards2[players?.indexOf(player)][0]}
                  //card1= {cards2[players?.indexOf(player)][1]}
                  //card2={cards2[players?.indexOf(player)][2]} //cards2[players?.indexOf(player)][2]
                  
                  droppable="true"
                  onDragOver={(event) => draggingOver(event)}
                  onDrop={(event) => onDrop(event, players?.indexOf(player),2, current_player?.id)}
                
                />
              </table>

          </div>
        ))}

      </div>

      <div className="reset">

        <button ></button>
      </div>

      <div className="contador">
        <Contador value1={count1} value2={count2} sumar1={sumarc1} sumar2={sumarc2} restar1={restarc1} restar2={restarc2}/>
      </div>
      
      

      <br />
    </>
  );
}
export default Board;
