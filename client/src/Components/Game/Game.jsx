import React, { useContext, useEffect, useState } from "react";
import GameField from "./GameField";
import GameCard from "./GameCard";
import GameService from "../../Services/GameService";
import Button from "../Button/Button";
import CardBack from "../../Images/card_back.jpg";
import AppContext from "../../Contexts/AppContext";
import { v4 } from "uuid";

export default function ({ game }) {
  const { socket, user } = useContext(AppContext);

  const [gameState, setGameState] = useState({
    opponentDeck:
      game.playerOne.user._id === user._id
        ? game.playerOneDeck
        : game.playerTwoDeck,
    playerDeck:
      game.playerOne.user._id === user._id
        ? game.playerTwoDeck
        : game.playerOneDeck,
    playerCards: [],
    playerMonsterFields: [{}, {}, {}, {}, {}],
    playerMagicFields: [{}, {}, {}, {}, {}],
    playerMaxSummons: 10,
    playerAmountSummons: 0,
    playerMonstersAttacked: [],
    playerEffects: [],
    opponentCards: [],
    opponentMonsterFields: [{}, {}, {}, {}, {}],
    opponentMagicFields: [{}, {}, {}, {}, {}],
    opponentStatus: "",
    opponentMaxSummons: 1,
    opponentAmountSummons: 0,
    opponentMonstersAttacked: [],
    opponentEffects: [],
    turn: game.turn,
    currentTurn: 1,
    currentPhase: "draw-phase",
    isPlayerAttacking: false,
    playerAttackingMonster: null,
  });

  useEffect(() => {
    if (gameState) {
      console.log(gameState)
    }
  }, [gameState])

  useEffect(() => {
    socket.on("get-finish-draw-phase", (data) => {
      setGameState({
        ...gameState,
        currentPhase: "main-phase-1",
        ...data.playerData,
      });
    });

    socket.on("on-card-put-opponent", (playerData) => {
      setGameState({ ...gameState, ...playerData });
    });

    socket.on("get-end-turn", (data) => {
      setGameState({ ...gameState, ...data });
    });

    socket.on("get-battle-phase", () => {
      setGameState({ ...gameState, currentPhase: "battle-phase" });
    });

    socket.on("do-battle", (data) => {
      setGameState({ ...gameState, ...data });
    });

    socket.on("on-card-effect", (data) => {
      const newGameStateFromCardChange = modifyCard(
        data.effectData,
        data.card,
        data.owner,
        data.effectId
      );
      setGameState({
        ...gameState,
        ...newGameStateFromCardChange,
        ...data.gameState,
      });
    });

    socket.on("revert-card-effect", (data) => {
      setGameState({
        ...gameState,
        ...data.gameState,
      });
    });

    return () => {
      socket.off("get-finish-draw-phase");
      socket.off("on-card-put-opponent");
      socket.off("get-end-turn");
      socket.off("get-battle-phase");
      socket.off("do-battle");
      socket.off("on-card-effect");
      socket.off("revert-card-effect");
    };
  }, [gameState]);

  const getPlayer = () => {
    return game.playerOne.user._id == user._id
      ? game.playerOne
      : game.playerTwo;
  };

  const getOpponent = () => {
    return game.playerOne.user._id == user._id
      ? game.playerTwo
      : game.playerOne;
  };

  useEffect(() => {
    let drawPhaseTimeout;
    if (gameState.turn.user._id === getPlayer().user._id) {
      switch (gameState.currentPhase) {
        case "draw-phase":
          drawPhaseTimeout = setTimeout(() => {
            socket.emit("revert-card-effect", {
              playerSocketId: getPlayer().socketId,
              opponentSocketId: getOpponent().socketId,
              gameState,
              type: "player",
            });

            const _playerDeck = [...gameState.playerDeck];
            const _playerCards = [...gameState.playerCards];
            const randomCard = randomArrayElement(gameState.playerDeck);

            let deckIndex;

            if (randomCard) {
              deckIndex = gameState.playerDeck.findIndex(
                (card) => card.uuid === randomCard.uuid
              );
              _playerDeck.splice(deckIndex, 1);
              _playerCards.push(randomCard);
            }

            let opponentSocketId = getOpponent().socketId;

            const playerData = {
              opponentCards: _playerCards,
              opponentDeck: _playerDeck,
            };

            socket.emit("set-finish-draw-phase", {
              opponentSocketId,
              playerData,
            });

            setGameState({
              ...gameState,
              playerCards: _playerCards,
              playerDeck: _playerDeck,
              currentPhase: "main-phase-1",
            });
          }, 1000);
      }
    }

    return () => {
      if (drawPhaseTimeout) {
        clearTimeout(drawPhaseTimeout);
      }
    };
  }, [gameState.currentPhase]);

  const modifyCard = (effectData, card, owner, effectId) => {
    const gm = { ...gameState };
    if (owner === getPlayer().socketId) {
      if (card.category === "monster") {
        const _field = gm.playerMonsterFields.find(
          (field) => field.card && field.card.uuid === card.uuid
        );
        if (_field) {
          _field.card = card;
        }
        gm.playerEffects.push({
          ...card,
          untilTurn: effectData.forTurns
            ? effectData.forTurns + gm.currentTurn
            : null,
          effectId,
        });
      }
    } else {
      if (card.category === "monster") {
        const _field = gm.opponentMonsterFields.find(
          (field) => field.card && field.card.uuid === card.uuid
        );
        if (_field) {
          _field.card = card;
        }
        gm.opponentEffects.push({
          ...card,
          untilTurn: effectData.forTurns
            ? effectData.forTurns + gm.currentTurn
            : null,
          effectId,
        });
      }
    }

    return gm;
  };

  const endTurn = () => {
    socket.emit("set-end-turn", {
      opponentSocketId: getOpponent().socketId,
      gameState: {
        currentPhase: "draw-phase",
        currentTurn: gameState.currentTurn + 1,
        turn: getOpponent(),
      },
    });
    setGameState({
      ...gameState,
      turn: getOpponent(),
      playerAmountSummons: 0,
      currentTurn: gameState.currentTurn + 1,
      currentPhase: "draw-phase",
      playerMonstersAttacked: [],
    });
  };

  function onCardPutPlayer(card, index) {
    const _gameState = GameService.OnCardPutPlayer(gameState, card, index);
    const playerData = {
      opponentMonsterFields: _gameState.playerMonsterFields,
      opponentCards: _gameState.playerCards,
      opponentDeck: _gameState.playerDeck,
    };
    socket.emit("on-card-put-player", {
      opponentSocketId: getOpponent().socketId,
      playerData,
    });

    _gameState.playerEffects.forEach((effect) => {
      const gameData = {
        card: effect,
        effectId: effect.effectId,
        playerSocketId: getPlayer().socketId,
        opponentSocketId: getOpponent().socketId,
        gameState,
      };
      socket.emit("on-card-effect", gameData);
    });

    setGameState(_gameState);
  }

  const onAttackPlayer = (card, index) => {
    if (gameState.currentTurn > 1) {
      socket.emit("set-battle-phase", {
        opponentSocketId: getOpponent().socketId,
      });

      setGameState({
        ...gameState,
        currentPhase: "battle-phase",
        isPlayerAttacking: true,
        playerAttackingMonster: card,
      });
    }
  };

  function onPlayerSelectedOpponentMonsterForAttack(card, index) {
    if (!gameState.playerAttackingMonster) return;
    if (
      gameState.playerMonstersAttacked.includes(
        gameState.playerAttackingMonster.uuid
      )
    )
      return;
    if (gameState.playerAttackingMonster.attack > card.attack) {
      const _opponentMonsterFields = [...gameState.opponentMonsterFields];
      _opponentMonsterFields.splice(index, 1, {});

      socket.emit("do-battle", {
        opponentSocketId: getOpponent().socketId,
        gameState: {
          playerMonsterFields: _opponentMonsterFields,
        },
      });

      setGameState({
        ...gameState,
        opponentMonsterFields: _opponentMonsterFields,
        isPlayerAttacking: false,
        playerAttackingMonster: null,
        playerMonstersAttacked: [
          ...gameState.playerMonstersAttacked,
          gameState.playerAttackingMonster.uuid,
        ],
      });
    } else if (gameState.playerAttackingMonster.attack === card.attack) {
      const _opponentMonsterFields = [...gameState.opponentMonsterFields];
      _opponentMonsterFields.splice(index, 1, {});
      const playerCardIndex = gameState.playerMonsterFields.findIndex(
        (field) => field.card.uuid === gameState.playerAttackingMonster.uuid
      );
      const _playerMonsterFields = [...gameState.playerMonsterFields];
      _playerMonsterFields.splice(playerCardIndex, 1, {});

      socket.emit("do-battle", {
        opponentSocketId: getOpponent().socketId,
        gameState: {
          playerMonsterFields: _opponentMonsterFields,
          opponentMonsterFields: _playerMonsterFields,
        },
      });

      setGameState({
        ...gameState,
        opponentMonsterFields: _opponentMonsterFields,
        playerMonsterFields: _playerMonsterFields,
        isPlayerAttacking: false,
        playerAttackingMonster: null,
        playerMonstersAttacked: [
          ...gameState.playerMonstersAttacked,
          gameState.playerAttackingMonster.uuid,
        ],
      });
    } else if (gameState.playerAttackingMonster.attack < card.attack) {
      const playerCardIndex = gameState.playerMonsterFields.findIndex(
        (field) => field.card.uuid === gameState.playerAttackingMonster.uuid
      );
      const _playerMonsterFields = [...gameState.playerMonsterFields];
      _playerMonsterFields.splice(playerCardIndex, 1, {});

      socket.emit("do-battle", {
        opponentSocketId: getOpponent().socketId,
        gameState: {
          opponentMonsterFields: _playerMonsterFields,
        },
      });

      setGameState({
        ...gameState,
        playerMonsterFields: _playerMonsterFields,
        isPlayerAttacking: false,
        playerAttackingMonster: null,
        playerMonstersAttacked: [
          ...gameState.playerMonstersAttacked,
          gameState.playerAttackingMonster.uuid,
        ],
      });
    }
  }

  const opponentHasMonstersOnField = () => {
    return !!gameState.opponentMonsterFields.filter((field) => field.card)
      .length;
  };

  function randomArrayElement(items) {
    return items[Math.floor(items.length * Math.random())];
  }

  const onCardEffect = (card) => {
    const gameData = {
      opponentSocketId: getOpponent().socketId,
      playerSocketId: getPlayer().socketId,
      card,
      gameState,
      effectId: v4(),
    };
    socket.emit("on-card-effect", gameData);
  };

  return (
    <article className="h-full p-4 w-full border border-indigo-500">
      <div className="w-full flex">
        <div className="w-1/2">
          <div className="flex justify-center">
            <Button
              className="bg-indigo-500 text-white mb-2"
              disabled={
                !gameState.isPlayerAttacking || opponentHasMonstersOnField()
              }
            >
              Opponent
            </Button>
          </div>
          <div className="flex mb-1">
            {gameState.opponentMonsterFields.map((field, index) => (
              <GameField
                isBack={field.card?.isBack}
                card={field.card}
                onPlayerAttack={() =>
                  onPlayerSelectedOpponentMonsterForAttack(field.card, index)
                }
                onEffect={null}
                key={index}
              />
            ))}
          </div>
          <div className="flex">
            {gameState.opponentMagicFields.map((field, index) => (
              <GameField
                isBack={field.card?.isBack}
                card={field.card}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-2 pt-12 flex flex-col justify-between">
          <div className="relative w-32 h-40">
            <div className="bg-indigo-500 text-white flex justify-center items-center absolute top-0 left-0 h-8 w-full">
              {gameState.opponentDeck.length}
            </div>
            <img src={CardBack} className="h-full w-full" />
          </div>
          <div className="flex flex-wrap">
            {gameState.opponentCards.map((card, index) => (
              <div key={index} className="w-32 h-40 mr-1 mb-1">
                <GameCard
                  title={card.title}
                  attack={card.attack}
                  defense={card.defense}
                  isBack={true}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/2 p-2 border border-indigo-500 mt-1 mb-1">
        <div className="flex items-center justify-between">
          <h3 className="py-1 border border-white mr-4">
            {gameState.turn === "player" ? (
              <i className="fas fa-chevron-down"></i>
            ) : (
              <i className="fas fa-chevron-up"></i>
            )}
          </h3>
          <div className="flex items-center">
            <p
              className={
                "mr-2 p-1 " +
                (gameState.currentPhase === "draw-phase"
                  ? "bg-indigo-500 text-white"
                  : "")
              }
            >
              Draw Phase
            </p>
            <i className="fas fa-chevron-right mr-2"></i>

            <p
              className={
                "mr-2 p-1 " +
                (gameState.currentPhase === "main-phase-1"
                  ? "bg-indigo-500 text-white"
                  : "")
              }
            >
              Main Phase 1
            </p>
            <i className="fas fa-chevron-right mr-2"></i>
            <p
              className={
                "mr-2 p-1 " +
                (gameState.currentPhase === "battle-phase"
                  ? "bg-indigo-500 text-white"
                  : "")
              }
            >
              Battle Phase
            </p>
          </div>
          <div className="w-32 flex justify-end">
            {gameState.turn.user._id === getPlayer().user._id ? (
              <button
                onClick={endTurn}
                className="border-b border-indigo-500 hover:border-t hover:border-indigo-500 px-6 py-1"
              >
                End Turn
              </button>
            ) : (
              <h4>Thinking...</h4>
            )}
          </div>
        </div>
      </div>

      <div className="w-full flex">
        <div className="w-1/2">
          <div className="flex mb-1">
            {gameState.playerMonsterFields.map((field, index) => (
              <GameField
                onEffect={(card) => onCardEffect(card)}
                card={field.card}
                onAttack={() => onAttackPlayer(field.card, index)}
                key={index}
              />
            ))}
          </div>
          <div className="flex">
            {gameState.playerMagicFields.map((field, index) => (
              <GameField
                onEffect={(card) => onCardEffect(card)}
                card={field.card}
                key={index}
              />
            ))}
          </div>
        </div>
        <div className="w-1/2 pl-2 flex flex-col justify-between">
          <div className="flex flex-wrap">
            {gameState.playerCards.map((card, index) => (
              <div key={index} className="w-32 h-40 mr-1 mb-1">
                <GameCard
                  attack={card.attack}
                  defense={card.defense}
                  title={card.title}
                  isBack={card.isBack}
                  disabled={
                    gameState.turn.user._id === getOpponent().user._id ||
                    gameState.currentPhase !== "main-phase-1"
                  }
                  onPut={() => onCardPutPlayer(card, index)}
                />
              </div>
            ))}
          </div>
          <div className="relative w-32 h-40">
            <div className="bg-indigo-500 text-white flex justify-center items-center absolute top-0 left-0 h-8 w-full">
              {gameState.playerDeck.length}
            </div>
            <img src={CardBack} className="h-full w-full" />
          </div>
        </div>
      </div>
    </article>
  );
}
