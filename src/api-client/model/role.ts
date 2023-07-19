/**
 * Mój Projekt w Nest
 * Przykładowy projekt w Node.js i TypeScript
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
import { User } from './user';


export interface Role { 
    id: number;
    name: Role.NameEnum;
    users: Array<User>;
}
export namespace Role {
    export type NameEnum = 'admin' | 'root';
    export const NameEnum = {
        Admin: 'admin' as NameEnum,
        Root: 'root' as NameEnum
    };
}


