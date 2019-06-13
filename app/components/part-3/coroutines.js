import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { inject } from '@ember/service';
import { task, timeout } from 'ember-concurrency';
import { resolve } from 'rsvp';

export default Component.extend({
  flashMessages: inject(),

  saveTask: task(function * () {
    try {
      yield resolve(this.draftSaveDebounceTask.last);
      yield resolve(this.draftSaveTask.last);
    } catch (e) {
      // Do nothing.
    }

    this.model.set('isDraft', false);
    yield this.model.save();
    this.flashMessages.success('Book saved successfully');
  }).drop(),

  draftSaveDebounceTask: task(function * () {
    yield resolve(this.draftSaveTask.last);
    yield timeout(500);
    return yield resolve(
      this.draftSaveTask.perform(...arguments));
  }).restartable(),

  draftSaveTask: task(function * () {
    this.model.set('isDraft', true);
    return yield this.model.save();
  }).keepLatest(),

  isSaving: readOnly('saveTask.isRunning'),
  isSavingAsDraft: readOnly('draftSaveTask.isRunning'),
  isDraft: readOnly('model.isDraft'),

  actions: {
    onSave() { return this.saveTask.perform(); },

    onChange(key, value) {
      this.model.set(key, value);
      return this.draftSaveDebounceTask.perform();
    },
  }
});
