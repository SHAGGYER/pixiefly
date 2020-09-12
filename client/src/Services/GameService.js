export default class GameService {
  static Deal = (gameState) => {
    const maxPlayerAttackMonster = GameService.GetMaxPlayerAttackMonsterField(
      gameState,
    );
    const hasAvailablePlayerMonsterFields = GameService.IsPlayerMonsterFieldAvailable(
      gameState,
    );
    const maxOpponentAttackMonsterCard = GameService.GetMaxOpponentAttackMonsterCard(
      gameState,
    );

    if (
      (maxOpponentAttackMonsterCard &&
        maxPlayerAttackMonster &&
        maxOpponentAttackMonsterCard.attack >
          maxPlayerAttackMonster.card.attack) ||
      (maxOpponentAttackMonsterCard && hasAvailablePlayerMonsterFields)
    ) {
      const {
        opponentMonsterFields,
        opponentCards,
      } = GameService.OnCardPutOpponent(
        gameState,
        maxOpponentAttackMonsterCard,
      );
      return { ...gameState, opponentMonsterFields, opponentCards };
    }
    return { ...gameState };
  };

  static IsPlayerMonsterFieldAvailable = (gameState) => {
    return gameState.playerMonsterFields.filter((field) => !field.card).length;
  };

  static FindAvailablePlayerMonsterFieldIndex = (gameState) => {
    return gameState.playerMonsterFields.findIndex((field) => !field.card);
  };

  static IsOpponentMonsterFieldAvailable = (gameState) => {
    return gameState.opponentMonsterFields.filter((field) => !field.card)
      .length;
  };

  static FindAvailableOpponentMonsterFieldIndex = (gameState) => {
    return gameState.opponentMonsterFields.findIndex((field) => !field.card);
  };

  static FindOpponentCardIndex = (gameState, card) => {
    return gameState.opponentCards.findIndex(
      (_card) => _card.uuid === card.uuid,
    );
  };

  static OnCardPutPlayer(gameState, card, index) {
    if (
      GameService.IsPlayerMonsterFieldAvailable(gameState) &&
      gameState.playerAmountSummons < gameState.playerMaxSummons
    ) {
      const _cards = [...gameState.playerCards];
      _cards.splice(index, 1);
      const _index = GameService.FindAvailablePlayerMonsterFieldIndex(
        gameState,
      );
      const _fields = [...gameState.playerMonsterFields];
      _fields[_index].card = card;
      return {
        ...gameState,
        playerCards: _cards,
        playerMonsterFields: _fields,
        playerAmountSummons: gameState.playerAmountSummons + 1,
      };
    }

    return { ...gameState };
  }

  static OnCardPutOpponent(gameState, card) {
    if (GameService.IsOpponentMonsterFieldAvailable(gameState)) {
      card.isBack = false;

      const index = GameService.FindOpponentCardIndex(gameState, card);
      const _cards = [...gameState.opponentCards];
      _cards.splice(index, 1);

      const _index = GameService.FindAvailableOpponentMonsterFieldIndex(
        gameState,
      );
      const _fields = [...gameState.opponentMonsterFields];
      _fields[_index].card = card;

      return {
        opponentMonsterFields: _fields,
        opponentCards: _cards,
      };
    }

    return { ...gameState };
  }

  static GetMaxPlayerAttackMonsterField = (gameState) => {
    let maxPlayerAttackMonster;

    const availablePlayerMonsterCards = gameState.playerMonsterFields.filter(
      (field) => field.card,
    );

    if (availablePlayerMonsterCards.length) {
      maxPlayerAttackMonster = availablePlayerMonsterCards.reduce(
        (prev, current) => {
          return prev.card.attack > current.card.attack ? prev : current;
        },
      );
    }

    return maxPlayerAttackMonster;
  };

  static GetMinPlayerAttackMonsterField = (gameState) => {
    let minPlayerAttackMonster;

    const availablePlayerMonsterFields = gameState.playerMonsterFields.filter(
      (field) => field.card,
    );
    if (availablePlayerMonsterFields.length) {
      minPlayerAttackMonster = availablePlayerMonsterFields.reduce(
        (prev, current) => {
          return prev.card.attack < current.card.attack ? prev : current;
        },
      );
    }

    return minPlayerAttackMonster;
  };

  static GetMaxOpponentAttackMonsterCard = (gameState) => {
    let maxOpponentAttackMonster;
    if (gameState.opponentCards.length) {
      maxOpponentAttackMonster = gameState.opponentCards.reduce(
        (prev, current) => {
          return prev.attack < current.attack ? prev : current;
        },
      );
    }

    return maxOpponentAttackMonster;
  };

  static OpponentEffectPhase = (gameState) => {
    const _gameState = { ...gameState };
    let cardGameState;
    for (let [index, field] of gameState.opponentMonsterFields.entries()) {
      if (field.card && field.card.effect) {
        let cardReturn = field.card.effect(gameState);
        if (cardReturn && cardReturn.length) {
          _gameState.opponentMonsterFields[index].card = cardReturn[0];
          cardGameState = cardReturn[1];
        }
      }
    }

    return { ..._gameState, ...cardGameState };
  };

  static ShouldAttack = (gameState) => {
    const minPlayerAttackMonster = GameService.GetMinPlayerAttackMonsterField(
      gameState,
    );
    const maxOpponentAttackMonster = GameService.GetOpponentAttackMonster(
      gameState,
      minPlayerAttackMonster,
    );

    if (
      maxOpponentAttackMonster &&
      minPlayerAttackMonster &&
      maxOpponentAttackMonster.card.attack > minPlayerAttackMonster.card.attack
    ) {
      return true;
    } else if (
      maxOpponentAttackMonster &&
      minPlayerAttackMonster &&
      minPlayerAttackMonster.card.attack >= maxOpponentAttackMonster.card.attack
    ) {
      return false;
    } else if (maxOpponentAttackMonster) {
      return true;
    }

    return false;
  };

  static GetOpponentAttackMonster = (
    gameState,
    minPlayerAttackMonsterField,
  ) => {
    let monster;
    const availableMonsters = gameState.opponentMonsterFields.filter(
      (field) => {
        return (
          ((minPlayerAttackMonsterField &&
            field.card &&
            field.card.attack > minPlayerAttackMonsterField.card.attack) ||
            field.card) &&
          !gameState.opponentMonstersAttacked.includes(field.card.uuid)
        );
      },
    );

    if (availableMonsters.length) {
      monster = availableMonsters.reduce((prev, current) => {
        return prev.card.attack > current.card.attack ? prev : current;
      });
    }

    return monster;
  };

  static Attack = (gameState) => {
    const minPlayerAttackMonsterField = GameService.GetMinPlayerAttackMonsterField(
      gameState,
    );

    const opponentMonster = GameService.GetOpponentAttackMonster(
      gameState,
      minPlayerAttackMonsterField,
    );

    if (minPlayerAttackMonsterField) {
      console.log('attacking player monster');
      const index = gameState.playerMonsterFields.findIndex(
        (field) =>
          field.card &&
          field.card.uuid === minPlayerAttackMonsterField.card.uuid,
      );
      const _playerMonsterFields = [...gameState.playerMonsterFields];
      _playerMonsterFields.splice(index, 1, {});

      return {
        ...gameState,
        playerMonsterFields: _playerMonsterFields,
        opponentStatus: 'ending-attack',
        opponentMonstersAttacked: [
          ...gameState.opponentMonstersAttacked,
          opponentMonster.card.uuid,
        ],
      };
    } else {
      console.log('attacking lifepoints directly');
      return {
        ...gameState,
        opponentStatus: 'ending-attack',
        opponentMonstersAttacked: [
          ...gameState.opponentMonstersAttacked,
          opponentMonster.card.uuid,
        ],
      };
    }
  };
}
