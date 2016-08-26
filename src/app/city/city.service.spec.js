describe('CityService', () => {
  let CityService;
  let httpBackend;
  let expectedUrl;
  let expectedParams;
  const expectedResult = {
    temperatura: 25.23,
    temperaturaMaxima: 25.23,
    temperaturaMinima: 25.23,
    pressao: 1028.39,
    descricao: 'céu claro',
    humidade: 47,
  };
  beforeEach(angular.mock.module('testAngular'));

  beforeEach(inject((cityService, $httpBackend, openWeatherApi, apiKey) => {
    CityService = cityService;
    httpBackend = $httpBackend;
    expectedUrl = `${openWeatherApi}/weather`;
    expectedParams = { q: name, appid: apiKey, units: 'metric', lang: 'pt' };
    $httpBackend.when('GET', expectedUrl, expectedParams).respond({
      coord: { lon: -0.13, lat: 51.51 },
      weather: [{ id: 800, main: 'Clear', description: 'céu claro', icon: '01d' }],
      base: 'stations',
      main: {
        temp: 25.23,
        pressure: 1028.39,
        humidity: 47,
        temp_min: 25.23,
        temp_max: 25.23,
        sea_level: 1035.71,
        grnd_level: 1028.39,
      },
      wind: { speed: 1.61, deg: 313.002 },
      clouds: { all: 0 },
      dt: 1468850391,
      sys: {
        message: 0.0412,
        country: 'GB',
        sunrise: 1468814748,
        sunset: 1468872423,
      },
      id: 2643743,
      name: 'London',
      cod: 200,
    }
    );
  }));

  it('should call openWeather api', () => {
    CityService.fetchByName('London').then((result) => {
      expect(result).toEqual(expectedResult);
    });
    httpBackend.expect('GET', expectedUrl, expectedParams);
  });
});
