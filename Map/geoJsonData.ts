import { FeatureCollection, Point } from 'geojson';
export const propertyData: FeatureCollection<Point> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 1,
      geometry: {
        type: 'Point',
        coordinates: [-80.1303, 25.7907]
      },
      properties: {
        title: 'Modern Beachfront Condo',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'Miami Beach',
          state: 'Florida',
          country: 'USA',
          zip_code: '33139'
        },
        price: '$2,500,000',
        beds: 3,
        baths: 2.5,
        length: 1500,
        amenities: ['Pool', 'Gym', 'Beach Access'],
        features: ['Ocean views', 'Open-concept floor plan', 'Stainless steel appliances']
      }
    },
    {
      type: 'Feature',
      id: 2,
      geometry: {
        type: 'Point',
        coordinates: [-73.9597, 40.6897]
      },
      properties: {
        title: 'Charming Victorian Townhouse',
        image: '/property/x.jpg',
        featured: false,
        location: {
          city: 'Brooklyn',
          state: 'New York',
          country: 'USA',
          zip_code: '11201'
        },
        price: '$1,200,000',
        beds: 4,
        baths: 3,
        length: 2200,
        amenities: ['Garden', 'Fireplace', 'Historical district'],
        features: ['Original details', 'High ceilings', 'Private patio']
      }
    },
    {
      type: 'Feature',
      id: 3,
      geometry: {
        type: 'Point',
        coordinates: [-73.9817, 40.7614]
      },
      properties: {
        title: 'Luxury Penthouse Apartment',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'Manhattan',
          state: 'New York',
          country: 'USA',
          zip_code: '10022'
        },
        price: '$5,000,000',
        beds: 2,
        baths: 3,
        length: 2500,
        amenities: ['Rooftop pool', 'Concierge service', 'Gym'],
        features: ['Panoramic city views', 'Modern design', 'High-end finishes']
      }
    },
    {
      type: 'Feature',
      id: 4,
      geometry: {
        type: 'Point',
        coordinates: [-72.5803, 44.6408]
      },
      properties: {
        title: 'Country Cottage with Acreage',
        image: '/property/x.jpg',
        featured: false,
        location: {
          city: 'Ruralville',
          state: 'Vermont',
          country: 'USA',
          zip_code: '05489'
        },
        price: '$750,000',
        beds: 3,
        baths: 2,
        length: 1800,
        amenities: ['Large yard', 'Fireplace', 'Barn'],
        features: ['Country setting', 'Privacy', 'Outdoor space']
      }
    },
    {
      type: 'Feature',
      id: 5,
      geometry: {
        type: 'Point',
        coordinates: [-122.4194, 37.7798]
      },
      properties: {
        title: 'Modern Farmhouse with Pool',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'Suburbia',
          state: 'California',
          country: 'USA',
          zip_code: '94025'
        },
        price: '$1,800,000',
        beds: 4,
        baths: 3.5,
        length: 2800,
        amenities: ['Pool', 'Spa', 'Outdoor kitchen'],
        features: ['Open-plan living', 'High ceilings', 'Modern farmhouse style']
      }
    },
    {
      type: 'Feature',
      id: 6,
      geometry: {
        type: 'Point',
        coordinates: [-73.9522, 40.6744]
      },
      properties: {
        title: 'Historic Brownstone in Brooklyn',
        image: '/property/x.jpg',
        featured: false,
        location: {
          city: 'Brooklyn',
          state: 'New York',
          country: 'USA',
          zip_code: '11215'
        },
        price: '$1,500,000',
        beds: 3,
        baths: 2.5,
        length: 2000,
        amenities: ['Garden', 'Fireplace', 'Historic district'],
        features: ['Original details', 'High ceilings', 'Private patio']
      }
    },
    {
      type: 'Feature',
      id: 7,
      geometry: {
        type: 'Point',
        coordinates: [-77.5436, 25.0348]
      },
      properties: {
        title: 'Beachfront Villa in the Caribbean',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'Paradise Island',
          state: 'Caribbean',
          country: 'Bahamas',
          zip_code: '12345'
        },
        price: '$3,500,000',
        beds: 4,
        baths: 3,
        length: 3000,
        amenities: ['Private beach', 'Pool', 'Outdoor dining area'],
        features: ['Ocean views', 'Tropical landscaping', 'Luxurious amenities']
      }
    },
    {
      type: 'Feature',
      id: 8,
      geometry: {
        type: 'Point',
        coordinates: [-106.7253, 39.1879]
      },
      properties: {
        title: 'Modern Mountainside Retreat',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'Aspen',
          state: 'Colorado',
          country: 'USA',
          zip_code: '81611'
        },
        price: '$2,200,000',
        beds: 3,
        baths: 2.5,
        length: 2500,
        amenities: ['Ski-in/ski-out access', 'Hot tub', 'Mountain views'],
        features: ['Modern design', 'Cozy ambiance', 'Mountain views']
      }
    },
    {
      type: 'Feature',
      id: 9,
      geometry: {
        type: 'Point',
        coordinates: [-73.9817, 40.7614]
      },
      properties: {
        title: 'Penthouse Apartment with City Views',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'New York City',
          state: 'New York',
          country: 'USA',
          zip_code: '10019'
        },
        price: '$4,500,000',
        beds: 2,
        baths: 3,
        length: 2500,
        amenities: ['Rooftop pool', 'Concierge service', 'Gym'],
        features: ['Panoramic city views', 'Modern design', 'High-end finishes']
      }
    },
    {
      type: 'Feature',
      id: 10,
      geometry: {
        type: 'Point',
        coordinates: [-72.5803, 44.6408]
      },
      properties: {
        title: 'Historic Farmhouse in the Country',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'Ruralville',
          state: 'Vermont',
          country: 'USA',
          zip_code: '05489'
        },
        price: '$850,000',
        beds: 3,
        baths: 2,
        length: 1800,
        amenities: ['Large yard', 'Fireplace', 'Barn'],
        features: ['Country setting', 'Privacy', 'Outdoor space']
      }
    },
    {
      type: 'Feature',
      id: 11,
      geometry: {
        type: 'Point',
        coordinates: [-82.4813041, 27.2898582]
      },
      properties: {
        boundary: {
          type: 'Polygon',
          snapshot: {
            path: [
              {
                lat: 27.289876260055866,
                lng: -82.48144139241838
              },
              {
                lat: 27.28996088046771,
                lng: -82.48124961447381
              },
              {
                lat: 27.289825011042684,
                lng: -82.48117853593492
              },
              {
                lat: 27.289791639579544,
                lng: -82.48126704883241
              },
              {
                lat: 27.289817860015724,
                lng: -82.48128180098199
              },
              {
                lat: 27.289767802814012,
                lng: -82.48138238382005
              }
            ]
          }
        },
        title: '4506 McIntosh Rd, Sarasota, FL 34233, USA',
        image: '/property/x.jpg',
        featured: true,
        location: {
          city: 'Ruralville',
          state: 'Vermont',
          country: 'USA',
          zip_code: '05489'
        },
        price: '$850,000',
        beds: 3,
        baths: 2,
        length: 1800,
        amenities: ['Large yard', 'Fireplace', 'Barn'],
        features: ['Country setting', 'Privacy', 'Outdoor space']
      }
    }
  ]
};
