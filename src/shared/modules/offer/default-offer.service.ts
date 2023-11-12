import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { City, Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { DEFAULT_OFFERS_COUNT, MAX_PREMIUM_OFFERS_COUNT } from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFERS_COUNT;
    return this.offerModel
      .find({}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['userId'])
      .exec();
  }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create({...dto, offerDate: new Date()});
    this.logger.info(`New offer created: ${dto.title}`);
    return result;
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findById(offerId)
      .populate(['userId'])
      .exec();
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, {new: true})
      .populate(['userId'])
      .exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findPremium(city: City): Promise<DocumentType<OfferEntity>[]> {
    const limit = MAX_PREMIUM_OFFERS_COUNT;
    return this.offerModel
      .find({city: `${city}`, isPremium: true}, {}, {limit})
      .sort({createdAt: SortType.Down})
      .populate(['userId'])
      .exec();
  }

  public async findFavorites(userId: string): Promise<DocumentType<OfferEntity>[] | null> {
    const user = await this.userModel
      .findById(userId, {favorites: true, _id: false})
      .populate<{favorites: DocumentType<OfferEntity>[]}>('favorites', {}, '', {sort: {createdAt: SortType.Down}})
      .orFail()
      .exec();

    user.favorites.forEach((offer) => {
      offer.isFavorite = true;
    });
    return user.favorites;
  }

  public async changeFavoriteStatus(userId: string, offerId: string, status: number): Promise<DocumentType<OfferEntity> | null> {
    const isFavorite = status === 1;
    const user = await this.userModel.findById(userId).orFail();
    const offer = await this.offerModel.findById(offerId).orFail();
    const offerRef = user.favorites.find((favorite) => favorite.toString() === offerId);

    if (isFavorite && offerRef && !user.favorites.includes(offerRef)) {
      user.favorites.push(offerRef);
    } else if (!isFavorite && offerRef && user.favorites.includes(offerRef)) {
      user.favorites = user.favorites.filter((favorite) => favorite.toString() !== offerId);
    }

    await user.save();
    offer.isFavorite = isFavorite;
    return offer;
  }

  public async addFavorite(offerId: string, userId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $addToSet: { favorites: offerId } }
    );
  }

  public async deleteFavorite(offerId: string, userId: string): Promise<void> {
    await this.userModel.updateOne(
      {_id: userId},
      { $pull: { favorites: offerId } }
    );
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async calculateRating(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .aggregate([
        {$match: {$expr: { $eq: ['$_id', {$toObjectId: offerId}] }}},
        {
          $lookup: {
            from: 'comments',
            let: { offerId: '$_id' },
            pipeline: [
              {$match: {$expr: { $eq: ['$$offerId', '$offerId'] }}},
            ],
            as: 'comments',
          },
        },
        {$set: {rating: { $avg: '$comments.rating' }}},
        {$unset: 'comments'},
      ])
      .exec()
      .then(([result]) => result ?? null);
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }
}
