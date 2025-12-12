import { useState, useEffect } from 'react'
import countryService from './services/countries'
import weatherService from './services/weather'
import './App.css'

function App() {
  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [weather, setWeather] = useState(null)

  useEffect(() => {
    countryService.getAll().then(data => {
      console.log(data)
      setCountries(data)
    })
  }, [])

  const handleShowCountry = (countryName) => {
    countryService.getByName(countryName).then(data => {
      setSelectedCountry(Array.isArray(data) ? data[0] : data)
    })
  }

  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(filter.toLowerCase())
  )

  // Quando há apenas 1 país, carrega os detalhes automaticamente
  useEffect(() => {
    const filtered = countries.filter(country =>
      country.name.common.toLowerCase().includes(filter.toLowerCase())
    )
    
    if (filtered.length === 1) {
      console.log('Carregando detalhes de:', filtered[0].name.common)
      countryService.getByName(filtered[0].name.common).then(data => {
        console.log('Detalhes carregados:', data)
        setSelectedCountry(Array.isArray(data) ? data[0] : data)
      }).catch(error => {
        console.log('Erro ao carregar:', error)
      })
    } else if (filtered.length > 10) {
      // Apenas limpa quando há "Too many matches"
      setSelectedCountry(null)
    }
  }, [filter, countries])

  // Carrega o clima quando o país selecionado muda
  useEffect(() => {
    if (selectedCountry && selectedCountry.capitalInfo?.latlng) {
      const [lat, lon] = selectedCountry.capitalInfo.latlng
      weatherService.getWeather(lat, lon).then(data => {
        console.log('Clima carregado:', data)
        setWeather(data)
      }).catch(error => {
        console.log('Erro ao carregar clima:', error)
      })
    }
  }, [selectedCountry])

  return (
    <div>
      <h1>Find countries</h1>
      
      <div>
        find countries: <input 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
          placeholder="type to search..."
        />
      </div>

      <div style={{ marginTop: '20px' }}>
        {filteredCountries.length > 10 && (
          <p>Too many matches, specify another filter</p>
        )}
        
        {selectedCountry ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <h2>{selectedCountry.name.common}</h2>
              <span style={{ fontSize: '100px' }}>{selectedCountry.flag}</span>
            </div>
            <p><strong>Official Name:</strong> {selectedCountry.name.official}</p>
            <p><strong>Capital:</strong> {selectedCountry.capital?.[0]}</p>
            <p><strong>Area:</strong> {selectedCountry.area} km²</p>
            <p><strong>Population:</strong> {selectedCountry.population}</p>
            <p><strong>Capital Location:</strong> {selectedCountry.capitalInfo?.latlng?.join(', ')}</p>
            <p><strong>Capital Lat:</strong> {selectedCountry.capitalInfo?.latlng?.[0]}</p>
            <p><strong>Capital Lng:</strong> {selectedCountry.capitalInfo?.latlng?.[1]}</p>
            
            <h3>Languages:</h3>
            <ul>
              {selectedCountry.languages && Object.values(selectedCountry.languages).map((lang, idx) => (
                <li key={idx}>{lang}</li>
              ))}
            </ul>
            
            {weather && (
              <div style={{ 
                marginTop: '20px', 
                padding: '10px', 
                borderRadius: '5px',
                border: '1px solid #ccc'
              }}>
                <p>
                  <strong>The weather in {selectedCountry.capital?.[0]} is:</strong>
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1px' }}>
                  <img 
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt={weather.weather[0].description}
                    style={{ width: '120px', height: '120px' }}
                  />
                  <div>
                    <p style={{ margin: '5px 0' }}>
                      Temperature: <strong>{weather.main.temp}°C</strong>
                    </p>
                    {/* <p style={{ margin: '5px 0', textTransform: 'capitalize' }}>
                      {weather.weather[0].description}
                    </p> */}
                    <p style={{ margin: '5px 0' }}>
                      Wind: <strong>{weather.wind.speed} m/s</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}
            <button onClick={() => setSelectedCountry(null)} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px' }}>
              back
            </button>
          </div>
        ) : (
          <>
            {filteredCountries.length <= 10 && filteredCountries.length > 1 && (
              <ul>
                {filteredCountries.map(country => (
                  <li key={country.name.common}>
                    {country.name.common}
                    <button onClick={() => handleShowCountry(country.name.common)} style={{ marginLeft: '10px' }}>
                      show
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {filteredCountries.length === 0 && filter && (
              <p>No countries found</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default App