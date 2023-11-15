import dayjs from 'dayjs';
import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, Property, Goods } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems } from '../../helpers/index.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

const MIN_PRICE = 500;
const MAX_PRICE = 2000;

const MIN_ROOM = 1;
const MAX_ROOM = 4;

const MIN_GUESTS = 1;
const MAX_GUESTS = 4;

const MIN_LOCATION = 1;
const MAX_LOCATION = 10;
const LOCATION_FLOAT = 6;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publishedDate = dayjs()
      .subtract(generateRandomValue(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();
    const city = getRandomItem<string>(this.mockData.cities);
    const preview = getRandomItem<string>(this.mockData.previews);
    const images = getRandomItems<string>(this.mockData.images);
    const isPremium = getRandomItem(['true', 'false']);
    const isFavorite = false;
    const rating = 0;
    const property = getRandomItem(Object.values(Property));
    const roomsCount = generateRandomValue(MIN_ROOM, MAX_ROOM);
    const guestsCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const goods = getRandomItems(Object.values(Goods));
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatarsPath);
    const isPro = getRandomItem(['standard', 'pro']);
    const user = [name, email, avatar, isPro];
    const commentsCount = 0;
    const latitude = generateRandomValue(MIN_LOCATION, MAX_LOCATION, LOCATION_FLOAT);
    const longitude = generateRandomValue(MIN_LOCATION, MAX_LOCATION, LOCATION_FLOAT);
    const location = [latitude, longitude];

    return [
      title, description, publishedDate, city, preview,
      images.join(';'), isPremium, isFavorite, rating, property,
      roomsCount, guestsCount, price, goods.join(';'), user.join('\t'), commentsCount, location.join(';'),
    ].join('\t');
  }
}
