// Utils
function camelCaseSplit(str) {
    var words = [];
    var buffer = '';

    for (var ch of str) {
        if (ch === ch.toUpperCase()) {
            ch = ch.toLowerCase();
            words.push(buffer);
            buffer = '';
        }

        buffer += ch;
    }

    words.push(buffer);

    return words;
}

// Utils
function randomize(min, max) {
    var n = Math.random() * (max - min) + min;

    return parseInt(n);
}
