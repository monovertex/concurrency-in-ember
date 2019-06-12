# concurrency-in-ember

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
  * That if a new save comes in while the previous save request is pending, we don't cancel, but wait instead.
  * Saving the model as final should wait for a currently ongoing draft save to finish first.
4. Extra
  * Testing
  * Log the activity in a service.

## Implementations

* async/await
* ember-concurrency tasks
* observables

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd concurrency-in-ember`
* `npm install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)
