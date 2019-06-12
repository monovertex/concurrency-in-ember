import Object from '@ember/object';
import Route from '@ember/routing/route';
import { later } from '@ember/runloop';
import { defer } from 'rsvp';

const Model = Object.extend({
  save() {
    const deferred = defer();
    later(() => deferred.resolve(), 1000 + Math.random() * 2000);
    return deferred.promise;
  },
});

export default Route.extend({
  model() {
    const model = Model.create();
    console.log('Model:', model);
    return model;
  }
});
