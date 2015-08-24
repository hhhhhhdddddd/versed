versed.translationsPanel = (function() {

    return {
        create : function(translater, translationHandler) {
            var translationPanel = HD_.TranslaterPanel.create(translater, translationHandler);
            return translationPanel;
        },

        placeNode : function(node) {
            var width = node.offsetWidth;
            node.style.position = "absolute";
            node.style.top = "0px";
            node.style.right = (-width) + "px";
        }
    };

})();
