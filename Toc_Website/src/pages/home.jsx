// ...existing code...
import React from "react";
import CardContainer from "../components/CardContainer";
import { cards } from "../mocks/card";
import { head } from "../mocks/head";

const Home = () => (
  <main className="box-border px-[132px]">
    {head.map((h, idx) => (
      <CardContainer key={idx} head={h} cards={cards} />
    ))}
  </main>
);

export default Home;
