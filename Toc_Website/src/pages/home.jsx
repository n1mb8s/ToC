import CardContainer from "../components/CardContainer";
import { cards } from "../mocks/card";
import { head } from "../mocks/head";
import SearchAndFilter from "../components/SearchAndFilter";
const Home = () => (
  <main className="box-border px-[132px] bg-[#0D1017]">
    <SearchAndFilter
      filters={["alphabet", "color", "year"]}
      initial={{ alphabet: "ALL", color: "All", year: "All" }}
      onChange={(v) => console.log(v)}
    />

    {head.map((h, idx) => (
      <CardContainer key={idx} head={h} cards={cards} />
    ))}
  </main>
);

export default Home;
