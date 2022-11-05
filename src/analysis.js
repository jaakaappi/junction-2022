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
<<<<<<< HEAD
=======

  //console.log(populationInRange);
>>>>>>> 32d1682 (fix bike bug if no bike stations inside area)
  return populationInRange;
};

export const calculatePopulationScore = (population) => {
  if (population < 10000) return 0.01 * population - 1000;
  else return Math.min(0.009 * population - 900, 900);
};
