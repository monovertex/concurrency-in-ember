import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { debounce } from '@ember/runloop';
import { inject } from '@ember/service';

export default Component.extend({
  flashMessages: inject(),

  isSaving: false,
  isSavingAsDraft: false,
  isDraft: readOnly('model.isDraft'),

  async saveModelAsDraft() {
    this.set('isSavingAsDraft', true);
    this.model.set('isDraft', true);

    const saveAsDraftPromise = this.model.save();
    this.set('saveAsDraftPromise', saveAsDraftPromise);

    try {
      await saveAsDraftPromise;
    } finally {
      this.set('saveAsDraftPromise', null);
      this.set('isSavingAsDraft', false);
    }
  },

  async saveModelAsDraftDebounced() {
    await this.waitForDraftSave();
    debounce(this, 'saveModelAsDraft', ...arguments, 500);
  },

  waitForDraftSave() {
    if (this.saveAsDraftPromise) { return this.saveAsDraftPromise.catch(() => {}); }
  },

  actions: {
    async onSave() {
      this.set('isSaving', true);
      await this.waitForDraftSave();

      try {
        await this.model.save();
        this.model.set('isDraft', false);
        this.flashMessages.success('Book saved successfully');
      } finally {
        this.set('isSaving', false);
      }
    },

    onChange(key, value) {
      this.model.set(key, value);
      this.saveModelAsDraftDebounced();
    }
  }
});
