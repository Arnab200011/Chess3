import React, { useState } from 'react';
import Board from './components/Board';
import GameInfo from './components/GameInfo';
import { initialBoard, isValidMove, makeMove } from './utils/chessLogic';

function App() {
  const [board, setBoard] = useState(initialBoard());
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState('white');
  const [gameHistory, setGameHistory] = useState([]);
  const [promotionPending, setPromotionPending] = useState(null);

  const handleSquareClick = (row, col) => {
    if (promotionPending) return;

    if (!selectedPiece) {
      const piece = board[row][col];
      if (piece && piece.color === currentPlayer) {
        setSelectedPiece({ row, col });
      }
    } else {
      const moveResult = isValidMove(board, selectedPiece, { row, col }, gameHistory);
      
      if (moveResult.valid) {
        if (moveResult.promotion) {
          setPromotionPending({ from: selectedPiece, to: { row, col } });
        } else {
          const newBoard = makeMove(board, selectedPiece, { row, col }, moveResult);
          setBoard(newBoard);
          setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
          setGameHistory([...gameHistory, { from: selectedPiece, to: { row, col }, piece: board[selectedPiece.row][selectedPiece.col] }]);
        }
      }
      setSelectedPiece(null);
    }
  };

  const handlePromotion = (pieceType) => {
    if (!promotionPending) return;

    const newBoard = [...board];
    newBoard[promotionPending.to.row][promotionPending.to.col] = {
      type: pieceType,
      color: currentPlayer,
      hasMoved: true
    };
    newBoard[promotionPending.from.row][promotionPending.from.col] = null;

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
    setPromotionPending(null);
    setGameHistory([...gameHistory, { 
      from: promotionPending.from, 
      to: promotionPending.to, 
      promotion: pieceType 
    }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <div className="flex flex-col md:flex-row gap-8">
          <Board
            board={board}
            selectedPiece={selectedPiece}
            onSquareClick={handleSquareClick}
            currentPlayer={currentPlayer}
          />
          <GameInfo
            currentPlayer={currentPlayer}
            gameHistory={gameHistory}
            promotionPending={promotionPending}
            onPromotion={handlePromotion}
          />
        </div>
      </div>
    </div>
  );
}

export default App;