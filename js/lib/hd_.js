// build 20150817_150123
HD_ = (function() {
    return {};
})();
HD_.ArrayCollection = (function() {

    return {

        create : function() {
            var collection = Object.create(null);
            collection._elements = [];

            HD_._Collection.initCollection(collection);

            collection.addElement = function(element) {
                this._elements.push(element);
                return element;
            };

            collection.eachElement = function(fun) {
                this._elements.forEach(function(element) {
                    fun(element);
                });
            };

            return collection;
        }
    };
})();
HD_.MapCollection = (function() {

    return {

        create : function() {
            var collection = Object.create(null);
            collection._elements = {};

            HD_._Collection.initCollection(collection);

            collection.addElement = function(key, element) {
                this._elements[ key ] = element;
            };

            collection.eachElement = function(fun) {
                for (var propName in this._elements) {
                    fun(this._elements[ propName ]);
                }
            };

            return collection;
        }
    };
})();
HD_._Collection = (function() {

    return {

        initCollection : function(collection) {
            collection.getElement =  function(key) {
                return this._elements[ key ];
            };
        }
    };
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

        chainRequests : function(requestType, urls, onEachSuccess, onEachFinished, onEachError, onAllFinished) {

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
                    if (onAllFinished) {
                        onAllFinished();
                    }
                    return;
                }

                var url = iterator.next();
                HD_.Ajax.makeRequest(requestType, url, function onEverySuccess(responseText) {
                    onEachSuccess(url, responseText);

                    chainRequestsAux();
                }, function onEveryError() {
                    console.log("HD_.chainRequests - error on processing request: " + url);
                    if (onEachError) {
                        onEachError();
                    }
                }, function onEveryFinished() {
                    console.log("HD_.chainRequests - finished processing request: " + url);
                    if (onEachFinished) {
                        onEachFinished();
                    }
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
            warningsContainer.innerHTML = "HD_.Debug: ";
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

        create : function(elements, name, style) {
            var hPanel = HD_._StackPanel.create("horizontal", elements, name, style);
            return hPanel;
        }
    };

})();
HD_.PanelField = (function() {

    function _findHtmlInputValue(node) {
        return node.value;
    }

    var _types = {
        list : {
            findDomValue : function() {
                return this._panelDomNode.options[this._panelDomNode.selectedIndex].value;
            },
            buildDomElement : function() {
                var select = document.createElement("select");
                var option = null;
                this.values.forEach(function(value) {
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
                return parseInt(_findHtmlInputValue(this._panelDomNode), 10);
            }
        },

        fileSelector : {
            buildDomElement : function() {
                var fileInput = HD_._DomTk.buildDomInput("file");
                return fileInput;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this._panelDomNode);
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
                return null;
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
                return _findHtmlInputValue(this._panelDomNode);
            },
            setFieldContent : function(content) {
                this._panelDomNode.value = content;
            }
        },

        string : {
            buildDomElement : function() {
                var stringInput = HD_._DomTk.buildTextInput(this.width, this.initValue);
                return stringInput;
            },
            findDomValue : function() {
                return _findHtmlInputValue(this._panelDomNode);
            },
            setFieldContent : function(content) {
                this._panelDomNode.value = content;
            }
        },

        textDisplay : {
            buildDomElement : function() {
                var div = HD_._DomTk.createDomElement("div");
                return div;
            },
            setParentStyle : function() {
                if ( this._style.verticalAlign ) {
                    this.parentContainerStyle['verticalAlign'] = "top";
                }
            },
            findDomValue : function() {
                return "textDisplay: findDomValue todo";
            },
            setFieldContent : function(content) {
                var that = this;
                var paragraph = null;
                content.split("\n").forEach(function(line) {
                    paragraph = HD_._DomTk.createDomElement("p");
                    paragraph.innerHTML = line;
                    that._panelDomNode.appendChild(paragraph);
                });
            }
        },

        image : {
            buildDomElement : function() {
                var img = HD_._DomTk.createDomElement("img");
                return img;
            },
            findDomValue : function() {
                return null;
            },
            setFieldContent : function(content) {
                this._panelDomNode.setAttribute('src', content);
            }
        }
    };

    return {
        create : function(data) {
            var field = Object.create(_types[data.type]);
            HD_._Panel.init(field, data.name, "fieldPanel", data.style);

            field.values = data.values;
            field.eventListeners = data.eventListeners;
            field.innerLabel = data.innerLabel;
            field.handler = data.handler;
            field.height = data.height;
            field.width = data.width;
            field.initValue = data.initValue;
            field.type = data.type;
            field.parentContainerStyle = {};

            if (field.setParentStyle) {
                field.setParentStyle();
            }

            field.buildPanelDomNode = function() {
                var that = this;

                that._panelDomNode = that.buildDomElement();

                if (data.initValue) {
                    that.setFieldContent(that.initValue);
                }

                if (that.eventListeners) {
                    that.eventListeners.forEach(function(eventListener) {
                        var listener = _types[that.type][eventListener.name];
                        if (listener) {
                            that._panelDomNode.addEventListener(eventListener.name, function(evt) {
                                listener(evt, that);
                                eventListener.handler(evt);
                            },
                            false);
                        }
                    });
                }

                
                return that._panelDomNode;
            };

            field.findVerifyingPanel = function(predicat) {
                // Rien de plus à faire que ce qui est fait dans panel.findPanel()
            };

            field.applyPanelTreeStyle = function(domNode) {
                // Rien de plus à faire que ce qui est fait dans panel.findPanel()
            };

            return field;
        }
    };

})();
HD_.VerticalPanel = (function() {

    return {

        create : function(elements, name, style) {
            var vPanel = HD_._StackPanel.create("vertical", elements, name, style);
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

        applyStyle : function(domNode, style) {
            for (var styleName in style) {
                domNode.style[styleName] = style[styleName];
            }
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

        getDomTableCell : function(table, row, column, domNode) {
            var tableChildren = table.children; // [body]
            var tableBody = tableChildren[0];
            var bodyChildren = tableBody.children; // [tr, tr, ...]
            var tableRow = bodyChildren[row];
            var rowChildren = tableRow.children; // [td, td, ...]
            var tableCell = rowChildren[column];
            return tableCell;
        },

        setDomTableCell : function(table, row, column, domNode) {
            var tableCell = this.getDomTableCell(table, row, column);
            this.appendDomElement(tableCell, domNode);
        }

    };

})();
HD_._Panel = (function() {

    var _generatedName = 0;

    // todo: plante sur rafraichissement de la racine (mainPanel)
    function _findParentDomNode(panel) {
        return panel._panelDomNode.parentElement;
    }

    return {

        init : function(panel, name, className, style) {
            panel._panelDomNode = null;
            panel._name = name ? name : "";
            panel._className = className;
            panel._parent = null;
            panel._style = style;

            panel.buildPanelDomNode = function() {
                alert("HD_._Panel -  " + this._className + " has no buildPanelDomNode() method.");
            };

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
                var domNode = this.buildPanelDomNode();
                this.applyPanelStyle(domNode);
                return domNode;
            };

            panel.applyPanelStyle = function(domNode) {
                this.applyPanelTreeStyle(domNode);
                if (this._style) {
                    HD_._DomTk.applyStyle(domNode, this._style);
                }
            };

            panel.refreshPanel = function() {
                var parent = _findParentDomNode(this);
                parent.removeChild(this._panelDomNode);
                this._panelDomNode = this.buildPanelDomNode();
                parent.appendChild(this._panelDomNode);
            };

            panel.getName = function() {
                return this._name;
            };

            panel.show = function() {
                this._panelDomNode.style.display = "block";
            };

            panel.hide = function() {
                this._panelDomNode.style.display = "none";
            };

            panel.removePanel = function() {
                var parent = _findParentDomNode(this);
                parent.removeChild(this._panelDomNode);
            };

            // Retourne le panneau vérifiant le prédicat passé en argument.
            panel.findPanel = function(predicat) {
                if (predicat(this)) {
                    return this;
                }
                return this.findVerifyingPanel(predicat);
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
// Un panneau à une direction horizontale ou verticale
HD_._StackPanel = (function() {

    return {

        create : function(direction, elements, name, style) {
            var stackPanel = Object.create(null);
            HD_._Panel.init(stackPanel, name, direction + 'Panel', style);

            stackPanel._panelElements = [];
            stackPanel._cellsStyle = [];

            if (direction === "horizontal") {
                stackPanel.getNumberOfRows = function(index) {
                    return 1;
                };
                stackPanel.getNumberOfColumns = function(index) {
                    return this.getNumberOfElements();
                };
                stackPanel.getRowIndex = function(index) {
                    return 0;
                };
                stackPanel.getColumnIndex = function(index) {
                    return index;
                };
            }
            else if (direction === "vertical") {
                stackPanel.getNumberOfRows = function(index) {
                    return this.getNumberOfElements();
                };
                stackPanel.getNumberOfColumns = function(index) {
                    return 1;
                };
                stackPanel.getRowIndex = function(index) {
                    return index;
                };
                stackPanel.getColumnIndex = function(index) {
                    return 0;
                };
            }
            else {
                alert("HD_._StackPanel.create: direction '" + direction + "' not defined");
            }
            
            stackPanel.addPanelElement = function(panelElt) {

                function addCellStyle(stackPanel, cellStyle, cellIndex) {
                    if (cellStyle) {
                        stackPanel._cellsStyle.push({
                            cellNumber: cellIndex,
                            style: cellStyle
                        });
                    }
                }

                panelElt.setPanelParent(this);
                addCellStyle(this, panelElt.parentContainerStyle, this._panelElements.length);
                this._panelElements.push(panelElt);
                return panelElt;
            };

            // Nécessite addPanelElement
            if (elements) {
                elements.forEach(function(elt) {
                    stackPanel.addPanelElement(elt);
                });
            }

            stackPanel.applyPanelTreeStyle = function(domNode) {
                var that = this;

                // On ajoute les styles que l'enfant impose à son container dom parent.
                // NB. Pas à son _Panel parent mais à son container dom parent.
                stackPanel._cellsStyle.forEach(function(cellStyleData) {
                    var tableCell = that.getPanelTableCell(cellStyleData.cellNumber);
                    HD_._DomTk.applyStyle(tableCell, cellStyleData.style);
                });
            };

            stackPanel.addAndShow = function(panelElt) {
                this.addPanelElement(panelElt);
                var eltNode = panelElt.buildPanelDomNode();
                this._panelDomNode.appendChild(eltNode);
            };

            stackPanel.eachPanelElement = function(fun) {
                this._panelElements.forEach(function(panelElt) {
                    fun(panelElt);
                });
            };

            stackPanel.getChildPanel = function(i) {
                return this._panelElements[i];
            };

            stackPanel.clearPanelElements = function() {
                this._panelElements = [];
            };

            stackPanel.buildPanelDomNode = function() {
                var that = this;
                that._panelDomNode = that.buildPanelEmptyTable();
                that._panelDomNode.setAttribute("name", that._name);
                HD_._DomTk.appendClassName(that._panelDomNode, that._className);
                that._panelElements.forEach(function(panelElement, index) {
                    var domNode = panelElement.buildDomNode();
                    domNode.setAttribute("parentPanel", that._name);
                    var tableCell = that.getPanelTableCell(index);
                    tableCell.appendChild(domNode);
                });
                return that._panelDomNode;
            };

            stackPanel.getNumberOfElements = function() {
                return this._panelElements.length;
            };

            stackPanel.findVerifyingPanel = function(predicat) {
                for (var i = 0; i < this._panelElements.length; i++) {
                    var element = this._panelElements[i];
                    var res = element.findPanel(predicat);
                    if (res) {
                        return res;
                    }
                }
            };

            stackPanel.buildPanelEmptyTable = function() {
                return HD_._DomTk.buildEmptyTable(this.getNumberOfRows(), this.getNumberOfColumns());
            };

            stackPanel.setPanelTableCell = function(index, domNode) {
                HD_._DomTk.setDomTableCell(this._panelDomNode,this.getRowIndex(index) , this.getColumnIndex(index), domNode);
            };

            stackPanel.getPanelTableCell = function(index) {
                return HD_._DomTk.getDomTableCell(this._panelDomNode,this.getRowIndex(index) , this.getColumnIndex(index));
            };

            return stackPanel;
        }
    };

})();
