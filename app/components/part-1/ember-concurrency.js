import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { inject } from '@ember/service';
import { task } from 'ember-concurrency';

export default Component.extend({
  flashMessages: inject(),

  saveTask: task(function * () {
    yield this.model.save();
    this.flashMessages.success('Book saved successfully');
  }).drop(),

  isSaving: readOnly('saveTask.isRunning'),

  actions: {
    onSave() { return this.saveTask.perform(); }
  }
});
