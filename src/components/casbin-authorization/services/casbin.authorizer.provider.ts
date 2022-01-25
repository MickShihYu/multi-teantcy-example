import { Getter, inject, Provider } from '@loopback/context';
import { HttpErrors } from '@loopback/rest';
import { Request } from '@loopback/express';
// import {
// AuthorizationBindings,
// AuthorizationMetadata,
// CasbinResourceModifierFn,
// } from 'loopback4-authorization';

import * as casbin from 'casbin';

import { Authorizer, AuthorizationContext, AuthorizationMetadata } from '../../../types'

export class CasbinAuthorizerProvider
  implements Provider<Authorizer>
{
  constructor(
    @inject('casbin.enforcer.factory')
    private enforcerFactory: (name: string) => Promise<casbin.Enforcer>
  ) { }

  value(): Authorizer {
    // return (pathParams: string[], req: Request) => this.action(pathParams, req);
    return this.authorize.bind(this);
  }

  async authorize(
    authorizationCtx: AuthorizationContext,
    metadata: AuthorizationMetadata,
  ): Promise<boolean> {
    return true;
  }
}
