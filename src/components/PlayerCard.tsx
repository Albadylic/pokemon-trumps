import { FC } from "react";

interface playerChoiceType {
  playerChoiceName: string | null;
  playerChoiceValue: number | null;
}

interface CardProps {
  data: apiShape;
  setPlayerChoice: React.Dispatch<
    React.SetStateAction<playerChoiceType | null>
  >;
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

const PlayerCard: FC<CardProps> = ({ data, setPlayerChoice }) => {
  const stats = data.stats.map((item, index) => {
    return (
      <div
        key={index}
        className="player_stat"
        onClick={() =>
          setPlayerChoice({
            playerChoiceName: item.stat.name,
            playerChoiceValue: item.base_stat,
          })
        }
      >
        <p>{item.stat.name}: </p>
        <p>{item.base_stat}</p>
      </div>
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

export default PlayerCard;
