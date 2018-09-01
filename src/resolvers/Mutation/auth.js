const jwt = require('jsonwebtoken');
const { ForbiddenError } = require('apollo-server');

const { getGithubUser } = require('../../utils');

const auth = {
  async authenticate(parent, { code }, ctx, info) {
    try {
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
    } catch (error) {
      throw new ForbiddenError(error);
    }
  }
};

module.exports = { auth };
