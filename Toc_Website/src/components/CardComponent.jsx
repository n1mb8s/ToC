// ...existing code...
import React from "react";
const CardComponent = ({ card }) => (
  <div className="border border-gray-200 rounded-lg p-4 max-w-sm shadow-sm">
    <img
      src={card.image}
      alt={card.name}
      className="w-full rounded-md mb-3 object-cover"
    />
    <h4 className="truncate text-base font-semibold mb-2">{card.name}</h4>
    <p className="text-sm text-[#546881] truncate">
      {(card.list || []).join(", ")}
    </p>
  </div>
);

export default CardComponent;
