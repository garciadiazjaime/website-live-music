const { ChooseChicagoTransformer } = require("./ChooseChicagoTransformer.js");
const { SecondSourceTransformer } = require("./SecondSourceTransformer.js");

const providersMap = {
  'CHOOSECHICAGO': ChooseChicagoTransformer,
  'SECONDSOURCE': SecondSourceTransformer
}

class TransformerFactory {
  getTransformer(provider){
    return providersMap[provider];
  }
}

module.exports = { TransformerFactory }