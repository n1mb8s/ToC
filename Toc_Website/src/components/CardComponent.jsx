// ...existing code...
import React from "react";
const CardComponent = ({ card }) => (
  <div className="border border-gray-200 rounded-lg p-4 max-w-sm shadow-sm">
    <img
      src={card.image}
      alt={card.name}
      className="w-full rounded-md mb-3 object-cover"
    />
    <h3 className="text-lg font-semibold mb-2">{card.name}</h3>
    <ul className="list-disc pl-5 m-0">
      {(card.list || []).map((item, idx) => (
        <li key={idx} className="text-sm text-gray-500">
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export default CardComponent;
