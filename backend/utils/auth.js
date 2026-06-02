const jwt = require('jsonwebtoken');

/**
 * Generates a JSON Web Token for user authorization
 * @param {string} id - The MongoDB User ID
 * @returns {string} Signed JWT
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'recipehubsecretjwt123', {
    expiresIn: '30d'
  });
};

module.exports = {
  generateToken
};
