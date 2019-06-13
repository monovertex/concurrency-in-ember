# Concurrency in Ember: promises, coroutines & observables

## Form Requirements

1. Base
  * Pressing the save button should save the model as final.
  * While saving the save button and the form have to be disabled.
  * After the final save is done, display a success message and re-enable everything.
2. Draft Saving
  * Save model as draft in real-time when properties are updated.
  * A notice should be displayed while the model is draft.
  * A loader should be displayed while saving the model as draft.
3. Refining
  * Change triggers should be debounced by 500ms.
  * That if a new draft save comes in while the previous save request is pending, we don't cancel, but wait instead.
  * Saving the model as final should wait for a currently ongoing draft save to finish first.
4. Extra
  * Testing
  * Log the activity in a service.

## Implementations

* promises (async/await)
* coroutines (ember-concurrency tasks)
* observables (RxJS/reactive programming)

## [Development](docs/DEVELOPMENT.md)

## [Slide Show Presentation](docs/PRESENTATION.md)

