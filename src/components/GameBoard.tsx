import { FC, useState, useEffect, useReducer } from "react";
import PlayerCard from "./PlayerCard";
import OpponentCard from "./OpponentCard";

interface cardShape {
  name: string;
  sprites: {
    front_default: string;
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
}

interface GameBoardProps {
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
  Types for the stat chosen by the user
 */
interface playerChoiceType {
  playerChoiceName: string | null;
  playerChoiceValue: number | null;
}

//

const GameBoard: FC<GameBoardProps> = ({ setGameStarted }) => {
  const [playerChoice, setPlayerChoice] = useState<playerChoiceType | null>(
    null
  );

  const [gameOutcome, setGameOutcome] = useState<string | null>(null);
  const [turnOutcome, setTurnOutcome] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  const [playerDeck, setPlayerDeck] = useState<cardShape[] | []>([]);
  const [opponentDeck, setOpponentDeck] = useState<cardShape[] | []>([]);

  // Default to 10 cards each
  // Fetch 20 cards
  const [deckSize, setDeckSize] = useState<number>(20);

  function randomID() {
    return Math.floor(Math.random() * 151) + 1;
  }

  useEffect(() => {
    async function getPokemon() {
      const ids: number[] = [];
      const url: string = `https://pokeapi.co/api/v2/pokemon/`;

      while (ids.length < deckSize) {
        let id = randomID();
        if (ids.indexOf(id) === -1) {
          ids.push(id);
        }
      }

      const promises = ids.map((id) =>
        fetch(`${url}${id}`).then((response) => response.json())
      );

      try {
        const results = await Promise.all(promises);

        // Split cards between player and opponent
        const playerCards: cardShape[] = [];
        const opponentCards: cardShape[] = [];

        results.forEach((item, index) =>
          index % 2 === 0 ? playerCards.push(item) : opponentCards.push(item)
        );

        setPlayerDeck(playerCards);
        setOpponentDeck(opponentCards);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getPokemon();
  }, [deckSize]);

  useEffect(() => {
    const compareValues = () => {
      const playerStat = playerChoice?.playerChoiceName;
      const playerValue = playerChoice?.playerChoiceValue;

      let opponentValue = opponentDeck[0].stats.filter((obj: any) => {
        return obj.stat.name === playerStat;
      })[0]["base_stat"];

      if (playerValue !== null && playerValue !== undefined) {
        if (playerValue >= opponentValue) {
          setTurnOutcome(
            `You win, you receive opponent's ${opponentDeck[0].name}!`
          );
          // Pass the opponentCard to the end of playerDeck
        } else {
          setTurnOutcome(
            `You lose, opponent receives your ${playerDeck[0].name}!`
          );
          // Pass the playerCard to the end of opponentDeck
        }
      }

      return null;
    };

    if (playerChoice) {
      compareValues();
      // Set next pokemon - should happen when the decks are changed above
    }
  }, [playerChoice, opponentDeck, playerDeck]);

  return (
    <>
      <section className="GameBoard">
        {playerDeck[0] && (
          <PlayerCard
            playerPokemon={playerDeck[0]}
            setPlayerChoice={setPlayerChoice}
          />
        )}

        {opponentDeck[0] && (
          <OpponentCard
            opponentPokemon={opponentDeck[0]}
            playerChoice={playerChoice}
          />
        )}
      </section>

      {turnOutcome && (
        <section className="turn_outcome">
          <p>{turnOutcome}</p>
          <button onClick={() => setTurnOutcome(null)}>Next hand</button>
        </section>
      )}

      {gameOutcome && (
        <section className="game_outcome">
          <p>You {gameOutcome}</p>
          <button onClick={() => setGameStarted(false)}>Play again</button>
        </section>
      )}
    </>
  );
};

export default GameBoard;
