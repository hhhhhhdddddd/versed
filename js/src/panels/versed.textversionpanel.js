versed.textVersionPanel = (function() {

    var _rows = 30;
    var _cols = 60;
    var _idPrefix = "textVersionPanel";

    function _textVersionPanelName(index) {
        return "textVersion_" + index;
    }

    return {
        create : function(textVersion) {
            var textField = HD_.PanelField.create({
                name: _textVersionPanelName(textVersion.getIndex()),
                type: "text",
                width: _cols,
                height: _rows,
                initValue: textVersion.buildTextInputText()
            });

            var updateButton = HD_.PanelField.create({
                name: "updateTextInput_" + textVersion.getIndex(),
                type: "button",
                labelBuilder : function() {
                    return versed.tr.translate(versed.tr.trKey('updatePar_cap'), [versed.tr.trKey(textVersion.getVersionAbbrKey())]);

                },
                handler: function onUpdate() {
                    // On construit le nouveau texte de la version correspondant au panneau à partir des tokens
                    // se trouvant dans la zone d'édition.
                    var root = updateButton.findRootPanel();
                    var tokensInputsPanel = root.findPanelByName("tokensInputsPanel");
                    var lines = [];
                    tokensInputsPanel.eachPanelElement(function(aggregatePanel) {
                        var linePanel = aggregatePanel.findLinePanel(textVersion.getIndex());
                        lines.push(linePanel.findLinePanelContent());
                    });
                    var fullText = versed.textVersion.joinLines(lines);
                    textVersion.setLines(fullText);
                }
            });

            var textVersionPanel = HD_.VerticalPanel.create({name: versed.buildId([versed.textVersionPanel.getTVPIdPrefix() , textVersion.getIndex()])});
            textVersionPanel.pushPanelElement(textField);
            textVersionPanel.pushPanelElement(updateButton);

            textVersionPanel.onSetTextInputContent = function(content) {
                textField.setFieldContent(content);
            };

            textVersionPanel.findContent = function() {
                return this.findPanelByName(_textVersionPanelName(textVersion.getIndex())).findDomValue();
            };

            textVersion.registerTextInputObserver(textVersionPanel);

            return textVersionPanel;
        },

        getTVPIdPrefix : function() {
            return _idPrefix;
        }
    };

})();
