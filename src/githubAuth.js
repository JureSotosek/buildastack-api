const got = require('got');

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

module.exports = { getGithubUser };
