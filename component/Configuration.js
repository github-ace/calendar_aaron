import Dictionary from "../static/Dictionary.js";

class Configuration {
    mountDictionary(){
        const DictionaryKeys = Object.keys(Dictionary);
        DictionaryKeys.map(el => this[el] = Dictionary[el]);
    }
};

export default Configuration;