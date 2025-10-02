import CardContainer from "../components/CardContainer";
import Banner from "../components/Banner";
import SearchAndFilter from "../components/SearchAndFilter";
import { AlphabetMock, TypeMock, YearMock } from "../mocks/filter";
import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sfState, setSfState] = useState({
    query: "",
    alphabet: AlphabetMock.initial ?? "All",
    type: TypeMock.initial ?? "All",
    year: YearMock.initial ?? "All",
  });
  const navigate = useNavigate();
  const filtersConfig = useMemo(() => [AlphabetMock, TypeMock, YearMock], []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/api/brands`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Brands API response:', data);
        setCards(data);
      } catch (err) {
        alert(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (card) => {
    const brandName = card.name.replace(/\s+/g, "-");
    navigate(`/brands/${brandName}`);
  };

  const filteredCards = cards.filter((card) => {
    const name = (card?.name || "").toString();
    const q = (sfState.query || "").trim().toLowerCase();

    if (q && !name.toLowerCase().includes(q)) return false;

    if (sfState.alphabet && sfState.alphabet !== "All") {
      if (!name.toUpperCase().startsWith(sfState.alphabet.toUpperCase())) {
        return false;
      }
    }

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

  const groupedCards = filteredCards.reduce((groups, card) => {
    const firstLetter = card.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(card);
    return groups;
  }, {});

  const sortedGroups = Object.keys(groupedCards).sort();

  if (loading) {
    return (
      <>
        <Banner />
        <main className="box-border px-[132px] bg-[#0D1017]">
          <div className="flex flex-col items-center justify-center py-20">
            <div className="text-white text-xl">Loading brands...</div>
            <div className="mt-4 w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Banner />
      <main className="box-border px-[132px] bg-[#0D1017]">
        <SearchAndFilter
          filters={filtersConfig}
          query={sfState.query}
          onChange={setSfState}
        />
        {sortedGroups.length === 0 ? (
          <div className="text-center text-white py-16">No brands found.</div>
        ) : (
          sortedGroups.map((letter) => (
            <CardContainer
              key={letter}
              head={{ title: letter }}
              cards={groupedCards[letter]}
              card_type="brand"
              onClick={handleCardClick}
            />
          ))
        )}
      </main>
    </>
  );
};

export default Home;
