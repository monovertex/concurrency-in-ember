import Component from '@ember/component';
import { inject } from '@ember/service';

export default Component.extend({
  flashMessages: inject(),

  isSaving: false,

  actions: {
    async onSave() {
      this.set('isSaving', true);
      try {
        await this.model.save();
        this.flashMessages.success('Book saved successfully');
      } finally {
        this.set('isSaving', false);
      }
    }
  }
});
