import Component from '@ember/component';
import { bind } from '@ember/runloop';
import { inject } from '@ember/service';
import { from, fromEvent } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export default Component.extend({
  flashMessages: inject(),

  isSaving: false,

  didInsertElement() {
    this._super(...arguments);
    this.initializeFormSubscription();
  },

  willDestroyElement() {
    this.formSubscription.unsubscribe();
  },

  initializeFormSubscription() {
    const submitStream = fromEvent(this.element.querySelector('#form-book'), 'submit', true);
    const saveFinishedStream = submitStream.pipe(flatMap((...args) => from(this.onSave(...args))));
    const subscription = saveFinishedStream.subscribe(bind(this, 'onSaveFinished'));
    this.set('formSubscription', subscription);
  },

  onSave() {
    this.set('isSaving', true);
    return this.model.save();
  },

  onSaveFinished() {
    this.flashMessages.success('Book saved successfully');
    this.set('isSaving', false);
  },
});
