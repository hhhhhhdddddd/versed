versed = (function () {

    function _setTr(versedObject, language, translationsKeys) {
        var translater = HD_.Translater.create();
        translater.addTranlsation("en", versed.en);
        translater.addTranlsation("fr", versed.fr);
        translater.setCurrentTranlsation(language);
        translater.setTrKeys(translationsKeys);

        versedObject.tr = translater;
        versedObject.tr.addTranslaterPanel = function(parentDomNode, handler) {
            var translaterPanel = HD_.TranslaterPanel.create(this, handler); // this est versedObject.tr
            translaterPanel.addTranslaterPanel(parentDomNode);
        };

        versedObject.tr.trKey = function(key) {
            return versed.tr.translate(versed.tr.getTrKey(key));
        };
    }

    return {
        
        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            _setTr(this, "en", versed.trKeys);

            var textVersions = versed.textVersions.create();
            var mainPanel = versed.mainPanel.create(textVersions);
            textVersions.registerTextInputsObserver(mainPanel.findPanelByName("textVersionsPanel"));
            var mainNode = mainPanel.buildDomNode();
            
            
            versed.tr.addTranslaterPanel(mainNode, function translationHandler(translationName) {

                function refreshFieldTexts(panel) {
                    panel.mapPanels(function(pan) {
                        if (pan.refreshFieldTexts) {
                            pan.refreshFieldTexts();
                        }
                    });
                }

                versed.tr.setCurrentTranlsation(translationName);
                refreshFieldTexts(mainPanel);
            });

            return mainNode;
        },

        buildId : function(idElements) {
            var id = "";
            idElements.forEach(function(idElt, index) {
                id += idElt;
                if (index < (idElements.length - 1)) {
                    id += "_";
                }
            });
            return id;
        }
    };
})();
