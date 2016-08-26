export default class CityController {
  constructor(cityService, $log, $state) {
    'ngInject';
    this.$log = $log;
    this.cityService = cityService;
    this.$state = $state;
    if ($state.params.cityName) {
      this.cityName = $state.params.cityName;
      this.find();
    } else {
      this.cityName = '';
    }
  }
/**
TODO seria melhor colocar um autocomplete onde pesquisava a cidade pelo id dela.....
**/
  find() {
    const cityName = this.cityName;
    const $state = this.$state;
    this.cityService.fetchByName(cityName).then((result) => {
      $state.transitionTo('city', { cityName }, { notify: false });
      this.previsao = result;
    });
  }
}
