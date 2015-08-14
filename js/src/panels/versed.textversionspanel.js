versed.textVersionsPanel = (function() {

    return {
        create : function(name) {
            var textVersionsPanel = HD_.HorizontalPanel.create(
                [],
                name
            );

            textVersionsPanel.onAddTextVersion = function(textVersion) {
                var textVersionPanel = versed.textVersionPanel.create(textVersion);
                textVersionsPanel.addPanelElement(textVersionPanel);
                textVersionsPanel.refreshPanel();
            };

            return textVersionsPanel;
        }
    };

})();
