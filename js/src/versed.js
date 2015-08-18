versed = (function () {

    return {
        
        main : function() {
            HD_.Debug.persistentLocalWarnings();
            
            var typeOfInputValues = versed.textVersions.findInputTypes();
            var textVersions = versed.textVersions.create();
            var mainPanel = versed.mainPanel.create(typeOfInputValues, textVersions);
            textVersions.registerTextInputsObserver(mainPanel.findPanelByName("textVersionsPanel"));
            return mainPanel.buildDomNode();
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
