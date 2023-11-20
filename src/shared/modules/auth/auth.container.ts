import { Container } from 'inversify';
import { AuthService, DefaultAuthService } from './index.js';
import { Component } from '../../types/index.js';
import { ExceptionFilter } from '../../libs/rest/index.js';
import { AuthExceptionFilter } from './errors/index.js';

export function createAuthContainer() {
  const authContainer = new Container();
  authContainer.bind<AuthService>(Component.AuthService).to(DefaultAuthService).inSingletonScope();
  authContainer.bind<ExceptionFilter>(Component.AuthExceptionFilter).to(AuthExceptionFilter).inSingletonScope();

  return authContainer;
}
