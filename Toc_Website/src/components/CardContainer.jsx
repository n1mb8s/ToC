// ...existing code...
import React from "react";
import CardComponent from "./CardComponent";

const CardContainer = ({ head, cards }) => {
  // Tailwind classes replace inline styles
  const containerClass =
    "w-full mx-auto mt-8  grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-y-4 gap-x-8";

  // If a cards array is provided, render CardComponent children for each card
  if (cards && Array.isArray(cards)) {
    return (
      <>
        <h1 className="text-4xl font-bold mt-12 mb-0">{head.title}</h1>
        <div className={containerClass}>
          {cards.map((card, idx) => (
            <CardComponent key={card.id ?? idx} card={card} />
          ))}
        </div>
      </>
    );
  }
};

export default CardContainer;
