import { FileReader } from './file-reader.interface.js';
import { readFileSync } from 'node:fs';
import { City, Facility, Offer, Property } from '../../types/index.js';

function convertToOffer(data: string[]): Offer {
  const [title, description, date, city, preview, photos, premium, favorite, rating, property, rooms, guests, price, facilities, name, email, avatar, password, isPro, commentsCount, location] = data;
  return {
    title,
    description,
    publishedDate: new Date(date),
    city: city as City,
    preview,
    photos: photos.split(';'),
    premium: premium === 'true',
    favorite: favorite === 'true',
    rating: Number.parseFloat(rating),
    property: property as Property,
    roomsCount: Number.parseInt(rooms, 10),
    guestsCount: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    facilities: facilities.split(';').map((facility) => facility as Facility),
    author: {
      name,
      email,
      avatar,
      password,
      isPro: isPro === 'true',
    },
    commentsCount: Number.parseInt(commentsCount, 10),
    location: {
      latitude: Number.parseFloat(location.split(';')[0]),
      longitude: Number.parseFloat(location.split(';')[1])
    }
  };
}

export class TSVFileReader implements FileReader {
  private rawData = '';

  constructor(
    private readonly filename: string
  ) {}

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    if (!this.rawData) {
      throw new Error('File was not read');
    }

    return this.rawData
      .split('\n')
      .filter((row) => row.trim().length > 0)
      .map((line) => convertToOffer(line.split('\t')));
  }
}
