import { PropertyTypes } from '../../../context/FeatureMapProvider';

export function transformGeojsonToProperties(data: any) {
  const result: PropertyTypes[] = [];

  data.forEach((item: any) => {
    item.features.forEach((feature: any) => {
      const transformedObject = {
        id: feature.id,
        image: feature.properties.image,
        title: feature.properties.title,
        location: {
          city: feature.properties.location.city,
          state: feature.properties.location.state || '', // Optional state
          country: feature.properties.location.country,
          zip_code: feature.properties.location.zip_code,
          latitude: feature.geometry.coordinates[1],
          longitude: feature.geometry.coordinates[0]
        },
        price: feature.properties.price,
        beds: feature.properties.beds,
        baths: feature.properties.baths,
        length: feature.properties.length,
        featured: feature.properties.featured,
        amenities: feature.properties.amenities,
        features: feature.properties.features
      };
      result.push(feature);
    });
  });

  return result;
}
