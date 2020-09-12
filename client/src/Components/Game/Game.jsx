import React, { useEffect, useState } from 'react';
import GameField from './GameField';
import GameCard from './GameCard';
import GameService from '../../Services/GameService';
import Button from '../Button/Button';
import CardBack from '../../Images/card_back.jpg';

export default function () {
  const [gameState, setGameState] = useState({
    opponentDeck: [],
    playerDeck: [],
    playerCards: [],
    playerMonsterFields: [],
    opponentCards: [],
    opponentMonsterFields: [],
    turn: 'player',
    opponentStatus: '',
    playerMaxSummons: 10,
    playerAmountSummons: 0,
    opponentMaxSummons: 1,
    opponentAmountSummons: 0,
    opponentMonstersAttacked: [],
    opponentMonsterEffects: [],
    playerMonstersAttacked: [],
    currentTurn: 1,
    currentPhase: 'draw-phase',
    isPlayerAttacking: false,
    playerAttackingMonster: null,
  });

  useEffect(() => {
    let drawPhaseTimeout;
    if (gameState.turn === 'player') {
      switch (gameState.currentPhase) {
        case 'draw-phase':
          drawPhaseTimeout = setTimeout(() => {
            const _playerDeck = [...gameState.playerDeck];
            const _playerCards = [...gameState.playerCards];
            const randomCard = randomArrayElement(gameState.playerDeck);

            let deckIndex;

            if (randomCard) {
              deckIndex = gameState.playerDeck.findIndex(
                (card) => card.uuid === randomCard.uuid,
              );
              _playerDeck.splice(deckIndex, 1);
              _playerCards.push(randomCard);
            }

            setGameState({
              ...gameState,
              currentPhase: 'main-phase-1',
              playerCards: _playerCards,
              playerDeck: _playerDeck,
            });
          }, 1000);
      }
    }

    return () => {
      if (drawPhaseTimeout) {
        clearTimeout(drawPhaseTimeout);
      }
    };
  }, [gameState.currentPhase, gameState]);

  useEffect(() => {
    if (gameState.opponentMonsterEffects.length) {
      gameState.opponentMonsterEffects.forEach((effect, index) => {
        const monster = gameState.opponentMonsterFields.find(
          (field) => field.card.uuid === effect.uuid,
        );
        const monsterIndex = gameState.opponentMonsterFields.findIndex(
          (field) => field.card.uuid === effect.uuid,
        );
        if (monster) {
          if (effect.endsOnTurn === gameState.currentTurn) {
            const [card] = monster.card.revertEffect(gameState);
            const monsterEffects = [...gameState.opponentMonsterEffects];
            monsterEffects.splice(index, 1);
            const monsterFields = [...gameState.opponentMonsterFields];
            monsterFields[monsterIndex].card = card;
            setGameState({
              ...gameState,
              opponentMonsterEffects: monsterEffects,
              opponentMonsterFields: monsterFields,
            });
          }
        }
      });
    }
  }, [gameState.currentTurn]);

  useEffect(() => {
    let waitingTimeout;
    let thinkingTimeout;
    let dealingTimeout;
    let effectPhaseTimeout;
    let attackingTimeout;
    let endingAttackTimeout;
    let endingTimeout;

    switch (gameState.opponentStatus) {
      case 'waiting':
        waitingTimeout = setTimeout(() => {
          const _opponentDeck = [...gameState.opponentDeck];
          const _opponentCards = [...gameState.opponentCards];
          const randomCard = randomArrayElement(gameState.opponentDeck);

          let deckIndex;

          if (randomCard) {
            deckIndex = gameState.opponentDeck.findIndex(
              (card) => card.uuid === randomCard.uuid,
            );
            _opponentDeck.splice(deckIndex, 1);
            _opponentCards.push(randomCard);
          }

          setGameState({
            ...gameState,
            opponentCards: _opponentCards,
            opponentDeck: _opponentDeck,
            opponentStatus: 'thinking',
          });
        }, 1000);
        break;
      case 'thinking':
        thinkingTimeout = setTimeout(() => {
          setGameState({
            ...gameState,
            opponentStatus: 'dealing',
            currentPhase: 'main-phase-1',
          });
        }, 1000);
        break;
      case 'dealing':
        dealingTimeout = setTimeout(() => {
          const _gameState = GameService.Deal(gameState, setGameState);
          setGameState({ ..._gameState, opponentStatus: 'effect-phase' });
        }, 1000);
        break;
      case 'effect-phase':
        effectPhaseTimeout = setTimeout(() => {
          const _gameState = GameService.OpponentEffectPhase(gameState);
          const shouldAttack = GameService.ShouldAttack(gameState);
          if (shouldAttack) {
            setGameState({
              ..._gameState,
              opponentStatus: 'attacking',
              currentPhase: 'battle-phase',
            });
          } else {
            setGameState({ ..._gameState, opponentStatus: 'ending' });
          }
        }, 1000);
        break;
      case 'attacking':
        attackingTimeout = setTimeout(() => {
          const _gameState = GameService.Attack(gameState, setGameState);
          setGameState(_gameState);
        }, 1000);
        break;
      case 'ending-attack':
        endingAttackTimeout = setTimeout(() => {
          if (GameService.ShouldAttack(gameState)) {
            setGameState({ ...gameState, opponentStatus: 'attacking' });
          } else {
            setGameState({
              ...gameState,
              opponentStatus: 'ending',
              opponentMonstersAttacked: [],
            });
          }
        }, 1000);
        break;
      case 'ending':
        endingTimeout = setTimeout(() => {
          setGameState({
            ...gameState,
            turn: 'player',
            currentTurn: gameState.currentTurn + 1,
            currentPhase: 'draw-phase',
          });
        }, 1000);
    }

    return () => {
      if (waitingTimeout) {
        clearTimeout(waitingTimeout);
      } else if (thinkingTimeout) {
        clearTimeout(thinkingTimeout);
      } else if (dealingTimeout) {
        clearTimeout(dealingTimeout);
      } else if (effectPhaseTimeout) {
        clearTimeout(effectPhaseTimeout);
      } else if (attackingTimeout) {
        clearTimeout(attackingTimeout);
      } else if (endingAttackTimeout) {
        clearTimeout(endingAttackTimeout);
      } else if (endingTimeout) {
        clearTimeout(endingTimeout);
      }
    };
  }, [gameState.opponentStatus]);

  useEffect(() => {
    importCards();
  }, []);

  const importCards = async () => {
    const _opponentCardsRaw = ['SuperFairy', 'Fairy'];
    const _playerCardsRaw = ['SuperWarrior', 'Fairy'];
    let _opponentDeck = [];
    let _playerDeck = [];

    for (let card of _opponentCardsRaw) {
      const cardImport = await import(`../../Data/Cards/${card}.js`);
      const _card = new cardImport.default();
      _card.isBack = true;
      _opponentDeck.push(_card);
    }

    for (let card of _playerCardsRaw) {
      const cardImport = await import(`../../Data/Cards/${card}.js`);
      const _card = new cardImport.default();
      _playerDeck.push(_card);
    }

    const _opponentMonsterFields = [{}, {}, {}, {}, {}];
    const _playerMonsterFields = [{}, {}, {}, {}, {}];

    setGameState({
      ...gameState,
      opponentDeck: _opponentDeck,
      playerDeck: _playerDeck,
      opponentMonsterFields: _opponentMonsterFields,
      playerMonsterFields: _playerMonsterFields,
    });
  };

  const endTurn = () => {
    setGameState({
      ...gameState,
      turn: 'opponent',
      opponentStatus: 'waiting',
      playerAmountSummons: 0,
      currentTurn: gameState.currentTurn + 1,
      currentPhase: 'draw-phase',
    });
  };

  function onCardPutPlayer(card, index) {
    const _gameState = GameService.OnCardPutPlayer(gameState, card, index);
    setGameState(_gameState);
  }

  const onAttackPlayer = (card, index) => {
    if (gameState.currentTurn > 1) {
      setGameState({
        ...gameState,
        currentPhase: 'battle-phase',
        isPlayerAttacking: true,
        playerAttackingMonster: card,
      });
    }
  };

  function onPlayerSelectedOpponentMonsterForAttack(card, index) {
    if (!gameState.playerAttackingMonster) return;
    console.log(
      gameState.playerAttackingMonster.uuid,
      gameState.playerMonstersAttacked,
    );
    if (
      gameState.playerMonstersAttacked.includes(
        gameState.playerAttackingMonster.uuid,
      )
    )
      return;
    if (gameState.playerAttackingMonster.attack > card.attack) {
      const _opponentMonsterFields = [...gameState.opponentMonsterFields];
      _opponentMonsterFields.splice(index, 1, {});
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
        (field) => field.card.uuid === gameState.playerAttackingMonster.uuid,
      );
      const _playerMonsterFields = [...gameState.playerMonsterFields];
      _playerMonsterFields.splice(playerCardIndex, 1);
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
        (field) => field.card.uuid === gameState.playerAttackingMonster.uuid,
      );
      const _playerMonsterFields = [...gameState.playerMonsterFields];
      _playerMonsterFields.splice(playerCardIndex, 1);
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
    // "|" for a kinda "int div"
    return items[(items.length * Math.random()) | 0];
  }

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
                card={field.card}
                onPlayerAttack={() =>
                  onPlayerSelectedOpponentMonsterForAttack(field.card, index)
                }
                key={index}
              />
            ))}
          </div>
          <div className="flex">
            <GameField />
            <GameField />
            <GameField />
            <GameField />
            <GameField />
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
                  isBack={card.isBack}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-1/2 p-2 border border-indigo-500 mt-1 mb-1">
        <div className="flex items-center justify-between">
          <h3 className="py-1 border border-white mr-4">
            {gameState.turn === 'player' ? (
              <i className="fas fa-chevron-down"></i>
            ) : (
              <i className="fas fa-chevron-up"></i>
            )}
          </h3>
          <div className="flex items-center">
            <p
              className={
                'mr-2 p-1 ' +
                (gameState.currentPhase === 'draw-phase'
                  ? 'bg-indigo-500 text-white'
                  : '')
              }
            >
              Draw Phase
            </p>
            <i className="fas fa-chevron-right mr-2"></i>

            <p
              className={
                'mr-2 p-1 ' +
                (gameState.currentPhase === 'main-phase-1'
                  ? 'bg-indigo-500 text-white'
                  : '')
              }
            >
              Main Phase 1
            </p>
            <i className="fas fa-chevron-right mr-2"></i>
            <p
              className={
                'mr-2 p-1 ' +
                (gameState.currentPhase === 'battle-phase'
                  ? 'bg-indigo-500 text-white'
                  : '')
              }
            >
              Battle Phase
            </p>
          </div>
          <div className="w-32 flex justify-end">
            {gameState.turn === 'player' ? (
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
                card={field.card}
                onAttack={() => onAttackPlayer(field.card, index)}
                key={index}
              />
            ))}
          </div>
          <div className="flex">
            <GameField />
            <GameField />
            <GameField />
            <GameField />
            <GameField />
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
                    gameState.turn !== 'player' &&
                    (gameState.currentPhase !== 'main-phase-1' ||
                      gameState.currentPhase !== 'main-phase-2')
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
