import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";

import { JwtStrategy } from './auth/strategies/jwt.strategy';
import * as passport from 'passport';
import * as cookieParser from 'cookie-parser';

async function start() {

  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.use(passport.initialize());

  const jwtStrategy = app.get(JwtStrategy);
  passport.use(jwtStrategy);

  const config = new DocumentBuilder()
      .setTitle('Farm_vic_nest')
      .setDescription('Application for farmers')
      .setVersion('0.0.1')
      .addTag('DmitriyTuz')
      .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
start();
