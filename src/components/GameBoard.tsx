import { FC, useState, useEffect } from "react";
import Card from "./Card";

const GameBoard: FC = () => {
  const [apiData, setApiData] = useState(null);

  function randomID() {
    return Math.floor(Math.random() * 151);
  }

  useEffect(() => {
    async function getPokemon() {
      const id: string = String(randomID());
      const url: string = `https://pokeapi.co/api/v2/pokemon/${id}`;

      try {
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error("Bad response");
        }
        const data = await response.json();
        setApiData(data);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    getPokemon();
  }, []);

  return (
    <section className="GameBoard">
      {apiData && <Card data={apiData} />}
      {apiData && <Card data={apiData} />}
    </section>
  );
};

export default GameBoard;
