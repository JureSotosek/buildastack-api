const { ForbiddenError } = require('apollo-server');

const { getUserId } = require('../../utils');

const stack = {
  createStack(parent, { dependencies }, ctx, info) {
    return ctx.db.mutation.createStack(
      { data: { dependencies: { create: dependencies } } },
      info
    );
  },

  saveStackNew(parent, { stack }, ctx, info) {
    try {
      const userId = getUserId(ctx);

      return ctx.db.mutation.createStack(
        {
          data: {
            name: stack.name,
            dependencies: {
              create: stack.dependencies
            },
            user: {
              connect: {
                id: userId
              }
            }
          }
        },
        info
      );
    } catch (error) {
      throw new ForbiddenError(error);
    }
  },

  async saveStackFromId(parent, { stackId, name }, ctx, info) {
    try {
      const userId = getUserId(ctx);

      const { dependencies } = await ctx.db.query.stack(
        { where: { id: stackId } },
        ` { dependencies { name version dev } } `
      );

      return ctx.db.mutation.createStack(
        {
          data: {
            name,
            dependencies: {
              create: dependencies
            },
            user: {
              connect: {
                id: userId
              }
            }
          }
        },
        info
      );
    } catch (error) {
      throw new ForbiddenError(error);
    }
  },

  async deleteStack(parent, { id }, ctx, info) {
    try {
      const userId = getUserId(ctx);

      const { user } = await ctx.db.query.stack(
        { where: { id } },
        ` { user { id } } `
      );

      if (user.id === userId) {
        await ctx.db.mutation.deleteStack({ where: { id } });
        return id;
      } else {
        throw 'Not the owner';
      }
    } catch (error) {
      throw new ForbiddenError(error);
    }
  }
};

module.exports = { stack };
