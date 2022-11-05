import * as R from "rambda";
import flatten from "@turf/flatten";
import fs from "fs";

export const getIsochrone = async (latitude, longitude, mode, range) => {
  const geoapifyApiKey = process.env.GEOAPIFY_KEY;

  const responseJson =
    !R.isNil(process.env.USE_GEOAPIFY) && process.env.USE_GEOAPIFY === "true"
      ? await (
          await fetch(
            `https://api.geoapify.com/v1/isoline?lat=${latitude}&lon=${longitude}&type=time&mode=${mode}&range=${
              range * 60
            }&apiKey=${geoapifyApiKey}`
          )
        ).json()
      : JSON.parse(fs.readFileSync("public/response_example.geojson"));

  const isochrone = flatten(responseJson);
  return isochrone;
};
