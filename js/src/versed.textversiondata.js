versed.textVersionData = (function() {

    return {
        create : function(type, content, number) {
            var textVersionData = Object.create(null);
            textVersionData.type = type;
            textVersionData.content = content;
            textVersionData.number = number;

            textVersionData.getTextInputDataType = function() {return this.type;};
            textVersionData.getTextInputDataContent = function() {return this.content;};
            textVersionData.getNumber = function() {return this.number;};

            textVersionData.setTextInputDataContent = function(content) {
                this.content = content;
            };
            
            return textVersionData;
        }
    };

})();
