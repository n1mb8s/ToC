import CardContainer from "../components/CardContainer";
import { cards } from "../mocks/card";
import { head } from "../mocks/head";
import SearchAndFilter from "../components/SearchAndFilter";
import { AlphabetMock, TypeMock, YearMock } from "../mocks/filter";
const Home = () => (
  <main className="box-border px-[132px] bg-[#0D1017]">
    <SearchAndFilter
      filters={[AlphabetMock, TypeMock, YearMock]}
      query=""
      onChange={(state) => console.log("search/filter changed", state)}
    />
    {head.map((h, idx) => (
      <CardContainer key={idx} head={h} cards={cards} card_type="brand" />
    ))}
  </main>
);

export default Home;
