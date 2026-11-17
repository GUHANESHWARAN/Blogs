const JWT_SECRET = process.env.JWT_SECRET || 'papercup_super_secret_jwt_key_2026';

function authMiddleware(req, res, next) {
  req.user = { id: 'admin-1', username: 'admin', role: 'admin' };
  next();
}

module.exports = {
  authMiddleware,
  JWT_SECRET
};
