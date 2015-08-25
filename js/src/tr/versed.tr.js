versed.tr = (function() {

    var _translater = null;

    return {
        setTranslater : function(language, translationsKeys) {
            _translater = HD_.Translater.create();
            _translater.addTranlsation("en", versed.tr.en);
            _translater.addTranlsation("fr", versed.tr.fr);
            _translater.setCurrentTranlsation(language);
            _translater.setTrKeys(translationsKeys);
        },

        getTrKey : function(key) {
            return _translater.getTrKey(key);
        },

        translate : function(str, placeholdersValues) {
            return _translater.translate(str, placeholdersValues);
        },

        setLocalTr : function(language) {
            return _translater.setCurrentTranlsation(language);
        },

        getCurrentLanguage : function() {
            return _translater.getCurrentTranslationName();
        },

        setTrKeys : function(translationsKeys) {
            return _translater.setTrKeys(translationsKeys);
        },

        trKey : function(key) {
            return versed.tr.translate(versed.tr.getTrKey(key));
        },

        eachElement : function(fun) {
            _translater.eachElement(fun);
        },

        addTranslaterPanel : function(parentDomNode, handler) {
            var translaterPanel = HD_.TranslaterPanel.create(_translater, handler);
            translaterPanel.addTranslaterPanel(parentDomNode);
        },

        testTr : function(testedPanel) {
            function refreshFieldTexts(testedPanel) {
                testedPanel.mapPanels(function(panel) {
                    if (panel.refreshFieldTexts) {
                        panel.refreshFieldTexts();
                    }
                });
            }

            setTimeout(function changeTr() {
                var language = versed.tr.getCurrentLanguage() === "en" ? "fr" : "en" ;

                versed.tr.setLocalTr(language);
                refreshFieldTexts(testedPanel);
            }, 2000);
        }
    };

})();
