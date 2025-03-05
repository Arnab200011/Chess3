import React from 'react';
import Square from './Square';
import classNames from 'classnames';
import { getValidMoves } from '../utils/chessLogic';

function Board({ board, selectedPiece, onSquareClick, currentPlayer }) {
  const isValidSelection = (row, col) => {
    const piece = board[row][col];
    return piece && piece.color === currentPlayer;
  };

  const validMoves = selectedPiece ? getValidMoves(board, selectedPiece) : [];
  const isValidMove = (row, col) => validMoves.some(move => move.row === row && move.col === col);

  return (
    <div className="grid grid-cols-8 gap-0 w-[640px] h-[640px] border-4 border-amber-900 rounded-lg shadow-2xl">
      {board.map((row, rowIndex) => (
        row.map((piece, colIndex) => {
          const isSelected = selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
          const isLight = (rowIndex + colIndex) % 2 === 0;
          const canMoveTo = isValidMove(rowIndex, colIndex);
          
          return (
            <Square
              key={`${rowIndex}-${colIndex}`}
              piece={piece}
              isLight={isLight}
              isSelected={isSelected}
              isValidMove={canMoveTo}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              className={classNames({
                'cursor-pointer': isValidSelection(rowIndex, colIndex) || selectedPiece,
                'ring-2 ring-blue-500': isSelected,
                'ring-2 ring-green-500': !isSelected && canMoveTo
              })}
            />
          );
        })
      ))}
    </div>
  );
}

export default Board;