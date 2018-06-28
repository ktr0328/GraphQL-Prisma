const Query = {
  user: (_, args, context, info) => {
    return context.prisma.query.user({
      where: {
        id: args.id
      }
    }, info)
  },
  users: (_, args, context, info) => {
    return context.prisma.query.users({}, info)
  },
  bear260002s: (_, args, context, info) => {
    return context.prisma.query.bear260002s({}, info)
  }
}

module.exports = Query
