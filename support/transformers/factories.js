const { ChooseChicagoTransformer } = require("./ChooseChicagoTransformer.js");
const { SongkickTransformer, getSongkickPages } = require("./SongkickTransformer.js");

const transformerProvidersMap = {
  'CHOOSECHICAGO': ChooseChicagoTransformer,
  'SONGKICK': SongkickTransformer
}

const paginatorProvidersMap = {
  'CHOOSECHICAGO': () => [],
  'SONGKICK': getSongkickPages,
}

function getTransformer(provider){
  return transformerProvidersMap[provider];
}

function getPaginator(provider){
  return paginatorProvidersMap[provider];
}

module.exports = { getTransformer, getPaginator }
