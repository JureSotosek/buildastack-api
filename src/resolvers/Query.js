const { search: algoliaSearch } = require('../algolia');
const { suggestions } = require('../suggestions');

const Query = {
  suggestions(parent, args, ctx, info) {
    return suggestions(args, ctx, info);
  },

  async search(parent, args, ctx, info) {
    const response = await algoliaSearch(args.uery);

    return response.hits;
  }
};

module.exports = { Query };
