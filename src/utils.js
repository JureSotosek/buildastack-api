const got = require('got');
const jwt = require('jsonwebtoken');

const { config } = require('dotenv');
config();

const toParams = query => {
  const q = query.replace(/^\??\//, '');

  return q.split('&').reduce((values, param) => {
    const [key, value] = param.split('=');

    values[key] = value;

    return values;
  }, {});
};

const getGithubUser = async code => {
  const tokenRes = await got.post(
    `https://github.com/login/oauth/access_token?client_id=${
      process.env.GITHUB_CLIENT_ID
    }&client_secret=${process.env.GITHUB_CLIENT_SECRET}&code=${code}`
  );

  const tokenResParams = toParams(tokenRes.body);

  const userRes = await got(
    `https://api.github.com/user?access_token=${tokenResParams.access_token}`
  );

  const githubUser = JSON.parse(userRes.body);

  return githubUser;
};

function getUserId(ctx) {
  const Authorization = ctx.request.get('Authorization');
  if (Authorization) {
    try {
      const token = Authorization.replace('Bearer ', '');
      const { userId } = jwt.verify(token, process.env.APP_SECRET);
      return userId;
    } catch (error) {
      throw 'Invalid Token';
    }
  } else {
    throw 'Not Authorized';
  }
}

module.exports = { getGithubUser, getUserId };
