const { v4: uuidv4 } = require('uuid');

const generateId = (prefix = '') => {
  const id = uuidv4().split('-')[0];
  return prefix ? `${prefix}_${id}` : id;
};

module.exports = {
  generateEventId: () => generateId('evt'),
  generatePlayerId: () => generateId('player'),
  generateMatchId: () => generateId('match'),
  generateRoundId: () => generateId('round')
};
