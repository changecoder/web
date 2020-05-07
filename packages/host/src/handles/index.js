const homeHandle = async (ctx, next) => {
  await ctx.render({
    title: 'ChangeCoder Home'
  })
  return next();
}

module.exports = {
  homeHandle
}