import { BaseController, DocumentExistsMiddleware, HttpMethod, ValidateDtoMiddleware, ValidateObjectIdMiddleware, PrivateRouteMiddleware } from '../../libs/rest/index.js';
import { HttpError } from '../../libs/rest/index.js';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { Request, Response } from 'express';
import { OfferService } from './offer-service.interface.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { fillDTO } from '../../helpers/index.js';
import { OfferRdo, FullOfferRdo } from './index.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CommentRdo, CommentService } from '../comment/index.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { DEFAULT_OFFERS_COUNT } from './offer.constant.js';

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
        new PrivateRouteMiddleware(),
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
    if (tokenPayload) {
      const count = limit ? limit as unknown as number : DEFAULT_OFFERS_COUNT;
      const offers = await this.offerService.findAuth(count, tokenPayload.id);
      this.ok(res, fillDTO(OfferRdo, offers));
    } else {
      const count = limit ? limit as unknown as number : DEFAULT_OFFERS_COUNT;
      const offers = await this.offerService.find(count);
      this.ok(res, fillDTO(OfferRdo, offers));
    }
  }

  public async show({ params, tokenPayload }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findFullOfferInfo(offerId, tokenPayload.id);
    this.ok(res, fillDTO(FullOfferRdo, offer));
  }

  public async getPremium({ params, tokenPayload }: Request, res: Response): Promise<void> {
    const { city } = params;
    const cityName = city.charAt(0).toUpperCase() + city.slice(1).toLowerCase();
    let offers;
    if (tokenPayload) {
      offers = await this.offerService.findPremium(cityName, tokenPayload.id);
    } else {
      offers = await this.offerService.findPremium(cityName);
    }
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async getFavorites({ tokenPayload }: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findUserFavorites(tokenPayload.id);
    this.ok(res, fillDTO(OfferRdo, offers));
  }

  //favorites/{offerId}/{status}
  public async updateFavoriteStatus({ params: { offerId, status }, tokenPayload }: Request, res: Response): Promise<void> {
    if (!status || (status !== '0' && status !== '1')) {
      throw new HttpError(StatusCodes.BAD_REQUEST, 'Incorrect path Error. Check your request', '');
    }
    await this.offerService.changeFavoriteStatus(tokenPayload.id, offerId as string, parseInt(status, 10));
    const offer = await this.offerService.findById(offerId as string);
    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async create({ body, tokenPayload }: CreateOfferRequest, res: Response): Promise<void> {
    const result = await this.offerService.create({ ...body, userId: tokenPayload.id });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);
    await this.commentService.deleteByOfferId(offerId);
    this.noContent(res, offer);
  }

  public async update({ body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>, res: Response): Promise<void> {
    const updatedOffer = await this.offerService.updateById(params.offerId, body);
    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async getComments({ params }: Request<ParamOfferId>, res: Response): Promise<void> {
    const comments = await this.commentService.findByOfferId(params.offerId);
    this.ok(res, fillDTO(CommentRdo, comments));
  }

  //TODO убрать после отладки
  public async consoleLog(_req: Request, res: Response): Promise<void> {
    console.log('Hello!');
    this.ok(res, 'Hello!');
  }
}
