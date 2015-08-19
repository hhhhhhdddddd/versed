versed.textVersionsPanel = (function() {

    return {
        create : function(data) {
            var textVersionsPanel = HD_.HorizontalPanel.create({name: data.name});

            textVersionsPanel.onAddTextVersion = function(textVersion) {
                var textVersionPanel = versed.textVersionPanel.create(textVersion);
                this.pushPanelElement(textVersionPanel);
                this.refreshPanel();
            };

            return textVersionsPanel;
        }
    };

})();
