import { FC, useState, useEffect } from "react";
import "./App.css";

import Header from "./components/Header";
import GameBoard from "./components/GameBoard";
import Footer from "./components/Footer";

interface PlayButtonProps {
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

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

const PlayButton: FC<PlayButtonProps> = ({ setGameStarted }) => {
  return (
    <button onClick={() => setGameStarted(true)} className="play_button">
      Play
    </button>
  );
};

const App: FC = () => {
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

  // Pass decks down to gameboard

  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="App">
      <Header />
      <section className="game_container">
        {gameStarted ? (
          <GameBoard
            setGameStarted={setGameStarted}
            setPlayerDeck={setPlayerDeck}
            playerDeck={playerDeck}
            setOpponentDeck={setOpponentDeck}
            opponentDeck={opponentDeck}
          />
        ) : (
          <PlayButton setGameStarted={setGameStarted} />
        )}
      </section>
      <Footer />
    </div>
  );
};

export default App;
