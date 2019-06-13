import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { bind } from '@ember/runloop';
import { inject } from '@ember/service';
import { from, fromEvent, Subject } from 'rxjs';
import { flatMap } from 'rxjs/operators';

export default Component.extend({
  flashMessages: inject(),

  isSaving: false,
  isSavingAsDraft: false,
  isDraft: readOnly('model.isDraft'),

  didInsertElement() {
    this._super(...arguments);
    this.initializeFormSubscription();
    this.initializeChangeSubscription();
  },

  willDestroyElement() {
    this._super(...arguments);
    this.formSubscription.unsubscribe();
    this.changeSubscription.unsubscribe();
  },

  initializeFormSubscription() {
    const submitStream = fromEvent(
      this.element.querySelector('#form-book'), 'submit', true);
    const saveFinishedStream = submitStream
      .pipe(flatMap((...args) => from(this.onSave(...args))));
    const subscription = saveFinishedStream
      .subscribe(bind(this, 'onSaveFinished'));
    this.set('formSubscription', subscription);
  },

  initializeChangeSubscription() {
    const changeSubject = new Subject();
    const saveFinishedStream = changeSubject
      .pipe(flatMap((...args) => from(this.onSaveAsDraft(...args))));
    const subscription = saveFinishedStream
      .subscribe(bind(this, 'onSaveAsDraftFinished'));
    this.set('changeSubject', changeSubject);
    this.set('changeSubscription', subscription);
  },

  onSave() {
    this.set('isSaving', true);
    this.model.set('isDraft', false);
    return this.model.save();
  },

  onSaveFinished() {
    this.flashMessages.success('Book saved successfully');
    this.set('isSaving', false);
  },

  onSaveAsDraft() {
    this.set('isSavingAsDraft', true);
    this.model.set('isDraft', true);
    return this.model.save();
  },

  onSaveAsDraftFinished() {
    this.set('isSavingAsDraft', false);
  },

  saveModelAsDraft() {
    this.changeSubject.next(...arguments);
  },

  actions: {
    onChange(key, value) {
      this.model.set(key, value);
      this.saveModelAsDraft(value);
    }
  }
});
