import pointsWithinPolygon from "@turf/points-within-polygon";
import fs from "fs";

const pois = JSON.parse(fs.readFileSync("public/helsinki_pois.json"));

const isochrone = JSON.parse(
  fs.readFileSync("public/response_example.geojson")
);

export const getPOIs = (isochone, amnesity) => {

  const points = pois.features.filter(row => row.properties.amenity === amnesity);
  return points.filter((poi) => {
  // console.log("poi", poi);
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
}
