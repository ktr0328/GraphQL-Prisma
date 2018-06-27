const Mutation = {
  signup: (_, args, context, info) => {
    return context.prisma.mutation.createUser({
      data: {
        name: args.name
      }
    }, info)
  }
}

module.exports = Mutation
