versed.tr = (function() {

    var _translater = null;

    return {
        setTranslater : function(localTranslations, translationsKeys) {
            _translater = HD_.Translater.create();
            this.setLocalTr(localTranslations);
            this.setTrKeys(translationsKeys);
        },

        getTrKey : function(key) {
            return _translater.getTrKey(key);
        },

        translate : function(str) {
            return _translater.translate(str);
        },

        setLocalTr : function(localTranslations) {
            return _translater.setLocalTr(localTranslations);
        },

        setTrKeys : function(translationsKeys) {
            return _translater.setTrKeys(translationsKeys);
        }
    };

})();