module.exports = function(url, prev, done) {
  return done(url.split(':')[0].toLowerCase() === 'npm'
    ? { file: require.resolve(url.split(':')[1]) }
    : null);
};
