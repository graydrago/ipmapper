/**
 * Description
 *
 * Because I have limitations on amount of requests to freegeoip.net, so I have
 * to prepare some kind of cache.
 *
 * It's bad idea to save cache in source control, but later I can without
 * headache run this project. Don't do that in the real life.
 */
let fs = require("fs");
let https = require("https");

if (process.argv.length < 4) {
    console.log(`Usage: ${__filename} input_file.json output_file.json`);
    process.exit(0);
}

const INPUT_FILE_NAME = process.argv[2];
const OUTPUT_FILE_NAME = process.argv[3];
let data = JSON.parse(fs.readFileSync(INPUT_FILE_NAME));

(async () => {
    let output_array = [];
    for (let item of data) {
        let ip_address = item[0];
        let number_of_requests = item[1];
        await get_geo_data(ip_address)
            .then((geo_data) => {
                console.log(`processed: ${ip_address}: ${geo_data.country_name} - ${geo_data.region_name}`);
                output_array.push({
                    number_of_requests,
                    ...geo_data
                });
            })
            .catch((error) => {
                console.error(error);
                process.exit(1);
            });
    }
    fs.writeFileSync(OUTPUT_FILE_NAME, JSON.stringify(output_array));
})();


async function get_geo_data(ip) {
    return new Promise((resolve, reject) => {
        https.get(`https://freegeoip.net/json/${ip}`, (res) => {
            let body = "";
            if (res.statusCode === 200) {
                res.on("data", (chunk) => { body += chunk; });
                res.on("end", () => {
                    resolve({
                        status: "ok",
                        ...JSON.parse(body)
                    });
                });
            } else if (res.statusCode === 404) {
                resolve({
                    status: "not_found",
                    ip: ip
                })
            } else {
                reject(`Found error while fetching data from https://freegeoip.net/. Status code: ${res.statusCode}.`);
            }
        });
    });
}
