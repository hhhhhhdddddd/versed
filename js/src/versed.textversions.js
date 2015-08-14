versed.textVersions = (function() {

    return {

        create : function() {
            var textVersions = Object.create(null);
                       
            textVersions._versions = [];
            textVersions._index = 0;
            textVersions._listeners = [];

            textVersions.addTextVersion = function(type, content) {
                var index = this._index++;
                var that = this;
                var version = versed.textVersion.create(index, type, content);
                this._versions.push(version);
                this._listeners.forEach(function(listener) {
                    listener.onAddTextVersion(version);
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
                this._versions.forEach(function(textVersion) {
                    lines.push(textVersion.findLine(lineNumber));
                });
                return lines;
            };

            textVersions.getInput = function(index) {
                return this._versions[index];
            };

            textVersions.getParsableContents = function() {
                var contents = "";
                this.each(function(version) {
                    contents += "#" + version.getType() + "\n" + version.buildTextInputText() + "\n";
                });
                return contents;
            };

            textVersions.each = function(fun) {
                this._versions.forEach(function(version) {
                    fun(version);
                });
            };

            textVersions.eachInputTypes = function(fun) {
                versed.textVersion.eachTypes(fun);
            };
            
            textVersions.findNumberOfInput = function(type) {
                var number = 0;
                this.each(function(version) {
                    if (version.getType() === type) {
                        number++;
                    }
                });
                return number;
            };

            // Retourne le nombre maximum de lignes
            textVersions.findMaxNumberOfLines = function() {
                var max = -1;
                this.each(function(version) {
                    var numberOfLines = version.getNumberOfLines();
                    if (numberOfLines > max) {
                        max = numberOfLines;
                    }
                });
                return max;
            };

            // Retourne le nombre maximum de tokens pour une ligne
            textVersions.findMaxNumberOfTokens = function(lineIndex) {
                var max = -1;
                this.each(function(version) {
                    var numberOfLines = version.findMaxNumberOfTokens(lineIndex);
                    if (numberOfLines > max) {
                        max = numberOfLines;
                    }
                });
                return max;
            };

            textVersions.versionsEmpty = function() {
                for (var i = 0; i < this._versions.length; i++) {
                    var version = this._versions[i];
                    if (! version.isContentEmpty()) {
                        return false;
                    }
                }
                return true;
            };

            textVersions.isTextInputsEmpty = function() {
                return this._versions.length === 0;
            };

            textVersions.registerTextInputsObserver = function(listener) {
                this._listeners.push(listener);
            };

            return textVersions;
        },

        findInputTypes : function() {
            var typeOfInputValues = [];
            versed.textVersion.eachTypes(function(typeName, type) {
                typeOfInputValues.push({value: typeName, label: typeName});
            });
            return typeOfInputValues;
        }
        
    };

})();
