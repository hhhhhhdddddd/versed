versed.textVersionsPanel = (function() {

    return {
        create : function(name) {
            var textVersionsPanel = HD_.HorizontalPanel.create(
                [],
                name
            );

            textVersionsPanel.onAddTextVersion = function(textVersion) {
                var textVersionPanel = versed.textVersionPanel.create(textVersion);
                this.addPanelElement(textVersionPanel);
                this.refreshPanel();
            };

            return textVersionsPanel;
        }
    };

})();
