import React from 'react';
import GameCard from './GameCard';

export default function ({ card }) {
  return (
    <div className="h-40 w-32 border border-r-0 last:border-r border-indigo-500">
      {card && (
        <div className="w-full h-full">
          <GameCard
            isBack={card.isBack}
            title={card.title}
            attack={card.attack}
            defense={card.defense}
          />
        </div>
      )}
    </div>
  );
}
