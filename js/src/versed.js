versed = (function () {

/*
Ce que je veux. L'interface la plus simple et convivial à utiliser.
Donc je commence par faire comme si ce que je voulais existait (simple et convivial) et je m'en sers dans main.
Ensuite on voit comment ça peut se passer, si c'est viable, etc.
*/



    return {
        
        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            versed.tr.setTranslater("en", versed.tr.keys);

            var textVersions = versed.textVersions.create();
            var mainPanel = versed.mainPanel.create(textVersions);

            versed.tr.testTr(mainPanel);
            
            textVersions.registerTextInputsObserver(mainPanel.findPanelByName("textVersionsPanel"));
            var mainNode = mainPanel.buildDomNode();
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
