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
    const tree = C({
        tag: 'fieldset',
        classes: ['create-name'],
        content: [
            C({
                tag: 'label',
                classes: ['label-name'],
                attributes: {
                    for: 'hero-name'
                },
                content: 'Your name:'
            }),
            C({
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
    const tree = C({
        tag: 'tr',
        content: [
            C({
                tag: 'td',
                classes: ['hero-property'],
                content: property
            }),
            C({
                tag: 'td',
                classes: ['hero-value'],
                content: value
            }),
        ]
    });

    return tree;
}

function HeroClassInfo(className, img) {
    const tree = C({
        tag: 'table',
        classes: ['hero'],
        content: [
            C({
                tag: 'thead',
                content: C({
                    tag: 'tr',
                    classes: ['hero-image-container'],
                    content: C({
                        tag: 'th',
                        classes: ['hero-image-wrapper'],
                        attributes: {
                            colspan: 2
                        },
                        content: C({
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
            C({
                tag: 'tbody',
                content: [
                    C({
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
    const tree = C({
        tag: 'fieldset',
        classes: ['create-class'],
        content: [
            C({
                tag: 'div',
                classes: ['heroes'],
                content: [
                    // Barbarian class
                    C({
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
                    C({
                        tag: 'label',
                        classes: ['label-class'],
                        attributes: {
                            for: `barbarian-radio`
                        },
                        content: HeroClassInfo('Barbarian', `img/${heroClasses.BARBARIAN}.png`)
                    }),
                    // Paladin class
                    C({
                        tag: 'input',
                        id: `paladin-radio`,
                        classes: ['input-class'],
                        attributes: {
                            name: 'class',
                            value: heroClasses.PALADIN,
                            type: 'radio'
                        }
                    }),
                    C({
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
    const tree = C({
        tag: 'div',
        classes: ['create-controls'],
        content: C({
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
    const tree = C({
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
    const tree = C({
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
    });

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

// Card
/**
 * 
 * @param {Hero | Mob} unit 
 * @returns 
 */
function CardImage(unit) {
    const tree = C({
        tag: 'div',
        classes: ['card-image'],
        content: C({
            tag: 'img',
            classes: ['card-image-inner'],
            attributes: {
                src: `../img/${unit.className}.png`,
                alt: unit.name
            }
        })
    });

    return tree;
}

function CardTitle(title) {
    const tree = C({
        tag: 'h3',
        classes: ['card-title'],
        content: title
    });

    return tree;
}

function CardSubtitle(subtitle) {
    const tree = C({
        tag: 'p',
        classes: ['card-subtitle'],
        content: subtitle
    });

    return tree;
}

function CardContent(content) {
    const tree = C({
        tag: 'div',
        classes: ['card-content'],
        content
    });

    return tree;
}

function CardContentHero(hero) {
    const tree = CardContent([
        CardInfoHero(hero),
        CardImage(hero)
    ]);

    return tree;
}

function CardContentMob(mob) {
    const tree = CardContent([
        CardInfoMob(mob),
        CardImage(mob)
    ]);

    return tree;
}

function CardInfo(content) {
    const tree = C({
        tag: 'div',
        classes: ['card-info'],
        content
    });

    return tree;
}

function CardInfoHero(hero) {
    const tree = CardInfo([
        C({
            tag: 'div',
            classes: ['card-info-bg', 'card-info-bg-hero'],
        }),
        CardTitle(hero.name),
        CardSubtitle(hero.className)
    ]);

    return tree;
}

function CardInfoMob(mob) {
    const tree = CardInfo([
        C({
            tag: 'div',
            classes: ['card-info-bg', 'card-info-bg-mob'],
        }),
        CardTitle(mob.className),
    ]);

    return tree;
}


function CardFooter(content) {
    const tree = C({
        tag: 'div',
        classes: ['card-footer'],
        content
    });

    return tree;
}

function CardStatHp(hp) {
    const tree = C({
        tag: 'li',
        classes: ['card-stat', 'card-stat-hp'],
        content: [
            C({
                tag: 'h4',
                classes: ['card-stat-title'],
                content: 'Health'
            }),
            C({
                tag: 'strong',
                classes: ['card-stat-value'],
                content: hp
            })
        ]
    });

    return tree;
}

function CardStats(content) {
    const tree = C({
        tag: 'ul',
        classes: ['card-stats'],
        content
    });

    return tree;
}

function CardStatsHero(hero) {
    const tree = C({
        tag: 'ul',
        classes: ['card-stats'],
        content: CardStats([
            CardStatHp(hero.hp),
            CardStatDmg(hero.dmg),
            CardStatMoral(hero.moral)
        ])
    });

    return tree;
}

function CardStatsMob(mob) {
    const tree = C({
        tag: 'ul',
        classes: ['card-stats'],
        content: CardStats([
            CardStatHp(mob.hp),
            CardStatDmg(mob.dmg)
        ])
    });

    return tree;
}

function CardStatDmg(dmg) {
    const tree = C({
        tag: 'li',
        classes: ['card-stat', 'card-stat-dmg'],
        content: [
            C({
                tag: 'h4',
                classes: ['card-stat-title'],
                content: 'Attack'
            }),
            C({
                tag: 'strong',
                classes: ['card-stat-value'],
                content: dmg
            })
        ]
    });

    return tree;
}

function CardStatMoral(moral) {
    const tree = C({
        tag: 'li',
        classes: ['card-stat', 'card-stat-moral'],
        content: [
            C({
                tag: 'h4',
                classes: ['card-stat-title'],
                content: 'Moral'
            }),
            C({
                tag: 'strong',
                classes: ['card-stat-value'],
                content: moral
            })
        ]
    });

    return tree;
}

function Card(content) {
    const tree = C({
        tag: 'div',
        classes: ['card'],
        content
    });

    return tree;
}

function HeroCard(hero) {
    const tree = Card([
        CardContentHero(hero),
        CardFooter(CardStatsHero(hero))
    ]);

    return tree;
}

function MobCard(mob) {
    const tree = Card([
        CardContentMob(mob),
        CardFooter(CardStatsMob(mob))
    ]);

    return tree;
}

// Fight
function Attack() {
    const tree = C({
        tag: 'button',
        classes: ['attack'],
    });

    return tree;
}

// App components
function CreateHeroComponent() {
    const tree = C({
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
    const textTree = PropmtText('Will you fight or run away?');
    const contentTree = PromptContent(textTree);
    const fightControlTree = PromptControl('Fight', {
        events: {
            click() {
                gameContext.dispatch(actions.fight());
            }
        }
    });
    const runAwayTree = PromptControl('Run away', {
        events: {
            click() {
                gameContext.dispatch(actions.runAway());
            }
        }
    });
    const controlsTree = PromptControls([fightControlTree, runAwayTree]);
    const tree = Prompt([contentTree, controlsTree]);

    return tree;
}

function RunningAwayComponent() {
    const textTree = PropmtText('Your moral has been decreased');
    const contentTree = PromptContent(textTree);
    const tree = Prompt(contentTree);

    setTimeout(() => {
        gameContext.dispatch(actions.determinePath());
    }, 1500);

    return tree;
}

function DetermingPathComponent() {
    const { hero } = gameContext.state;
    const tree = HeroCard(hero);

    setTimeout(() => {
        gameContext.dispatch(actions.idle());
    }, 1500);

    return tree;
}

function EnemyFoundComponent() {
    const { mob } = gameContext.state;
    const textTree = PropmtText('You\'ve found ' + mob.className);
    const contentTree = PromptContent(textTree);
    const tree = Prompt(contentTree);

    setTimeout(() => {
        gameContext.dispatch(actions.introduceEnemy());
    }, 1500);

    return tree;
}

function IntroducingEnemyComponent() {
    const { mob } = gameContext.state;
    const tree = MobCard(mob);

    setTimeout(() => {
        gameContext.dispatch(actions.doubt());
    }, 1500);

    return tree;
}

function FinishComponent() {
    const score = gameContext.state.score;
    const textTree = PropmtText(`Your score is: ${score}.\n Do you want to start again?`);
    const contentTree = PromptContent(textTree);
    const startControlTree = PromptControl('Start again', {
        events: {
            click() {
                gameContext.dispatch(actions.createHero());
            }
        }
    });
    const controlsTree = PromptControls(startControlTree);
    const tree = Prompt([contentTree, controlsTree]);

    return tree;
}

function FightingComponent() {
    const { hero, mob } = gameContext.state;
    const tree = C({
        tag: 'div',
        classes: ['arena'],
        content: [
            C({
                tag: 'div',
                classes: ['arena-fighter'],
                content: HeroCard(hero)
            }),
            Attack(),
            C({
                tag: 'div',
                classes: ['arena-fighter'],
                content: MobCard(mob)
            })
        ]
    });

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
            case stepTypes.CREATE_HERO:
                this.domEl = this.createHero();
                break;
            case stepTypes.DETERMING_PATH:
                this.domEl = this.determingPath();
                break;
            case stepTypes.IDLE:
                this.domEl = this.idle();
                break;
            case stepTypes.ENEMY_FOUND:
                this.domEl = this.enemyFound();
                break;
            case stepTypes.INTRODUCING_ENEMY:
                this.domEl = this.introducingEnemy();
                break;
            case stepTypes.DOUBTING:
                this.domEl = this.doubting();
                break;
            case stepTypes.RUNNING_AWAY:
                this.domEl = this.runningAway();
                break;
            case stepTypes.FIGHTING:
                this.domEl = this.fighting();
                break;
            case stepTypes.FINISH:
                this.domEl = this.finish();
                break;
        }

        this.mount(this.domEl);
    }

    createHero() {
        return CreateHeroComponent();
    }

    determingPath() {
        return DetermingPathComponent();
    }

    idle() {
        return IdleComponent();
    }

    doubting() {
        return DoubtingComponent();
    }

    enemyFound() {
        return EnemyFoundComponent();
    }

    introducingEnemy() {
        return IntroducingEnemyComponent();
    }

    runningAway() {
        return RunningAwayComponent();
    }

    fighting() {
        return FightingComponent();
    }

    finish() {
        return FinishComponent();
    }
}
