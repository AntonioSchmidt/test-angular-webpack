/* global AP_ANGULAR_DEFAULT_DEBOUNCE AP_ANGULAR_DEFAULT_BLUR */

export default function config($logProvider, $translateProvider, $provide) {
  'ngInject';
  $logProvider.debugEnabled(true);
  $translateProvider.useSanitizeValueStrategy('sanitize');
  $translateProvider.translations('en', {
    DESCRIPTION: 'Description',
    HUMIDITY: 'Humidity',
    PRESSURE: 'Pressure',
    TEMPERATURE: 'Temperature',
    TEMPERATURE_MIN: 'Minimum Temp.',
    TEMPERATURE_MAX: 'Maximum Temp.',
    GET_FORECAST: 'Get forecast',
    CITY: 'City',
    CITIES_BY_NAME: 'Find cities by name',
  });

  $translateProvider.translations('pt_BR', {
    DESCRIPTION: 'Descri\\U00E7\\U00E3o',
    HUMIDITY: 'Humidade',
    PRESSURE: 'Press\\U00E3o',
    TEMPERATURE: 'Temperatura',
    TEMPERATURE_MIN: 'Temp. m\\U00E1xima',
    TEMPERATURE_MAX: 'Temp. m\\U00EDnima',
    GET_FORECAST: 'Ver previs\\U00E3o',
    CITY: 'Cidade',
    CITIES_BY_NAME: 'Busque cidades pelo nome',
  });

  $translateProvider.preferredLanguage('en');


  $provide.decorator('ngModelDirective', ($delegate) => {
    'ngInject';
    const directive = $delegate[0];
    const originalCompile = directive.compile;

    directive.compile = (...args) => {
      const link = originalCompile.apply(this, args);
      return {
        pre: function ngModelPostLink(scope, element, attr, ctrls) {
          const modelCtrls = ctrls;
          let ngModelOptions = modelCtrls[2];
          if (!ngModelOptions) {
            ngModelOptions = {};
            modelCtrls[2] = ngModelOptions;
          }

          if (ngModelOptions.$options === undefined) {
            ngModelOptions.$options = {};
          }
          const $options = ngModelOptions.$options;
          if ($options.debounce === undefined) {
            $options.debounce = {
              default: AP_ANGULAR_DEFAULT_DEBOUNCE,
              blur: AP_ANGULAR_DEFAULT_BLUR,
            };
            $options.updateOnDefault = $options.updateOnDefault || true;
          }
          link.pre.apply(this, [scope, element, attr, modelCtrls]);
        },
      };
    };
    return $delegate;
  });
}
