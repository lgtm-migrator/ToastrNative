/**
 * Used to specify default CSS classes per notification type
 */
interface ToastrIconClasses {
    /**
     * CSS Class to use for the error notification type
     * @default 'toastr-error'
     */
    error: string;
    /**
     * CSS Class to use for the info notification type
     * @default 'toastr-info'
     */
    info: string;
    /**
     * CSS Class to use for the success notification type
     * @default 'toastr-success'
     */
    success: string;
    /**
     * CSS Class to use for the warning notification type
     * @default 'toastr-warning'
     */
    warning: string;
}

/**
 * Options for clearing notifications
 */
interface ToastrClearOptions {
    /**
     * Set to true to always delete the notification, even when the element has focus
     */
    force: boolean;
}

/**
 * Settings for the show and hide animations
 */
interface FadeOptions {
    /**
     * Called when the animation ends
     */
    onComplete: () => void;
    /**
     * Duration (in miliseconds) of the animation
     */
    duration: number;
    /**
     * The css class to use for the animation
     */
    style: string;
}

/**
 * Settings for the notifications
 */
interface ToastrSettings {
    /**
     * If set to true, a 'close' button will be shown
     * @default false
     */
    closeButton: boolean;
    /**
     * The class to add to the close button
     * @default 'toast-close-button'
     */
    closeClass: string;
    /**
     * The amount of time (in miliseconds) the animation should take when the user clicks the close button
     * @default 0
     */
    closeDuration: number;
    /**
     * HTML used to create the close button
     *  @default '<button type="button">&times;</button>'
     */
    closeHtml: string;
    /**
     * Whether the notification should be closed when the user hovers the notification
     * @default true
     */
    closeOnHover: boolean;
    /**
     * DOM id of the container
     * @default 'toast-container'
     */
    containerId: string;
    /**
     * Whether or not HTML characters in the title and message should be escaped
     * @default false
     */
    escapeHtml: boolean;
    /**
     * The amount of time (in miliseconds) the toast should be displayed after a user hovers it
     * @default 1000
     */
    extendedTimeOut: number;
    /**
     * The amount of time the hide animation should take
     * @default 1000
     */
    hideDuration: number;
    /**
     * The name of the animate.css animation used for hiding the toast
     * @default 'fadeOut'
     */
    hideMethod: string;
    /**
     * The default icon class
     * @default 'toast-info'
     */
    iconClass: string;
    /**
     * Can be used to specify the default icon per notification type
     */
    iconClasses: ToastrIconClasses;
    /**
     * The class added to the message element of the notification
     * @default 'toast-message'
     */
    messageClass: string;
    /**
     * If set to false, new notifications will be added at the bottom
     * @default true
     */
    newestOnTop: boolean;
    /**
     * Called when the user clicks the notification
     * @default noop
     */
    onClick: () => void;
    /**
     * Called when a user clicks the close button
     * @default noop
     */
    onCloseClick: (event: Event) => void;
    /**
     * Called after the notification is hidden
     * @default noop
     */
    onHidden: () => void;
    /**
     * Called after the notification is shown
     * @default noop
     */
    onShown: () => void;
    /**
     * Class used to set the position of the notification
     * @default 'toast-top-right'
     */
    positionClass: string;
    /**
     * Prevents the notifications from being shown when the message matches the previous message
     * @default false
     */
    preventDuplicates: boolean;
    /**
     * Whether or not a progressbar should be shown
     * @default false
     */
    progressBar: boolean;
    /**
     * Css class to set on the progressbar element
     * @default 'toast-progress'
     */
    progressClass: string;
    /**
     *  Set to true for right-to-left languages
     *  @default false
     */
    rtl: boolean;
    /**
     * The amount of time the hide animation should take
     * @default 300
     */
    showDuration: number;
    /**
     * The name of the animate.css animation used for showing the toast
     * @default 'fadeIn'
     */
    showMethod: string;
    /**
     * The element the toastr container should be added to
     * @default: 'body'
     */
    target: string;
    /**
     * The amount of time (in miliseconds) the notification should be shown
     * @default 5000
     */
    timeOut: number;
    /**
     * The CSS class to add to the title element
     * @default 'toast-title'
     */
    titleClass: string;
    /**
     * The CSS class to add to the notification element
     * @default 'toast-title'
     */
    toastClass: string;
    /**
     * Set to true to hide the notification when a user click on it
     * @default true
     */
    tapToDismiss: boolean;
}

/**
 * Used to set overriden options for the notifications
 */
interface ToastrOptions extends Partial<ToastrSettings> {}

/**
 * Used as argument for toastr show and hide events
 */
interface ToastrEvent {
    /** The time the notification is hidden */
    endTime: Date;
    /** The ID of the notification */
    toastId: number;
    /** The state of the toastr, visible or hidden */
    state: 'visible' | 'hidden';
    /** The time the toastr is created */
    startTime: Date;
    /** The settings for the notification */
    options: ToastrSettings & { [key: string]: any };
    /** The overriden options for the notification */
    map: any;
}

/**
 * Returns true when the given value is null or undefined
 * @param value The value to check if it's null or undefined
 */
function isNotNullOrUndefined<T>(value: T | null | undefined): value is T {
    return value != null && value !== undefined;
}

/**
 * Returns whether the given argument is a function or not
 * @param functionToCheck The value to check if it's a function
 */
function isFunction(functionToCheck: unknown): functionToCheck is () => any {
    return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

/**
 * An empty function
 */
function noop() {}

const enum ToastType {
    error = 'error',
    info = 'info',
    success = 'success',
    warning = 'warning',
}

/**
 * Toastr notification library
 */
export class Toastr {
    /** Default settings for the notifications */
    public static options: ToastrOptions = {};

    /** Reference to the container DOM element */
    private static containerEl: HTMLElement;

    /** The message of the last toast */
    private static previousToast: string | undefined;

    /** Can be used to listen to events */
    private static listener: (eventArgs: ToastrEvent) => void;

    /** The toast id (will increment for every new toast) */
    private static toastId = 0;

    /**
     * Get default settings from toastrjs
     */
    public static getDefaults(): ToastrSettings {
        return {
            closeButton: false,
            closeClass: 'toast-close-button',
            closeDuration: 0,
            closeHtml: '<button type="button">&times;</button>',
            closeOnHover: true,
            containerId: 'toast-container',
            escapeHtml: false,
            extendedTimeOut: 1000,
            hideDuration: 1000,
            hideMethod: 'fadeOut',
            iconClass: 'toast-info',
            iconClasses: {
                error: 'toast-error',
                info: 'toast-info',
                success: 'toast-success',
                warning: 'toast-warning',
            },
            messageClass: 'toast-message',
            newestOnTop: true,
            onClick: noop,
            onCloseClick: (event: Event) => {},
            onHidden: noop,
            onShown: noop,
            positionClass: 'toast-top-right',
            preventDuplicates: false,
            progressBar: false,
            progressClass: 'toast-progress',
            rtl: false,
            showDuration: 300,
            showMethod: 'fadeIn',
            tapToDismiss: true,
            target: 'body',
            timeOut: 5000,
            titleClass: 'toast-title',
            toastClass: 'toast',
        };
    }

    /**
     * Clear toastr container
     */
    private static clearContainer(options: ToastrSettings) {
        if (!isNotNullOrUndefined(Toastr.containerEl)) return;

        Array.from(Toastr.containerEl.children).forEach(el => Toastr.clearToast(el as HTMLElement, options));
    }

    /**
     * Remove a toast element
     */
    private static removeToast(toastElement: HTMLElement) {
        if (!Toastr.containerEl) {
            Toastr.containerEl = Toastr.getContainer();
        }

        Toastr.removeElement(toastElement);

        if (Toastr.containerEl?.children.length === 0) {
            Toastr.removeElement(Toastr.containerEl);
            Toastr.previousToast = undefined;
        }
    }

    /**
     * Clear toastr element
     */
    private static clearToast(toastElement: HTMLElement | undefined, options: ToastrSettings, clearOptions?: ToastrClearOptions) {
        const force = clearOptions?.force === true;
        if (toastElement && (force || toastElement !== toastElement.ownerDocument?.activeElement)) {
            Toastr.animate(toastElement, {
                duration: options.hideDuration,
                style: options.hideMethod,
                onComplete: () => {
                    Toastr.removeToast(toastElement);
                },
            });
            return true;
        }
        return false;
    }

    /**
     * Creates the container that contains all toasters
     */
    private static createContainer(options: ToastrSettings) {
        Toastr.containerEl = document.createElement('div');
        Toastr.containerEl.setAttribute('id', options.containerId);
        Toastr.containerEl.classList.add(options.positionClass);
        const targetEl: HTMLElement | null = document.querySelector(options.target);

        if (targetEl != null) {
            targetEl.appendChild(Toastr.containerEl);
        } else {
            console.warn(`Couldn't create toastr container, the 'containerEl' cannot be found.`);
        }
    }

    /**
     * Native remove element helper
     */
    private static removeElement(el: HTMLElement) {
        el?.parentNode?.removeChild(el);
    }

    /**
     * Removes the notification element from the dom.
     * Clears the whole container if the notification couldn't be removed
     * @param toastElement The notification element to remove
     * @param clearOptions Clear options
     */
    public static clear(toastElement?: HTMLElement, clearOptions?: ToastrClearOptions) {
        const options = Toastr.getOptions();
        if (!Toastr.containerEl) {
            Toastr.getContainer(options, false);
        }
        if (!Toastr.clearToast(toastElement, options, clearOptions)) {
            Toastr.clearContainer(options);
        }
    }

    /**
     * Register a callback function
     */
    public static subscribe(callback: (eventArgs: ToastrEvent) => void) {
        Toastr.listener = callback;
    }

    /**
     * Show info message
     */
    public static info(message?: string, title?: string, optionsOverride?: ToastrOptions & { [key: string]: any }) {
        return Toastr.notify({
            type: ToastType.info,
            iconClass: (Toastr.getOptions().iconClasses as ToastrIconClasses).info,
            message,
            optionsOverride,
            title,
        });
    }

    /**
     * Show success message
     */
    public static success(message?: string, title?: string, optionsOverride?: ToastrOptions & { [key: string]: any }) {
        return Toastr.notify({
            type: ToastType.success,
            iconClass: (Toastr.getOptions().iconClasses as ToastrIconClasses).success,
            message,
            optionsOverride,
            title,
        });
    }

    /**
     * Show warning message
     */
    public static warning(message?: string, title?: string, optionsOverride?: ToastrOptions & { [key: string]: any }) {
        return Toastr.notify({
            type: ToastType.warning,
            iconClass: (Toastr.getOptions().iconClasses as ToastrIconClasses).warning,
            message,
            optionsOverride,
            title,
        });
    }

    /**
     * Shows an error message
     */
    public static error(message?: string, title?: string, optionsOverride?: ToastrOptions & { [key: string]: any }) {
        return Toastr.notify({
            type: ToastType.error,
            iconClass: (Toastr.getOptions().iconClasses as ToastrIconClasses).error,
            message,
            optionsOverride,
            title,
        });
    }

    /**
     * Get container that contains the toastr
     */
    public static getContainer(options?: ToastrSettings, create?: boolean) {
        const settings = options ?? (Toastr.getOptions() as ToastrSettings);

        if (settings.containerId != null) {
            Toastr.containerEl = document.getElementById(settings.containerId) as HTMLElement;
        }
        if (Toastr.containerEl == null && create === true) {
            Toastr.createContainer(settings);
        }
        return Toastr.containerEl;
    }

    /**
     * Creates a DOM element from a HTML string
     * @param htmlString The HTML string to create the DOM element(s) from
     */
    private static createElementFromHTML(htmlString: string): HTMLElement {
        const div = document.createElement('div');
        div.innerHTML = htmlString.trim();
        return div.firstChild as HTMLElement;
    }

    /**
     * Used to add animation to show and hide the notification
     * @param toastElement The element to animate
     * @param options The animation options
     */
    private static animate(toastElement: HTMLElement, options: FadeOptions) {
        toastElement.classList.add('animate__animated', `animate__${options.style}`);

        const onAnimationEnd = (ev: { type: string }) => {
            if (isFunction(options.onComplete)) {
                options.onComplete();
            }

            toastElement.removeEventListener(ev.type, onAnimationEnd);
        };

        if (!isNaN(options.duration) || 0) {
            if (options.duration === 0) {
                onAnimationEnd({ type: 'animationend' });
            } else {
                toastElement.style.setProperty('--animate-duration', options.duration / 1000 + 's');
            }
        }

        toastElement.addEventListener('animationend', onAnimationEnd);
    }

    /**
     * Fires events
     */
    private static publish(args: ToastrEvent) {
        if (Toastr.listener) {
            Toastr.listener(args);
        }
    }

    /**
     * Creates the notification
     * @param map The overriden options
     */
    private static notify(map: any) {
        const shouldExit = (_settings: ToastrSettings, _map: any) => {
            const result = _settings.preventDuplicates === true && _map.message === Toastr.previousToast;
            Toastr.previousToast = _map.message;
            return result;
        };

        let options = Toastr.getOptions();
        let iconClass = map.iconClass || options.iconClass;

        if (isNotNullOrUndefined(map.optionsOverride)) {
            options = {
                ...options,
                ...map.optionsOverride,
            };
            iconClass = map.optionsOverride.iconClass || iconClass;
        }

        if (shouldExit(options, map)) {
            return;
        }

        Toastr.toastId++;
        Toastr.containerEl = Toastr.getContainer(options, true);

        let intervalId: number | undefined;
        const toastElement = document.createElement('div');
        const $titleElement = document.createElement('div');
        const $messageElement = document.createElement('div');
        const progressElement = document.createElement('div');
        const closeElement: HTMLElement = Toastr.createElementFromHTML(options.closeHtml);

        const response: ToastrEvent = {
            toastId: Toastr.toastId,
            state: 'visible',
            startTime: new Date(),
            endTime: new Date(),
            options,
            map,
        };

        const hideToast = (override: boolean) => {
            const hideDuration = override && options.closeDuration !== 0 ? options.closeDuration : options.hideDuration;
            if (toastElement === toastElement.ownerDocument?.activeElement && !override) {
                return;
            }

            Toastr.animate(toastElement, {
                duration: hideDuration,
                style: options.hideMethod,
                onComplete: () => {
                    Toastr.removeToast(toastElement);
                    clearTimeout(intervalId);
                    if (isFunction(options.onHidden) && response.state !== 'hidden') {
                        options.onHidden();
                    }
                    response.state = 'hidden';
                    response.endTime = new Date();
                    Toastr.publish(response);
                },
            });
        };

        /**
         * Display toast message
         */
        const displayToast = () => {
            Toastr.animate(toastElement, {
                duration: options.showDuration,
                onComplete: options.onShown,
                style: options.showMethod,
            });

            if (options.timeOut) {
                intervalId = setTimeout(hideToast, options.timeOut);
            }
        };

        const handleEvents = () => {
            if (options.closeOnHover) {
                toastElement.addEventListener('mouseover', stickAround);
                toastElement.addEventListener('mouseout', delayedHideToast);
            }

            if (!options.onClick && options.tapToDismiss) {
                toastElement.addEventListener('click', () => {
                    hideToast(false);
                });
            }

            if (options.closeButton && closeElement) {
                toastElement.addEventListener('click', event => {
                    if (event.stopPropagation) {
                        event.stopPropagation();
                    } else if (event.cancelBubble === false) {
                        event.cancelBubble = true;
                    }

                    if (options.onCloseClick) {
                        options.onCloseClick(event);
                    }

                    hideToast(true);
                });
            }

            if (isFunction(options.onClick)) {
                toastElement.addEventListener('click', event => {
                    options.onCloseClick(event);
                    hideToast(false);
                });
            }
        };

        const escapeHtml = (source: string) => {
            return (source ?? '').replace(/&/g, '&amp;').replace(/'/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        };

        const setAria = () => {
            const ariaValue = ['toast-success', 'toast-info'].includes(map.iconClass) ? 'polite' : 'assertive';
            toastElement.setAttribute('aria-live', ariaValue);
        };

        /**
         * Set icons on toast
         */
        const setIcon = () => {
            if (map.iconClass) {
                toastElement.classList.add(options.toastClass, iconClass);
            }
        };

        /**
         * Add toaster to container
         */
        const setSequence = () => {
            Toastr.containerEl.insertBefore(toastElement, options.newestOnTop ? Toastr.containerEl.firstChild : null);
        };

        /**
         * Set title of a toast message
         */
        const setTitle = () => {
            if (map.title) {
                let suffix = map.title;
                if (options.escapeHtml) {
                    suffix = escapeHtml(map.title);
                }
                $titleElement.innerHTML += suffix;
                $titleElement.classList.add(options.titleClass);
                toastElement.appendChild($titleElement);
            }
        };

        /**
         * Set message of a toast message
         */
        const setMessage = () => {
            if (map.message) {
                let suffix = map.message;
                if (options.escapeHtml) {
                    suffix = escapeHtml(map.message);
                }
                $messageElement.innerHTML += suffix;
                $messageElement.classList.add(options.messageClass);
                toastElement.appendChild($messageElement);
            }
        };

        /**
         * Set closebutton
         */
        const setCloseButton = () => {
            if (options.closeButton) {
                closeElement.classList.add(options.closeClass);
                closeElement.setAttribute('role', 'button');
                toastElement.insertBefore(closeElement, toastElement.firstChild);
            }
        };

        /**
         * Set progressbar
         */
        const setProgressBar = () => {
            if (options.progressBar) {
                progressElement.classList.add(options.progressClass);
                progressElement.style.setProperty('--animate-duration', options.timeOut / 1000 + 's');
                toastElement.insertBefore(progressElement, toastElement.firstChild);
            }
        };

        /**
         * Set RTL
         */
        const setRTL = () => {
            if (options.rtl) {
                toastElement.classList.add('rtl');
            }
        };

        const delayedHideToast = () => {
            if (options.closeOnHover) {
                Toastr.removeToast(toastElement);
            } else if (options.timeOut > 0 || options.extendedTimeOut > 0) {
                progressElement.classList.remove(options.progressClass);
                progressElement.style.setProperty('--animate-duration', options.extendedTimeOut / 1000 + 's');
                progressElement.style.width = '100%';
                // trigger reflow
                // tslint:disable-next-line
                void progressElement.offsetWidth;
                progressElement.classList.add(options.progressClass);
            }
        };

        const stickAround = () => {
            clearTimeout(intervalId);
        };

        setIcon();
        setTitle();
        setMessage();
        setCloseButton();
        setProgressBar();
        setRTL();
        setSequence();
        setAria();

        displayToast();
        handleEvents();

        Toastr.publish(response);

        return toastElement;
    }

    /**
     * Get toaster options
     */
    private static getOptions(): ToastrSettings {
        return {
            ...Toastr.getDefaults(),
            ...Toastr.options,
        };
    }
}
