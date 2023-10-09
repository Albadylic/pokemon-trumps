import { FC } from "react";

interface CardProps {
  data: apiShape;
  setPlayerChoice: React.Dispatch<React.SetStateAction<string | null>>;
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

const PlayerCard: FC<CardProps> = ({ data, setPlayerChoice }) => {
  const stats = data.stats.map((item, index) => {
    return (
      <span
        key={index}
        className="player_stat"
        onClick={() => setPlayerChoice(item.stat.name)}
      >
        <p>
          {item.stat.name}: {item.base_stat}
        </p>
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

export default PlayerCard;