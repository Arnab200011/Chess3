// import React from 'react';
// import queen from '../assets/images/queen.png';
// import rook from '../assets/images/rook.png';
// import bishop from '../assets/images/bishop.jpg';
// import knight from '../assets/images/knight.png';
// import pawn from '../assets/images/pawn.jpg';
// import king from '../assets/images/king.png';
// import defaultPiece from '../assets/images/default.png'; // Fallback image

// // Utility function to convert board indices to algebraic notation
// function parseSquare({ row, col }) {
//   const files = 'abcdefgh';
//   return `${files[col]}${8 - row}`;
// }

// // Mapping standard chess notation to image keys
// const pieceImages = { queen, rook, bishop, knight, pawn, king };
// const pieceMap = {
//   P: 'pawn', N: 'knight', B: 'bishop', R: 'rook', Q: 'queen', K: 'king',
//   p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king'
// };

// function GameInfo({ currentPlayer, gameHistory, promotionPending, onPromotion }) {
//   const promotionPieces = ['queen', 'rook', 'bishop', 'knight'];

//   return (
//     <div className="w-64 p-4 bg-gray-50 rounded-lg">
//       <h2 className="text-xl font-bold mb-4">Game Info</h2>
      
//       <div className="mb-4">
//         <p className="font-semibold">Current Turn:</p>
//         <p className={`capitalize ${currentPlayer === 'white' ? 'text-gray-700' : 'text-gray-900'}`}>
//           {currentPlayer}
//         </p>
//       </div>

//       {promotionPending && (
//         <div className="mb-4">
//           <p className="font-semibold mb-2">Promote to:</p>
//           <div className="flex gap-2">
//             {promotionPieces.map(piece => (
//               <button
//                 key={piece}
//                 onClick={() => onPromotion(piece)}
//                 className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 capitalize"
//               >
//                 <img src={pieceImages[piece] || defaultPiece} alt={piece} className="w-6 h-6 inline-block mr-2" />
//                 {piece}
//               </button>
//             ))}
//           </div>
//         </div>
//       )}

//       <div>
//         <p className="font-semibold mb-2">Move History (PGN):</p>
//         <div className="h-64 overflow-y-auto text-sm">
//           {gameHistory.map((move, index) => {
//             console.log("Move Data:", pieceImages[move.piece.type] );
            
//             const promotionKey = move.promotion ? pieceMap[move.promotion] : null;
            
//             return (
//               <div key={index} className="mb-1 flex items-center gap-2">
//                 {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ''}
//                 <img src={pieceImages[move.piece.type] || defaultPiece} alt={move.piece || 'unknown'} className="w-4 h-4 inline-block" />
//                 {parseSquare(move.from)} → {parseSquare(move.to)}
//                 {promotionKey && (
//                   <>
//                     {' ('}
//                     <img src={pieceImages[promotionKey] || defaultPiece} alt={move.promotion || 'unknown'} className="w-4 h-4 inline-block" />
//                     {')'}
//                   </>
//                 )}
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// }

// export default GameInfo;
// ....................................................



import React from 'react';
import queen from '../assets/images/queen.png';
import rook from '../assets/images/rook.png';
import bishop from '../assets/images/bishop.jpg';
import knight from '../assets/images/knight.jpg';
import pawn from '../assets/images/pawn.jpg';
import king from '../assets/images/king.png';
import defaultPiece from '../assets/images/default.png'; // Fallback image

// Utility function to convert board indices to algebraic notation
function parseSquare({ row, col }) {
  const files = 'abcdefgh';
  return `${files[col]}${8 - row}`;
}

// Mapping standard chess notation to image keys
const pieceImages = { queen, rook, bishop, knight, pawn, king };
const pieceMap = {
  P: 'pawn', N: 'knight', B: 'bishop', R: 'rook', Q: 'queen', K: 'king',
  p: 'pawn', n: 'knight', b: 'bishop', r: 'rook', q: 'queen', k: 'king'
};

function GameInfo({ currentPlayer, gameHistory, promotionPending, onPromotion }) {
  const promotionPieces = ['queen', 'rook', 'bishop', 'knight'];

  return (
    <div className="w-64 p-4 bg-gray-50 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Game Info</h2>
      
      <div className="mb-4">
        <p className="font-semibold">Current Turn:</p>
        <p className={`capitalize ${currentPlayer === 'white' ? 'text-gray-700' : 'text-gray-900'}`}>
          {currentPlayer}
        </p>
      </div>

      {promotionPending && (
        <div className="mb-4">
          <p className="font-semibold mb-2">Promote to:</p>
          <div className="flex gap-2">
            {promotionPieces.map(piece => (
              <button
                key={piece}
                onClick={() => onPromotion(piece)}
                className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 capitalize"
              >
                <img src={pieceImages[piece] || defaultPiece} alt={piece} className="w-6 h-6 inline-block mr-2" />
                {piece}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <p className="font-semibold mb-2">Move History (PGN):</p>
        <div className="h-64 overflow-y-auto text-sm">
          {gameHistory.map((move, index) => {
            console.log("Move Data:", move);
            const pieceKey = pieceMap[move.piece] || 'default';
            const promotionKey = move.promotion ? pieceMap[move.promotion] : null;
            const isEnPassant = move.enPassant;
            
            return (
              <div key={index} className="mb-1 flex items-center gap-2">
                {index % 2 === 0 ? `${Math.floor(index / 2) + 1}. ` : ''}
                <img src={pieceImages[move.piece.type] || defaultPiece} alt={move.piece || 'unknown'} className="w-4 h-4 inline-block" />
                {parseSquare(move.from)} → {parseSquare(move.to)}
                {promotionKey && (
                  <>
                    {' ('}
                    <img src={pieceImages[promotionKey] || defaultPiece} alt={move.promotion || 'unknown'} className="w-4 h-4 inline-block" />
                    {')'}
                  </>
                )}
                {isEnPassant && <span className="text-red-500"> (en passant)</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default GameInfo;
