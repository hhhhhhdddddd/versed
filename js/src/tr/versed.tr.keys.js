versed.tr.keys = (function() {

    var keysArr = [
        'add_cap',
        'tokensInput_cap',
        'saveInputs_cap',
        'updatePar_cap',
        'word_cap',
        'line_cap',
        'wordAbbr_cap',
        'lineAbbr_cap'
    ];

    var keys = {};
    keysArr.forEach(function(keyName) {
        keys[keyName] = keyName;
    });

    return keys;
})();
