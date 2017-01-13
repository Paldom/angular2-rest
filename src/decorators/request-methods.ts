import { RequestMethod as RequestMethods } from '@angular/http'
import { methodBuilder } from "../builders/request-builder";
import { RestClient } from "../rest-client";

/**
 * Get method
 * @param {string} url - resource url of the method
 */
export var Get  = methodBuilder( RequestMethods.Get );
/**
 * Post method
 * @param {string} url - resource url of the method
 */
export var Post = methodBuilder( RequestMethods.Post );
/**
 * Put method
 * @param {string} url - resource url of the method
 */
export var Put  = methodBuilder( RequestMethods.Put );

/**
 * Patch method
 * @param {string} url - resource url of the method
 */
export var Patch  = methodBuilder( RequestMethods.Patch );
/**
 * Delete method
 * @param {string} url - resource url of the method
 */
export var Delete = methodBuilder( RequestMethods.Delete );
/**
 * Head method
 * @param {string} url - resource url of the method
 */
export var Head   = methodBuilder( RequestMethods.Head );
