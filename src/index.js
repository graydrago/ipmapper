import "leaflet_css";
import L from "leaflet";
import { prepareRoot, colorInterpolation, outExpo } from "./utils";

import "./assets/css/map.scss";


document.addEventListener("DOMContentLoaded", () => {
    const sizeCoefficient = 500;
    const startColor = "#00ff00";
    const endColor = "#ff0000";

    let root = prepareRoot(document.body, "map");
    root.classList.add("map")

    let map = L.map('map');
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    fetch("./data/cache.json", { method: "get" })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            let preparedData = data
                .filter((geoData) => !(geoData.latitude === 0 && geoData.longitude === 0))
                .filter((geoData) => (geoData.status === "ok"));
            preparedData = joinNeighbours(preparedData);
            preparedData.sort((a, b) => b.number_of_requests - a.number_of_requests);

            let requests = preparedData.map((i) => i.number_of_requests);
            let maxRequests = Math.max(...requests);
            
            preparedData.map(
                (geoData) => {
                    let ratio = geoData.number_of_requests/maxRequests;
                    let color = colorInterpolation(startColor, endColor, outExpo(ratio));
                    L.circle([geoData.latitude, geoData.longitude], { radius: geoData.number_of_requests * sizeCoefficient })
                        .setStyle({ color })
                        .addTo(map)
                        .bindPopup(`${geoData.text}<br>Total: ${geoData.number_of_requests}`);
                });

                map.setView([data[0].latitude, data[0].longitude], 3)
        })
        .catch((error) => {
            console.error("Can't load the data set.");
            console.error(error);
        });
});


function joinNeighbours(data) {
    let hash = data.reduce((acc, geoData) => {
        let key = `${geoData.country_name} - ${geoData.region_name}`;
        if (geoData.country_name === undefined) {
            console.log(geoData);
        }
        if (acc[key]) {
            acc[key].text += `<br>${geoData.ip}: ${geoData.number_of_requests}`;
            acc[key].number_of_requests += geoData.number_of_requests;
        } else {
            acc[key] = {
                text: `${geoData.country_name}<br>`+
                      `${geoData.region_name}<br>`+
                      `${geoData.ip}: ${geoData.number_of_requests}`,
                number_of_requests: geoData.number_of_requests,
                longitude: geoData.longitude,
                latitude: geoData.latitude,
            }
        }
        return acc;
    }, {})

    return Object.values(hash);
}
