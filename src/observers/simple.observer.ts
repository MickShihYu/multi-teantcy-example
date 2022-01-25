
import {
  Application,
  CoreBindings,
  inject,
  lifeCycleObserver, // The decorator
  LifeCycleObserver,
} from '@loopback/core';

import {
  UserRepository,
  AuthClientRepository,
  RoleRepository,
  TenantRepository,
  UserTenantRepository,
} from '../repositories';

import { RoleType } from '../modules/roles/role.enum';
import { TenantType } from '../modules/user-tenants/tenant-type.enum';

/**
 * This class will be bound to the application as a `LifeCycleObserver` during
 * `boot`
 */
@lifeCycleObserver('')
export class SimpleObserver implements LifeCycleObserver {

  constructor(
    @inject(CoreBindings.APPLICATION_INSTANCE) private app: Application,
    @inject('repositories.UserRepository') private userRepo: UserRepository,
    @inject('repositories.AuthClientRepository') private authClientRepository: AuthClientRepository,
    @inject('repositories.RoleRepository') private roleRepository: RoleRepository,
    @inject('repositories.TenantRepository') private tenantRepository: TenantRepository,
    @inject('repositories.UserTenantRepository') private userTenantRepository: UserTenantRepository,
  ) { }

  /**
   * This method will be invoked when the application initializes. It will be
   * called at most once for a given application instance.
   */
  async init(): Promise<void> {
    // Add your logic for init
  }

  /**
   * This method will be invoked when the application starts.
   */
  async start(): Promise<void> {
    if (process.env.SEED_DATA) {
      await this.createDefaultData();
    }
  }

  async createDefaultData(): Promise<void> {
    await this.roleRepository.createAll([
      {
        // id: 1,
        name: 'super_admin',
        roleKey: RoleType.SuperAdmin,
        permissions: [
          'canLoginToIPS',
          'ViewOwnUser',
          'ViewAnyUser',
          'ViewTenantUser',
          'CreateAnyUser',
          'CreateTenantUser',
          'UpdateOwnUser',
          'UpdateTenantUser',
          'UpdateAnyUser',
          'DeleteTenantUser',
          'DeleteAnyUser',
          'ViewTenant',
          'CreateTenant',
          'UpdateTenant',
          'DeleteTenant',
          'ViewRole',
          'CreateRole',
          'UpdateRole',
          'DeleteRole',
          'ViewAudit',
          'CreateAudit',
          'UpdateAudit',
          'DeleteAudit',
        ],
      },
      {
        // id: 2,
        name: 'admin',
        roleKey: RoleType.Admin,
        permissions: [
          'ViewOwnUser',
          'ViewTenantUser',
          'CreateTenantUser',
          'UpdateOwnUser',
          'UpdateTenantUser',
          'DeleteTenantUser',
          'ViewTenant',
          'ViewRole',
        ],
      },
      {
        // id: 2,
        name: 'user',
        roleKey: RoleType.Subscriber,
        permissions: [
          'ViewTenant',
        ],
      },
    ]);

    const tenantRepository = await this.tenantRepository.create({
      // id: 1,
      name: 'application',
      type: TenantType.APPLICATION,
    });
    // const tenantId = await this.createAuthClient(tenantRepository.getId);

    const user = await this.userRepo.create({
      // id: 1,
      firstName: 'Test',
      lastName: 'test_last1',
      username: 'test1',
      phone: '9898989898',
      defaultTenant: tenantRepository.id,
    });

    const user2 = await this.userRepo.create({
      // id: 1,
      firstName: 'Test',
      lastName: 'test_last2',
      username: 'test2',
      phone: '9898989898',
      defaultTenant: 2,
    });

    await this.authClientRepository.create({
      // id: 1,
      clientId: 'web',
      clientSecret: 'test_secret1',
      redirectUrl: 'http://localhost:4200/login/success',
      accessTokenExpiration: 900,
      refreshTokenExpiration: 86400,
      authCodeExpiration: 180,
      secret: 'poiuytrewq',
    });

    await this.userTenantRepository.create(user);
    await this.userTenantRepository.create(user2);
  }


  /**
   * This method will be invoked when the application stops.
   */
  async stop(): Promise<void> {
    // Add your logic for stop
  }
}
