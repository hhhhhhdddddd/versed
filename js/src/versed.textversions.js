versed.textVersions = (function() {

    return {

        create : function() {
            var textVersions = HD_.ArrayCollection.create();
                       
            textVersions._listeners = [];

            textVersions.addTextVersion = function(type, content) {
                var index = this.getSize();
                var version = versed.textVersion.create(index, type, content);
                this.addElement(version);
                this._listeners.forEach(function(listener) {
                    listener.onAddTextVersion(version);
                });
            };

            textVersions.clearTextVersions = function() {
                this.clearCollection();
                this._listeners.forEach(function(listener) {
                    listener.onClearTextVersions();
                });
            };

            textVersions.addVersionsFromData = function(textVersionsData) {
                var that = this;
                if (textVersionsData.length !== 0) {
                    textVersionsData.forEach(function(textVersionData) {
                        that.addTextVersion(textVersionData.getTextInputDataType(), textVersionData.getTextInputDataContent());
                    });
                }
            };

            textVersions.findLines = function(lineNumber) {
                var lines = [];
                this.eachElement(function(textVersion) {
                    lines.push(textVersion.findLine(lineNumber));
                });
                return lines;
            };

            textVersions.getParsableContents = function() {
                var contents = "";
                this.eachElement(function(version) {
                    contents += "#" + version.getType() + "\n" + version.buildTextInputText() + "\n";
                });
                return contents;
            };

            textVersions.eachInputTypes = function(fun) {
                versed.textVersion.eachTypes(fun);
            };
            
            textVersions.findNumberOfInput = function(type) {
                var number = 0;
                this.eachElement(function(version) {
                    if (version.getType() === type) {
                        number++;
                    }
                });
                return number;
            };

            // Retourne le nombre maximum de lignes
            textVersions.findMaxNumberOfLines = function() {
                var max = -1;
                this.eachElement(function(version) {
                    var numberOfLines = version.getSize();
                    if (numberOfLines > max) {
                        max = numberOfLines;
                    }
                });
                return max;
            };

            // Retourne le nombre maximum de tokens pour une ligne
            textVersions.findMaxNumberOfTokens = function(lineIndex) {
                var max = -1;
                this.eachElement(function(version) {
                    var numberOfLines = version.findMaxNumberOfTokens(lineIndex);
                    if (numberOfLines > max) {
                        max = numberOfLines;
                    }
                });
                return max;
            };

            textVersions.versionsEmpty = function() {
                var length = this.getSize();
                for (var i = 0; i < length; i++) {
                    var version = this.getElement(i);
                    if (! version.isContentEmpty()) {
                        return false;
                    }
                }
                return true;
            };

            textVersions.registerTextInputsObserver = function(listener) {
                this._listeners.push(listener);
            };

            textVersions.mapFunToVersionTypes = function(fun) {
                return versed.textVersion.mapFunToArray(fun);
            };

            return textVersions;
        }
        
    };

})();
