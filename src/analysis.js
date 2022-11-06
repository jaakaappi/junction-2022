import area from "@turf/area";
import bbox from "@turf/bbox";
import bboxPolygon from "@turf/bbox-polygon";
import booleanWithIn from "@turf/boolean-within";
import intersect from "@turf/intersect";

export const calculatePopulation = async (population, isochrone) => {
  const orderedIsochroneRegions = isochrone.features;

  let populationFeatures = population.features;
  let insideBboxFeatures = [];
  let remainingPopulationFeatures = populationFeatures;
  const orderedIsochroneRegionBbs = orderedIsochroneRegions.map((region) =>
    bboxPolygon(bbox(region))
  );
  for (let i = 0; i < orderedIsochroneRegionBbs.length; i++) {
    const containedPopulationFeatures = remainingPopulationFeatures.filter(
      (feature) =>
        booleanWithIn(feature, orderedIsochroneRegionBbs[i]) ||
        intersect(orderedIsochroneRegionBbs[i], feature) !== null
    );
    remainingPopulationFeatures = remainingPopulationFeatures.filter(
      (feature) => !containedPopulationFeatures.includes(feature)
    );
    insideBboxFeatures.push(...containedPopulationFeatures);
  }

  let matchedPopulationFeatures = [];
  for (let i = 0; i < orderedIsochroneRegions.length; i++) {
    const overlapped = insideBboxFeatures.filter(
      (populationFeature) =>
        booleanWithIn(populationFeature, orderedIsochroneRegions[i]) ||
        intersect(orderedIsochroneRegions[i], populationFeature) !== null
    );
    insideBboxFeatures = insideBboxFeatures.filter(
      (feature) =>
        !overlapped.some(
          (overlap) => overlap.properties.INDEX === feature.properties.INDEX
        )
    );
    matchedPopulationFeatures.push(...overlapped);
  }
  const populationInRange = matchedPopulationFeatures.reduce(
    (prev, current) => current.properties["ASUKKAITA"] + prev,
    0
  );
  return populationInRange;
};

export const calculatePopulationScore = (population) => {
  if (population < 10000) return 0.01 * population - 1000;
  else return Math.min(0.009 * population - 900, 900);
};
