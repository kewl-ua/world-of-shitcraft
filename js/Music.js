class MusicSurrounder {
    /**
     * 
     * @param {HTMLElement} mountTarget 
     */
    constructor(mountTarget) {
        this.audioEl = new Audio();
        this.currentSong = null;

        this.mount(mountTarget);
    }

    /**
     * 
     * @param {float} v - from 0.00 to 1.00
     */
    volume(v) {
        this.audioEl.volume = v;
    }

    /**
     * 
     * @param {HTMLElement} target 
     */
    mount(target) {
        target.replaceChildren(this.audioEl);
    }

    /**
     * 
     * @param {string} src - URI
     */
    changeSong(src) {
        if (this.currentSong !== src) {
            this.currentSong = src;
            this.play();
        }
    }

    react({ step }) {
        switch (step) {
            case stepTypes.CREATE_HERO:
                this.volume(0.3);
                this.changeSong('../music/create-hero.mp3');
                break;
            case stepTypes.START:
            case stepTypes.IDLE:
            case stepTypes.DOUBTING:
                this.volume(0.3);
                this.changeSong('../music/start.mp3');
                break;
            case stepTypes.FIGHTING:
                this.volume(1);
                this.changeSong('../music/fight.mp3');
                break;
            case stepTypes.FINISH:
                this.volume(1);
                this.changeSong('../music/finish.mp3');
                break;
            default:
                return;
        }
    }

    play() {
        this.audioEl.src = this.currentSong;
        this.audioEl.play().catch(this.handleFail.bind(this));
    }

    handleFail() {
        document.body.addEventListener('click', () => { this.audioEl.play(); }, { once: true });
    }
}