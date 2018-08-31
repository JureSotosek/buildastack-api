const jwt = require('jsonwebtoken');
const { ForbiddenError } = require('apollo-server');

const { search: algoliaSearch } = require('../lib/algolia');
const { suggestions } = require('../lib/suggestions');
const { getGithubUser, getUserId } = require('../utils');

const Query = {
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
  },

  async user(parent, args, ctx, info) {
    try {
      const userId = getUserId(ctx);
      return ctx.db.query.user({ where: { id: userId } }, info);
    } catch (error) {
      throw new ForbiddenError(error);
    }
  },

  async stack(parent, args, ctx, info) {
    return ctx.db.query.stack({ where: { id: args.id } }, info);
  },

  async search(parent, args, ctx, info) {
    const response = await algoliaSearch(args.query);

    return response.hits;
  },

  suggestions(parent, args, ctx, info) {
    return suggestions(args, ctx, info);
  }
};

module.exports = { Query };
