import fetch from "node-fetch";
import booleanWithIn from "@turf/boolean-within";
import intersect from "@turf/intersect";
import flatten from "@turf/flatten";
import fs from "fs";
import * as dotenv from "dotenv";

const geoapify_key = process.env.GEOAPIFY_KEY;

export const intersection = async (population, lat, lon, mode, range) => {
  //const response = await fetch(
  //  `https://api.geoapify.com/v1/isoline?lat=${lat}&lon=${lon}&type=time&mode=${mode}&range=${range}&apiKey=${geoapify_key}`
  //);
  const response = fs.readFileSync("public/response_example.geojson");
  const isochrone = flatten(JSON.parse(response.toString()));

  // const response2 = fs.readFileSync("public/vaesto_2021_4326.geojson");
  // const population = flatten(JSON.parse(response2.toString()));

  console.log("population);

  return population.features
    .filter((popF) => {
      // if (f.geometry.type === 'MultiPolygon')
      // console.log(f.geometry.type, isochrone.type);
      let intersects = false;
      for (let i = 0; i < isochrone.features.length; i++) {
        const isoF = isochrone.features[i];
        if (intersect(popF, isoF) !== null || booleanWithIn(popF, isoF)) {
          intersects = true;
          break;
        }
      }
      return intersects;
    })
    .reduce((prev, current) => current.properties["ASUKKAITA"] + prev, 0);
};

(async () => {
  //const a = { type: "FeatureCollection", features: await intersection() };
  console.log(await intersection());
  //await fs.writeFileSync("äitis", JSON.stringify(a));
})();
