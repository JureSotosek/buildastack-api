const { ForbiddenError } = require('apollo-server');

const { search: algoliaSearch } = require('../lib/algolia');
const { suggestions } = require('../lib/suggestions');
const { getUserId } = require('../utils');

const Query = {
  viewer(parent, args, ctx, info) {
    try {
      const userId = getUserId(ctx);

      return ctx.db.query.user({ where: { id: userId } }, info);
    } catch (error) {
      throw new ForbiddenError(error);
    }
  },

  templateStacks(parent, args, ctx, info) {
    return ctx.db.query.stacks(
      { where: { template: true } },
      '{ id name color dependencies { name version dev }}'
    );
  },

  stack(parent, { id }, ctx, info) {
    return ctx.db.query.stack({ where: { id } }, `{ id }`);
  },

  async search(parent, { query }, ctx, info) {
    const response = await algoliaSearch(query);

    return response.hits;
  },

  suggestions(parent, args, ctx, info) {
    return suggestions(args, ctx, info);
  }
};

module.exports = { Query };
