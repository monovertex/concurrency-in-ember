import Component from '@ember/component';
import { readOnly } from '@ember/object/computed';
import { inject } from '@ember/service';

export default Component.extend({
  flashMessages: inject(),

  isSaving: false,
  isSavingAsDraft: false,
  isDraft: readOnly('model.isDraft'),

  async saveModelAsDraft() {
    this.set('isSavingAsDraft', true);
    this.model.set('isDraft', true);

    try {
      await this.model.save();
    } finally {
      this.set('isSavingAsDraft', false);
    }
  },

  actions: {
    async onSave() {
      this.set('isSaving', true);
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
      this.saveModelAsDraft();
    }
  }
});
