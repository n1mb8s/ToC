import CardContainer from "../components/CardContainer";
import Navbar from "../components/NavBar";
import Banner from "../components/Banner";
import SearchAndFilter from "../components/SearchAndFilter";
import { AlphabetMock, TypeMock, YearMock } from "../mocks/filter";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [cards, setCards] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/brands`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setCards(data);
      } catch (err) {
        alert(err.message);
      }
    };

    fetchData();
  }, []);

  const handleCardClick = (card) => {
    const brandName = card.name.replace(/\s+/g, "-");
    navigate(`/brands/${brandName}`);
  };

  const groupedCards = cards.reduce((groups, card) => {
    const firstLetter = card.name.charAt(0).toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(card);
    return groups;
  }, {});

  const sortedGroups = Object.keys(groupedCards).sort();

  return (
    <>
      <Banner />
      <main className="box-border px-[132px] bg-[#0D1017]">
        <SearchAndFilter
          filters={[AlphabetMock, TypeMock, YearMock]}
          query=""
          onChange={(state) => console.log("search/filter changed", state)}
        />
        {sortedGroups.map((letter) => (
          <CardContainer
            key={letter}
            head={{ title: letter }}
            cards={groupedCards[letter]}
            card_type="brand"
            onClick={handleCardClick}
          />
        ))}
      </main>
    </>
  );
};

export default Home;
