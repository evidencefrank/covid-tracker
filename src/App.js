import React, { useEffect, useState } from 'react';
import { FormControl, Select, MenuItem, Card, CardContent } from '@material-ui/core';
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import LineGraph from './LineGraph';
import { sortData, prettyPrintStat } from "./util";
import './App.css';
import "leaflet/dist/leaflet.css"

function App () {

  // STATE = How to write a variable in REACT <<<<<<

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState('worldwide');
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [type, setType] = useState('cases');

  // USEEFFECT = Runs a piece of code based on a given condition

  useEffect(() => {
    fetch('https://disease.sh/v3/covid-19/all')
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      })
  }, []);

  useEffect(() => {
    // The code inside here will run once when the component loads and as well when there is a change to the variable "countries"
    // async -> send a request, wait for it, then do something with the response

    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => (
            {
              name: country.country,
              value: country.countryInfo.iso2
            }
          ));

          const sortedData = sortData(data);

          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();

  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    if (country === countryCode) return;

    // https://disease.sh/v3/covid-19/countries{countryCode} || https://disease.sh/v3/covid-19/all
    const url = countryCode === 'worldwide' ? 'https://disease.sh/v3/covid-19/all' : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);

        // All of the data from the country response
        setCountryInfo(data);

        //update map
        countryCode === 'worldwide' ? setMapCenter({ lat: 34.80746, lng: -40.4796 }) : setMapCenter({ lat: data.countryInfo.lat, lng: data.countryInfo.long });

        setMapZoom(4);
      });

  };


  return (
    <div className="app">

      <div className="app__left">
        {/* Header */}
        {/* Title + Select input dropdown field */}
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select variant="outlined" onChange={onCountryChange} value={country}>
              {/* Loop through all the countries and show a drop down of the options */}
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {
                countries.map((country) => (
                  <MenuItem value={country.value}>{country.name}</MenuItem>
                ))
              }

            </Select>
          </FormControl>
        </div>


        <div className="app__stats">
          {/* InforBoxes title="Coronavirus cases"*/}
          <InfoBox
            isRed
            active={type === 'cases'}
            onClick={(e) => setType('cases')}
            title="Coronavirus Cases"
            total={prettyPrintStat(countryInfo.cases)}
            cases={prettyPrintStat(countryInfo.todayCases)}
          ></InfoBox>

          {/* InforBoxes title="Coronavirus recoveries" */}
          <InfoBox
            active={type === 'recovered'}
            onClick={(e) => setType('recovered')}
            title="Recovered"
            total={prettyPrintStat(countryInfo.recovered)}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
          ></InfoBox>

          {/* InforBoxes title="Coronavirus deaths"*/}
          <InfoBox
            isRed
            active={type === 'deaths'}
            onClick={(e) => setType('deaths')}
            title="Deaths"
            total={prettyPrintStat(countryInfo.deaths)}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
          ></InfoBox>
        </div>

        {/* Map */}
        <Map
          countries={mapCountries}
          type={type}
          center={mapCenter}
          zoom={mapZoom}
        ></Map>
      </div>

      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData}></Table>
          <h3 className="app__graphTitle">Worldwide New {type}</h3>
          <LineGraph className="app__graph" type={type} />
        </CardContent>
      </Card>



    </div>
  );
}

export default App;
