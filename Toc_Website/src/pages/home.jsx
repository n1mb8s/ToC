// ...existing code...
import React from "react";
import CardContainer from "../components/CardContainer";
import { cards } from "../mocks/card";

const Home = () => (
  <main className="box-border px-[100px]">
    <CardContainer cards={cards} />
    {/* Option B: render CardComponent manually as children
    <CardContainer>
      {cards.map((c) => (
        <CardComponent key={c.id} card={c} />
      ))}
    </CardContainer> */}
  </main>
);

export default Home;
