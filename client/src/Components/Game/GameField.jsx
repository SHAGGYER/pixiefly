import React from "react";
import GameCard from "./GameCard";

export default function ({ card, onAttack, onPlayerAttack, isBack, onEffect }) {
  return (
    <div className="h-40 w-1/5 border border-r-0 last:border-r border-indigo-500">
      {card && (
        <div
          className="w-full h-full"
          onClick={() => (onPlayerAttack ? onPlayerAttack() : {})}
        >
          <GameCard
            isBack={isBack}
            title={card.title}
            attack={card.attack}
            defense={card.defense}
            onAttack={onAttack}
            hasEffect={card.effect}
            onEffect={card.effect && onEffect ? () => onEffect(card) : null}
          />
        </div>
      )}
    </div>
  );
}
