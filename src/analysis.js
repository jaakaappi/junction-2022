import booleanWithIn from "@turf/boolean-within";
import intersect from "@turf/intersect";

export const calculatePopulation = async (population, isochrone) => {
  const populationInRange = population.features
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

  console.log(populationInRange);
  return populationInRange;
};

export const calculatePopulationScore = (population) => {
  if (population < 10000) return 0.01 * population - 1000;
  else return Math.min(0.009 * population - 900, 900);
};

// (async () => {
//   //const a = { type: "FeatureCollection", features: await intersection() };
//   console.log(await intersection());
//   //await fs.writeFileSync("äitis", JSON.stringify(a));
// })();
