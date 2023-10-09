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
  types: object[];
}

const OpponentCard: FC<CardProps> = ({
  data,
  playerChoice,
  setGameOutcome,
}) => {
  const compareValues = () => {
    // Compare the value of the player's chosen stat to that of the opponent
    // setGameOutcome to win / lose
  };

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

  return (
    <article className="Card_container">
      <h2>{data.name}</h2>
      <img src={data.sprites.front_default} alt={`sprite for ${data.name}`} />
      <div className="Card_stats">{stats}</div>
    </article>
  );
};

export default OpponentCard;
