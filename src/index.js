import * as R from "rambda";
import express from "express";
import { loadPopulationDataPolygons } from "./dataUtils.js";
import * as dotenv from "dotenv";
import { intersection } from "./isocrone.js";

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

  res.json({
    reachablePopulation: await intersection(req.app.locals.populationData),
  });
});

app.listen(process.env.port, () => {
  console.log("Awesome server is up");
});
