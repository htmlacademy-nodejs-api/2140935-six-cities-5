import { City, Goods, Offer, Property, UserType } from '../types/index.js';

export function createOffer(data: string): Offer {
  const [title,
    description,
    date,
    city,
    preview,
    photos,
    premium,
    favorite,
    rating,
    property,
    rooms,
    guests,
    price,
    goods,
    name,
    email,
    avatar,
    userType,
    commentCount,
    location] = data.replace('\n', '').split('\t');

  return {
    title,
    description,
    offerDate: new Date(date),
    city: city as City,
    preview,
    images: photos.split(';'),
    isPremium: premium === 'true',
    isFavorite: favorite === 'true',
    rating: Number.parseFloat(rating),
    property: property as Property,
    roomsCount: Number.parseInt(rooms, 10),
    guestsCount: Number.parseInt(guests, 10),
    price: Number.parseInt(price, 10),
    goods: goods.split(';').map((good) => good as Goods),
    user: {
      name,
      email,
      avatar,
      userType: userType as UserType,
      favorites: [],
    },
    commentCount: Number.parseInt(commentCount, 10),
    location: {
      latitude: Number.parseFloat(location.split(';')[0]),
      longitude: Number.parseFloat(location.split(';')[1])
    }
  };
}
