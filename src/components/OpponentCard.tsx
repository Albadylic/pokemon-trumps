import { FC } from "react";

interface playerChoiceType {
  playerChoiceName: string | null;
  playerChoiceValue: number | null;
}

interface CardProps {
  data: apiShape;
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
  data,
  playerChoice,
  setGameOutcome,
}) => {
  const compareValues = () => {
    const playerStat = playerChoice?.playerChoiceName;
    const playerValue = playerChoice?.playerChoiceValue;

    let opponentValue = data.stats.filter((obj) => {
      return obj.stat.name === playerStat;
    })[0]["base_stat"];

    if (playerValue !== null && playerValue !== undefined) {
      return playerValue > opponentValue ? "win" : "lose";
    }

    return null;
  };

  if (playerChoice) {
    setGameOutcome(compareValues());
  }

  const stats = data.stats.map((item, index) => {
    return playerChoice ? (
      <span key={index} className="opponent_stat">
        <p>
          {item.stat.name}: {item.base_stat}
        </p>
      </span>
    ) : (
      <span key={index} className="opponent_stat">
        <p>{item.stat.name}: ??</p>
      </span>
    );
  });

  const type = data.types[0].type.name;

  return (
    <article className={`Card_container ${type}-type`}>
      <h2>{data.name}</h2>
      <img src={data.sprites.front_default} alt={`sprite for ${data.name}`} />
      <div className="Card_stats">{stats}</div>
    </article>
  );
};

export default OpponentCard;
