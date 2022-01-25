// import { inject } from '@loopback/core';
// import { juggler } from '@loopback/repository';
// import * as config from './pgdb.datasource.config.json';

// export class PgdbDataSource extends juggler.DataSource {
//   static dataSourceName = 'pgdb';


//   constructor(
//     @inject('datasources.config.pgdb', { optional: true })
//     dsConfig: object = { ...config },
//   ) {
//     // Override data source config from environment variables
//     Object.assign(dsConfig, {
//       host: process.env.DB_HOST,
//       port: process.env.DB_PORT,
//       user: process.env.DB_USER,
//       password: process.env.DB_PASSWORD,
//       database: process.env.DB_DATABASE,
//       schema: process.env.DB_SCHEMA,
//       ssl: false
//     });
//     super(dsConfig);
//   }
// }


// import { inject } from '@loopback/core';
// import { juggler } from '@loopback/repository';

// const config = {
//   name: 'db',
//   connector: 'memory',
//   localStorage: '',
//   file: './data/db.json',
// };

// export class PgdbDataSource extends juggler.DataSource {
//   static dataSourceName = 'pgdb';
//   static readonly defaultConfig = config;

//   constructor(
//     @inject('datasources.config.pgdb', { optional: true })
//     dsConfig: object = config,
//   ) {
//     super(dsConfig);
//   }
// }


import { inject, lifeCycleObserver, LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';

const config = {
  name: 'db',
  connector: 'mongodb',
  url: '',
  host: 'localhost',
  port: 27017,
  user: '',
  password: '',
  database: 'multiTenant',
  useNewUrlParser: true
};

@lifeCycleObserver('datasource')
export class PgdbDataSource extends juggler.DataSource
  implements LifeCycleObserver {
  static dataSourceName = 'pgdb';
  static readonly defaultConfig = config;

  constructor(
    @inject('datasources.config.pgdb', { optional: true })
    dsConfig: object = config,
  ) {
    super(dsConfig);
  }
}
