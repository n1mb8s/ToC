// ...existing code...
import React from "react";
const CardComponent = ({ card }) => {
  return (
    <div className="aspect-[3/4] border border-gray-200 rounded-lg shadow-sm">
      <img
        src={card.image}
        alt={card.name}
        className="w-full object-cover aspect-square"
      />
      <div className="px-4 flex flex-col justify-center pt-4">
        <h4 className="truncate text-base font-semibold mb-2">{card.name}</h4>
        <p className="text-sm text-[#546881] truncate">
          {(card.list || []).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default CardComponent;
