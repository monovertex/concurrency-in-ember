import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('part-1', function() {
    this.route('promises');
    this.route('coroutines');
    this.route('observables');
  });

  this.route('part-2', function() {
    this.route('promises');
    this.route('coroutines');
    this.route('observables');
  });

  this.route('part-3', function() {
    this.route('promises');
    this.route('coroutines');
    this.route('observables');
  });
});

export default Router;
