import * as R from "rambda";
import express from "express";
import { loadPopulationDataPolygons } from "./dataFileUtils.js";
import * as dotenv from "dotenv";
import { calculatePopulation, calculatePopulationScore } from "./analysis.js";
import { getIsochrone } from "./isochrone.js";
import { getCityBikes } from "./citybikes.js";
import {
  SUPPORTED_ISOCHRONE_TIME_RANGES,
  SUPPORTED_ISOCHRONE_TRAVEL_MODES,
} from "./constants.js";
import { getPOIs, getPOIScore } from "./pois.js";

dotenv.config();
const app = express();

const requiredEnvVars = ["GEOAPIFY_KEY", "PORT"];
requiredEnvVars.map((envVar) => {
  if (R.isNil(R.prop(envVar, process.env)))
    throw Error(`Missing env var ${envVar}`);
});

app.locals.populationData = loadPopulationDataPolygons();

app.use(express.static("public"));

app.get("/health", (req, res) => {
  res.status(200).send();
});

// Suitability estimate for a WGS84 location https://developer.apple.com/documentation/corelocation/cllocationcoordinate2d
app.get("/estimate", async (req, res) => {
  if (R.isNil(req.query.latitude) || R.isNil(req.query.longitude))
    res.status(400).send("Missing or bad coordinates");

  if (
    R.isNil(req.query.isochroneTransitMode) ||
    !SUPPORTED_ISOCHRONE_TRAVEL_MODES.includes(req.query.isochroneTransitMode)
  )
    res.status(400).send("Missing or bad isochrone transit mode");

  if (
    R.isNil(req.query.isochroneTimeRange) ||
    !SUPPORTED_ISOCHRONE_TIME_RANGES.includes(req.query.isochroneTimeRange)
  )
    res.status(400).send("Missing or bad isochrone time range");

  let timestamp = Date.now();
  const isochrone = await getIsochrone(
    req.query.latitude,
    req.query.longitude,
    req.query.isochroneTransitMode,
    req.query.isochroneTimeRange
  );
  console.log("Isochrone", (Date.now() - timestamp) / 1000);

  timestamp = Date.now();
  const cityBikes = getCityBikes(
    req.query.latitude,
    req.query.longitude,
    isochrone
  );
  console.log("Citybikes", (Date.now() - timestamp) / 1000);
  //console.log(cityBikes);

  timestamp = Date.now();
  const population = await calculatePopulation(
    req.app.locals.populationData,
    isochrone
  );
  const reachablePopulation = {
    population: population,
    score: calculatePopulationScore(population, req.query.isochroneTimeRange),
  };
  console.log("Population", (Date.now() - timestamp) / 1000);
  //console.log(reachablePopulation);

  timestamp = Date.now();
  const sortedPOIs = getPOIs(isochrone);
  const POIScore = getPOIScore(sortedPOIs);
  const POIs = {
    score: POIScore,
    POIs: sortedPOIs,
  };
  console.log("POIs", (Date.now() - timestamp) / 1000);

  res.json({
    reachablePopulation: reachablePopulation,
    cityBikes: cityBikes,
    POIs: POIs,
    isochoroneGeoJson: isochrone,
  });
});

app.listen(process.env.PORT, () => {
  console.log("Awesome server is up");
});
