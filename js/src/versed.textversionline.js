versed.textVersionLine = (function() {

    return {
        create : function(lineNumber, tokens, type, inputFieldWidth) {
            var textVersionLine = Object.create(null);
            textVersionLine._lineNumber = lineNumber;
            textVersionLine._tokens = tokens;
            textVersionLine._type = type;
            textVersionLine._inputFieldWidth = inputFieldWidth;

            textVersionLine.getLineNumber = function() {
                return this._lineNumber;
            };

            textVersionLine.getLineToken = function(i) {
                return this._tokens[i];
            };

            textVersionLine.getNumberOfTokens = function() {
                return this._tokens.length;
            };

            textVersionLine.getLineType = function() {
                return this._type;
            };

            textVersionLine.getFieldWidth = function() {
                return this._inputFieldWidth;
            };

            textVersionLine.buildText = function() {
                return textVersionLine._tokens.join(" ");
            };

            return textVersionLine;
        },

        createEmptyLine : function(lineNumber, type) {
            return this.create(lineNumber, [], type);
        }

    };

})();
