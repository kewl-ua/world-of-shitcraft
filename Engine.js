// Constants
const complexityModes = {
    EASY: 'EASY',
    HARD: 'HARD',
    IMPOSSIBLE: 'IMPOSSIBLE'
};

const heroClasses = {
    PALADIN: 'PALADIN',
    BARBARIAN: 'BARBARIAN'
};

const mobClasses = {
    ORK: 'ORK',
    TROLL: 'TROLL'
};

const stepTypes = {
    START: 'START',
    DETERMING_PATH: 'DETERMING_PATH',
    IDLE: 'IDLE',
    FIGHTING: 'FIGHTING',
    HERO_ATTACKING: 'HERO_ATTACKING',
    MOB_ATTACKING: 'MOB_ATTACKING',
    DOUBTING: 'DOUBTING',
    ENEMY_FOUND: 'ENEMY_FOUND',
    INTRODUCING_ENEMY: 'INTRODUCING_ENEMY',
    RUNNING_AWAY: 'RUNNING_AWAY',
    FINISH: 'FINISH',
    FIGHT_WON: 'FIGHT_WON'
};

const actionTypes = {
    CREATE_HERO: 'CREATE_HERO',
    HERO_ATTACK: 'HERO_ATTACK',
    MOB_ATTACK: 'MOB_ATTACK',
    START: 'START',
    DETERMINE_PATH: 'DETERMINE_PATH',
    IDLE: 'IDLE',
    LOOK_FOR_ENEMIES: 'LOOK_FOR_ENEMIES',
    INTRODUCE_ENEMY: 'INTRODUCE_ENEMY',
    DOUBT: 'DOUBT',
    RUN_AWAY: 'RUN_AWAY',
    FIGHT: 'FIGHT',
    FINISH_FIGHTING: 'FINISH_FIGHTING',
    FINISH: 'FINISH'
};

// Hero constructors
const createHero = className => stats => name => ({
    name,
    className,
    hp: stats.hp,
    moral: stats.moral,
    dmg: stats.dmg,
    criticalHp: 0,
    criticalMoral: 0
});

const createPaladinHero = createHero('Paladin');
const createBarbarianHero = createHero('Barbarian');

const createEasyPaladinHero = createPaladinHero({ hp: 65, dmg: 8, moral: 12 });
const createHardPaladinHero = createPaladinHero({ hp: randomize(50, 65), dmg: randomize(4, 8), moral: randomize(8, 12) });
const createImpossiblePaladinHero = createPaladinHero({ hp: 50, dmg: 4, moral: 8 });

const createEasyBarbarianHero = createBarbarianHero({ hp: 60, dmg: 12, moral: 7 });
const createHardBarbarianHero = createBarbarianHero({ hp: randomize(45, 60), dmg: randomize(8, 12), moral: randomize(3, 7) });
const createImpossibleBarbarianHero = createBarbarianHero({ hp: 45, dmg: 8, moral: 3 });

// Mob constructos
const createMob = className => stats => () => ({
    className,
    hp: stats.hp,
    dmg: stats.dmg,
    criticalHp: 0
});

const createOrkMob = createMob('Ork');
const createTrollMob = createMob('Troll');

const createEasyOrkMob = createOrkMob({ hp: 20, dmg: 4 });
const createHardOrkMob = createOrkMob({ hp: randomize(20, 80), dmg: randomize(4, 12) });
const createImpossibleOrkMob = createOrkMob({ hp: 80, dmg: 12 });

const createEasyTrollMob = createTrollMob({ hp: 15, dmg: 5 });
const createHardTrollMob = createTrollMob({ hp: randomize(15, 30), dmg: randomize(5, 10) });
const createImpossibleTrollMob = createTrollMob({ hp: 30, dmg: 10 });

// Spawners
// Heroes
const generateHeroSpawner = complexity => (className) => {
    const complexityHeroClassMap = {
        [complexityModes.EASY]: {
            [heroClasses.PALADIN]: createEasyPaladinHero,
            [heroClasses.BARBARIAN]: createEasyBarbarianHero
        },
        [complexityModes.HARD]: {
            [heroClasses.PALADIN]: createHardPaladinHero,
            [heroClasses.BARBARIAN]: createBarbarianHero
        },
        [complexityModes.IMPOSSIBLE]: {
            [heroClasses.PALADIN]: createImpossiblePaladinHero,
            [heroClasses.BARBARIAN]: createImpossibleBarbarianHero
        }
    };

    return complexityHeroClassMap[complexity][className];
};

const spawnEasyHero = generateHeroSpawner(complexityModes.EASY);
const spawnHardHero = generateHeroSpawner(complexityModes.HARD);
const spawnImpossbileHero = generateHeroSpawner(complexityModes.IMPOSSIBLE);

// Mobs
const generateMobSpawner = (complexity) => {
    const complexityChanceSpawnersMap = {
        [complexityModes.EASY]: [
            [60, createEasyOrkMob],
            [40, createEasyTrollMob]
        ],
        [complexityModes.HARD]: [
            [70, createHardOrkMob],
            [30, createHardTrollMob]
        ],
        [complexityModes.IMPOSSIBLE]: [
            [85, createImpossibleOrkMob],
            [15, createImpossibleTrollMob]
        ]
    };

    return () => {
        const guess = randomize(1, 100);

        const chances = complexityChanceSpawnersMap[complexity];
        let i = 0;
    
        for (const [chance, spawner] of chances) {
            i += chance;
    
            if (guess <= i) {
                return spawner;
            }
        }
    };
};

const spawnEasyMob = generateMobSpawner(complexityModes.EASY);
const spawnHardMob = generateMobSpawner(complexityModes.HARD);
const spawnImpossibleMob = generateMobSpawner(complexityModes.IMPOSSIBLE);

// Game
const actions = {
    start: (hero) => ({ type: actionTypes.START, hero }),
    determinePath: () => ({ type: actionTypes.DETERMINE_PATH }),
    heroAttack: () => ({ type: actionTypes.HERO_ATTACK }),
    mobAttack: () => ({ type: actionTypes.MOB_ATTACK }),
    createHero: () => ({ type:  actionTypes.CREATE_HERO }),
    idle: () => ({ type: actionTypes.IDLE }),
    lookForEnemies: () => ({ type: actionTypes.LOOK_FOR_ENEMIES }),
    introduceEnemy: () => ({ type: actionTypes.INTRODUCE_ENEMY }),
    doubt: () => ({ type: actionTypes.DOUBT }),
    runAway: () => ({ type: actionTypes.RUN_AWAY }),
    fight: () => ({ type: actionTypes.FIGHT }),
    finish: () => ({ type: actionTypes.FINISH })
};

const initialState = {
    step: stepTypes.CREATE_HERO,
    hero: null,
    mob: null,
    score: null,
    bestScore: null,
    keepPlaying: false
};

const gameGenerator = (heroSpawner, mobSpawner) => ({
    spawnHero: heroSpawner,
    spawnMob: mobSpawner,
    state: initialState,
    listeners: [],
    subscribe(listener) {
        this.listeners.push(listener);
    },
    unsubscribe(listener) {
        this.listeners = this.listeners.filter(l => l !== listener);
    },
    notify() {
        for (const l of this.listeners) {
            l.react(this.state);
        }
    },
    dispatch(action) {
        this.state = this.reduce(this.state, action);
        this.notify(this.state);
    },
    reduce(state = initialState, action) {
        switch (action.type) {
            case actionTypes.CREATE_HERO: {
                const hero = null;
                const score = null;
                const step = stepTypes.CREATE_HERO;

                return { ...state, hero, score, step };
            }
            case actionTypes.START: {
                const score = 0;
                const { name, className } = action.hero;
                const hero = this.spawnHero(className)(name);
                const keepPlaying = true;
                const step = stepTypes.IDLE;
                const bestScore = state.bestScore || 0; // TODO: implement with local storage 

                return { ...state, hero, bestScore, score, keepPlaying, step };
            }
            case actionTypes.DETERMINE_PATH: {
                const step = stepTypes.DETERMING_PATH;

                return { ...state, step  };
            }
            case actionTypes.IDLE: {
                const step = stepTypes.IDLE;

                return { ...state, step };
            }
            case actionTypes.LOOK_FOR_ENEMIES: {
                const mob = this.spawnMob()();
                const step = stepTypes.ENEMY_FOUND;

                return { ...state, mob, step };
            }
            case actionTypes.INTRODUCE_ENEMY: {
                const step = stepTypes.INTRODUCING_ENEMY;

                return { ...state, step };
            }
            case actionTypes.DOUBT: {
                const step = stepTypes.DOUBTING;

                return { ...state, step };
            }
            case actionTypes.RUN_AWAY: {
                const hero = state.hero;
                hero.moral -= 1;
                const step = hero.moral > hero.criticalMoral ? stepTypes.RUNNING_AWAY : stepTypes.FINISH;
                const score = step === stepTypes.RUNNING_AWAY ? state.score + 1 : state.score;

                return { ...state, hero, step, score };
            }
            case actionTypes.FIGHT: {
                const step = stepTypes.FIGHTING;

                return { ...state, step };
            }
            case actionTypes.HERO_ATTACK: {
                let { hero, mob, score } = state;
                const expectedHp = mob.hp - hero.dmg;
                const mobHp = expectedHp > mob.criticalHp ? expectedHp : mob.criticalHp;
                const step = mobHp === mob.criticalHp ? stepTypes.FIGHT_WON : stepTypes.HERO_ATTACKING;

                if (step === stepTypes.FIGHT_WON) {
                    mob = null;
                    score += 1;
                } else {
                    mob.hp = mobHp;
                }

                return { ...state, mob, step, score };
            }
            case actionTypes.MOB_ATTACK: {
                let { hero, mob } = state;
                const expectedHp = hero.hp - mob.dmg;
                const heroHp = expectedHp > hero.criticalHp ? expectedHp : hero.criticalHp;
                const step = heroHp === hero.criticalHp ? stepTypes.FINISH : stepTypes.MOB_ATTACKING;

                if (step === stepTypes.FINISH) {
                    hero = null;
                    mob = null;
                } else {
                    hero.hp = heroHp;
                }

                return { ...state, hero, mob, step };
            }
            case actionTypes.FINISH: {
                const keepPlaying = false;
                const bestScore = state.score > state.bestScore ? state.score : state.bestScore;
                const step = stepTypes.FINISH;

                return { ...state, keepPlaying, bestScore, step };
            }
            default: {
                return state;
            }
        }
    }
});

const createGame = (complexity) => {
    switch (complexity) {
        case complexityModes.EASY:
            return gameGenerator(spawnEasyHero, spawnEasyMob);
        case complexityModes.HARD:
            return gameGenerator(spawnHardHero, spawnHardMob);
        case complexityModes.IMPOSSIBLE:
            return gameGenerator(spawnImpossbileHero, spawnImpossibleMob);
    }
};




