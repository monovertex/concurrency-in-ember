import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { bind } from '@ember/runloop';
import { inject } from '@ember/service';
import { from, fromEvent, Subject } from 'rxjs';
import { audit, debounceTime, flatMap, share, mapTo, startWith } from 'rxjs/operators';

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
    this.submitFormSubscription.unsubscribe();
    this.saveFinishedSubscription.unsubscribe();
    this.changeSubscription.unsubscribe();
  },

  initializeFormSubscription() {
    const submitStream = fromEvent(
      this.element.querySelector('#form-book'), 'submit', true);
    const submitFormSubscription = submitStream
      .subscribe(bind(this, 'onSaveStarted'));

    const saveFinishedStream = submitStream.pipe(
      audit(() => this.isSavingAsDraft
        ? this.draftSaveFinishedStream : from(true)),
      flatMap((...args) => from(this.onSave(...args)))
    );
    const saveFinishedSubscription = saveFinishedStream
      .subscribe(bind(this, 'onSaveFinished'));

    this.set('submitFormSubscription', submitFormSubscription);
    this.set('saveFinishedSubscription', saveFinishedSubscription);
  },

  initializeChangeSubscription() {
    const changeSubject = new Subject();
    const saveStartStream = changeSubject.pipe(debounceTime(500));

    let saveSignal;
    const saveFinishedStream = saveStartStream.pipe(
      audit(() => saveSignal),
      flatMap((...args) => from(this.onSaveAsDraft(...args))),
      share(),
    );
    saveSignal = saveFinishedStream
      .pipe(mapTo(true), startWith(true));

    const subscription = saveFinishedStream
      .subscribe(bind(this, 'onSaveAsDraftFinished'));
    this.set('draftSaveFinishedStream', saveFinishedStream);
    this.set('changeSubject', changeSubject);
    this.set('changeSubscription', subscription);
  },

  onSaveStarted() {
    this.set('isSaving', true);
  },

  onSave() {
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
