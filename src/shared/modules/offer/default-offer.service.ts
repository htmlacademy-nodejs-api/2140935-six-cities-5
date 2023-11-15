import { inject, injectable } from 'inversify';
import mongoose from 'mongoose';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { UserEntity } from '../user/user.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { MAX_PREMIUM_OFFERS_COUNT } from './offer.constant.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) {}

  public async find(count: number): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({})
      .sort({createdAt: SortType.Down})
      .limit(count)
      .exec();
  }

  public async findAuth(count: number, userId: string): Promise<DocumentType<OfferEntity>[]> {
    const user = await this.userModel.findOne({ _id: userId });
    if (!user) {
      throw new Error('Пользователь не найден');
    }
    const offers = await this.offerModel
      .find({})
      .sort({ createdAt: SortType.Down })
      .limit(count)
      .exec();

    const result: DocumentType<OfferEntity>[] = offers.map((offer) => {
      const offerObject = offer.toObject();
      if (user.favorites.includes(offer._id.toString())) {
        return { ...offerObject, isFavorite: true } as DocumentType<OfferEntity>;
      }
      return offerObject as DocumentType<OfferEntity>;
    });

    return result;
  }

  public async findUserFavorites(userId: string): Promise<DocumentType<OfferEntity>[] | null> {
    const userWithFavorites = await this.userModel.findById(userId);
    if (!userWithFavorites || !Array.isArray(userWithFavorites.favorites)) {
      return null;
    }
    const result = await this.offerModel.aggregate<DocumentType<OfferEntity>>([
      {
        '$match': {
          '_id': { '$in': userWithFavorites.favorites.map((favoriteId) => new mongoose.Types.ObjectId(favoriteId)) }
        }
      },
      {
        '$addFields': {
          'isFavorite': true
        }
      }
    ]).exec();

    return result;
  }

  public async findFullOfferInfo(offerId: string, userId?: string): Promise<DocumentType<OfferEntity> | null> {
    if (!userId) {
      return this.offerModel
        .findOne({ _id: offerId })
        .populate('userId')
        .exec();
    } else {
      const result = await this.offerModel.aggregate<DocumentType<OfferEntity>>([
        {
          '$match': {
            '_id': new mongoose.Types.ObjectId(offerId)
          },
        },
        {
          '$lookup': {
            from: 'users',
            let: { offerId: { $toString: '$_id' } },
            pipeline: [
              {
                '$match': {
                  '_id': new mongoose.Types.ObjectId(userId),
                  '$expr': {
                    '$in': ['$$offerId', '$favorites']
                  },
                }
              }
            ],
            as: 'usersWithFavorites'
          }
        },
        {
          $addFields: {
            isFavorite: {
              $toBool: {
                $size: '$usersWithFavorites'
              }
            }
          }
        },
        {
          $unset: 'usersWithFavorites'
        }
      ]).exec();
      const offer = result[0] ? result[0] : null;
      return this.offerModel.populate(offer, { path: 'userId' });
    }
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

  public async updateById(dto: UpdateOfferDto, offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.userId && offer.userId.toString() !== userId) {
      throw new Error('You can delete only your own offers');
    }

    await this.offerModel.findByIdAndUpdate(offerId, dto, {new: true}).exec();
    const result = await this.offerModel.aggregate<DocumentType<OfferEntity>>([
      {
        '$match': {
          '_id': new mongoose.Types.ObjectId(offerId),
        },
      },
      {
        '$lookup': {
          'from': 'users',
          'let': { 'offerId': { '$toString': '$_id' } },
          'pipeline': [
            {
              '$match': {
                '_id': new mongoose.Types.ObjectId(userId),
                '$expr': {
                  '$in': ['$$offerId', '$favorites']
                },
              }
            }
          ],
          'as': 'usersWithFavorites'
        }
      },
      {
        '$addFields': {
          'isFavorite': {
            '$toBool': {
              '$size': '$usersWithFavorites',
            },
          },
        }
      },
      {
        '$unset': 'usersWithFavorites',
      }
    ]).exec();

    const updatedOffer = result[0] ? result[0] : null;
    return this.offerModel.populate(updatedOffer, { path: 'userId' });
  }

  public async deleteById(offerId: string, userId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = await this.offerModel.findById(offerId).exec();

    if (!offer) {
      throw new Error('Offer not found');
    }

    if (offer.userId && offer.userId.toString() !== userId) {
      throw new Error('You can delete only your own offers');
    }

    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async findPremium(cityName: string, userId?: string): Promise<DocumentType<OfferEntity>[]> {
    let result: DocumentType<OfferEntity>[];
    if (userId) {
      const user = await this.userModel.findOne({ _id: userId });
      if (!user) {
        throw new Error('Пользователь не найден');
      }

      const offers = await this.offerModel
        .find({city: `${cityName}`, isPremium: true})
        .sort({createdAt: SortType.Down})
        .limit(MAX_PREMIUM_OFFERS_COUNT)
        .populate(['userId'])
        .exec();

      result = offers.map((offer) => {
        const offerObject = offer.toObject();
        if (user.favorites.includes(offer._id.toString())) {
          return { ...offerObject, isFavorite: true } as DocumentType<OfferEntity>;
        }
        return offerObject as DocumentType<OfferEntity>;
      });
    } else {
      result = await this.offerModel
        .find({city: `${cityName}`, isPremium: true})
        .sort({createdAt: SortType.Down})
        .limit(MAX_PREMIUM_OFFERS_COUNT)
        .populate(['userId'])
        .exec();
    }
    return result;
  }

  public async changeFavoriteStatus(userId: string, offerId: string, status: number): Promise<DocumentType<OfferEntity> | null> {
    const isFavorite = status === 1;
    const user = await this.userModel.findById(userId).orFail();
    const offer = await this.offerModel.findById(offerId).orFail();

    if (isFavorite && !user.favorites.includes(offerId)) {
      user.favorites.push(offer._id.toString());
    } else if (!isFavorite && user.favorites.includes(offerId)) {
      user.favorites = user.favorites.filter((favorite) => favorite !== offerId);
    }

    await user.save();
    return offer;
  }

  public async incCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, {'$inc': {
        commentCount: 1,
      }}).exec();
  }

  public async calculateRating(offerId: string): Promise<number | null> {
    const result = await this.offerModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(offerId) } },
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$offerId', '$$offerId'] } } },
          ],
          as: 'comments',
        },
      },
      {
        $addFields: {
          rating: { $avg: '$comments.rating' },
        },
      },
      { $unset: 'comments' },
    ]).exec();

    if (result.length > 0) {
      return parseFloat(result[0].rating.toFixed(1)) ?? null;
    }

    return null;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({_id: documentId})) !== null;
  }
}
