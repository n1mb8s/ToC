import CardContainer from "../components/CardContainer";
import SearchAndFilter from "../components/SearchAndFilter";
import { TypeMock, YearMock } from "../mocks/filter";
import { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const Brand = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  // Track search/type/year from SearchAndFilter (no alphabet on this page)
  const [sfState, setSfState] = useState({
    query: "",
    type: TypeMock.initial ?? "All",
    year: YearMock.initial ?? "All",
  });
  const { brandName } = useParams();
  const navigate = useNavigate();
  const filtersConfig = useMemo(() => [], []);

  const formatModelName = (modelName) => {
    modelName = modelName.replace(brandName, '').trim();
    return modelName.replace(/\s+/g, '-');
  };

  const handleModelClick = (model) => {
    if (model.name) {
      const formattedModelName = formatModelName(model.name);
      navigate(`/brands/${brandName}/${formattedModelName}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/model/${brandName}?brand_name=${brandName}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCards(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandName])

  // Apply search and filters (models data may or may not have type/year)
  const filteredCards = cards.filter((card) => {
    const name = (card?.name || "").toString();
    const q = (sfState.query || "").trim().toLowerCase();

    if (q && !name.toLowerCase().includes(q)) return false;

    if (sfState.type && sfState.type !== "All") {
      const typeVal = card.type ?? card.color ?? card.category;
      if (typeVal != null && String(typeVal).toLowerCase() !== sfState.type.toLowerCase()) {
        return false;
      }
    }

    if (sfState.year && sfState.year !== "All") {
      const yearVal = card.year ?? card.model_year;
      if (yearVal != null && String(yearVal) !== String(sfState.year)) {
        return false;
      }
    }

    return true;
  });

  if (loading) {
    return (
      <>
        {/* <Navbar /> */}
        <main className="box-border px-[132px] bg-[#0D1017]">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-white text-xl">Loading models...</div>
            <div className="mt-4 w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      {/* <Navbar /> */}
      <main className="box-border px-[132px] bg-[#0D1017]">
        <div className="flex flex-col gap-12">
          <h1 className="text-white text-4xl font-bold mt-12 mb-0">{brandName.replace(/-/g, ' ')}</h1>
          <SearchAndFilter
            filters={filtersConfig}
            query={sfState.query}
            onChange={setSfState}
          />
        </div>
        {filteredCards.length === 0 ? (
          <div className="text-center text-white py-16">No models found.</div>
        ) : (
          <CardContainer head={null} cards={filteredCards} card_type="model" onClick={handleModelClick} />
        )}
      </main>
    </>
  );
};

export default Brand;
