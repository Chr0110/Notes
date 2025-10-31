// import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { UserModule } from './user/user.module';
// import { NoteModule } from './note/note.module';
// import { PrismaModule } from './prisma/prisma.module';
// import { AuthModule } from './auth/auth.module';

// import { ConfigModule } from '@nestjs/config';

// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//     }),
//     UserModule,
//     NoteModule,
//     PrismaModule,
//     AuthModule,
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}
// src/app.module.ts
// import { Module } from '@nestjs/common';
// import { ClientsModule, Transport } from '@nestjs/microservices';
// import { AppController } from './app.controller';
// import { JwtStrategy } from './auth/jwt.strategy';

// @Module({
//   imports: [
//     ClientsModule.register([
//       {
//         name: 'AUTH_SERVICE',
//         transport: Transport.TCP,
//         options: { host: 'localhost', port: 3001 },
//       },
//       {
//         name: 'NOTES_SERVICE',
//         transport: Transport.TCP,
//         options: { host: 'localhost', port: 3002 },
//       },
//     ]),
//   ],
//   controllers: [AppController],
//   providers: [JwtStrategy],
// })
// export class AppModule {}
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Add ConfigModule
import { AppController } from './app.controller';
import { JwtStrategy } from './auth/jwt.strategy';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'your-secret-key',
        signOptions: { expiresIn: '1d' },
      }),
      inject: [ConfigService],
    }),
    ClientsModule.register([
      {
        name: 'AUTH_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3001 },
      },
      {
        name: 'NOTES_SERVICE',
        transport: Transport.TCP,
        options: { host: 'localhost', port: 3002 },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [JwtStrategy],
})
export class AppModule {}