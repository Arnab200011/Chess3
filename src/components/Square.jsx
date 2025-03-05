import React from 'react';
import classNames from 'classnames';
import { getPieceSymbol } from '../utils/pieceSymbols';

function Square({ piece, isLight, isSelected, isValidMove, onClick, className }) {
  return (
    <div
      className={classNames(
        'w-20 h-20 flex items-center justify-center text-5xl relative',
        isLight ? 'bg-amber-100' : 'bg-amber-800',
        className
      )}
      onClick={onClick}
    >
      {isValidMove && !piece && (
        <div className="absolute w-4 h-4 rounded-full bg-green-500 opacity-50" />
      )}
      {isValidMove && piece && (
        <div className="absolute inset-0 bg-red-500 opacity-20" />
      )}
      {piece && (
        <span 
          className={classNames(
            'transform transition-transform hover:scale-110',
            piece.color === 'white' 
              ? 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.5)]' 
              : 'text-gray-900 drop-shadow-[0_2px_2px_rgba(255,255,255,0.5)]'
          )}
        >
          {getPieceSymbol(piece.type)}
        </span>
      )}
    </div>
  );
}

export default Square;