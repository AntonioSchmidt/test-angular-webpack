import 'angular';
import 'angular-mocks/angular-mocks';
import './src/app/index.module.js';

const testsContext = require.context('./src', true, /.spec$/);
testsContext.keys().forEach(testsContext);
