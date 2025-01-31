import { HttpModule, MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  APP_FILTER,
  APP_GUARD,
  APP_INTERCEPTOR,
  ModuleRef,
} from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

import { EventEmitterModule } from '@nestjs/event-emitter';
import { TerminusModule } from '@nestjs/terminus';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HealthModule } from './health/health.module';
import { UserModule } from './api/user/user.module';
import { AuthModule } from './api/auth/auth.module';
import { ErrorFilter } from './filters/error.filter';
import { LogResponseInterceptor } from './interceptors/log-response.interceptor';
import { LogRequestMiddleware } from './middlewares/log-request.middleware';
import { setModuleRef } from './utils/common.util';
import { ServicesModule } from './services';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { MinioClientModule } from './minio-client/minio-client.module';
import {
  HeaderResolver,
  I18nJsonParser,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
// import { IoRedisModule } from './io-redis';
import * as path from 'path';
import { SelectLanguageMiddleware } from './middlewares/select-language.middleware';
import { I18nRedisResolverService } from './services/i18n-redis-resolver/i18n-redis-resolver.service';
import { validate } from './env.validation';
import { ShutdownMiddleware } from './middlewares';
import { PostCategoryModule } from './api/post-category/post-category.module';
import { PostModule } from './api/post/post.module';
import { VotingModule } from './api/voting/voting.module';
import { CommentsModule } from './api/comments/comments.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api*'],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        transport: {
          host: config.get('EMAIL_HOST'),
          port: config.get('EMAIL_PORT'),
          secure: config.get('EMAIL_SECURE'),
          // secureConnection: false,
          auth: {
            user: config.get('EMAIL_USER'),
            pass: config.get('EMAIL_PASSWORD'),
          },
          tls: {
            rejectUnauthorized: false,
            maxVersion: 'TLSv1.2',
            minVersion: 'TLSv1',
            // ciphers: 'TLS_AES_ 128_GCM_SHA256',
          },
        },
        defaults: {
          from: config.get('EMAIL_EMAIL'),
        },
        template: {
          dir: __dirname + './templates',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService]
    }),

    // MailerModule.forRootAsync({
    //   useFactory: () => ({
    //     transport: {
    //     host: 'in-v3.mailjet.com',
    //     port: 587,
    //     secure: true // upgrade later with STARTTLS
    //   },
    //     auth: {
    //       user: "04212573e56b5bc3ce53a2ea7d7c42df",
    //       pass: "99855f2749fa31264885819364aae031"
    //     },
    //     tls: {
    //       rejectUnauthorized: false
    //   },
    //     defaults: {
    //       from:'"Check School" <admin.checkschool@gmail.com>',
    //     },
    //     template: {
    //       dir: process.cwd() + '/templates/welcome',
    //       adapter: new HandlebarsAdapter(), // or new PugAdapter() or new EjsAdapter()
    //       options: {
    //         strict: true,
    //       },
    //   }})
    // }),

    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: config.get('THROTTLE_TTL'),
        limit: config.get('THROTTLE_LIMIT'),
      }),
    }),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        timeout: configService.get('HTTP_TIMEOUT'),
        maxRedirects: configService.get('HTTP_MAX_REDIRECTS'),
      }),
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        
        replication: {
          master: {
            host: configService.get('DB_HOST'),
            port: +configService.get<number>('DB_PORT'),
            username: configService.get('DB_USER'),
            password: configService.get('DB_PASS'),
            database: configService.get('DB_NAME'),
          },
          slaves: [
            {
              host: configService.get('DB_HOST'),
              port: +configService.get<number>('DB_PORT'),
              username: configService.get('DB_USER'),
              password: configService.get('DB_PASS'),
              database: configService.get('DB_NAME'),
            }
          ],
          selector: 'RR',
          canRetry: true,
          removeNodeErrorCount: 5,
          restoreNodeTimeout: 1000,
        },
        synchronize: configService.get('DB_SYNC'),
        logging: configService.get('DB_LOG'),
        entities: ['dist/api/**/*.entity.js'],
        cli: {
          entitiesDir: 'src/api/**/*.entity.ts',
        },
        namingStrategy: new SnakeNamingStrategy(),
        poolSize: 20,
      }),
      inject: [ConfigService],
    }),
    I18nModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.get('LANG'),
        parserOptions: {
          path: path.join(__dirname, configService.get('I18N_SOURCE')),
          watch: true,
        },
      }),
      parser: I18nJsonParser,
      resolvers: [
        { use: QueryResolver, options: ['lang', 'locale', 'l'] },
        new HeaderResolver(['x-aella-lang']),
        new I18nRedisResolverService(),
      ],
      inject: [ConfigService],
    }),
    MinioClientModule,
    ServicesModule,
    TerminusModule,
    HealthModule,
    AuthModule,
    UserModule,
    // IoRedisModule,
    AppModule,
    PostCategoryModule,
    PostModule,
    VotingModule,
    CommentsModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: LogResponseInterceptor,
    },
  ],
})
export class AppModule {
  
  constructor(
    private readonly moduleRef: ModuleRef,
    // @InjectQueue("kabani") private kabaniQueue: Queue,
    private readonly configService: ConfigService,
  ) {
    setModuleRef(moduleRef);
  }

  configure(consumer: MiddlewareConsumer) {
    const middlewares = [
      LogRequestMiddleware,
      SelectLanguageMiddleware,
      ...(this.configService.get('SHUTDOWN_SWITCH') === 'on' ? [ ShutdownMiddleware ] : [])
    ]
    consumer      
      .apply(...middlewares)
      .forRoutes('(.*)');
  }

  onApplicationBootstrap() {
    // this.kabaniQueue.add("push-messages-to-slack", {}, {
    //   repeat: {
    //     cron: '0 * * * *',
    //   }
    // })
    // this.kabaniQueue.add("refresh-bvns", {}, {
    //   repeat: {
    //     cron: '0 * * * *',
    //   }
    // })
  }

}
