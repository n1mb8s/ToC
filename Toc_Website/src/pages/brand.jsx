import CardContainer from "../components/CardContainer";
import SearchAndFilter from "../components/SearchAndFilter";
import { TypeMock, YearMock } from "../mocks/filter";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const Brand = () => {
  const [cards, setCards] = useState([]);
  const { brandName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/model/${brandName}?brand_name=${brandName}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API response:', data);
        setCards(data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchData();
  }, [brandName])

  return (
    <main className="box-border px-[132px] bg-[#0D1017]">
      <h1 className="text-white text-4xl font-bold mt-12 mb-0">{brandName.replace(/-/g, ' ')}</h1>
      <SearchAndFilter
        filters={[TypeMock, YearMock]}
        query=""
        onChange={(state) => console.log("search/filter changed", state)}
      />
      <CardContainer head={null} cards={cards} card_type="model" />
    </main>
  );
};

export default Brand;
