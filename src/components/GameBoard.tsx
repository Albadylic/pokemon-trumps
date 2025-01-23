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
  const [currentPlayerCard, setCurrentPlayerCard] = useState<cardShape>();
  const [currentOpponentCard, setCurrentOpponentCard] = useState<cardShape>();

  // Default to 10 cards each
  // Fetch 20 cards
  const [deckSize, setDeckSize] = useState<number>(20);

  function randomID() {
    return Math.floor(Math.random() * 151) + 1;
  }

  const setCurrentCards = () => {
    if (playerDeck.length === 0) {
      setGameOutcome("lose");
    } else if (opponentDeck.length === 0) {
      setGameOutcome("win");
    } else {
      const playerCard = playerDeck[0];
      const opponentCard = opponentDeck[0];

      setCurrentPlayerCard(playerCard);
      setCurrentOpponentCard(opponentCard);
    }
  };

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

        setCurrentCards();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getPokemon();
  }, [deckSize]);

  const compareValues = () => {
    const playerStat = playerChoice?.playerChoiceName;
    const playerValue = playerChoice?.playerChoiceValue;

    let opponentValue = currentOpponentCard?.stats.filter((obj: any) => {
      return obj.stat.name === playerStat;
    })[0]["base_stat"];

    if (
      playerValue !== null &&
      playerValue !== undefined &&
      opponentValue !== null &&
      opponentValue !== undefined &&
      currentPlayerCard !== undefined &&
      currentOpponentCard !== undefined
    ) {
      if (playerValue >= opponentValue) {
        handleWin("player", currentPlayerCard, currentOpponentCard);
      } else {
        handleWin("opponent", currentPlayerCard, currentOpponentCard);
      }
    }

    return null;
  };

  const handleWin = (
    winner: string,
    playerCard: cardShape,
    opponentCard: cardShape
  ) => {
    if (winner === "player") {
      setTurnOutcome(
        `You win, you receive opponent's ${currentOpponentCard?.name}!`
      );
      // Pass the opponentCard to the end of playerDeck
      setPlayerDeck([...playerDeck.slice(1), playerCard, opponentCard]);
      setOpponentDeck(opponentDeck.slice(1));
    } else {
      setTurnOutcome(
        `You lose, opponent receives your ${currentPlayerCard?.name}!`
      );
      // Pass the playerCard to the end of opponentDeck
      setOpponentDeck([...opponentDeck.slice(1), opponentCard, playerCard]);
      setPlayerDeck(playerDeck.slice(1));
    }
  };

  if (playerChoice) {
    compareValues();
    // Set next pokemon - should happen when the decks are changed above
  }

  return (
    <>
      <section className="GameBoard">
        {currentPlayerCard && (
          <PlayerCard
            playerPokemon={currentPlayerCard}
            setPlayerChoice={setPlayerChoice}
          />
        )}

        {currentOpponentCard && (
          <OpponentCard
            opponentPokemon={currentOpponentCard}
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
