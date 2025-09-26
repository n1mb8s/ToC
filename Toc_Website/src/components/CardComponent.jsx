import React from "react";

const CardComponent = ({ card = {}, card_type = "model" }) => {
  const isModel = card_type === "model";

  return (
    <div
      className={`border border-gray-200 rounded-lg shadow-sm bg-white ${
        isModel ? "aspect-[4/3]" : "aspect-[3/4]"
      }`}
    >
      <img
        src={card.image}
        alt={card.name || ""}
        className={`w-full object-cover rounded-t-lg ${
          isModel ? "aspect-[16/9]" : "aspect-square"
        }`}
      />
      <div
        className={`px-4 flex flex-col justify-center ${
          isModel ? "pt-1" : "pt-4"
        }`}
      >
        <h4
          className={`truncate text-base font-semibold ${
            isModel ? "mb-1" : "mb-2"
          }`}
        >
          {card?.name}
        </h4>
        <p className="text-sm text-[#546881] truncate">
          {(card?.list || []).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default CardComponent;
