import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  flashMessages: inject(),

  saveTask: task(function * () {
    yield this.model.save();
    this.model.set('isDraft', false);
    this.flashMessages.success('Book saved successfully');
  }).drop(),

  draftSaveTask: task(function * () {
    this.model.set('isDraft', true);
    return yield this.model.save();
  }),

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
