import CardComponent from "./CardComponent";

const CardContainer = ({ head, cards, card_type }) => {
  if (!head) head = { title: " " };
  const containerClass =
    "w-full mx-auto mt-8  grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-y-4 gap-x-8";
  if (cards && Array.isArray(cards)) {
    return (
      <>
        <h1 className="text-white text-4xl font-bold mt-12 mb-0">
          {head.title}
        </h1>
        <div className={containerClass}>
          {cards.map((card, idx) => (
            <CardComponent key={card.id ?? idx} card={card} card_type={card_type} />
          ))}
        </div>
      </>
    );
  }
};

export default CardContainer;
