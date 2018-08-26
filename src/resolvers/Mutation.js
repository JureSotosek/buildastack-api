const Mutation = {
  createStack(parent, args, ctx, info) {
    return ctx.db.mutation.createStack(
      { data: { dependencies: { create: args.dependencies } } },
      info
    );
  }
};

module.exports = { Mutation };
