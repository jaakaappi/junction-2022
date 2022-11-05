import booleanWithIn from "@turf/boolean-within";
import intersect from "@turf/intersect";

export const calculatePopulation = async (population, isochrone) => {
  const populationInRange = population.features
    .filter((popF) => {
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
  return populationInRange;
};

export const calculatePopulationScore = (population, time) => {
  const limit = time * 500;
  const res = (population - limit) * 0.1;
  return Math.min(1000, Math.max(-1000, res));
};
