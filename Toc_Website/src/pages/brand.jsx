import CardContainer from "../components/CardContainer";
import { cards } from "../mocks/card";
import { head } from "../mocks/head";
import SearchAndFilter from "../components/SearchAndFilter";
import { TypeMock, YearMock } from "../mocks/filter";
const Brand = () => (
  <main className="box-border px-[132px] bg-[#0D1017]">
    <SearchAndFilter
      filters={[TypeMock, YearMock]}
      query=""
      onChange={(state) => console.log("search/filter changed", state)}
    />
    {head.map((h, idx) => (
      <CardContainer key={idx} head={null} cards={cards} card_type="model" />
    ))}
  </main>
);

export default Brand;
