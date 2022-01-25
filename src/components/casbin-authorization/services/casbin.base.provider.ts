import { Getter, inject, Provider } from '@loopback/context';
import { HttpErrors } from '@loopback/rest';
import { Request } from '@loopback/express';
import {
  AuthorizationBindings,
  AuthorizationMetadata,
  // CasbinResourceModifierFn,
} from 'loopback4-authorization';

import {
  CasbinResourceModifierFn
} from '../../../types';

import { AuthUser } from '../../../modules/auth';
import * as casbin from 'casbin';

export class CasbinBaseProvider implements Provider<CasbinResourceModifierFn>
{
  constructor(
    @inject('casbin.enforcer.factory')
    private enforcerFactory: (name: string) => Promise<casbin.Enforcer>,
    @inject.getter(AuthorizationBindings.METADATA)
    private readonly getCasbinMetadata: Getter<AuthorizationMetadata>,
    @inject(AuthorizationBindings.PATHS_TO_ALLOW_ALWAYS)
    private readonly allowAlwaysPath: string[],
  ) { }

  value(): CasbinResourceModifierFn {
    return (authUser: AuthUser, pathParams: string[], req: Request) => this.action(authUser, pathParams, req);
  }

  async action(
    user: AuthUser,
    pathParams: string[],
    request: Request
  ): Promise<boolean> {

    let authDecision = false;
    try {
      // fetch decorator metadata
      const metadata: AuthorizationMetadata = await this.getCasbinMetadata();

      console.log(this.enforcerFactory.toString);

      if (request && this.checkIfAllowedAlways(request)) {
        return true;
      } else if (!metadata) {
        return false;
      } else if (metadata.permissions?.indexOf('*') === 0) {
        return true;
      } else if (!metadata.resource) {
        throw new HttpErrors.Unauthorized(
          `Resource parameter is missing in the decorator.`,
        );
      }

      if (!user.id) {
        throw new HttpErrors.Unauthorized(`User not found.`);
      }

      if (metadata.permissions && metadata.permissions.length <= 0) {
        throw new HttpErrors.Unauthorized(
          `Permissions are missing in the decorator.`,
        );
      }

      const subject = user.username;
      const enforcer = await this.enforcerFactory(user.role);

      for (const permission of metadata.permissions) {
        const decision = await enforcer.enforce(subject, metadata.resource, permission);
        authDecision = authDecision || decision;
      }

    } catch (err) {
      throw new HttpErrors.Unauthorized(err.message);
    }
    return authDecision;
  }

  checkIfAllowedAlways(req: Request): boolean {
    let allowed = false;
    allowed = !!this.allowAlwaysPath.find(path => req.path.indexOf(path) === 0);
    return allowed;
  }
}
