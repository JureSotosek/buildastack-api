const { search: algoliaSearch } = require('../lib/algolia');
const { suggestions } = require('../lib/suggestions');

const Query = {
  suggestions(parent, args, ctx, info) {
    return suggestions(args, ctx, info);
  },

  async search(parent, args, ctx, info) {
    const response = await algoliaSearch(args.query);

    return response.hits;
  }
};

module.exports = { Query };
