const jwt = require('jsonwebtoken');
const { getGithubUser } = require('../../githubAuth');

const { config } = require('dotenv');
config();

const auth = {
  async authenticate(parent, { code }, ctx, info) {
    const githubUser = await getGithubUser(code);

    const user = await ctx.db.mutation.upsertUser(
      {
        where: { githubId: githubUser.id },
        create: {
          githubId: githubUser.id,
          name: githubUser.name
        },
        update: {
          name: githubUser.name
        }
      },
      ` { id } `
    );

    return {
      user,
      token: jwt.sign({ userId: user.id }, process.env.APP_SECRET)
    };
  }
};

module.exports = { auth };
