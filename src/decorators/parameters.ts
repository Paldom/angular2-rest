
import { RestClient } from "../rest-client";

export function paramBuilder( paramName: string) {
  return function(key: string) {
    return function(target: RestClient, propertyKey: string | symbol, parameterIndex: number) {
      var metadataKey = `${propertyKey}_${paramName}_parameters`;
      var paramObj: any = {
        key: key,
        parameterIndex: parameterIndex
      };
      if (Array.isArray(target[metadataKey])) {
        target[metadataKey].push(paramObj);
      } else {
        target[metadataKey] = [paramObj];
      }
    };
  };
}

/**
 * Path variable of a method's url, type: string
 * @param {string} key - path key to bind value
 */
export var Path = paramBuilder("Path");
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export var Query = paramBuilder("Query");
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export var Body = paramBuilder("Body")("Body");
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export var Header = paramBuilder("Header");
