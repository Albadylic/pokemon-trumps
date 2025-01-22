import { FC } from "react";

interface playerChoiceType {
  playerChoiceName: string | null;
  playerChoiceValue: number | null;
}

interface CardProps {
  opponentPokemon: apiShape;
  playerChoice: playerChoiceType | null;
  setGameOutcome: React.Dispatch<React.SetStateAction<string | null>>;
}

interface apiShape {
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

const OpponentCard: FC<CardProps> = ({
  opponentPokemon,
  playerChoice,
  setGameOutcome,
}) => {
  const compareValues = () => {
    const playerStat = playerChoice?.playerChoiceName;
    const playerValue = playerChoice?.playerChoiceValue;

    let opponentValue = opponentPokemon.stats.filter((obj) => {
      return obj.stat.name === playerStat;
    })[0]["base_stat"];

    if (playerValue !== null && playerValue !== undefined) {
      return playerValue >= opponentValue ? "win" : "lose";
    }

    return null;
  };

  if (playerChoice) {
    setGameOutcome(compareValues());
  }

  const stats = opponentPokemon.stats.map((item, index) => {
    return playerChoice ? (
      <div key={index} className="opponent_stat">
        <p>{item.stat.name}: </p>
        <p>{item.base_stat}</p>
      </div>
    ) : (
      <div key={index} className="opponent_stat">
        <p>{item.stat.name}: </p>
        <p>??</p>
      </div>
    );
  });

  const type = opponentPokemon.types[0].type.name;

  return (
    <article className={`Card_container ${type}-type`}>
      <h2>{opponentPokemon.name}</h2>
      <img
        src={opponentPokemon.sprites.front_default}
        alt={`sprite for ${opponentPokemon.name}`}
      />
      <div className="Card_stats">{stats}</div>
    </article>
  );
};

export default OpponentCard;
