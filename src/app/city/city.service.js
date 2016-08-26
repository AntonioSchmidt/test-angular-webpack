export default class CityService {
  constructor($http, openWeatherApi, apiKey) {
    'ngInject';
    this.privates = { http: $http, fetchCity: `${openWeatherApi}/weather`, apiId: apiKey };
  }

  fetchByName(name) {
    return this.privates.http({
      method: 'GET',
      url: this.privates.fetchCity,
      params: { q: name, appid: this.privates.apiId, units: 'metric', lang: 'pt' } })
    .then((result) => {
      const weather = result.data;
      return {
        temperaturaMinima: weather.main.temp_min,
        temperaturaMaxima: weather.main.temp_max,
        temperatura: weather.main.temp,
        pressao: weather.main.pressure,
        descricao: weather.weather[0].description,
        humidade: weather.main.humidity,
      };
    });
  }
}
