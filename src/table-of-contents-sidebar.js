var TableOfContents  = {
    params: undefined,
    fixedHeight: 0,
    isOverflow: false,
    init: function(params){
        this.params = params;
        if(TableOfContents.isMobile()){
            return;
        }
        var nodes = this.extractNodes();
        if (!nodes.nodes ||  nodes.nodes.length ==0 || (nodes.nodes.length == 1 && !nodes.nodes[0].nodes)) {
            return;
        }
        this.injectCss();
        var fixedSidebarNode = this.createFixedSidebarNode();
        var fixedMenuNode = this.createFixedMenuNode();
        fixedSidebarNode.appendChild(this.createOptionsNode());
        var ul = document.createElement("ul");
        ul.id = "table-of-contents-sidebar-list-container-id";
        this.parseNodes(ul,nodes,0);
        fixedSidebarNode.appendChild(ul);
        fixedSidebarNode.appendChild(this.createCopyrightNode());
        var doc = document.createElement("div");
        doc.id = "table-of-contents-sidebar-fixed-sidebar-tooltip";
        fixedSidebarNode.appendChild(doc);
        document.body.appendChild(fixedSidebarNode);
        document.body.appendChild(fixedMenuNode);
        TableOfContentsTooltip.tooltip = document.getElementById('table-of-contents-sidebar-fixed-sidebar-tooltip');
        this.scrollRebuild();
    },
    isMobile: function(){
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth <= 480 ) {
            return true;
        }
        return false;
    },
    scrollRebuild: function() {
        var isScrolling;
        window.addEventListener('scroll', function ( event ) {
            window.clearTimeout( isScrolling );
            isScrolling = setTimeout(function() {
                var height = 0;
                var documents = document.getElementsByTagName('*');
                for (var i = 0, l = documents.length; i < l; i++) {
                    var node = documents[i];
                    if(node.id == "table-of-contents-sidebar-id") continue;
                    var style = window.getComputedStyle(node,null);
                    var position = style.getPropertyValue("position");
                    var top =  style.getPropertyValue("top");
                    if(position == "fixed" && top == "0px" && node.offsetHeight < 200) {
                        height += node.offsetHeight;
                    }
                 }
                 TableOfContents.fixedHeight = height;
                 TableOfContents.rebuild();
            }, 500);
        }, false);
    },
    rebuild: function() {
        var ul = document.getElementById("table-of-contents-sidebar-list-container-id");
        if(!ul) return;
        var nodes = this.extractNodes();
        if (!nodes.nodes ||  nodes.nodes.length ==0 || (nodes.nodes.length == 1 && !nodes.nodes.nodes)) {
            return;
        }
        while (ul.firstChild) {
            ul.removeChild(ul.firstChild);
        }
        this.parseNodes(ul,nodes,0);
    },
    createFixedMenuNode: function(){
        var sidebar = this.fixedSidebarNode();
        var left = null, right = "18px";
        if (sidebar) {
            sidebar.style.left;
            sidebar.style.right;
        }
        var fixedSidebarHoverMenu = document.createElement('img');
        fixedSidebarHoverMenu.id = "table-of-contents-sidebar-hover-menu-id";
        fixedSidebarHoverMenu.src = this.params.basePath + "images/ic_normal.png";
        fixedSidebarHoverMenu.className = "table-of-contents-sidebar-menu";
        fixedSidebarHoverMenu.style.left = left;
        fixedSidebarHoverMenu.style.right = right;
        fixedSidebarHoverMenu.addEventListener('mouseover', TableOfContents.mouseOverEvent);
        fixedSidebarHoverMenu.addEventListener('mouseout', TableOfContents.mouseOutEvent);
        return fixedSidebarHoverMenu;
    },
     fixedSidebarPinBtnNode: function() {
        var element = document.getElementById("table-of-contents-sidebar-pin-id");
        return element;
    },
     fixedSidebarPositionBtnNode: function() {
        var element = document.getElementById("table-of-contents-sidebar-position-id");
        return element;
    },
     fixedSidebarNode: function() {
        var element = document.getElementById("table-of-contents-sidebar-id");
        return element;
    },
     fixedSidebarMenuNode: function() {
        var element = document.getElementById("table-of-contents-sidebar-hover-menu-id");
        return element;
    },
    sidebarMouseOutEvent: function(e) {
        e.stopPropagation();
        var sidebar =  document.getElementById("table-of-contents-sidebar-id");
        sidebar.className = "table-of-contents-sidebar-fixed-sidebar";
    },
    sidebarMouseOverEvent: function(e) {
        e.stopPropagation();
        var sidebar =  document.getElementById("table-of-contents-sidebar-id");
        sidebar.className = "table-of-contents-sidebar-fixed-sidebar show";
    },
    mouseOutEvent: function(e) {
        e.stopPropagation();
        var sidebar =  document.getElementById("table-of-contents-sidebar-id");
        sidebar.className = "table-of-contents-sidebar-fixed-sidebar";
        sidebar.addEventListener('mouseout', TableOfContents.sidebarMouseOutEvent);
        sidebar.addEventListener('mouseover', TableOfContents.sidebarMouseOverEvent);
    },
    mouseOverEvent: function(e) {
        e.stopPropagation();
        var sidebar = document.getElementById("table-of-contents-sidebar-id");
        if (sidebar) {
            sidebar.className = "table-of-contents-sidebar-fixed-sidebar show";
            sidebar.addEventListener('mouseout', TableOfContents.sidebarMouseOutEvent);
            sidebar.addEventListener('mouseover', TableOfContents.sidebarMouseOverEvent);
        }
    },
    createFixedSidebarNode: function(){
        var fixedSidebarNode = document.createElement('div');
        fixedSidebarNode.id = "table-of-contents-sidebar-id";
        fixedSidebarNode.className = "table-of-contents-sidebar-fixed-sidebar";
        return fixedSidebarNode;
    },
    createOptionsNode: function() {
        var optionsContainer = this.createSpanNode("");
        var leftBtn = this.createImageNode(this.params.basePath + "images/right.png", "Right");
        leftBtn.id = "table-of-contents-sidebar-position-id";
        leftBtn.src = this.params.basePath + "images/left.png";
            leftBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                TableOfContents.activeLeft();
            });
        leftBtn.tooltip = this.params.leftTooltip || "Left";
        leftBtn.addEventListener('mouseover', TableOfContentsTooltip.show);
        leftBtn.addEventListener('mouseleave', TableOfContentsTooltip.hide);

        var pinBtn = this.createImageNode(this.params.basePath + "images/unpin.png", "Pin");
        pinBtn.id = "table-of-contents-sidebar-pin-id";
        pinBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                TableOfContents.activePin();
            });
        pinBtn.tooltip = this.params.pinTooltip || "Pin";
        pinBtn.addEventListener('mouseover', TableOfContentsTooltip.show);
        pinBtn.addEventListener('mouseleave', TableOfContentsTooltip.hide);

        var bugBtn = this.createImageNode(this.params.basePath + "images/bug.png", "Report Bugs");
        bugBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            window.open('https://github.com/table-of-contents-sidebar/table-of-contents-sidebar/issues', '_blank');
        });
        bugBtn.tooltip = this.params.bugTooltip || "Report Bug";
        bugBtn.addEventListener('mouseover', TableOfContentsTooltip.show);
        bugBtn.addEventListener('mouseleave', TableOfContentsTooltip.hide);

        var starBtn = this.createImageNode(this.params.basePath + "images/star.png", "Rate Us");
        starBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            window.open('https://chrome.google.com/webstore/detail/table-of-contents-sidebar/ohohkfheangmbedkgechjkmbepeikkej/reviews', '_blank');
        });
        starBtn.tooltip = this.params.rateusTooltip || "Rate Us";
        starBtn.addEventListener('mouseover', TableOfContentsTooltip.show);
        starBtn.addEventListener('mouseleave', TableOfContentsTooltip.hide);

        var installBtn = this.createImageNode(this.params.basePath + "images/chrome.png", "Install Chrome Extension");
        installBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            e.preventDefault();
            chrome.webstore.install("https://chrome.google.com/webstore/detail/ohohkfheangmbedkgechjkmbepeikkej", function() {
            }, function(err) {
                if (err != "User cancelled install") {
                    window.open('https://chrome.google.com/webstore/detail/table-of-contents-sidebar/ohohkfheangmbedkgechjkmbepeikkej/reviews', '_blank');
                } else {
                    console.log(err);
                }
            });
        });
        installBtn.tooltip = this.params.installTooltip || "Install Chrome Extension";
        installBtn.addEventListener('mouseover', TableOfContentsTooltip.show);
        installBtn.addEventListener('mouseleave', TableOfContentsTooltip.hide);

        var integrateBtn = this.createImageNode(this.params.basePath + "images/code.png", "Integrate to your website");
        integrateBtn.addEventListener('click', function (e) {
            e.stopPropagation();
            window.open('https://table-of-contents-sidebar.github.io', '_blank');
        });
        integrateBtn.tooltip = this.params.integrateBtnTooltip || "Integrate to your website";
        integrateBtn.addEventListener('mouseover', TableOfContentsTooltip.show);
        integrateBtn.addEventListener('mouseleave', TableOfContentsTooltip.hide);

        optionsContainer.appendChild(leftBtn);
        optionsContainer.appendChild(pinBtn);
        optionsContainer.appendChild(bugBtn);

        if(!!window.chrome) {
            if(!!window.chrome.extension) {
                optionsContainer.appendChild(starBtn);
            } else {
                var link = document.createElement("link");
                link.href = "https://chrome.google.com/webstore/detail/ohohkfheangmbedkgechjkmbepeikkej";
                link.rel = "chrome-webstore-item";
                var headNode = document.getElementsByTagName("head");
                if (headNode) {
                    headNode[0].appendChild(link);
                } else {
                    document.body.appendChild(link);
                }
                optionsContainer.appendChild(installBtn);
            }
        }
        optionsContainer.appendChild(integrateBtn);
        optionsContainer.appendChild(document.createElement('br'));
        return optionsContainer;
    },
    createCopyrightNode: function () {
        var span = document.createElement('span');
        span.className = "copyright";
        var yiting = document.createElement('a');
        yiting.appendChild(document.createTextNode("Yiting"));
        yiting.href = "https://yiting.myportfolio.com?utm_source=toc";
        yiting.target = "_blank";
        yiting.tooltip = this.params.yitingTooltip || "Yiting's Blog";
        yiting.addEventListener('mouseover', TableOfContentsTooltip.show);
        yiting.addEventListener('mouseleave', TableOfContentsTooltip.hide);
        var majiang = document.createElement('a');
        majiang.appendChild(document.createTextNode("Majiang"));
        majiang.href = "http://www.majiang.life?utm_source=toc";
        majiang.target = "_blank";
        majiang.tooltip = this.params.majiangTooltip || "Majiang's Blog";
        majiang.addEventListener('mouseover', TableOfContentsTooltip.show);
        majiang.addEventListener('mouseleave', TableOfContentsTooltip.hide);
        var copyright = document.createTextNode("Powered by ");
        var and = document.createTextNode(" & ");
        span.appendChild(copyright);
        span.appendChild(yiting);
        span.appendChild(and);
        span.appendChild(majiang);
        return span;
    },
    createImageNode: function (url, title, size) {
        var image = document.createElement('img');
        image.style.marginLeft = "12px";
        image.style.height = !!size ? size : "22px";
        image.style.width = !!size ? size : "22px";
        image.style.cursor = "pointer";
        image.src = url;
        return image;
    },
    injectCss: function(){
        var link = document.createElement("link");
        link.href = this.params.basePath + "table-of-contents-sidebar.css";
        link.type = "text/css";
        link.rel = "stylesheet";
        var headNode = document.getElementsByTagName("head");
        if (headNode) {
            headNode[0].appendChild(link);
        } else {
            document.body.appendChild(link);
        }
    },
    extractNodes: function(){
        var querySelector = this.params.querySelector || "body";
        var documents = document.querySelector(querySelector).querySelectorAll("*")
        var iteratorAbsTop = 0;
        var sidebarCount = 0;
        var matchesNodes = [];
        var root = {nodes: []};
        for (var i = 0, l = documents.length; i < l; i++) {
            var node = documents[i];
            var style = window.getComputedStyle(node,null);
            var position = style.getPropertyValue("position");
            var top =  style.getPropertyValue("top");
            if(position == "fixed" && top == "0px" && node.offsetHeight < 200) {
                TableOfContents.fixedHeight += node.offsetHeight;
            }
            if (!!node && !!node.textContent && !!node.textContent.trim()
                && (node.nodeName == "H1" || node.nodeName == "H2" || node.nodeName == "H3"
                || node.nodeName == "H4" || node.nodeName == "H5" || node.nodeName == "H6")) {
                var absTop = node.getBoundingClientRect().top + document.documentElement.scrollTop;
                if(absTop > document.body.offsetHeight){
                    TableOfContents.isOverflow = true;
                }
                if (!!matchesNodes && matchesNodes.length != 0) {
                    var previous = matchesNodes[matchesNodes.length - 1];
                    if (absTop == previous.absTop) {
                        continue;
                    }
                }
                if (!node.id) {
                    node.id = this.uuid();
                }
                var data = {
                    id: node.id,
                    text: node.textContent,
                    name: node.nodeName,
                    absTop: absTop
                };
                this.addNode(root, data);
                matchesNodes.push(data);
                iteratorAbsTop = absTop;
                sidebarCount++;
            }
        }
        return root;
    },
    addNode: function (root, node) {
        if (!!root && !!root.nodes && root.nodes.length != 0) {
            var lastNode = root.nodes[root.nodes.length - 1];
            if (lastNode.name == node.name) {
                root.nodes.push(node);
            } else if (lastNode.name < node.name) {
                this.addNode(lastNode, node);
            } else {
                root.nodes.push(node);
            }
        } else {
            root.nodes = [node];
        }
    },
    uuid: function () {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    },
    activeLeft: function (sidebar, menu) {
        var positionNode = this.fixedSidebarPositionBtnNode();
        if (positionNode) {
            positionNode.src = this.params.basePath + "images/right.png";
            positionNode.addEventListener('click', function (e) {
                e.stopPropagation();
                TableOfContents.activeRight();
            });
            positionNode.tooltip = this.params.rightTooltip || "Right";
            positionNode.addEventListener('mouseover', TableOfContentsTooltip.show);
            positionNode.addEventListener('mouseleave', TableOfContentsTooltip.hide);
        }
        var sidebar = !!sidebar ? sidebar : this.fixedSidebarNode();
        var menu = !!menu ? menu : this.fixedSidebarMenuNode();
        if (sidebar) {
            sidebar.style.left = "0px";
            sidebar.style.right = null;
        }
        if (menu) {
            menu.style.left = "18px";
            menu.style.right = null;
        }
    },
    activeRight: function (sidebar, menu) {
        var positionNode = this.fixedSidebarPositionBtnNode();
        if (positionNode) {
            positionNode.src = this.params.basePath + "images/left.png";
            positionNode.addEventListener('click', function (e) {
                e.stopPropagation();
                TableOfContents.activeLeft();
            });
            positionNode.tooltip = this.params.leftTooltip || "Left";
            positionNode.addEventListener('mouseover', TableOfContentsTooltip.show);
            positionNode.addEventListener('mouseleave', TableOfContentsTooltip.hide);
        }
        var sidebar = !!sidebar ? sidebar : this.fixedSidebarNode();
        var menu = !!menu ? menu : this.fixedSidebarMenuNode();
        if (sidebar) {
            sidebar.style.right = "0px";
            sidebar.style.left = null;
        }
        if (menu) {
            menu.style.right = "18px";
            menu.style.left = null;
        }
    },
    activePin: function (sidebar, menu) {
        var pinNode = this.fixedSidebarPinBtnNode();
        if (pinNode) {
            pinNode.src = this.params.basePath + "images/pin.png";
            pinNode.addEventListener('click', function (e) {
                e.stopPropagation();
                TableOfContents.activeUnpin();
            });
            pinNode.tooltip = this.params.unpinTooltip || "Unpin";
            pinNode.addEventListener('mouseover', TableOfContentsTooltip.show);
            pinNode.addEventListener('mouseleave', TableOfContentsTooltip.hide);
        }
        var sidebar = !!sidebar ? sidebar : this.fixedSidebarNode();
        var menu = !!menu ? menu : this.fixedSidebarMenuNode();
        if (sidebar) {
            sidebar.removeEventListener('mouseout', TableOfContents.sidebarMouseOutEvent, false);
            sidebar.removeEventListener('mouseover', TableOfContents.sidebarMouseOverEvent, false);
            sidebar.className = "table-of-contents-sidebar-fixed-sidebar show";
        }
        if (menu) {
            menu.removeEventListener('mouseout', TableOfContents.mouseOutEvent, false);
            menu.removeEventListener('mouseover', TableOfContents.mouseOverEvent, false);
        }
    },
    activeUnpin: function (sidebar, menu) {
        var pinNode = this.fixedSidebarPinBtnNode();
        if (pinNode) {
            pinNode.src = this.params.basePath + "images/unpin.png";
            pinNode.addEventListener('click', function (e) {
                e.stopPropagation();
                TableOfContents.activePin();
            });
            pinNode.tooltip = this.params.pinTooltip || "Pin";
            pinNode.addEventListener('mouseover', TableOfContentsTooltip.show);
            pinNode.addEventListener('mouseleave', TableOfContentsTooltip.hide);
        }
        var sidebar = !!sidebar ? sidebar : this.fixedSidebarNode();
        var menu = !!menu ? menu : this.fixedSidebarMenuNode();
        if (sidebar) {
            // sidebar.style.width = '0';
            sidebar.addEventListener('mouseout', TableOfContents.sidebarMouseOutEvent);
            sidebar.addEventListener('mouseover', TableOfContents.sidebarMouseOverEvent);
        }
        if (menu) {
            menu.style.display = "block";
            menu.addEventListener('mouseover', TableOfContents.mouseOverEvent);
            menu.addEventListener('mouseout', TableOfContents.mouseOutEvent);
        }
    },
    createSpanNode: function (text) {
        var span = document.createElement('span');
        var textNode = document.createTextNode(text);
        span.appendChild(textNode);
        return span;
    },
    parseNodes: function (parent,node,index) {
        var scrollEffect = this.params.scrollEffect;
        var showTooltip = this.params.showTooltip;
        if (!!node) {
            if(!!node.text) {
                var li = document.createElement("li");
                var className = "ANCHOR-" + index;
                li.className = className;
                var refNode = document.createElement('a');
                var text = document.createTextNode(node.text);
                refNode.appendChild(text);
                refNode.tooltip = node.text;
                refNode.auto = true;
                refNode.href = "#" + node.id;
                if (showTooltip) {
                    refNode.addEventListener('mouseover', TableOfContentsTooltip.show);
                    refNode.addEventListener('mouseleave', TableOfContentsTooltip.hide);
                }
                refNode.addEventListener('click', function (e) {
                    e.preventDefault();
                    var id = e.srcElement.hash.substr(1);
                    var doc = document.getElementById(decodeURIComponent(id));
                    var top = doc.getBoundingClientRect().top + window.scrollY - TableOfContents.fixedHeight;
                    if(TableOfContents.isOverflow) {
                        window.location.hash = e.srcElement.hash; 
                    } else {
                        window.scroll({
                          top: top,
                          left: 0, 
                          behavior: scrollEffect ? 'smooth' : 'auto'
                        });
                    }
                 });
                 li.appendChild(refNode);
                 parent.appendChild(li);
            }
            index++;
            if (!!node.nodes && node.nodes.length != 0)
                for (var i = 0; i < node.nodes.length; i++) {
                    this.parseNodes(parent, node.nodes[i], index);
                }
        }
    }
};

var TableOfContentsTooltip = {
    tooltip: undefined,
    target: undefined,
    show: function() {
        TableOfContentsTooltip.target = this;
        var tip = TableOfContentsTooltip.target['tooltip'];
        if( !tip || tip == '' ) {            
            return false;
        }
        TableOfContentsTooltip.tooltip.innerText = tip.trim().replace(/\n|\r/g, "");
        var pos_top  = TableOfContentsTooltip.target.offsetTop - TableOfContentsTooltip.tooltip.offsetHeight - 10;
        if (TableOfContentsTooltip.target['auto']) {
            var scrollTop = document.getElementById("table-of-contents-sidebar-list-container-id").scrollTop;
            pos_top  = pos_top - scrollTop;
        }
        var pos_left = 0;
        TableOfContentsTooltip.tooltip.className = '';
        if(TableOfContentsTooltip.tooltip.offsetWidth > 240) {
            TableOfContentsTooltip.tooltip.style.maxWidth = 240 + 'px';
        }

        if(TableOfContentsTooltip.target.offsetWidth > 200) {
            pos_left = 0;
        }else if((TableOfContentsTooltip.target.offsetLeft + ( TableOfContentsTooltip.target.offsetWidth / 2 )) > (TableOfContentsTooltip.tooltip.offsetWidth / 2) && (250 - TableOfContentsTooltip.target.offsetLeft + ( TableOfContentsTooltip.target.offsetWidth / 2 )) > (TableOfContentsTooltip.tooltip.offsetWidth / 2)){
            pos_left = TableOfContentsTooltip.target.offsetLeft + ( TableOfContentsTooltip.target.offsetWidth / 2 ) - ( TableOfContentsTooltip.tooltip.offsetWidth / 2 );
        }
        
        if( pos_top < 0 ) {
            var pos_top  = TableOfContentsTooltip.target.offsetTop + TableOfContentsTooltip.target.offsetHeight - 5;
            if (TableOfContentsTooltip.target['auto']) {
                pos_top  = pos_top - scrollTop;
            }
            TableOfContentsTooltip.tooltip.className += ' top';
        }
        
        TableOfContentsTooltip.tooltip.style.left = pos_left + 'px';
        TableOfContentsTooltip.tooltip.style.top = pos_top + 'px';
        TableOfContentsTooltip.tooltip.className += ' show';
    },
    hide: function() {
        TableOfContentsTooltip.tooltip.className = TableOfContentsTooltip.tooltip.className.replace('show', '');
    }
};