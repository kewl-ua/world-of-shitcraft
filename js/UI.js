// Component lib
const ComponentBuilder = {
    construct(options) {
        let el = this.createElement(options.tag);

        el = this.fillContent(el, options.content);
        el = this.fillId(el, options.id);
        el = this.fillClasses(el, options.classes);
        el = this.fillAttributes(el, options.attributes);
        el = this.bindEvents(el, options.events);
        el = this.mount(el, options.mountTarget);

        return el;
    },
    fillId(el, id) {
        if (id) {
            el.id = id;        
        }

        return el;
    },
    fillClasses(el, classes) {
        if (classes) {
            for (const className of classes) {
                el.classList.add(className);
            }
        }

        return el;
    },
    fillAttributes(el, attributes)  {
        if (attributes) {
            for (const attr in attributes) {
                const kebabCaseAttr = camelCaseSplit(attr).join('-');

                el.setAttribute(kebabCaseAttr, attributes[attr]);
            }
        }

        return el;
    },
    fillContent(el, content) {
        if (!content) {
            return el;
        }

        const ELEMENT_NODE = 1;
        let child;

        // If primitive
        if (['string', 'number', 'boolean'].includes(typeof content)) {
            child = document.createTextNode(content);
        } else if (content.nodeType === ELEMENT_NODE) {
            // If an HTML Element
            child = content;
        } else if (Array.isArray(content)) {
            // If an array of HTML Elements
            child = document.createDocumentFragment();

            for (const c of content) {
                child.append(c);
            }
        }

        el.replaceChildren(child);

        return el;
    },
    createElement(tag) {
        const el = document.createElement(tag);

        return el;
    },
    bindEvents(el, eventsOptions) {
        for (const event in eventsOptions) {
            el['on' + event] = eventsOptions[event];
        }

        return el;
    },
    mount(el, target) {
        if (target) {
            if (target.childNodes.length < 1) {
                target.append(el);
            } else {
                target.replaceChildren(el);
            }
        }

        return el;
    }
};

function C(options) {
    return ComponentBuilder.construct(options);
}

function HeroNameInput() {
    const tree = new C({
        tag: 'fieldset',
        classes: ['create-name'],
        content: [
            new C({
                tag: 'label',
                classes: ['label-name'],
                attributes: {
                    for: 'hero-name'
                },
                content: 'Your name:'
            }),
            new C({
                tag: 'input',
                id: 'hero-name',
                classes: ['input-name'],
                attributes: {
                    name: 'name',
                    type: 'text',
                    required: 'required'
                }
            })
        ]
    });

    return tree;
}

function HeroClassProperty(property, value) {
    const tree = new C({
        tag: 'tr',
        content: [
            new C({
                tag: 'td',
                classes: ['hero-property'],
                content: property
            }),
            new C({
                tag: 'td',
                classes: ['hero-value'],
                content: value
            }),
        ]
    });

    return tree;
}

function HeroClassInfo(className, img) {
    const tree = new C({
        tag: 'table',
        classes: ['hero'],
        content: [
            new C({
                tag: 'thead',
                content: new C({
                    tag: 'tr',
                    classes: ['hero-image-container'],
                    content: new C({
                        tag: 'th',
                        classes: ['hero-image-wrapper'],
                        attributes: {
                            colspan: 2
                        },
                        content: new C({
                            tag: 'img',
                            classes: ['hero-image'],
                            attributes: {
                                src: img,
                                alt: className
                            }
                        })
                    })
                })
            }),
            new C({
                tag: 'tbody',
                content: [
                    new C({
                        tag: 'tr',
                        content: [
                            HeroClassProperty('Class:', className),
                            HeroClassProperty('Health:', 60),
                            HeroClassProperty('Damage:', 15),
                            HeroClassProperty('Morale:', 5)
                        ]
                    })
                ]
            })
        ]
    });

    return tree;
}

function HeroClassInput() {
    const tree = new C({
        tag: 'fieldset',
        classes: ['create-class'],
        content: [
            new C({
                tag: 'div',
                classes: ['heroes'],
                content: [
                    // Barbarian class
                    new C({
                        tag: 'input',
                        id: `barbarian-radio`,
                        classes: ['input-class'],
                        attributes: {
                            name: 'class',
                            value: heroClasses.BARBARIAN,
                            checked: 'checked',
                            type: 'radio'
                        }
                    }),
                    new C({
                        tag: 'label',
                        classes: ['label-class'],
                        attributes: {
                            for: `barbarian-radio`
                        },
                        content: HeroClassInfo('Barbarian', `img/${heroClasses.BARBARIAN}.png`)
                    }),
                    // Paladin class
                    new C({
                        tag: 'input',
                        id: `paladin-radio`,
                        classes: ['input-class'],
                        attributes: {
                            name: 'class',
                            value: heroClasses.PALADIN,
                            type: 'radio'
                        }
                    }),
                    new C({
                        tag: 'label',
                        classes: ['label-class'],
                        attributes: {
                            for: `paladin-radio`
                        },
                        content: HeroClassInfo('Paladin', `img/${heroClasses.PALADIN}.png`)
                    })
                ]
            })
        ]
    });

    return tree;
}

function HeroCreateInput() {
    const tree = new C({
        tag: 'div',
        classes: ['create-controls'],
        content: new C({
            tag: 'input',
            id: 'create-hero',
            classes: ['create-control'],
            attributes: {
                type: 'submit',
                value: 'Create'
            }
        })
    });

    return tree;
}

function CreateHeroForm() {
    const tree = new C({
        tag: 'form',
        classes: ['create-form'],
        id: 'create-form',
        content: [
            HeroNameInput(),
            HeroClassInput(),
            HeroCreateInput()
        ],
        events: {
            submit(e) {
                e.preventDefault();

                const hero = {
                    name: e.currentTarget.elements.name.value,
                    className: e.currentTarget.elements.class.value
                };

                gameContext.dispatch(actions.start(hero));
            }
        }
    });

    return tree;
}

function Prompt(content) {
    const tree = new C({
        tag: 'div',
        classes: ['box'],
        content: C({
            tag: 'div',
            classes: ['prompt'],
            content
        })
    });

    return tree;
}

function PromptContent(content) {
    const tree = C({
        tag: 'div',
        classes: ['prompt-content'],
        content
    });

    return tree;
}

function PropmtText(content) {
    const tree = C({
        tag: 'h2',
        classes: ['prompt-text'],
        content
    });

    return tree;
}

function PromptControls(content, options) {
    const tree = C({
        tag: 'div',
        classes: ['prompt-controls'],
        content,
        ...options
    })

    return tree;
}

function PromptControl(content, options) {
    const tree = C({
        tag: 'button',
        classes: ['prompt-control'],
        content,
        ...options
    });

    return tree;
}

// App components
function StartComponent() {
    const tree = new C({
        tag: 'div',
        classes: ['box'],
        content: C({
            tag: 'div',
            classes: ['create'],
            content: CreateHeroForm()
        })
    });

    return tree;
}

function IdleComponent() {
    const textTree = PropmtText('Do you want to go to the forest or back home?');
    const contentTree = PromptContent(textTree);
    const finishControlTree = PromptControl('Go home', {
        attributes: {
            dataAction: actionTypes.FINISH
        }
    })
    const lookForEnemiesControlTree = PromptControl('To the forest', {
        attributes: {
            dataAction: actionTypes.LOOK_FOR_ENEMIES
        }
    })
    const controlsTree = PromptControls([finishControlTree, lookForEnemiesControlTree], {
        events: {
            click(e) {
                const actionType = e.target.dataset.action;

                switch (actionType) {
                    case actionTypes.FINISH:
                        gameContext.dispatch(actions.finish());
                        break;
                    case actionTypes.LOOK_FOR_ENEMIES:
                        gameContext.dispatch(actions.lookForEnemies());
                        break;
                }
            }
        }
    });
    const tree = Prompt([contentTree, controlsTree]);

    return tree;
}

function DoubtingComponent() {
    const textTree = PropmtText('To be continued...');
    const contentTree = PromptContent(textTree);
    const tree = Prompt(contentTree);

    return tree;
}

function FinishComponent() {
    const textTree = PropmtText('To be continued...');
    const contentTree = PromptContent(textTree);
    const tree = Prompt(contentTree);

    return tree;
}

class GameUI {
    constructor(game, mountTarget) {
        this.game = game;
        this.mountTarget = mountTarget;
        this.domEl = null;
    }

    mount(domEl) {
        this.mountTarget.replaceChildren(domEl);
    }

    react(state) {
        switch (state.step) {
            case stepTypes.START:
                this.domEl = this.createHero();
                break;
            case stepTypes.IDLE:
                this.domEl = this.idle();
                break;
            case stepTypes.DOUBTING:
                this.domEl = this.doubting();
                break;
            case stepTypes.FINISH:
                this.domEl = this.finish();
                break;
        }

        this.mount(this.domEl);
    }

    createHero() {
        return StartComponent();
    }

    idle() {
        return IdleComponent();
    }

    doubting() {
        return DoubtingComponent();
    }

    finish() {
        return FinishComponent();
    }
}
