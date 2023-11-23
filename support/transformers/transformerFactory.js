const { ChooseChicagoTransformer } = require("./ChooseChicagoTransformer.js");
const { SongkickTransformer } = require("./SongkickTransformer.js");

const providersMap = {
  'CHOOSECHICAGO': ChooseChicagoTransformer,
  'SONGKICK': SongkickTransformer
}

function getTransformer(provider){
  return providersMap[provider];
}

module.exports = { getTransformer }
