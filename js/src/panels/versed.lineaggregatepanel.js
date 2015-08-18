versed.lineAggregatePanel = (function() {

    var _numberOfTokensStr = "numberOfTokens";

    function _buildLinePanel(line, numberOfTokensStr, versionIndex, linesIndex) {
        var linePanel = HD_.HorizontalPanel.create(
            [], versed.buildId(["linePanel", line.getLineNumber(), versionIndex])
        );

        for (var i = 0; i < numberOfTokensStr; i++) {
            var lineToken = line.getElement(i);
            var tokenPanel = HD_.PanelField.create({
                name: versed.buildId(["tokenPanel", versionIndex, linesIndex, i]), // i est l'index du token
                type: "string",
                initValue: lineToken ? lineToken : "",
                width: line.getFieldWidth()
            });
            linePanel.addPanelElement(tokenPanel);
        }
        
        linePanel.findLinePanelContent = function() {
            var content = [];
            this.eachPanelElement(function(panelField) {
                content.push(panelField.findDomValue());
            });
            var str = content.join(" ");
            return str;
        };

        return linePanel;
    }

    function _buildConstructionData(lines) {
        var constructionData = {};
        lines.forEach(function(line) {
            var obj = {};
            obj[_numberOfTokensStr] = -1;
            constructionData[line.getLineType()] = obj;
        });
        lines.forEach(function(line) {
            var type = line.getLineType();
            var lineTokenNumber = line.getSize();
            var currentTokenNumber = constructionData[line.getLineType()][_numberOfTokensStr];
            constructionData[line.getLineType()][_numberOfTokensStr] =
                (lineTokenNumber > currentTokenNumber) ? lineTokenNumber: currentTokenNumber;
        });
        return constructionData;
    }

    return {

        create : function(lines, linesIndex) {
            var lineAggregatePanel = HD_.VerticalPanel.create(
                [], versed.buildId(["lineAggregatePanel", linesIndex])
            );

            var constructionData = _buildConstructionData(lines);
            lines.forEach(function(line, versionIndex) {
                var linePanel = _buildLinePanel(
                    line,
                    constructionData[line.getLineType()][_numberOfTokensStr],
                    versionIndex, linesIndex
                );
                lineAggregatePanel.addPanelElement(linePanel);
            });

            lineAggregatePanel.findLinePanel = function(versionNumber) {
                return this.getChildPanel(versionNumber);
            };

            return lineAggregatePanel;
        }
    };

})();
