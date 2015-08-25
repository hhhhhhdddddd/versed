versed = (function () {

    var _translaterName = "tr";

    return {
        
        main : function() {
            var that = this;

            HD_.LocalWarnings.persistentLocalWarnings();

            HD_.Translater.setAppTrProperty(that, _translaterName, "fr", versed.trKeys, [
                {name: "en", translations: versed.en},
                {name: "fr", translations: versed.fr},
            ]);

            var textVersions = versed.textVersions.create();
            var mainPanel = versed.mainPanel.create(textVersions);
            textVersions.registerTextInputsObserver(mainPanel.findPanelByName("textVersionsPanel"));
            var mainNode = mainPanel.buildDomNode();
            
            HD_.TranslaterPanel.addTranslaterPanel(that[_translaterName], mainPanel);

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
