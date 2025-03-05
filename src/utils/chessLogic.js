export function initialBoard() {
  const board = Array(8).fill(null).map(() => Array(8).fill(null));
  
  // Set up pawns
  for (let i = 0; i < 8; i++) {
    board[1][i] = { type: 'pawn', color: 'black', hasMoved: false };
    board[6][i] = { type: 'pawn', color: 'white', hasMoved: false };
  }

  // Set up other pieces
  const backRow = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];
  backRow.forEach((piece, i) => {
    board[0][i] = { type: piece, color: 'black', hasMoved: false };
    board[7][i] = { type: piece, color: 'white', hasMoved: false };
  });

  return board;
}

export function getValidMoves(board, from) {
  const piece = board[from.row][from.col];
  if (!piece) return [];

  const validMoves = [];
  
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const to = { row, col };
      const moveResult = isValidMove(board, from, to, []);
      if (moveResult.valid) {
        validMoves.push(to);
      }
    }
  }

  return validMoves;
}

export function isValidMove(board, from, to, history) {
  const piece = board[from.row][from.col];
  if (!piece) return { valid: false };

  // Can't move to a square with our own piece
  if (board[to.row][to.col]?.color === piece.color) return { valid: false };

  // Basic movement validation
  const moveResult = validateBasicMove(board, from, to, piece);
  if (!moveResult.valid) return moveResult;

  // Check for castling
  if (piece.type === 'king' && Math.abs(to.col - from.col) === 2) {
    return validateCastling(board, from, to, piece);
  }

  // Check for en passant
  if (piece.type === 'pawn' && Math.abs(to.col - from.col) === 1 && board[to.row][to.col] === null) {
    const enPassantResult = validateEnPassant(board, from, to, history);
    if (enPassantResult.valid) return enPassantResult;
  }

  // Check for pawn promotion
  if (piece.type === 'pawn' && (to.row === 0 || to.row === 7)) {
    return { ...moveResult, promotion: true };
  }

  return moveResult;
}

function validateBasicMove(board, from, to, piece) {
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  
  switch (piece.type) {
    case 'pawn':
      return validatePawnMove(board, from, to, piece);
    case 'knight':
      return { valid: (dx === 2 && dy === 1) || (dx === 1 && dy === 2) };
    case 'bishop':
      return validateDiagonalMove(board, from, to);
    case 'rook':
      return validateStraightMove(board, from, to);
    case 'king':
      return { valid: dx <= 1 && dy <= 1 };
    case 'queen':
      return { valid: validateDiagonalMove(board, from, to).valid || validateStraightMove(board, from, to).valid };
      
    default:
      return { valid: false };
  }
}

function validatePawnMove(board, from, to, piece) {
  const direction = piece.color === 'white' ? -1 : 1;
  const startRow = piece.color === 'white' ? 6 : 1;
  
  // Normal move
  if (to.col === from.col && to.row === from.row + direction && !board[to.row][to.col]) {
    return { valid: true };
  }
  
  // First move - two squares
  if (from.row === startRow && to.col === from.col && 
      to.row === from.row + 2 * direction && 
      !board[to.row][to.col] && 
      !board[from.row + direction][from.col]) {
    return { valid: true };
  }
  
  // Capture
  if (Math.abs(to.col - from.col) === 1 && to.row === from.row + direction) {
    const targetPiece = board[to.row][to.col];
    if (targetPiece && targetPiece.color !== piece.color) {
      return { valid: true };
    }
  }
  
  return { valid: false };
}

function validateDiagonalMove(board, from, to) {
  const dx = Math.abs(to.col - from.col);
  const dy = Math.abs(to.row - from.row);
  
  if (dx !== dy) return { valid: false };
  
  const xStep = to.col > from.col ? 1 : -1;
  const yStep = to.row > from.row ? 1 : -1;
  
  for (let i = 1; i < dx; i++) {
    if (board[from.row + i * yStep][from.col + i * xStep]) {
      return { valid: false };
    }
  }
  
  return { valid: true };
}

function validateStraightMove(board, from, to) {
  if (from.row !== to.row && from.col !== to.col) return { valid: false };
  
  const dx = to.col - from.col;
  const dy = to.row - from.row;
  
  const xStep = dx ? Math.sign(dx) : 0;
  const yStep = dy ? Math.sign(dy) : 0;
  
  const steps = Math.max(Math.abs(dx), Math.abs(dy));
  
  for (let i = 1; i < steps; i++) {
    if (board[from.row + i * yStep][from.col + i * xStep]) {
      return { valid: false };
    }
  }
  
  return { valid: true };
}

function validateCastling(board, from, to, piece) {
  if (piece.hasMoved) return { valid: false };
  
  const row = from.row;
  const rookCol = to.col > from.col ? 7 : 0;
  const rook = board[row][rookCol];
  
  if (!rook || rook.type !== 'rook' || rook.hasMoved) return { valid: false };
  
  const direction = to.col > from.col ? 1 : -1;
  for (let col = from.col + direction; col !== rookCol; col += direction) {
    if (board[row][col]) return { valid: false };
  }
  
  return { valid: true, castling: true };
}

function validateEnPassant(board, from, to, history) {
  if (!history.length) return { valid: false };
  
  const lastMove = history[history.length - 1];
  const lastPiece = board[lastMove.to.row][lastMove.to.col];
  
  if (!lastPiece || lastPiece.type !== 'pawn') return { valid: false };
  
  const isDoublePawnMove = Math.abs(lastMove.to.row - lastMove.from.row) === 2;
  const isAdjacentColumn = Math.abs(lastMove.to.col - from.col) === 1;
  const isSameRow = lastMove.to.row === from.row;
  
  if (isDoublePawnMove && isAdjacentColumn && isSameRow) {
    return { valid: true, enPassant: true };
  }
  
  return { valid: false };
}

export function makeMove(board, from, to, moveResult) {
  const newBoard = board.map(row => [...row]);
  const piece = { ...newBoard[from.row][from.col], hasMoved: true };
  
  if (moveResult.castling) {
    const rookFromCol = to.col > from.col ? 7 : 0;
    const rookToCol = to.col > from.col ? to.col - 1 : to.col + 1;
    newBoard[to.row][rookToCol] = { ...newBoard[to.row][rookFromCol], hasMoved: true };
    newBoard[to.row][rookFromCol] = null;
  }
  
  if (moveResult.enPassant) {
    newBoard[from.row][to.col] = null;
  }
  
  newBoard[to.row][to.col] = piece;
  newBoard[from.row][from.col] = null;
  
  return newBoard;
}

