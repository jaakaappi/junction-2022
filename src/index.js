import * as R from "rambda";
import express from "express";
import { loadPopulationDataPolygons } from "./dataFileUtils.js";
import * as dotenv from "dotenv";
import { calculatePopulation } from "./analysis.js";
import { getIsochrone } from "./isochrone.js";
import {
  SUPPORTED_ISOCHRONE_TIME_RANGES,
  SUPPORTED_ISOCHRONE_TRAVEL_MODES,
} from "./constants.js";

const app = express();

dotenv.config();

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
    res.status(400).send("Missing or bad coordinate information");

  if (
    R.isNil(req.query.isochroneTransitMode) ||
    !SUPPORTED_ISOCHRONE_TRAVEL_MODES.includes(req.query.isochroneTransitMode)
  )
    res.status(400).send("Missing or bad isochrone transit mode");

  if (
    R.isNil(req.query.isochroneTimeRange) ||
    !SUPPORTED_ISOCHRONE_TIME_RANGES.includes(req.query.isochroneTimeRange)
  )
    res.status(400).send("Missing or bad isochrone time ranges");

  const isochrone = await getIsochrone(
    req.query.latitude,
    req.query.longitude,
    req.query.isochroneTransitMode,
    req.query.isochroneTimeRange
  );
  res.json({
    reachablePopulation: await calculatePopulation(
      req.app.locals.populationData,
      isochrone
    ),
  });
});

app.listen(process.env.port, () => {
  console.log("Awesome server is up");
});
