import fs from "fs";
import pointsWithinPolygon from "@turf/points-within-polygon";
import {point} from "@turf/helpers";
import nearestPoint from "@turf/nearest-point";
import distance from "@turf/distance";

const cityBikesGeojson = JSON.parse(fs.readFileSync("public/citybikes.geojson"));
const getCityBikesInsideArea = (isochrone) => {
    const area = isochrone
    const bikes = cityBikesGeojson
    const bikesInArea = pointsWithinPolygon(bikes, area)
    return bikesInArea
};

const getNearestBikeStation = (marker, bikes) => {
    const nearest = nearestPoint(marker, bikes)
    return nearest
};

const getCityBikeScore = (nearestStationDistance) => {
    // 0 meters => 100 score; >= 1000 meters => -100 score
    const inMeters = nearestStationDistance * 1000
    const score = (-0.1) * inMeters + 100
    return Math.max(score, -100)
}

export const getCityBikes = (latitude, longitude, isochrone) => {
    const marker = point([longitude, latitude])
    const bikesInArea = getCityBikesInsideArea(isochrone)
    const nearestStation = getNearestBikeStation(marker, bikesInArea)
    const distanceToNearest = distance(marker, nearestStation, {units: 'kilometers'})
    const cityBikeScore = getCityBikeScore(distanceToNearest)
    return {
        score: cityBikeScore,
        distanceToNearest: distanceToNearest,
        bikesInArea: bikesInArea
    }
}
