HD_ = (function() {
    return {};
})();
HD_.Ajax = (function() {

    return {
        makeRequest : function(requestType, url, onSuccess, onError, onFinished) {
            // Instances of XMLHttpRequest can make an HTTP request to the server.
            var httpRequest = new XMLHttpRequest();

            // Tells the HTTP request object which JavaScript function will handle processing the response. 
            httpRequest.onreadystatechange = function responseHandler() {
                if (httpRequest.readyState === 4) {
                    if (httpRequest.status === 200) {
                        onSuccess(httpRequest.responseText);
                        onFinished();
                    } else {
                        onError();
                        onFinished();
                    }
                }
            };

            // Actually make the request.
            httpRequest.open(requestType, url);
            httpRequest.send();
        },

        chainRequests : function(requestType, urls, onSuccess, onFinished, onError) {

            function createArrayIterator(anArray) {
                var iterator = Object.create(null);
                iterator.position = 0;
                iterator.list = anArray;

                iterator.hasNext = function() {
                    return this.position < this.list.length;
                };
                
                iterator.next = function() {
                    return this.list[this.position++];
                };

                return iterator;
            }

            function chainRequestsAux() {
                if (! iterator.hasNext()) {
                    onFinished();
                    return;
                }

                var url = iterator.next();
                HD_.Ajax.makeRequest(requestType, url, function fullOnSuccess(responseText) {
                    onSuccess(url, responseText);

                    chainRequestsAux();
                }, function onError() {
                    console.log("_chainRequests - Ajax Error: " + url);
                }, function onFinished() {

                });
            }

            var iterator = createArrayIterator(urls);
            chainRequestsAux();
        }
    };
})();
HD_.Debug = (function() {

    var _localhostName = 'localhost';
    var _fileProtocolName = 'file:';

    return {
        isLocalHost : function() {
            return location.hostname === _localhostName;
        },

        isFileProtocol : function() {
            return location.protocol === _fileProtocolName;
        },

        // Affiche un avertissement clignotant si on travaille en local
        // c'est-à-dire si l'hote est 'localhost' ou si le protocole est 'file:'
        persistentLocalWarnings : function() {

            function createWarning(name) {

                function buildSpan(warningName, blink) {
                    var warningSpan = document.createElement('span');
                    warningSpan.style.backgroundColor = 'red';
                    warningSpan.style.marginLeft = '10px';
                    warningSpan.innerHTML = warningName;
                    return warningSpan;
                }

                function blinkWarning() {
                    var warningSpan = warning.span;
                    warningSpan.style.visibility=(warningSpan.style.visibility === 'visible') ? 'hidden' : 'visible';
                }

                var warning = Object.create(null);
                warning.span = buildSpan(name);

                if (true) {
                    setInterval(blinkWarning,500);
                }

                return warning;
            }

            var warnings = [];
            if (this.isLocalHost()) {
                warnings.push(createWarning("localhost"));
            }
            if (this.isFileProtocol()) {
                warnings.push(createWarning("file:"));
            }

            var warningsContainer = document.createElement("div");
            warnings.forEach(function(warning) {
                warningsContainer.appendChild(warning.span);
            });
            document.body.appendChild(warningsContainer);
        }
    };
})();
// http://stackoverflow.com/questions/12718210/how-to-save-file-from-textarea-in-javascript-with-a-name?lq=1
HD_.Download = (function() {

    function _click(node) {
        var ev = document.createEvent("MouseEvents");
        ev.initMouseEvent("click", true, false, self, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
        return node.dispatchEvent(ev);
    }

    function _encode(data) {
            return 'data:application/octet-stream;base64,' + utf8_to_b64( data );
    }

    function _link(data, name){
        var a = document.createElement('a');
        a.download = name || self.location.pathname.slice(self.location.pathname.lastIndexOf('/')+1);
        a.href = data || self.location.href;
        return a;
    }

    // https://developer.mozilla.org/en-US/docs/Web/API/WindowBase64/btoa
    function utf8_to_b64(str) {
        return window.btoa(unescape(encodeURIComponent(str)));
    }
    // function b64_to_utf8(str) {
    //     return decodeURIComponent(escape(window.atob(str)));
    // }

    return {

        save : function(data, name) {
            _click(
                _link(
                    _encode( data ),
                    name
                )
            );
        }
    };
})();
HD_.HorizontalPanel = (function() {

    return {

        create : function(elements, name) {
            var hPanel = HD_._PanelComposite.create(elements, name, "hPanel");

            hPanel.buildPanelEmptyTable = function() {
                return HD_._DomTk.buildEmptyTable(1, this.getNumberOfElements());
            };

            hPanel.setPanelTableCell = function(index, domNode) {
                HD_._DomTk.setDomTableCell(this._panelContainer,0 , index, domNode);
            };

            return hPanel;
        }
    };

})();
HD_.PanelField = (function() {

    var index = 0;

    function _findHtmlInputValue(node) {
        return node.value;
    }

    var _types = {
        list : {
            findDomValue : function() {
                return this.domNode.options[this.domNode.selectedIndex].value;
            },
            buildDomElement : function() {
                var select = document.createElement("select");
                var option = null;
                this.getValues().forEach(function(value) {
                    option = document.createElement("option");
                    option.setAttribute("value", value.value);
                    option.innerHTML = value.label;
                    select.appendChild(option);
                });
                return select;
            }
        },

        number : {
            buildDomElement : function() {
                return HD_._DomTk.buildTextInput(5, null);
            },
            findDomValue : function() {
                return parseInt(_findHtmlInputValue(this.domNode), 10);
            }
        },

        fileSelector : {
            buildDomElement : function() {
                var fileInput = HD_._DomTk.buildDomInput("file");
                return fileInput;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this.domNode);
            },
            //Retrieve the first (and only!) File from the FileList object
            change : function(evt, field) {
                var f = evt.target.files[0];
                if (f) {
                    field.postChangeValue = f;
                }
                else {
                    alert("Failed to load file");
                }
            },
            //http://www.htmlgoodies.com/beyond/javascript/read-text-files-using-the-javascript-filereader.html#fbid=uTCcfskrObx
            readFileAsText : function(onFileRead) {
                var r = new FileReader();
                r.onload = function(e) {
                    var contents = e.target.result;
                    onFileRead(contents);
                };
                r.readAsText(this.postChangeValue);
            }
        },

        button : {
            buildDomElement : function() {
                var button = HD_._DomTk.buildButtonWithClickHandler(this.innerLabel, this.handler);
                return button;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this.domNode);
            }
        },

        text : {
            buildDomElement : function() {
                var textArea = HD_._DomTk.createDomElement("textarea");
                textArea.setAttribute("rows", this.height);
                textArea.setAttribute("cols", this.width);
                return textArea;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this.domNode);
            },
            setFieldContent : function(content) {
                this.domNode.value = content;
            }
        },

        string : {
            buildDomElement : function() {
                var stringInput = HD_._DomTk.buildTextInput(this.width, this.initValue);
                return stringInput;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this.domNode);
            },
            setFieldContent : function(content) {
                this.domNode.value = content;
            }
        }
    };

    return {
        /*
        data === {
            name : string,
            type : string,
            values : array,
            eventListeners : array,
            label: string,
            innerLabel: string,
            noLabel : boolean
        }
        */
        create : function(data) {
            var field = Object.create(_types[data.type]);
            HD_._PanelLeaf.init(field, data.name, "fPanel");
            field.name = data.name;
            field.type = data.type;
            field.values = data.values;
            field.eventListeners = data.eventListeners;
            field.noLabel = data.noLabel;
            field.label = data.label;
            field.innerLabel = data.innerLabel;
            field.box = data.box;
            field.handler = data.handler;
            field.height = data.height;
            field.width = data.width;
            field.initValue = data.initValue;

            field.getValues = function() {
                return this.values;
            };

            // Nécessite getValues()
            field.domNode = field.buildDomElement();

            if (data.initValue) {
                field.setFieldContent(data.initValue);
            }

            // Nécessite buildDomElement()
            if (data.eventListeners) {
                data.eventListeners.forEach(function(eventListener) {
                    var listener = _types[data.type][eventListener.name];
                    if (listener) {
                        field.domNode.addEventListener(eventListener.name, function(evt) {
                            listener(evt, field);
                            eventListener.handler(evt);
                        },
                        false);
                    }
                });
            }

            field.getName = function() {
                return this.name;
            };

            field.getType = function() {
                return this.type;
            };

            field.buildDomNode = function() {
                this._panelContainer = this.domNode;
                return this._panelContainer;
            };

            field.getPostChangeValue = function() {
                return this.postChangeValue;
            };

            field.getLabel = function() {
                return "label" + index++;
            };

            field.hasLabel = function() {
                return (typeof this.noLabel === "undefined") || (! this.noLabel);
            };

            field.getBoxName = function() {
                return this.box;
            };

            return field;
        },

        findDomValue : function(type, node) {
            return _types[type].getNodeValue(node);
        },

        buildDomElement : function(field) {
            return _types[type].buildDomElement(type);
        }
    };

})();
HD_.VerticalPanel = (function() {

    return {

        create : function(elements, name) {
            var vPanel = HD_._PanelComposite.create(elements, name, "vPanel");

            vPanel.buildPanelEmptyTable = function() {
                return HD_._DomTk.buildEmptyTable(this.getNumberOfElements(), 1);
            };

            vPanel.setPanelTableCell = function(index, domNode) {
                HD_._DomTk.setDomTableCell(this._panelContainer,index, 0, domNode);
            };

            return vPanel;
        }
    };

})();
HD_._DomTk = (function() {

    return {
        appendClassName : function( domNode, className ) {
            domNode.className = domNode.className + " " + className;
        },

        buildDomInput : function(type) {
            var input = document.createElement("input");
            input.setAttribute("type", type);
            return input;
        },

        buildTextInput : function(size, data) {
            var input = this.buildDomInput("text");
            input.setAttribute("size", size);
            if (data) {
                input.value = data;
            }
            return input;
        },

        buildButtonWithClickHandler : function(label, handler) {
            var button = document.createElement("button");
            if (handler) {
                button.addEventListener("click", handler, false);
            }
            button.innerHTML = label;
            return button;
        },

        createDomElement : function(tagName) {
            return document.createElement(tagName);
        },

        appendDomElement : function(parent, child) {
            parent.appendChild(child);
        },

        // Tableaux

        buildEmptyTable : function(rows, columns) {
            var body = this.createDomElement("tbody");
            for (var r = 0; r < rows; r++) {
                var tr = this.createDomElement("tr");
                for (var c = 0; c < columns; c++) {
                    var td = this.createDomElement("td");
                    this.appendDomElement(tr, td);
                }
                this.appendDomElement(body, tr);
            }
            var table = this.createDomElement("table");
            this.appendDomElement(table, body);
            return table;
        },

        setDomTableCell : function(table, row, column, domNode) {
            var tableChildren = table.children; // [body]
            var tableBody = tableChildren[0];
            var bodyChildren = tableBody.children; // [tr, tr, ...]
            var tableRow = bodyChildren[row];
            var rowChildren = tableRow.children; // [td, td, ...]
            var tableCell = rowChildren[column];
            this.appendDomElement(tableCell, domNode);
        }

    };

})();
HD_._Panel = (function() {

    var _generatedName = 0;

    function _findParentDomNode(panel) {
        return panel._panelContainer.parentElement;
    }

    return {

        init : function(panel, name, className) {
            panel._panelContainer = null;
            panel._name = name ? name : "";
            panel._className = className;
            panel._parent = null;

            panel.setPanelParent = function(panelParent) {
                this._parent = panelParent;
            };

            panel.getPanelParent = function() {
                return this._parent;
            };

            // Retourne le panneau racine de l'arbre auquel appartient ce panneau.
            // NB. fonction récursive
            panel.findRootPanel = function() {
                if (this.getPanelParent() === null) {
                    return this;
                }
                else {
                    return this.getPanelParent().findRootPanel();
                }
            };

            panel.buildDomNode = function() {
                alert("HD_._Panel -  " + this._className + " has no buildDomNode() method.");
            };

            panel.refreshPanel = function() {
                var parent = _findParentDomNode(this);
                parent.removeChild(this._panelContainer);
                this._panelContainer = this.buildDomNode();
                parent.appendChild(this._panelContainer);
            };

            panel.getName = function() {
                return this._name;
            };

            panel.show = function() {
                this._panelContainer.style.display = "block";
            };

            panel.hide = function() {
                this._panelContainer.style.display = "none";
            };

            panel.removePanel = function() {
                var parent = _findParentDomNode(this);
                parent.removeChild(this._panelContainer);
            };

            // Retourne le panneau vérifiant le prédicat passé en argument.
            // NB. fonction récursive
            panel.findPanel = function(predicat) {
                if (predicat(this)) {
                    return this;
                }
                else if (this._panelElements) { // c'est un sous-arbre
                    for (var i = 0; i < this._panelElements.length; i++) {
                        var element = this._panelElements[i];
                        var res = element.findPanel(predicat);
                        if (res) {
                            return res;
                        }
                    }
                }
            };
            
            panel.findPanelByName = function(name) {
                return this.findPanel(function(elt) {
                    return name === elt.getName();
                });
            };

            return panel;
        }
    };

})();
HD_._PanelComposite = (function() {

    return {

        create : function(elements, name, className) {
            var panelComposite = Object.create(null);
            HD_._Panel.init(panelComposite, name, className);
            panelComposite._panelElements = [];
                        
            panelComposite.addPanelElement = function(panelElt) {
                panelElt.setPanelParent(this);
                this._panelElements.push(panelElt);
            };

            // Nécessite addPanelElement
            if (elements) {
                elements.forEach(function(elt) {
                    panelComposite.addPanelElement(elt);
                });
            }

            panelComposite.eachPanelElement = function(fun) {
                this._panelElements.forEach(function(panelElt) {
                    fun(panelElt);
                });
            };

            panelComposite.getChildPanel = function(i) {
                return this._panelElements[i];
            };

            panelComposite.clearPanelElements = function() {
                this._panelElements = [];
            };

            panelComposite.buildDomNode = function() {
                var that = this;
                that._panelContainer = that.buildPanelEmptyTable();
                that._panelContainer.setAttribute("name", that._name);
                HD_._DomTk.appendClassName(that._panelContainer, that._className);
                that._panelElements.forEach(function(panelElement, index) {
                    var domNode = panelElement.buildDomNode();
                    domNode.setAttribute("parentPanel", that._name);
                    domNode.setAttribute("index", index);
                    that.setPanelTableCell(index, domNode);
                });
                return that._panelContainer;
            };

            panelComposite.getNumberOfElements = function() {
                return this._panelElements.length;
            };

            panelComposite.buildPanelEmptyTable = function() {
                alert("HD_._PanelComposite - Panel " + this._className + "has no buildPanelEmptyTable() method.");
            };

            panelComposite.setPanelTableCell = function(index, domNode) {
                alert("HD_._PanelComposite - Panel " + this._className + "has no setPanelTableCell() method.");
            };

            return panelComposite;
        }
    };

})();
HD_._PanelLeaf = (function() {

    return {

        init : function(panelLeaf, name, className) {
            HD_._Panel.init(panelLeaf, name, className);
            return panelLeaf;
        }
    };

})();
