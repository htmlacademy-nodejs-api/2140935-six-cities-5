import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentService, DefaultCommentService, CommentEntity, CommentModel } from './index.js';
import { Component } from '../../types/index.js';
import CommentController from './comment.controller.js';
import { Controller } from '../../libs/rest/index.js';

export function createCommentContainer() {
  const commentContainer = new Container();

  commentContainer.bind<CommentService>(Component.CommentService)
    .to(DefaultCommentService)
    .inSingletonScope();

  commentContainer.bind<types.ModelType<CommentEntity>>(Component.CommentModel)
    .toConstantValue(CommentModel);

  commentContainer.bind<Controller>(Component.CommentController)
    .to(CommentController).inSingletonScope();

  return commentContainer;
}
