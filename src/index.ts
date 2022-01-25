import { Loopback4StarterApplication } from './application';
import { ApplicationConfig } from '@loopback/core';

import {
  givenHttpServerConfig,
} from '@loopback/testlab';
import { AuthenticationBindings } from 'loopback4-authentication';

export { Loopback4StarterApplication };

const debugAppType = true;

export async function main() {
  let app;
  if (!debugAppType) {
    const config: ApplicationConfig = {
      rest: {
        cors: {},
        port: +(process.env.PORT ?? 3000),
        host: process.env.HOST,
        // gracePeriodForClose: 5000,
        openApiSpec: {
          setServersFromRequest: true,
        },
      },
    };
    app = new Loopback4StarterApplication(config);
    await app.boot();
  }
  else {
    const config = givenHttpServerConfig({
      port: +(process.env.PORT ?? 3000),
      host: process.env.HOST,
    });

    app = new Loopback4StarterApplication({
      rest: config,
    });

    await app.boot();

    app.bind('datasources.config.pgdb').to({
      name: 'pgdb',
      connector: 'memory',
      localStorage: '',
      file: './data/db.json',
    });

    app.bind(AuthenticationBindings.CURRENT_USER).to({
      id: 1,
      username: 'test_user',
      password: process.env.USER_TEMP_PASSWORD,
    });
  }

  await app.start();

  const url = app.restServer.url;
  console.log(`Server is running at ${url}`);
  console.log(`Try ${url}/ping`);

  // await registerDatabase(app);

  return app;
}

if (require.main === module) {
  main().catch((err) => {
    console.error('Cannot start the application.', err);
    process.exit(1);
  });
}
