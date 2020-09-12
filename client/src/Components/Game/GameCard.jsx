import React, { useRef, useState } from 'react';
import CardBack from '../../Images/card_back.jpg';
import { useClickOutside } from '../../Hooks/ClickOutside';
import Button from '../Button/Button';

export default function ({
  isBack,
  title,
  attack,
  defense,
  onPut,
  disabled,
  onAttack,
}) {
  const cardRef = useRef(null);
  const [overlayActive, setOverlayActive] = useState(false);

  useClickOutside(cardRef, () => {
    setOverlayActive(false);
  });

  const handleOnPut = () => {
    onPut();
    setOverlayActive(false);
  };

  return (
    <article className="w-full h-full">
      {isBack ? (
        <img src={CardBack} className="h-full w-full" />
      ) : (
        <div
          className="h-full flex flex-col bg-gray-300 p-2 cursor-pointer relative"
          ref={cardRef}
          onMouseEnter={() => setOverlayActive(true)}
          onMouseLeave={() => setOverlayActive(false)}
        >
          {(onAttack || onPut) && (
            <div
              style={{
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              className={'absolute ' + (overlayActive ? 'block' : 'hidden')}
            >
              {onPut && (
                <Button
                  disabled={disabled}
                  onClick={handleOnPut}
                  className="bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  PUT
                </Button>
              )}

              {onAttack && (
                <Button
                  disabled={disabled}
                  onClick={onAttack}
                  className="bg-gray-500 text-white rounded hover:bg-gray-700"
                >
                  ATTACK
                </Button>
              )}
            </div>
          )}
          <div className="flex-grow">
            <h3>{title}</h3>
          </div>
          <div className="text-xs flex justify-center">
            {attack} / {defense}
          </div>
        </div>
      )}
    </article>
  );
}
