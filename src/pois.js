import pointsWithinPolygon from "@turf/points-within-polygon";
import fs from "fs";
import { POI_TYPE_MAP } from "./constants.js";

const pois = JSON.parse(fs.readFileSync("public/helsinki_pois.json"));

const POIBelongsToCategory = (categoryName, categoryValues, POI) => {
  if (POI_TYPE_MAP[categoryName].includes(POI.properties.amenity)) {
    return "amenity";
  }

  categoryValues.forEach((category) => {
    if (category in POI.properties) {
      if (
        POI.properties[category] !== undefined &&
        POI.properties[category] !== null
      ) {
        return category;
      }
    }
  });

  return null;
};

export const getPOIs = (isochrone) => {
  const points = pois.features.filter((row) => {
    return (
      POI_TYPE_MAP.shops.includes(row.properties.amenity) ||
      POI_TYPE_MAP.restaurants.includes(row.properties.amenity) ||
      POI_TYPE_MAP.entertainment.includes(row.properties.amenity)
    );
  });
  const includedPois = points.filter((poi) => {
    if (
      poi.geometry.type === "Point" &&
      poi.geometry.coordinates &&
      poi.geometry.coordinates.length > 1 &&
      !isNaN(poi.geometry.coordinates[0])
    ) {
      const feature = pointsWithinPolygon(poi, isochrone.features[0].geometry);
      return feature.features.length > 0;
    } else return false;
  });

  const sortedPOIs = includedPois.reduce(
    (previous, current) => {
      if (POIBelongsToCategory("shops", ["shop"], current) !== null) {
        return { ...previous, shops: [...previous.shops, current] };
      } else if (
        POIBelongsToCategory(
          "restaurants",
          POI_TYPE_MAP.restaurants,
          current
        ) !== null
      )
        return { ...previous, restaurants: [...previous.restaurants, current] };
      else
        return {
          ...previous,
          entertainment: [...previous.entertainment, current],
        };
    },
    {
      shops: [],
      restaurants: [],
      entertainment: [],
    }
  );

  return sortedPOIs;
};

export const getPOIScore = () => {
  return 0;
};
