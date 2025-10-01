import CardContainer from "../components/CardContainer";
import SearchAndFilter from "../components/SearchAndFilter";
import { TypeMock, YearMock } from "../mocks/filter";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/NavBar";

const Brand = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const { brandName } = useParams();
  const navigate = useNavigate();

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
        console.log('API response:', data);
        setCards(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [brandName])

  if (loading) {
    return (
      <>
        <Navbar />
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
      <Navbar />
      <main className="box-border px-[132px] bg-[#0D1017]">
        <div className="flex flex-col gap-12">
          <h1 className="text-white text-4xl font-bold mt-12 mb-0">{brandName.replace(/-/g, ' ')}</h1>
          <SearchAndFilter
            filters={[TypeMock, YearMock]}
            query=""
            onChange={(state) => console.log("search/filter changed", state)}
          />
        </div>
        <CardContainer head={null} cards={cards} card_type="model" onClick={handleModelClick} />
      </main>
    </>
  );
};

export default Brand;
