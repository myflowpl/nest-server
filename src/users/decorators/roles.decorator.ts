import { SetMetadata } from '@nestjs/common';
import { RoleNames } from '../entities/user.entity';

export const ROLES_KEY = Symbol('Roles');

export const Roles = (...args: RoleNames[]) => SetMetadata(ROLES_KEY, args);

// const key1 = 'roles';

// const key2 = 'roles';

// console.log('strings', key1 === key2); // true

// const key12 = Symbol('roles');

// const key22 = Symbol('roles');

// // console.log('symbols', key12 === key22); // false

// const metadata = {
//     [key22]: 'costam',
//     [key12]: 'costam',
    
//     [key2]: 'costam',
//     [key1]: 'costam',

// }


