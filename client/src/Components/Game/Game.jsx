import React, { useEffect, useState } from 'react';
import GameField from './GameField';
import GameCard from './GameCard';
import GameService from '../../Services/GameService';

export default function () {
  const [gameState, setGameState] = useState({
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
  });

  useEffect(() => {
    console.log(gameState.opponentMonsterEffects);
    if (gameState.opponentMonsterEffects.length) {
      console.log('effects found');
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
          setGameState({ ...gameState, opponentStatus: 'thinking' });
        }, 1000);
        break;
      case 'thinking':
        thinkingTimeout = setTimeout(() => {
          setGameState({ ...gameState, opponentStatus: 'dealing' });
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
            setGameState({ ..._gameState, opponentStatus: 'attacking' });
          } else {
            setGameState({ ..._gameState, turn: 'player' });
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
        }, 500);
        break;
      case 'ending':
        endingTimeout = setTimeout(() => {
          setGameState({
            ...gameState,
            turn: 'player',
            currentTurn: gameState.currentTurn + 1,
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
    const _opponentCardsRaw = ['SuperFairy'];
    const _playerCardsRaw = ['SuperWarrior'];
    let _opponentCards = [];
    let _playerCards = [];

    for (let card of _opponentCardsRaw) {
      const cardImport = await import(`../../Data/Cards/${card}.js`);
      const _card = new cardImport.default();
      _card.isBack = true;
      _opponentCards.push(_card);
    }

    for (let card of _playerCardsRaw) {
      const cardImport = await import(`../../Data/Cards/${card}.js`);
      const _card = new cardImport.default();
      _playerCards.push(_card);
    }

    const _opponentMonsterFields = [{}, {}, {}, {}, {}];
    const _playerMonsterFields = [{}, {}, {}, {}, {}];

    setGameState({
      ...gameState,
      opponentCards: _opponentCards,
      playerCards: _playerCards,
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
    });
  };

  function onCardPutPlayer(card, index) {
    const _gameState = GameService.OnCardPutPlayer(gameState, card, index);
    setGameState(_gameState);
  }

  return (
    <article className="h-full p-4 w-full border border-indigo-500">
      <div className="flex">
        <div>
          <div className="flex mb-1">
            {gameState.opponentMonsterFields.map((field, index) => (
              <GameField card={field.card} key={index} />
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
        <div className="w-1/2 pl-2">
          <h2>Opponent's Cards</h2>
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

      <div className="py-2">
        <div className="flex items-center">
          <h3 className="py-1 border border-white mr-4">
            {gameState.turn === 'player' ? 'Your Turn' : "Opponent's Turn"}
          </h3>
          {gameState.turn === 'player' ? (
            <button
              onClick={endTurn}
              className="border-b border-indigo-500 hover:border-t hover:border-indigo-500 px-6 py-1"
            >
              End Turn
            </button>
          ) : (
            <h4>Status: {gameState.opponentStatus}...</h4>
          )}
        </div>
      </div>

      <div className="flex">
        <div>
          <div className="flex mb-1">
            {gameState.playerMonsterFields.map((field, index) => (
              <GameField card={field.card} key={index} />
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
        <div className="w-1/2 pl-2">
          <h2>Your Cards</h2>
          <div className="flex flex-wrap">
            {gameState.playerCards.map((card, index) => (
              <div key={index} className="w-32 h-40 mr-1 mb-1">
                <GameCard
                  attack={card.attack}
                  defense={card.defense}
                  title={card.title}
                  isBack={card.isBack}
                  onPut={() => onCardPutPlayer(card, index)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
