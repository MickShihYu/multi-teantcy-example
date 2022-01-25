import { DefaultCrudRepository } from '@loopback/repository';
import { AuditLog } from '../models';
import { PgdbDataSource } from '../datasources';
import { inject } from '@loopback/core';

export class AuditLogRepository extends DefaultCrudRepository<
  AuditLog,
  typeof AuditLog.prototype.id
> {
  constructor(@inject('datasources.pgdb') dataSource: PgdbDataSource) {
    super(AuditLog, dataSource);
  }
}
