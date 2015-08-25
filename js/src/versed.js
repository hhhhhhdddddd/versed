versed = (function () {

    return {
        
        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            versed.tr.setTranslater("en", versed.tr.keys);

            var textVersions = versed.textVersions.create();
            var mainPanel = versed.mainPanel.create(textVersions);
            textVersions.registerTextInputsObserver(mainPanel.findPanelByName("textVersionsPanel"));
            var mainNode = mainPanel.buildDomNode();
            
            
            versed.tr.addTranslaterPanel(mainNode, function(translationName) {

                function refreshFieldTexts(panel) {
                    panel.mapPanels(function(pan) {
                        if (pan.refreshFieldTexts) {
                            pan.refreshFieldTexts();
                        }
                    });
                }

                versed.tr.setLocalTr(translationName);
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
