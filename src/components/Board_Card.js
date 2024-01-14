
import "./Board_Card.css"

function Board_Card({card,card0,card1,card2,onDragOver,onDrop }){
  
  
  return (
     <>
      <div  
      //key={card?.id} 
      className="board_card"       
      droppeable='true'
      onDragOver={onDragOver}
      onDrop={onDrop}
      
      >
        <h3>{card?.numero}</h3>
        <h3>{card?.pinta}</h3> 
                  
      </div>



    </>
        )

      }
export default Board_Card;