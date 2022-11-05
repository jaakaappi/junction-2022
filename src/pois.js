import fs from "fs";
import pointsWithinPolygon from "@turf/points-within-polygon";

const response = fs.readFileSync("public/helsinki_pois.json");
const pois = JSON.parse(response.toString());

export const getPOIS = (isocrone, amnesity) => {
  //pois.features = pois.features.filter(row => row.properties.amenity === "restaurant");
  console.log("hi")

  return pointsWithinPolygon(pois.features, isocrone);
};

console.log(getPOIS(JSON.parse(fs.readFileSync("public/response_example.geojson"), "restaurant")));


