import { FC, useState } from "react";
import "./App.css";

import Header from "./components/Header";
import GameBoard from "./components/GameBoard";

interface PlayButtonProps {
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>;
}

const PlayButton: FC<PlayButtonProps> = ({ setGameStarted }) => {
  return <button onClick={() => setGameStarted(true)}>Play</button>;
};

const App: FC = () => {
  const [gameStarted, setGameStarted] = useState(false);

  return (
    <div className="App">
      <Header />
      {gameStarted ? (
        <GameBoard setGameStarted={setGameStarted} />
      ) : (
        <PlayButton setGameStarted={setGameStarted} />
      )}
    </div>
  );
};

export default App;
