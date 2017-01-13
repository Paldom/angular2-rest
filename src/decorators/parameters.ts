
import { RestClient } from "../rest-client";

export function paramBuilder( paramName: string) {
  return function(name: string, value?:any|{value?:any,format?:string}) {
    return function(target: RestClient, propertyKey: string | symbol, parameterIndex: number) {
      let format;
      if(value){
        if(typeof(value) === 'object'){
          if(value.value !== undefined && value.value !== null){
            value = value.value;
          }
          if(value.format !== undefined && value.format !== null){
            if(Format[value.format] !== undefined) {
              format = value.format;
            }else{
              throw new Error("Unknown Collection Format: '" + value.format + "'");
            }
          }
        }
      }
      var metadataKey = `${propertyKey}_${paramName}_parameters`;
      var paramObj: any = {
        key: name,
        parameterIndex: parameterIndex,
        value: value,
        format: format
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
export const Path = paramBuilder("Path");
/**
 * Query value of a method's url, type: string
 * @param {string} key - query key to bind value
 */
export const Query = paramBuilder("Query");
/**
 * Body of a REST method, type: key-value pair object
 * Only one body per method!
 */
export const Body = paramBuilder("Body")("Body");
/**
 * Custom header of a REST method, type: string
 * @param {string} key - header key to bind value
 */
export const Header = paramBuilder( "Header" );

/**
 * collection Formats
 */
export const Format = {
  /**
   *  comma separated values foo,bar.
   */
  CSV: 'CSV',
  /**
   *  space separated values foo bar.
   */
  SSV: 'SSV',
  /**
   *  tab separated values foo\tbar.
   */
  TSV: 'TSV',
  /**
   *  pipe separated values foo|bar.
   */
  PIPES: 'PIPES',
  /**
   *  corresponds to multiple parameter instances instead of multiple values for a single instance foo=bar&foo=baz.
   *  This is valid only for parameters in "query" or "formData".
   */
  MULTI: 'MULTI',
};
