const { ChooseChicagoTransformer } = require("./ChooseChicagoTransformer.js");
const { Do312Transformer, Do312Pages } = require("./Do312Transformer.js");
const { SongkickTransformer, SongkickPages } = require("./SongkickTransformer.js");

const transformerProvidersMap = {
  'CHOOSECHICAGO': ChooseChicagoTransformer,
  'SONGKICK': SongkickTransformer,
  'DO312': Do312Transformer
}

const paginatorProvidersMap = {
  'CHOOSECHICAGO': () => [],
  'SONGKICK': SongkickPages,
  'DO312': Do312Pages,
}

function getTransformer(provider){
  return transformerProvidersMap[provider];
}

function getPaginator(provider){
  return paginatorProvidersMap[provider];
}

module.exports = { getTransformer, getPaginator }
