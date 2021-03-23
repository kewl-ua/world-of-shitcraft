// Driver
window.onload = function() {
    const game = createGame(complexityModes.IMPOSSIBLE);

    window.gameContext = game;

    const gameUI = new GameUI(game, document.getElementById('app-root'));
    const musicSurrounder = new MusicSurrounder(document.getElementById('music'));

    game.subscribe(gameUI);
    game.subscribe(musicSurrounder);

    game.notify();
};
