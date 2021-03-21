class MusicSurrounder {
    constructor(mountTarget) {
        this.domEl = this.config(new Audio());
        this.currentSong = null;

        this.mount(mountTarget);
    }

    config(audioEl) {
        audioEl.volume = 0.3;

        return audioEl;
    }

    mount(target) {
        target.replaceChildren(this.domEl);
    }

    changeSong(src) {
        if (this.currentSong !== src) {
            this.currentSong = src;
            this.play();
        }
    }

    react({ step }) {
        switch (step) {
            case stepTypes.START:
            case stepTypes.IDLE:
                this.changeSong('../music/start.mp3');
                break;
            case stepTypes.DOUBTING:
            case stepTypes.FIGHTING:
                this.changeSong('../music/fight.mp3');
                break;
            case stepTypes.FINISH:
                this.changeSong('../music/finish.mp3');
                break;
            default:
                return;
        }
    }

    play() {
        this.domEl.src = this.currentSong;
        this.domEl.play().catch(this.handleFail.bind(this));
    }

    handleFail() {
        document.body.addEventListener('click', () => { this.domEl.play(); }, { once: true });
    }
}