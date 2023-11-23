function SecondSourceTransformer(html, link) {
  console.log("SecondSourceTransformer", html, link);
  return []; // events array
}

module.exports = { SecondSourceTransformer };