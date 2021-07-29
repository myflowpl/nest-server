/* tslint:disable */
/* eslint-disable */
/**
 * Mój Projekt w Nest
 * Przykładowy projekt w Node.js i TypeScript
 *
 * OpenAPI spec version: 1.0
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
/**
 * 
 * @export
 * @interface Role
 */
export interface Role {
    /**
     * 
     * @type {number}
     * @memberof Role
     */
    id: any;
    /**
     * 
     * @type {string}
     * @memberof Role
     */
    name: RoleNameEnum;
    /**
     * 
     * @type {Array&lt;User&gt;}
     * @memberof Role
     */
    users?: any;
}

/**
    * @export
    * @enum {string}
    */
export enum RoleNameEnum {
    Admin = 'admin',
    Root = 'root',
    Partner = 'partner'
}

