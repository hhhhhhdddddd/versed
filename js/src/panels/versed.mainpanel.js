versed.mainPanel = (function() {

    function _parsableTextToTextVersionsData(savedData) {

        function createLine(lineStr) {
            var line = Object.create(null);
            line.str = lineStr;
            line._index = 0;
            
            line.readOneChar = function() {
                var charReaded = this.str.charAt(this._index++);
                return charReaded;
            };

            line.pickCharAt = function(index) {
                return this.str.charAt(index);
            };

            line.lineString = function() {
                return this.str.slice(this._index);
            };

            line.buildFullLine = function() {
                if (this.str === "") {
                    return "\n";
                }
                else {
                    return this.lineString() + "\n";
                }
            };

            return line;
        }

        function _isInstruction(line) {
            return line.pickCharAt(0) === "#";
        }


        // Parser
        var data = [];

        if (! savedData) {
            return data;
        }

        var currentType = "";
        var currentContent = "";
        var currentContentIndex = -1;
        var lines = savedData.split(/\r\n|\r|\n/g); //http://stackoverflow.com/a/1156388
        lines.forEach(function(lineStr, index) {
            var line = createLine(lineStr);
            if (_isInstruction(line)) {
                line.readOneChar();
                currentContent = "";
                currentContentIndex = currentContentIndex + 1;
                currentType = line.lineString();
                data.push(versed.textVersionData.create(currentType, currentContent));
            }
            else {
                var lineString = line.buildFullLine();
                currentContent += lineString;
                data[currentContentIndex].setTextInputDataContent(currentContent);
            }
        });

        return data;
    }

    return {
        create : function(textVersions) {
            var fileInputField = HD_.PanelField.create({
                name: "fileInput",
                type: "fileSelector",
                eventListeners : [{
                    name : "change",
                    handler: function fileInputHandler(evt) {
                        var tokensInputsPanel = mainPanel.findPanelByName("tokensInputsPanel");
                        tokensInputsPanel.clearPanelElements();
                        tokensInputsPanel.refreshPanel();

                        textVersions.clearTextVersions();
                        fileInputField.readFileAsText(function onFileRead(content) {
                            var textVersionsData = _parsableTextToTextVersionsData(content);
                            textVersions.addVersionsFromData(textVersionsData);
                        });
                    }
                }]
            });
            var inputTypeField = HD_.PanelField.create({
                name: "inputType",
                type: "list",
                labelValuesBuilder: function() {
                    return textVersions.mapFunToVersionTypes(function(versionType) {
                        return versionType.typeName;
                    });
                },
                labelsBuilder: function() {
                    return textVersions.mapFunToVersionTypes(function(versionType) {
                        return versed.tr.trKey(versionType.getVersionTypeLabelKey());
                    });
                }
            });
            var numberOfInputsField = HD_.PanelField.create({
                name: "numberOfInputs",
                type: "number"
            });
            var addTextInputsField = HD_.PanelField.create({
                name: "addTextInputs",
                type: "button",
                handler: function addTextInputsHandler() {
                    var numberOfInputsField = mainPanel.findPanelByName("numberOfInputs");
                    var inputsTypeField = mainPanel.findPanelByName("inputType");
                    var numberOfInputs = numberOfInputsField.findDomValue();
                    var inputsType = inputsTypeField.findDomValue();
                    for (var i = 0; i < numberOfInputs; i++) {
                        textVersions.addTextVersion(inputsType, "");
                    }
                },
                labelBuilder: function() {
                    return versed.tr.trKey('add_cap');
                }
            });
            var tokenInputsField = HD_.PanelField.create({
                name: "tokenInputs",
                type: "button",
                labelBuilder: function() {
                    return versed.tr.trKey('tokensInput_cap');
                },
                handler: function tokensInputsHandler() {
                    if (textVersions.versionsEmpty()) {
                        return;
                    }

                    var textVersionsPanel = mainPanel.findPanelByName("textVersionsPanel");
                    textVersions.eachElement(function(textVersion) {
                        var versionPanel = textVersionsPanel.findPanelByName(versed.buildId([versed.textVersionPanel.getTVPIdPrefix() , textVersion.getIndex()]));
                        textVersion.setLines(versionPanel.findContent());
                    });
                    var tokensInputsPanel = mainPanel.findPanelByName("tokensInputsPanel");
                    tokensInputsPanel.clearPanelElements();
                    var numberOfLines = textVersions.findMaxNumberOfLines();
                    for (var i = 0; i < numberOfLines; i++) {
                        var lineAggregatePanel = versed.lineAggregatePanel.create(textVersions.findLines(i), i);
                        tokensInputsPanel.pushPanelElement(lineAggregatePanel);
                    }
                    tokensInputsPanel.refreshPanel();
                }
            });
            var saveInputsField = HD_.PanelField.create({
                name: "saveInputs",
                type: "button",
                labelBuilder: function() {
                    return versed.tr.trKey('saveInputs_cap');
                },
                handler: function saveInputsHandler() {
                    var contents = textVersions.getParsableContents();
                    HD_.Download.saveEncodedData(contents, 'contents.txt');
                }
            });

            var fileInputPanel = HD_.HorizontalPanel.create({name: "fileInputPanel"});
            fileInputPanel.pushPanelElement(fileInputField);

            var addTextVersionPanel = HD_.HorizontalPanel.create({name: "addTextVersionPanel"});
            addTextVersionPanel.pushPanelElement(inputTypeField);
            addTextVersionPanel.pushPanelElement(numberOfInputsField);
            addTextVersionPanel.pushPanelElement(addTextInputsField);

            var inputsMenuPanel = HD_.HorizontalPanel.create({name: "inputsMenuPanel"});
            inputsMenuPanel.pushPanelElement(tokenInputsField);
            inputsMenuPanel.pushPanelElement(saveInputsField);

            var mainPanel = HD_.VerticalPanel.create({name: "mainPanel"});
            mainPanel.pushPanelElement(fileInputPanel);
            mainPanel.pushPanelElement(addTextVersionPanel);
            mainPanel.pushPanelElement(inputsMenuPanel);
            mainPanel.pushPanelElement(versed.textVersionsPanel.create({name: "textVersionsPanel"}));
            mainPanel.pushPanelElement(HD_.VerticalPanel.create({name: "tokensInputsPanel"}));

            return mainPanel;
        }
    };

})();
