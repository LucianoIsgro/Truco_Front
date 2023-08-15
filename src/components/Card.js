import React, { useEffect, useState } from "react";
import './Card.css';

import { useParams } from "react-router";

function Card({card, onCardClick, drag, droppeable,onDragOver,onDrop}){

  

    return(
        
        <div  key={card?.id} className="card" 
        onClick={onCardClick} 
        draggable 
        droppeable='true'
        onDragStart={drag}
        onDragOver={onDragOver}
        onDrop={onDrop}  >
            <h3>{card?.numero}</h3>
            <h3>{card?.pinta}</h3> 
        </div>
        
        
    )

}
export default Card;
