import { PREFIX } from './constants';

export default class Feature {
    constructor(init, lrnUtils) {
        this.init = init;
        this.events = init.events;
        this.lrnUtils = lrnUtils;
        this.el = init.$el.get(0);

        this.render().then(() => {
            this.registerPublicMethods();

            if (init.state === 'review') {

                /**
                 * below, we call the disable public method on the custom feature to display it in a read-only mode
                 * to learners and/or instructors viewing their completed assessment results (via Reports API or Items API in "review" mode).
                 * (Please see this.registerPublicMethods below for more detials about the .disable() method, including an example implementation)
                 */
                init.getFacade().disable();
            }

            init.events.trigger('ready');
        });
    }

    render() {
        const { el, init } = this;
        const { feature } = init;

        el.innerHTML = `<div class="lrn_feature_wrapper ${PREFIX}"></div>`;

        return Promise.all([]).then(() => {
            const $wrapper = init.$el.find('.lrn_feature_wrapper');
            const htmlBlock = `
                <section class="lrn-custom-strategy-popup">
                    <section class="lrn-custom-strategy-header">
                        <button class="lrn-custom-strategy-toggle-button">
                            <img class="lrn-custom-strategy-avatar" alt="Bob" src="${feature.teacher_avatar_url}" />
                        </button>
                        
                        <span class="lrn-custom-strategy-title">${feature.title}</span>
                    </section>             
                    
                    <section class="lrn-custom-strategy-content">${feature.description}</section>                
                </section>
            `;

            $wrapper.append(htmlBlock);

            const $toggleButton = $wrapper.find('.lrn-custom-strategy-toggle-button');
            const $popup = $wrapper.find('.lrn-custom-strategy-popup');

            $toggleButton.on('click', () => {
                $popup.toggleClass('open');
            });
        });
    }

    /**
     * Add public methods to the created feature instance that is accessible during runtime
     *
     * Example: questionsApp.feature('my-custom-feature-feature-id').myNewMethod();
     *
     */
    registerPublicMethods() {
        const { init } = this;
        // Attach the methods you want on this object
        const facade = init.getFacade();


        facade.disable = () => {
            // Example using jQuery to disable elements within your feature
            init.$el.find('.lrn-custom-strategy-toggle-button').prop('disabled', true);
            // Potentially hide the popup or make its content non-interactive
            // init.$el.find('.lrn-custom-strategy-popup').addClass('disabled-review-mode');
        };
        facade.enable = () => {
            // Example using jQuery to enable elements within your feature
            init.$el.find('.lrn-custom-strategy-toggle-button').prop('disabled', false);
            // Potentially re-enable the popup content
            // init.$el.find('.lrn-custom-strategy-popup').removeClass('disabled-review-mode');
        };
    }
}
