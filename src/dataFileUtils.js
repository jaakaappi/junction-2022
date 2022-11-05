import flatten from "@turf/flatten";
import fs from "fs";

export const loadPopulationDataPolygons = () => {
  const response2 = fs.readFileSync("public/vaesto_2021_4326.geojson");
  const population = flatten(JSON.parse(response2.toString()));
  return population;
};
