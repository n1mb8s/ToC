// ...existing code...
import React from "react";
import CardComponent from "./CardComponent";

const CardContainer = ({ cards, children }) => {
  // Tailwind classes replace inline styles
  const containerClass = "grid grid-cols-4 gap-4 justify-center p-6";

  // If a cards array is provided, render CardComponent children for each card
  if (cards && Array.isArray(cards)) {
    return (
      <div className={containerClass}>
        {cards.map((card, idx) => (
          <CardComponent key={card.id ?? idx} card={card} />
        ))}
      </div>
    );
  }

  // Fallback: render whatever children were passed in
  return <div className={containerClass}>{children}</div>;
};

export default CardContainer;
