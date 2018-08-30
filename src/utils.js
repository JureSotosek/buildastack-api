const jwt = require('jsonwebtoken');

const { config } = require('dotenv');
config();

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '');
    const { userId } = jwt.verify(token, process.env.APP_SECRET);
    return userId;
  }

  throw new Error('Not Authorized');
}

module.exports = { getUserId };
