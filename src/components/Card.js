import React, { useEffect, useState } from "react";
import './Card.css';

import { useParams } from "react-router";
import { GetPlayerCards } from "../api/games";

function Card({card, onCardClick, onDragStart }){


    //useEffect(() => {
    //      
    //}, [card]);

    // Puede haber algo interesante aca con fetch tal vez o con un start waiting.

    

    return(
        <>
        
        <div  key={card?.id} className="card" 
        onClick={onCardClick} 
        draggable 
        droppeable='true'
        onDragStart={onDragStart}
        >

            <h3>{card?.numero}</h3>
            <h3>{card?.pinta}</h3> 
            
        </div>
        </>

  
        
    )

}
export default Card;
