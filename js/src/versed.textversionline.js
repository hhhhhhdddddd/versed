versed.textVersionLine = (function() {

    return {
        create : function(lineNumber, tokens, type, inputFieldWidth) {
            var textVersionLine = HD_.ArrayCollection.create();
            textVersionLine.addCollectionElements(tokens);
            textVersionLine._lineNumber = lineNumber;
            textVersionLine._type = type;
            textVersionLine._inputFieldWidth = inputFieldWidth;

            textVersionLine.getLineNumber = function() {
                return this._lineNumber;
            };

            textVersionLine.getLineType = function() {
                return this._type;
            };

            textVersionLine.getFieldWidth = function() {
                return this._inputFieldWidth;
            };

            textVersionLine.buildText = function() {
                var tokenArray = this.toArray();
                return tokenArray.join(" ");
            };

            return textVersionLine;
        },

        createEmptyLine : function(lineNumber, type) {
            return this.create(lineNumber, [], type);
        }

    };

})();
