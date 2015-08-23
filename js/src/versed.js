versed = (function () {

/*
Ce que je veux. L'interface la plus simple et convivial à utiliser.
Donc je commence par faire comme si ce que je voulais existait (simple et convivial) et je m'en sers dans main.
Ensuite on voit comment ça peut se passer, si c'est viable, etc.
*/

    function _refreshFieldTexts(mainPanel) {
        mainPanel.mapPanels(function(panel) {
            if (panel.refreshFieldTexts) {
                console.log(panel.getName());
                panel.refreshFieldTexts();
            }
        });
    }

    return {
        
        main : function() {
            HD_.LocalWarnings.persistentLocalWarnings();

            versed.tr.setTranslater(versed.tr.en, versed.tr.keys);

            setTimeout(function changeTr() {
                versed.tr.setLocalTr(versed.tr.fr);
                _refreshFieldTexts(mainPanel);
            }, 2000);

            var textVersions = versed.textVersions.create();
            var mainPanel = versed.mainPanel.create(versed.textVersions.findInputTypes, textVersions);
            
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
