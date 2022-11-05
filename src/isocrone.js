import fetch from "node-fetch";

const geoapify_key = "YOUR_KEY_HERE";
const getIsocroneFor = async (lat, lon, mode, range) => {
  const response = await fetch(
    `https://api.geoapify.com/v1/isoline?lat=${lat}&lon=${lon}&type=time&mode=${mode}&range=${range}&apiKey=${geoapify_key}`
  );
  const data = await response.json();
  return data;
};
