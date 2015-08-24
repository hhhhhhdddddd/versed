versed.tr = (function() {

    var _translater = null;
    var _currentLanguage = null;

    return {
        setTranslater : function(language, translationsKeys) {
            _translater = HD_.Translater.create();
            this.setLocalTr(language);
            this.setTrKeys(translationsKeys);
        },

        getTrKey : function(key) {
            return _translater.getTrKey(key);
        },

        translate : function(str, placeholdersValues) {
            return _translater.translate(str, placeholdersValues);
        },

        setLocalTr : function(language) {
            _currentLanguage = language;
            return _translater.setLocalTr(versed.tr[language]);
        },

        getCurrentLanguage : function() {
            return _currentLanguage;
        },

        setTrKeys : function(translationsKeys) {
            return _translater.setTrKeys(translationsKeys);
        },

        testTr : function(testedPanel) {
            function refreshFieldTexts(testedPanel) {
                testedPanel.mapPanels(function(panel) {
                    if (panel.refreshFieldTexts) {
                        console.log(panel.getName());
                        panel.refreshFieldTexts();
                    }
                });
            }

            setInterval(function changeTr() {
                var language = versed.tr.getCurrentLanguage() === "en" ? "fr" : "en" ;

                versed.tr.setLocalTr(language);
                refreshFieldTexts(testedPanel);
            }, 2000);
        }
    };

})();