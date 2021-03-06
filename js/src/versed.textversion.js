versed.textVersion = (function() {

    var _types = HD_.ArrayCollection.create();
    _types.addElement({
        typeName: "tokens",
        inputSize : 5,
        getVersionTypeAbbrKey : function() {
            return versed.tr.getTrKey('wordAbbr_cap');
        },
        getVersionTypeLabelKey : function() {
            return versed.tr.getTrKey('word_cap');
        },
        getNumberOfInputs : function(n) {
            return n;
        },
        parser : function(str) {

            function isCharacter(character) {
                if (character === " ") {
                    return false;
                }
                else {
                    return true;
                }
            }

            function isPonctuation(character) {
                return false;
            }

            function addToken(tokens, token) {
                tokens.push(token);
                inToken = false;
            }

            var tokens = [];
            var currentToken = "";
            var inToken = false;
            for (var i = 0, strLength = str.length; i < strLength; i++) {
                var currentChar = str.charAt(i);
                var isChar = isCharacter(currentChar);

                // On détermine si on entre ou si on a fini un mot.
                if (isPonctuation(currentChar)) {
                    addToken(tokens, "" + currentChar);
                    continue;
                }

                if (! inToken && isChar) {
                    inToken = true;
                    currentToken = "" + currentChar;
                }
                else if (inToken && ! isChar) {
                    addToken(tokens, currentToken);
                    currentToken = "";
                }
                else if (inToken && isChar) {
                    currentToken += currentChar;
                }
            }

            if (inToken) {
                addToken(tokens, currentToken);
            }
            return tokens;
        },
        inputFieldWidth: 10
    });
    _types.addElement({
        typeName: "lines",
        inputSize : 100,
        getVersionTypeAbbrKey : function() {
            return versed.tr.getTrKey('lineAbbr_cap');
        },
        getVersionTypeLabelKey : function() {
            return versed.tr.getTrKey('line_cap');
        },
        getNumberOfInputs : function(n) {
            return 1; // une seule input pour les lignes orientées lignes.
        },
        parser : function(str) {
            return [str];
        },
        inputFieldWidth: 100
    });


    function _buildTextInputStringLines(text) {
        return text.split('\n');
    }

    function _findType(typeName) {
        return _types.findElement(function(type) {
            return type.typeName === typeName;
        });
    }

    function _setLines(textVersion, text) {
        textVersion.clearCollection();

        var stringLines = _buildTextInputStringLines(text);
        stringLines.forEach(function(str, index) {
            var type = _findType(textVersion.type);
            var tokens = type.parser(str);
            textVersionLine = versed.textVersionLine.create(index, tokens, textVersion.type, type.inputFieldWidth);
            textVersion.addElement(textVersionLine);
        });
    }

    return {
        create : function(index, type, text) {
            var textVersion = HD_.ArrayCollection.create();
            textVersion.index = index;
            textVersion.type = type;
            textVersion._observers = [];

            _setLines(textVersion, text);

            textVersion.findLine = function(lineNumber) {
                var line = this.getElement(lineNumber);
                if (!line) {
                    var type = _findType(textVersion.type);
                    return versed.textVersionLine.createEmptyLine(lineNumber, this.type, type.inputFieldWidth);
                }
                else {
                    return line;
                }
            };

            textVersion.getVersionAbbrKey = function() {
                return _findType(this.type).getVersionTypeAbbrKey();
            };

            textVersion.setLines = function(text) {
                _setLines(this, text);
                this._observers.forEach(function(obs) {
                    obs.onSetTextInputContent(text);
                });
            };

            textVersion.buildTextInputText = function() {
                var fullText = [];
                this.eachElement(function(line) {
                    fullText.push(line.buildText());
                });
                return versed.textVersion.joinLines(fullText);
            };

            textVersion.registerTextInputObserver = function(tiObserver) {
                this._observers.push(tiObserver);
            };

            textVersion.isContentEmpty = function() {
                return this.buildTextInputText() === "";
            };

            textVersion.getIndex = function() {
                return this.index;
            };

            textVersion.getType = function() {
                return this.type;
            };

            return textVersion;
        },

        eachTypes : function(fun) {
            _types.eachElement(fun);
        },

        joinLines : function(lines) {
            return lines.join("\n");
        },

        mapFunToArray : function(fun) {
            return _types.mapFunToArray(fun);
        }
    };

})();
