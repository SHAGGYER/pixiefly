import React, { useEffect, useState } from "react";
import Page from "../../Components/Page/Page";
import GameBoard from "../../Components/Game/Game";
import { useContext } from "react";
import AppContext from "../../Contexts/AppContext";

export default function () {
  const { socket, user } = useContext(AppContext);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    socket.on("game-found", (game) => {
      setLoading(false);
      console.log(game.turn);
      setGame(game);
    });
  }, []);

  const findGame = () => {
    socket.emit("find-game", user);
    setLoading(true);
  };

  return (
    <Page>
      {game ? (
        <GameBoard game={game} />
      ) : (
        <div>
          <button className="text-white bg-blue-600 p-2" onClick={findGame}>
            Find Game
          </button>
          {loading && <p>Waiting for opponent...</p>}
        </div>
      )}
    </Page>
  );
}
