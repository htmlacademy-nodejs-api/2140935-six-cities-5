import { BaseController, DocumentExistsMiddleware, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { City, Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { fillDTO } from '../../helpers/index.js';
import { ParamOfferId, CreateOfferRequest, OfferService, OfferRdo, FullOfferRdo, UpdateOfferDto, CreateOfferDto } from './index.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { DEFAULT_OFFERS_COUNT } from '../../const/index.js';

@injectable()
export default class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected logger: Logger,
    @inject(Component.OfferService) private readonly offerService: OfferService,
    @inject(Component.CommentService) private readonly commentService: CommentService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateDtoMiddleware(CreateOfferDto)
      ]
    });
    this.addRoute({
      path: '/premium/:city',
      method: HttpMethod.Get,
      handler: this.getPremium,
      middlewares: []
    });
    this.addRoute({
      path: '/favorites',
      method: HttpMethod.Get,
      handler: this.getFavorites,
      middlewares: [
        new PrivateRouteMiddleware(),
      ]
    });
    this.addRoute({
      path: '/favorites/:offerId/:status',
      method: HttpMethod.Post,
      handler: this.updateFavoriteStatus,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId/comments',
      method: HttpMethod.Get,
      handler: this.getComments,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Get,
      handler: this.show,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
    this.addRoute({
      path: '/:offerId',
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDtoMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId')
      ]
    });
  }

  public async index({ query: { limit }, tokenPayload }: Request, res: Response): Promise<void> {
    const count = limit ? limit as unknown as number : DEFAULT_OFFERS_COUNT;
    let offers = [];

    if (tokenPayload) {
      offers = await this.offerService.findAuth(count, tokenPayload.id);
    } else {
      offers = await this.offerService.find(count);
    }

    const offersWithRatings = await Promise.all(offers.map(async (offer) => {
      const preRating = await this.offerService.calculateRating(offer._id.toString());
      const rating = preRating === null ? 0 : preRating;
      const offerData = offer.toJSON ? offer.toJSON() : offer;
      return { ...offerData, rating };
    }));

    this.ok(res, fillDTO(OfferRdo, offersWithRatings));
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    let offer;
    if (tokenPayload) {
      offer = await this.offerService.findFullOfferInfo(offerId, tokenPayload.id);
    } else {
      offer = await this.offerService.findFullOfferInfo(offerId);
    }
    const preRating = await this.offerService.calculateRating(offerId);
    const rating = preRating === null ? 0 : preRating;
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', '');
    }
    const offerData = offer.toJSON ? offer.toJSON() : offer;
    this.ok(res, fillDTO(FullOfferRdo, {...offerData, rating}));
  }

  public async getPremium({ params, tokenPayload }: Request, res: Response): Promise<void> {
    const { city } = params;
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    let offers = [];
    if (tokenPayload) {
      offers = await this.offerService.findPremium(cityName as City, tokenPayload.id);
    } else {
      offers = await this.offerService.findPremium(cityName as City);
    }

    const offersWithRatings = await Promise.all(offers.map(async (offer) => {
      const preRating = await this.offerService.calculateRating(offer._id.toString());
      const rating = preRating === null ? 0 : preRating;
      const offerData = offer.toJSON ? offer.toJSON() : offer;
      return { ...offerData, rating };
    }));

    this.ok(res, fillDTO(OfferRdo, offersWithRatings));
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findUserFavorites(tokenPayload.id);

    if (offers) {
      const offersWithRatings = await Promise.all(offers.map(async (offer) => {
        const preRating = await this.offerService.calculateRating(offer._id.toString());
        const rating = preRating === null ? 0 : preRating;
        const offerData = offer.toJSON ? offer.toJSON() : offer;
        return { ...offerData, rating };
      }));

      this.ok(res, fillDTO(OfferRdo, offersWithRatings));
    } else {
      this.ok(res, fillDTO(OfferRdo, []));
    }
  }

  public async updateFavoriteStatus({ params: { offerId, status }, tokenPayload }: Request, res: Response): Promise<void> {
    if (!status || (status !== '0' && status !== '1')) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Incorrect path Error. Check your request', '');
    }
    await this.offerService.changeFavoriteStatus(tokenPayload.id, offerId as string, parseInt(status, 10));
    const offer = await this.offerService.findById(offerId as string);
    const preRating = await this.offerService.calculateRating(offerId);
    const rating = preRating === null ? 0 : preRating;
    if (!offer) {
      throw new HttpError(StatusCodes.NOT_FOUND, 'Offer not found', '');
    }
    const offerData = offer.toJSON ? offer.toJSON() : offer;
    this.ok(res, fillDTO(OfferRdo, {...offerData, isFavorite: Boolean(Number(status)), rating}));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({
      ...body,
      offerDate: new Date(),
      userId: tokenPayload.id,
      isFavorite: false,
      rating: 0,
      commentCount: 0,
    });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(FullOfferRdo, offer));
  }

  public async delete({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId, tokenPayload.id);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({ body, params, tokenPayload }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(body, params.offerId, tokenPayload.id);
    if (updatedOffer) {
      const preRating = await this.offerService.calculateRating(params.offerId);
      const rating = preRating === null ? 0 : preRating;
      const offerData = updatedOffer.toJSON ? updatedOffer.toJSON() : updatedOffer;
      this.ok(res, fillDTO(FullOfferRdo, {...offerData, rating}));
    }
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
