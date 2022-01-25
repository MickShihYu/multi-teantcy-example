import { AuthUser } from './modules/auth';
import { Request } from '@loopback/express';
import { Principal, Role } from '@loopback/security';
import { BindingAddress, InvocationContext } from '@loopback/core';

export interface CasbinResourceModifierFn {
  (
    authUser: AuthUser,
    pathParams: string[],
    req: Request
  ): Promise<boolean>;
}

export declare type Authorizer<T extends AuthorizationMetadata = AuthorizationMetadata> =
  (context: AuthorizationContext, metadata: T) => Promise<boolean>;

export interface AuthorizationContext {
  username?: string
}

export interface AuthorizationMetadata {
  /**
   * Roles that are allowed access
   */
  allowedRoles?: string[];
  /**
   * Roles that are denied access
   */
  deniedRoles?: string[];
  /**
   * Voters that help make the authorization decision
   */
  voters?: (Authorizer | BindingAddress<Authorizer>)[];
  /**
   * Name of the resource, default to the method name
   */
  resource?: string;
  /**
   * Define the access scopes
   */
  scopes?: string[];
  /**
   * A flag to skip authorization
   */
  skip?: boolean;
}
