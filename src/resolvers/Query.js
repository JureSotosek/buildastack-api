const { ForbiddenError } = require('apollo-server');

const { search: algoliaSearch } = require('../lib/algolia');
const { suggestions } = require('../lib/suggestions');
const { getUserId } = require('../utils');

const Query = {
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
