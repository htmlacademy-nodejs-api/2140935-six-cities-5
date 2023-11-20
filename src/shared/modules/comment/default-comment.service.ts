import { inject, injectable } from 'inversify';
import { Component, SortType } from '../../types/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { CommentService, CommentEntity, CreateCommentDto } from './index.js';
import { MAX_COMMENTS_COUNT } from '../../const/index.js';

@injectable()
export class DefaultCommentService implements CommentService {
  constructor(
    @inject(Component.CommentModel) private readonly commentModel: types.ModelType<CommentEntity>
  ) {}

  public async create(dto: CreateCommentDto, offerId: string, userId: string): Promise<DocumentType<CommentEntity>> {
    const comment = await this.commentModel.create({...dto, offerId, userId});
    return comment.populate('userId');
  }

  public async findByOfferId(offerId: string): Promise<DocumentType<CommentEntity>[]> {
    const limit = MAX_COMMENTS_COUNT;
    return this.commentModel
      .find({offerId}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate('userId')
      .exec();
  }

  public async deleteByOfferId(offerId: string): Promise<number> {
    const result = await this.commentModel
      .deleteMany({offerId})
      .exec();

    return result.deletedCount;
  }
}
