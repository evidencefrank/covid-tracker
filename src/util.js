import React from "react";
import { Circle, Popup } from "react-leaflet";
import numeral from 'numeral';

const typeColors = {
    cases: {
        hex: "#CC1034",
        multiplier: 100
    },
    recovered: {
        hex: "#7DD71D",
        multiplier: 200
    },
    deaths: {
        hex: "#C0C0C0",
        multiplier: 700
    }
}

export const sortData = (data) => {
    const sortedData = [...data]; //copy out into an array

    return sortedData.sort((a, b) => a.cases > b.cases ? -1 : 1);
}

export const prettyPrintStat = (stat) => stat ? `+${numeral(stat).format("0.0a")}` : "+0";

// Draw cirlces on the map with interactive tooltip
export const showDataOnMap = (data, type = 'cases') => (
    data.map(country => (
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            pathOptions={{
                color: typeColors[type].hex,
                fillColor: typeColors[type].hex
            }}
            radius={
                Math.sqrt(country[type] / 10) * typeColors[type].multiplier
            }
        >
            <Popup>
                <div className="info-container">
                    <div className="info-flag" style={{ backgroundImage: `url(${country.countryInfo.flag})` }} />
                    <div className="info-name">{country.country}</div>
                    <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                    <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                    <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                </div>
            </Popup>
        </Circle>

    ))
);