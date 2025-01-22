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
  setPlayerDeck: React.Dispatch<React.SetStateAction<[] | cardShape[]>>;
  playerDeck: [] | cardShape[];
  setOpponentDeck: React.Dispatch<React.SetStateAction<[] | cardShape[]>>;
  opponentDeck: [] | cardShape[];
}

/**
  Types for the stat chosen by the user
 */
interface playerChoiceType {
  playerChoiceName: string | null;
  playerChoiceValue: number | null;
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case "PLAYER_WIN":
      return {
        ...state,
        playerDeck: action.payload.playerDeck,
        opponentDeck: action.payload.opponentDeck,
      };
    case "OPPONENT_WIN":
      return {
        ...state,
        playerDeck: action.payload.playerDeck,
        opponentDeck: action.payload.opponentDeck,
      };
    case "SET_NEXT_POKEMON":
      return {
        ...state,
        playerPokemon: state.playerDeck[0],
        opponentPokemon: state.opponentDeck[0],
        playerDeck: state.playerDeck.slice(1),
        opponentDeck: state.opponentDeck.slice(1),
      };
    default:
      return state;
  }
}

const GameBoard: FC<GameBoardProps> = ({
  setGameStarted,
  setPlayerDeck,
  playerDeck,
  setOpponentDeck,
  opponentDeck,
}) => {
  const initialState = {
    playerDeck: playerDeck, // Initial player deck
    opponentDeck: opponentDeck, // Initial opponent deck
    playerPokemon: null, // Current player Pokémon
    opponentPokemon: null, // Current opponent Pokémon
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  const [playerChoice, setPlayerChoice] = useState<playerChoiceType | null>(
    null
  );

  const [gameOutcome, setGameOutcome] = useState<string | null>(null);
  const [turnOutcome, setTurnOutcome] = useState<string | null>(null);
  const [score, setScore] = useState<number>(0);

  useEffect(() => {
    if (playerDeck.length > 0 && opponentDeck.length > 0) {
      dispatch({ type: "SET_NEXT_POKEMON" });
    } else if (playerDeck.length === 0) {
      setGameOutcome("lose");
    } else if (opponentDeck.length === 0) {
      setGameOutcome("win");
    }
  }, [playerDeck, opponentDeck]);

  useEffect(() => {
    const compareValues = () => {
      const playerStat = playerChoice?.playerChoiceName;
      const playerValue = playerChoice?.playerChoiceValue;

      let opponentValue = state.opponentPokemon.stats.filter((obj: any) => {
        return obj.stat.name === playerStat;
      })[0]["base_stat"];

      if (playerValue !== null && playerValue !== undefined) {
        if (playerValue >= opponentValue) {
          setTurnOutcome(
            `You win, you receive opponent's ${state.opponentPokemon.name}!`
          );
          // Pass the opponentCard to the end of playerDeck
        } else {
          setTurnOutcome(
            `You lose, opponent receives your ${state.playerPokemon.name}!`
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
  }, [playerChoice]);

  return (
    <>
      <section className="GameBoard">
        {state.playerPokemon && (
          <PlayerCard
            playerPokemon={state.playerPokemon}
            setPlayerChoice={setPlayerChoice}
          />
        )}

        {state.opponentPokemon && (
          <OpponentCard
            opponentPokemon={state.opponentPokemon}
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
