import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import '../styles/components/Board.css';
import Card from './Card';
import Contador from './Contador';
import BoardCard from './BoardCard';
import { useParams } from 'react-router-dom';
import {
  DealCards,
  DropCard,
  GetPlayerCards,
  getGameDroppedCards,
  getGamePlayers,
  resetPlayerCards,
} from '../api/games';

const HAND_SIZE = 3;
const POLL_INTERVAL = 1000;

const normalizeHand = (cards = []) => {
  const next = [...cards];
  while (next.length < HAND_SIZE) {
    next.push(null);
  }
  return next.slice(0, HAND_SIZE);
};

function Board({ current_player }) {
  const { id } = useParams();
  const [players, setPlayers] = useState([]);
  const [hand, setHand] = useState(() => normalizeHand());
  const [boardCards, setBoardCards] = useState({});
  const [resetting, setResetting] = useState(false);
  const [count1, setCount1] = useState(0);
  const [count2, setCount2] = useState(0);

  const pollRef = useRef(null);
  const dropOrderRef = useRef({});

  const playerIndex = useMemo(
    () => players.findIndex((player) => player?.id === current_player?.id),
    [players, current_player],
  );

  const orderedPlayers = useMemo(() => {
    if (!players.length || playerIndex < 0) {
      return players;
    }
    const current = players[playerIndex];
    const before = players.slice(0, playerIndex);
    const after = players.slice(playerIndex + 1);
    return [current, ...after, ...before];
  }, [players, playerIndex]);

  const opponents = orderedPlayers.slice(1);

  const stopPolling = useCallback(() => {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }, []);

  const fetchCards = useCallback(async () => {
    if (!current_player?.id || playerIndex < 0 || !id) {
      return;
    }

    try {
      const [handResponse, droppedByGame] = await Promise.all([
        GetPlayerCards(current_player.id),
        getGameDroppedCards(id),
      ]);

      if (Array.isArray(handResponse)) {
        setHand(normalizeHand(handResponse));
      }

      if (droppedByGame && typeof droppedByGame === 'object') {
        setBoardCards(() => {
          const next = {};

          players.forEach((player) => {
            const playerId = player?.id;
            if (!playerId) {
              return;
            }

            const value = droppedByGame[playerId] || droppedByGame[String(playerId)] || [];
            const list = Array.isArray(value) ? value : [];
            const normalized = normalizeHand(list);

            next[playerId] = normalized;
            dropOrderRef.current[playerId] = normalized.filter(Boolean).length + 1;
          });

          return next;
        });
      }
    } catch (error) {
      console.log('Fetch board state', error);
    }
  }, [current_player?.id, id, playerIndex, players]);

  const fetchPlayers = useCallback(async () => {
    if (!id) {
      return;
    }

    const res = await getGamePlayers(id);
    if (Array.isArray(res)) {
      setPlayers(res);
    }
  }, [id]);

  useEffect(() => {
    fetchPlayers();
  }, [fetchPlayers]);

  useEffect(() => {
    if (!current_player?.id || playerIndex < 0) {
      stopPolling();
      return undefined;
    }

    fetchCards();
    pollRef.current = setInterval(fetchCards, POLL_INTERVAL);

    return () => {
      stopPolling();
    };
  }, [current_player?.id, playerIndex, fetchCards, stopPolling]);

  const handleDeal = async (slotIndex) => {
    if (!id || !current_player?.id) {
      return;
    }

    if (hand.filter(Boolean).length >= HAND_SIZE && hand[slotIndex]) {
      alert('Ya tiene las 3 cartas');
      return;
    }

    const res = await DealCards(id, current_player.id);
    if (res?.error) {
      console.log('NO');
      return;
    }

    setHand((prev) => {
      const next = [...prev];
      next[slotIndex] = res;
      return normalizeHand(next);
    });
  };

  const handleDragStart = (event, card) => {
    if (!card) {
      return;
    }
    event.dataTransfer.setData('card', JSON.stringify(card));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = async (event, targetPlayerId, slotIndex) => {
    event.preventDefault();
    const rawCard = event.dataTransfer.getData('card');
    if (!rawCard) {
      return;
    }

    const card = JSON.parse(rawCard);
    const order = dropOrderRef.current[targetPlayerId] ?? 1;
    dropOrderRef.current[targetPlayerId] = order + 1;

    setBoardCards((prev) => {
      const next = { ...prev };
      const playerBoard = [...(next[targetPlayerId] || normalizeHand())];
      playerBoard[slotIndex] = card;
      next[targetPlayerId] = playerBoard;
      return next;
    });

    setHand((prev) => prev.map((handCard) => (handCard?.id === card.id ? null : handCard)));

    if (card?.id && current_player?.id) {
      await DropCard(card.id, current_player.id, order);
    }
  };

  const handleResetCards = useCallback(async () => {
    if (!current_player?.id || playerIndex < 0 || resetting) {
      return;
    }

    setResetting(true);
    try {
      await resetPlayerCards();
      delete dropOrderRef.current[current_player.id];
      setHand(normalizeHand());
      setBoardCards((prev) => {
        const next = { ...prev };
        next[current_player.id] = normalizeHand();
        return next;
      });
      await fetchCards();
    } catch (error) {
      console.log('Reset cards', error);
    } finally {
      setResetting(false);
    }
  }, [current_player?.id, fetchCards, playerIndex, resetting]);

  if (!players.length) {
    return <div>Loading</div>;
  }

  const currentPlayerBoard = boardCards[current_player?.id] || normalizeHand();

  return (
    <>
      <div className="Player">
        {current_player?.username}
        <table id="my_cards">
          {[0, 1, 2].map((slot) => (
            <Card
              key={`hand-${slot}`}
              card={hand[slot]}
              onCardClick={() => handleDeal(slot)}
              onDragStart={(event) => handleDragStart(event, hand[slot])}
            />
          ))}
        </table>
        <button
          type="button"
          className="reset-button"
          onClick={handleResetCards}
          disabled={resetting}
        >
          {resetting ? 'Reiniciando...' : 'Reiniciar cartas'}
        </button>
      </div>

      <div className="board">
        {opponents.map((player) => {
          const cardsForPlayer = boardCards[player?.id] || normalizeHand();
          return (
            <div key={player?.id} className="BoardPlayer">
              <span className="board-player-name">{player?.username}</span>
              <table className="board_cards">
                {[0, 1, 2].map((slot) => (
                  <BoardCard key={`${player?.id}-${slot}`} card={cardsForPlayer[slot]} />
                ))}
              </table>
            </div>
          );
        })}
      </div>

      <div className="board-self">
        <span className="board-player-name board-player-name--self">Mesa</span>
        <table className="board_cards">
          {[0, 1, 2].map((slot) => (
            <BoardCard
              key={`self-${slot}`}
              card={currentPlayerBoard[slot]}
              droppable
              onDragOver={handleDragOver}
              onDrop={(event) => handleDrop(event, current_player?.id, slot)}
            />
          ))}
        </table>
      </div>

      <div className="contador">
        <Contador
          value1={count1}
          value2={count2}
          sumar1={() => setCount1((prev) => prev + 1)}
          sumar2={() => setCount2((prev) => prev + 1)}
          restar1={() => setCount1((prev) => prev - 1)}
          restar2={() => setCount2((prev) => prev - 1)}
        />
      </div>
    </>
  );
}

export default Board;
