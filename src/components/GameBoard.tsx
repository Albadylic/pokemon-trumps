import { FC, useState, useEffect } from "react";
import PlayerCard from "./PlayerCard";
import OpponentCard from "./OpponentCard";

const GameBoard: FC = () => {
  const [playerPokemon, setPlayerPokemon] = useState(null);
  const [opponentPokemon, setOpponentPokemon] = useState(null);
  const [playerChoice, setPlayerChoice] = useState<string | null>(null);

  function randomID() {
    return Math.floor(Math.random() * 151);
  }

  useEffect(() => {
    async function getPokemon() {
      const playerID: string = String(randomID());
      const opponentID: string = String(randomID());

      const url: string = `https://pokeapi.co/api/v2/pokemon/`;

      try {
        const playerResponse = await fetch(`${url}${playerID}`);

        if (!playerResponse.ok) {
          throw new Error("Bad playerResponse");
        }
        const playerData = await playerResponse.json();
        setPlayerPokemon(playerData);

        const opoonentResponse = await fetch(`${url}${opponentID}`);

        if (!opoonentResponse.ok) {
          throw new Error("Bad opponentResponse");
        }
        const opponentData = await opoonentResponse.json();
        setOpponentPokemon(opponentData);
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    }

    getPokemon();
  }, []);

  return (
    <section className="GameBoard">
      {playerPokemon && (
        <PlayerCard data={playerPokemon} setPlayerChoice={setPlayerChoice} />
      )}

      {opponentPokemon && (
        <OpponentCard data={opponentPokemon} playerChoice={playerChoice} />
      )}
    </section>
  );
};

export default GameBoard;
