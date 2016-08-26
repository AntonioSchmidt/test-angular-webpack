describe('CityController', () => {
  let cityContoller;
  const expectedWeatherData = {
    temperaturaMinima: 20,
    temperaturaMaxima: 30,
    temperatura: 25,
    pressao: 1000,
    descricao: 'limpo',
  };
  let cityServiceStub;
  let state;
  beforeEach(() => {
    angular.mock.module('testAngular');
  });

  beforeEach(inject(($controller, cityService, $log, $state) => {
    spyOn(cityService, 'fetchByName').and.returnValue({
      then: (callback) => { callback(expectedWeatherData); },
    });
    spyOn($state, 'transitionTo');
    cityServiceStub = cityService;
    state = $state;
    cityContoller = $controller('CityController');
  }));

  describe('when city is specified as parameter', () => {
    beforeEach(inject(($controller) => {
      state.params.cityName = 'Florianopolis';
      cityContoller = $controller('CityController');
    }));

    it('should find the weather for the specified city', () => {
      expect(cityContoller.cityName).toEqual('Florianopolis');
      expect(cityContoller.previsao).toEqual(expectedWeatherData);
    });
  });

  describe('find', () => {
    it('should assign values from cityService', () => {
      cityContoller.cityName = 'Florianopolis';
      cityContoller.find();
      expect(cityServiceStub.fetchByName).toHaveBeenCalledWith('Florianopolis');
      expect(cityContoller.previsao).toEqual(expectedWeatherData);
    });

    it(' should put the city name as parameter', () => {
      cityContoller.cityName = 'Florianopolis';
      cityContoller.find();
      expect(state.transitionTo).toHaveBeenCalledWith('city', {
        cityName: 'Florianopolis',
      }, { notify: false });
    });
  });
});
