const { ChooseChicagoTransformer } = require("./ChooseChicagoTransformer.js");
const { SongkickTransformer } = require("./SongkickTransformer.js");

const providersMap = {
  'CHOOSECHICAGO': ChooseChicagoTransformer,
  'SONGKICK': SongkickTransformer
}

class TransformerFactory {
  getTransformer(provider){
    return providersMap[provider];
  }
}

module.exports = { TransformerFactory }
