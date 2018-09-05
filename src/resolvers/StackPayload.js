const { getUserId } = require('../utils');

const StackPayload = {
  stack({ id }, args, ctx, info) {
    return ctx.db.query.stack({ where: { id } }, info);
  },

  async owner({ id }, args, ctx, info) {
    try {
      const userId = getUserId(ctx);

      const stack = await ctx.db.query.stack(
        { where: { id } },
        `{ user { id } }`
      );

      return userId === stack.user.id;
    } catch (error) {
      return false;
    }
  }
};

module.exports = { StackPayload };
