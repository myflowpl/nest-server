export * from './app.api';
import { AppApi } from './app.api';
export * from './auth.api';
import { AuthApi } from './auth.api';
export * from './contacts.api';
import { ContactsApi } from './contacts.api';
export * from './usersAdmin.api';
import { UsersAdminApi } from './usersAdmin.api';
export const APIS = [AppApi, AuthApi, ContactsApi, UsersAdminApi];
