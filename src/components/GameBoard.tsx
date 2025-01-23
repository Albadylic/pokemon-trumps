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
        playerDeck: [...state.playerDeck, state.opponentDeck[0]],
      };
    case "OPPONENT_WIN":
      return {
        ...state,
        opponentDeck: [...state.opponentDeck, state.playerDeck[0]],
      };
    case "SET_NEXT_POKEMON":
      return {
        ...state,
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
    console.log(state.opponentDeck[0]);
    const compareValues = () => {
      const playerStat = playerChoice?.playerChoiceName;
      const playerValue = playerChoice?.playerChoiceValue;

      let opponentValue = state.opponentDeck[0].stats.filter((obj: any) => {
        return obj.stat.name === playerStat;
      })[0]["base_stat"];

      if (playerValue !== null && playerValue !== undefined) {
        if (playerValue >= opponentValue) {
          setTurnOutcome(
            `You win, you receive opponent's ${state.opponentDeck[0].name}!`
          );
          // Pass the opponentCard to the end of playerDeck
          dispatch({ type: "PLAYER_WIN" });
        } else {
          setTurnOutcome(
            `You lose, opponent receives your ${state.playerDeck[0].name}!`
          );
          // Pass the playerCard to the end of opponentDeck
          dispatch({ type: "OPPONENT_WIN" });
        }
      }

      return null;
    };

    if (playerChoice) {
      compareValues();
      // Set next pokemon - should happen when the decks are changed above
      dispatch({ type: "SET_NEXT_POKEMON" });
    }
  }, [playerChoice, state.opponentDeck, state.playerDeck]);

  return (
    <>
      <section className="GameBoard">
        {state.playerDeck[0] && (
          <PlayerCard
            playerPokemon={state.playerDeck[0]}
            setPlayerChoice={setPlayerChoice}
          />
        )}

        {state.opponentDeck[0] && (
          <OpponentCard
            opponentPokemon={state.opponentDeck[0]}
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
