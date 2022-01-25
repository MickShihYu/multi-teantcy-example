import { Binding, Component } from '@loopback/core';
import { CasbinModiferProvider, CasbinBaseProvider, getCasbinEnforcerByName } from './services';
// import { CasbinBaseProvider, getCasbinEnforcerByName } from './services';
import {
  AuthorizationBindings,
} from 'loopback4-authorization';

// import { AuthorizationBindings } from '../../keys'
export class CasbinAuthorizationComponent implements Component {
  bindings: Binding[] = [
    Binding.bind('casbin.enforcer.factory').to(getCasbinEnforcerByName),

    // Binding.bind(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN.key)
    //   .toProvider(CasbinAuthorizerProvider)
    //   .tag("authorizer"),

    // Binding.bind(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN.key)
    //   .toProvider(CasbinModiferProvider)
    //   .tag("authorizer"),

    Binding.bind(AuthorizationBindings.CASBIN_RESOURCE_MODIFIER_FN.key)
      .toProvider(CasbinBaseProvider)
      .tag("authorizer"),
  ];
}
