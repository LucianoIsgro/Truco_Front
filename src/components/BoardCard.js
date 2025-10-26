import '../styles/components/BoardCard.css';

function BoardCard({ card, onDragOver, onDrop, droppable = false }) {
  const handleDragOver = droppable ? onDragOver : undefined;
  const handleDrop = droppable ? onDrop : undefined;

  return (
    <div
      className={`board_card${droppable ? ' board_card--droppable' : ''}`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3>{card?.numero}</h3>
      <h3>{card?.pinta}</h3>
    </div>
  );
}

export default BoardCard;
