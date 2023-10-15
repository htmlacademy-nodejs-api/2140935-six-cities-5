import { OfferGenerator } from './offer-generator.interface.js';
import { MockServerData, Property, Facility } from '../../types/index.js';
import { generateRandomValue, getRandomItem, getRandomItems, getRandomDate } from '../../helpers/index.js';


const MIN_PRICE = 500;
const MAX_PRICE = 2000;

const MIN_RATING = 1;
const MAX_RATING = 5;

const MIN_ROOM = 1;
const MAX_ROOM = 4;

const MIN_GUESTS = 1;
const MAX_GUESTS = 4;

const MIN_COMMENTS = 0;
const MAX_COMMENTS = 100;

const MIN_LOCATION = 1;
const MAX_LOCATION = 10;
const LOCATION_FLOAT = 6;

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem<string>(this.mockData.titles);
    const description = getRandomItem<string>(this.mockData.descriptions);
    const publishedDate = getRandomDate();
    const city = getRandomItem<string>(this.mockData.cities);
    const preview = getRandomItem<string>(this.mockData.previews);
    const photos = getRandomItems<string>(this.mockData.images);
    const isPremium = getRandomItem(['true', 'false']);
    const isFavorite = getRandomItem(['true', 'false']);
    const rating = generateRandomValue(MIN_RATING, MAX_RATING);
    const property = getRandomItem(Object.values(Property));
    const roomsCount = generateRandomValue(MIN_ROOM, MAX_ROOM);
    const guestsCount = generateRandomValue(MIN_GUESTS, MAX_GUESTS);
    const price = generateRandomValue(MIN_PRICE, MAX_PRICE);
    const facilities = getRandomItems(Object.values(Facility));
    const name = getRandomItem<string>(this.mockData.names);
    const email = getRandomItem<string>(this.mockData.emails);
    const avatar = getRandomItem<string>(this.mockData.avatarsPath);
    const password = getRandomItem<string>(this.mockData.passwords);
    const isPro = getRandomItem(['true', 'false']);
    const author = [name, email, avatar, password, isPro];
    const commentsCount = generateRandomValue(MIN_COMMENTS, MAX_COMMENTS);
    const latitude = generateRandomValue(MIN_LOCATION, MAX_LOCATION, LOCATION_FLOAT);
    const longitude = generateRandomValue(MIN_LOCATION, MAX_LOCATION, LOCATION_FLOAT);
    const location = [latitude, longitude];

    return [
      title, description, publishedDate, city, preview,
      photos.join(';'), isPremium, isFavorite, rating, property,
      roomsCount, guestsCount, price, facilities.join(';'), author.join(' '), commentsCount, location.join(';'),
    ].join('\t');
  }
}
