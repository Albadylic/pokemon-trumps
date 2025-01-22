import { FC } from "react";

interface playerChoiceType {
  playerChoiceName: string | null;
  playerChoiceValue: number | null;
}

interface CardProps {
  playerPokemon: apiShape;
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

const PlayerCard: FC<CardProps> = ({ playerPokemon, setPlayerChoice }) => {
  const stats = playerPokemon.stats.map((item, index) => {
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

  const type = playerPokemon.types[0].type.name;

  return (
    <article className={`Card_container ${type}-type`}>
      <h2>{playerPokemon.name}</h2>
      <img
        src={playerPokemon.sprites.front_default}
        alt={`sprite for ${playerPokemon.name}`}
      />
      <div className="Card_stats">{stats}</div>
    </article>
  );
};

export default PlayerCard;
