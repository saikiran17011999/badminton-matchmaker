const { v4: uuidv4 } = require('uuid');

const generateId = (prefix = '') => {
  const id = uuidv4().split('-')[0];
  return prefix ? `${prefix}_${id}` : id;
};

// Generate a secure admin token (16 chars)
const generateAdminToken = () => {
  return uuidv4().replace(/-/g, '').substring(0, 16);
};

// Generate a human-friendly share code (e.g., "GAME-A1B2")
const generateShareCode = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars (0,O,1,I)
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `GAME-${code}`;
};

module.exports = {
  generateEventId: () => generateId('evt'),
  generatePlayerId: () => generateId('player'),
  generateMatchId: () => generateId('match'),
  generateRoundId: () => generateId('round'),
  generateAdminToken,
  generateShareCode
};
