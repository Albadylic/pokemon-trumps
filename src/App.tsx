import { useEffect, useState } from "react";
import "./App.css";
import Card from "./components/Card";

// import getPokemon from "./tools/getPokemon";

function App() {
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
    <div className="App">
      <header className="App-header">
        <h1>Pokémon top trumps</h1>
      </header>
      {apiData && <Card data={apiData} />}
    </div>
  );
}

export default App;
