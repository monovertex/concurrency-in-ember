import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { inject } from '@ember/service';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  flashMessages: inject(),

  saveTask: task(function * () {
    try {
      yield this.draftSaveTask.last;
    } catch (e) {
      // Do nothing.
    }

    this.model.set('isDraft', false);
    yield this.model.save();
    this.flashMessages.success('Book saved successfully');
  }).drop(),

  draftSaveTask: task(function * () {
    yield timeout(500);
    this.model.set('isDraft', true);
    return yield this.model.save();
  }).restartable(),

  isSaving: readOnly('saveTask.isRunning'),
  isSavingAsDraft: readOnly('draftSaveTask.isRunning'),
  isDraft: readOnly('model.isDraft'),

  actions: {
    onSave() { return this.saveTask.perform(); },

    onChange(key, value) {
      this.model.set(key, value);
      return this.draftSaveTask.perform();
    },
  }
});
