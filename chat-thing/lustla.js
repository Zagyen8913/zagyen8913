

var lustla = {};

(function(){
function lst(input) {
    
    lustla.run(input);
    
}

function safeRun(input) {
    
    lustla.req.run(input);
    
}

lustla.onconsole = function(){};

window.addEventListener("error", function(e){
    
    safeRun("logB64: "+btoa(e.message));
    
});

var kk = [];
window.addEventListener("keydown", function(event) {
    var k = String(event.key).toLowerCase();
    if(!kk.includes(k)) {
        if(k == " ") {
            var nk = "space";
            kk.push(nk);
        }
        kk.push(k);
        lustla.setVar("#lastKeyPressed", k);
    }
    if(!kk.includes("any")) {
        kk.push("any");
    }
    
});

window.addEventListener("keyup", function(event) {
    var k = String(event.key).toLowerCase();
    if(kk.includes(k)) {
        if(k == " ") {
            var nk = "space";
            kk.splice(kk.indexOf(nk), 1);
        }
        kk.splice(kk.indexOf(k), 1);
    }
    if(kk.length == 1 && kk[0] == "any") {
        kk.splice(kk.indexOf("any"), 1);
    }
});

lustla.allowConsoleClear = true;

lustla.functions = {

"log":function(data){
    console.log(data);
    lustla.onconsole({type: "out", text:data});
    if(document.querySelector("#lustlaOutput") !== null) {
        
        document.querySelector("#lustlaOutput").innerText+=data+"\n";
        
    }
    lustla.setVar("#lastLog", data);
},

"clearConsole":
function(data){
    lustla.onconsole({type: "clear"});
    if(lustla.allowConsoleClear === true) {
        console.clear();
        if(document.querySelector("#lustlaOutput") !== null) {
            
            document.querySelector("#lustlaOutput").innerText="";
            
        }
    }
}, 

"logB64":
function(data){
    data = window.atob(data);
    lustla.functions.log(data);
}, 

"execute":
function(data){
    safeRun(data);
}, 

"error":
function(data){
    
    var newdata = ("Uncaught "+data.substr(0,data.indexOf(' '))+": "+data.substr(data.indexOf(' ')+1));
    console.error(newdata);
    lustla.onconsole({type: "out", text:newdata});
    if(document.querySelector("#lustlaOutput") !== null) {
        
        document.querySelector("#lustlaOutput").innerText+=newdata+"\n";
        
    }
    
},

"warn":
function(data){
    
    var newdata = ("Warning: "+data);
    console.warn(newdata);
    lustla.onconsole({type: "out", text:newdata});
    if(document.querySelector("#lustlaOutput") !== null) {
        
        document.querySelector("#lustlaOutput").innerText+=newdata+"\n";
        
    }
    
},

"setVar":
function(data) {
    if(data.startsWith("$")) {
        lustla.setVar(data.substr(0,data.indexOf(' ')), data.substr(data.indexOf(' ')+1));
    } else {
        
        safeRun("error: SyntaxError Unexpected text in variable definition. Make sure you are using dollar signs ($) before your variable names.");
        
    }
},

"getVar":
function(data) {
    
    safeRun("logB64: "+btoa("Variable \""+data+"\": "+lustla.getVar(data)));
    lustla.setVar("#output", lustla.getVar(data));
    
},

"b64encode":
function(data) {
    try {
        lustla.setVar("#output", btoa(data));
    } catch(err) {
        safeRun("error:TypeError String to be encoded contains bad characters.");
    }
},

"b64decode":
function(data) {
    try {
        lustla.setVar("#output", atob(data));
    } catch(err) {
        safeRun("error:TypeError String to be decoded is not correctly encoded.");
    }
},

"random":
function(data) {
    
    if(data.includes(" ")) {
        var dat = data.split(" ");
        lustla.setVar("#output", lustla.req.random(Number(dat[0]), Number(dat[1])));
    } else {
        safeRun("error:SyntaxError Not enough values passed to random.");
    }
    
},
"requireComponent":
function(data) {
    if(data in lustla.comps) {
        lustla.usedComps.push(data);
    } else {
        safeRun("error:ReferenceError Use of unknown component \""+data+"\".");
    }
},
"comp":
function(data) {
    
    var inpName = data.splitAtFirst(":")[0];
    var inpValue = data.splitAtFirst(":")[1];
    
    if(lustla.usedComps.includes(inpName) && inpName in lustla.comps) {
        
        lustla.comps[inpName](inpValue);
        
    } else if(!(inpName in lustla.comps)) {
        
        safeRun("error:ReferenceError Use of unknown component \""+inpName+"\".");
        
    } else if(!lustla.usedComps.includes(inpName)) {
        
        safeRun("error:ReferenceError Component \""+inpName+"\" was not one of the required components. Use \"requireComponent\" to use components.");
        
    }
    
},


"round":
function(data) {
    var inpNum = Number(data);
    if(!isNaN(inpNum)) {
        lustla.setVar("#output", math.round(inpNum));
    } else {
        safeRun("error:TypeError Invalid number passed to \"round\".");
    }
    
},
"isset":
function(data) {
    if(data in lustla.variables) {
        
        lustla.setVar("#output", 1);
        
    } else {
        
        lustla.setVar("#output", 0);
        
    }
},

"length":function(data){
    
    lustla.setVar("#output", data.length);
    
},

"substr":function(data){
    
    da1 = data.split(":")[0];
    da2 = data.splitAtFirst(":")[1];
    
    d = da1.split(" ");
    
    lustla.setVar("#output", da2.substr(...d));
    
},

"substring":function(data){
    
    da1 = data.split(":")[0];
    da2 = data.splitAtFirst(":")[1];
    
    d = da1.split(" ");
    
    lustla.setVar("#output", da2.substring(...d));
    
},

"slice":function(data){
    
    da1 = data.split(":")[0];
    da2 = data.splitAtFirst(":")[1];
    
    d = da1.split(" ");
    
    lustla.setVar("#output", da2.slice(...d));
    
},

"":function(){},

"testing aaa":
function(data) {
    
    if(typeof line !== undefined && typeof script !== undefined) {
        
        safeRun("log:working. "+line+" of "+(script.toString()));
        
    }
    
},
"LSTVG":
function() {
    
    lustla.req.functionCache = lustla.lstvg;
    
}
};

lustla.lstvg_accepted_cmds = ["a",
"animate",
"animateMotion",
"animateTransform",
"circle",
"clipPath",
"color-profile",
"defs",
"ellipse",
"feBlend",
"feColorMatrix",
"feComponentTransfer",
"feComposite",
"feConvolveMatrix",
"feDiffuseLighting",
"feDisplacementMap",
"feDistantLight",
"feDropShadow",
"feFlood",
"feFuncA",
"feFuncB",
"feFuncG",
"feFuncR",
"feGaussianBlur",
"feImage",
"feMerge",
"feMergeNode",
"feMorphology",
"feOffset",
"fePointLight",
"feSpecularLighting",
"feSpotLight",
"feTile",
"feTurbulence",
"filter",
"g",
"hatch",
"hatchpath",
"line",
"linearGradient",
"marker",
"mask",
"mesh",
"meshgradient",
"meshpatch",
"meshrow",
"metadata",
"mpath",
"path",
"pattern",
"polygon",
"polyline",
"radialGradient",
"rect",
"set",
"solidcolor",
"stop",
"style",
"switch",
"symbol",
"text",
"textPath",
"title",
"tspan",
"unknown",
"use",
"view"];
lustla.lstvg = {};

lustla.lstvg_data = "<svg>";
lustla.lstvg.LSTVG_END = function() {
    
    lustla.lstvg_data = lustla.lstvg_data+"</svg>";
    lustla.req.functionCache = lustla.functions;
    /*el = document.createElement("div");
    el.innerHTML = lustla.lstvg_data;
    el = el.querySelector("svg");*/
    lustla.setVar("#output", "data:image/svg+xml;base64,"+btoa(lustla.lstvg_data.replace(/\n/g, "")));
    
};
lustla.lstvg.attr = function(data) {
    
    var dat = [];
    dat[0] = data.splitAtFirst(" ")[0].replace(/\W/g, "");
    dat[1] = data.splitAtFirst(" ")[1].replace(/\"/g, "");
    
    var da = [];
    da[0] = lustla.lstvg_data.lastIndexOf("/>");
    da[1] = lustla.lstvg_data.lastIndexOf(">") - 1;
    
    if(da[1] > da[0]) {
        
        da[0] = da[1]+1;
        
    }
    da = da[0];
    
    var fin_da = " "+dat[0]+"=\""+dat[1]+"\"";
    lustla.lstvg_data = lustla.lstvg_data.slice(0, da)+fin_da+lustla.lstvg_data.slice(da);
    
};

lustla.lstvg_accepted_cmds.forEach(function(itm, indx){
    
    lustla.lstvg[itm] = function(data, fname){
        if(data === "start") {
            lustla.lstvg_data+="<"+fname+">\n";
        } else if(data === "end") {
            lustla.lstvg_data+="</"+fname+">\n";
        } else {
            lustla.lstvg_data+="<"+fname+"/>\n";
        }
    };
    
});

lustla.variables = {};
lustla.defaultVariables = {};

lustla.usedComps = [];
lustla.comps = {};
lustla.renderInterval = 100;

lustla.addComp = function(name, value) {
    
    lustla.comps[name] = value;
    
};

lustla.info = function(){console.log("Lustla ver 0.1")};
lustla.run = async function(script, attrs){
    
    return new Promise(function(endScript){
    if(attrs !== "doNotResetVars") {
        
        lustla.usedComps = [];
        lustla.variables = lustla.defaultVariables;
        lustla.req.functionCache = lustla.functions;
        lustla.lstvg_data = "<svg>";
        
    }
    
    scriptSplitter = /[\n;]/g;
    
    script=script.split(scriptSplitter);
    for(i=0;i<script.length;i++) {
        
        script[i] = script[i].replace(/\\n/g, "\n")
        script[i] = script[i].replace(/\\s/g, ";")
        
    }
    script = script.filter(function (el) {
        return el !== "";
    });
    
    (function(){
        var helper = 0;
        var line = 0;
        function noodle(){
            waitTime = 0;
            itm = script[line]+"";
            mths = itm.split("(");
            mths.shift();
            mths.forEach(function(item, index) {
                
                mthname = item.split(")")[0];
                mthreg = /[+\-*\/^]/g;
                if(mthname.split(mthreg).length > 1) {
                    evaluated = mthname;
                    mth1 = evaluated.split(mthreg)[0];
                    mth2 = evaluated.split(mthreg)[1];
                    
                    
                    
                    if(mth1 in lustla.variables && isNaN(Number(mth1))) {
                        
                        mth1 = lustla.getVar(mth1);
                        
                    }
                    if(mth2 in lustla.variables && isNaN(Number(mth2))) {
                        
                        mth2 = lustla.getVar(mth2);
                        
                    }
                    
                    omth1 = mth1;
                    omth2 = mth2;
                    mth1 = Number(mth1);
                    mth2 = Number(mth2);
                    
                    if(isNaN(mth1) || isNaN(mth2)) {
                        
                        safeRun("error:TypeError Invalid number in math function. Math error in "+omth1+" or "+omth2);
                        
                    } else {
                    
                        if(mthname.includes("+")) {
                            evaluated = mth1+mth2;
                        }
                        if(mthname.includes("-")) {
                            evaluated = mth1-mth2;
                        }
                        if(mthname.includes("*")) {
                            evaluated = mth1*mth2;
                        }
                        if(mthname.includes("/")) {
                            evaluated = mth1/mth2;
                        }
                        if(mthname.includes("^")) {
                            evaluated = mth1**mth2;
                        }
                        itm=itm.replace("("+mthname+")", evaluated);
                    }
                } else {
                    
                    /*varname = item.substr(0,item.indexOf(')'));
                    
                    
                    itm1=lustla.getVar(varname).split(scriptSplitter);
                    itm2=itm.splitAtFirst("("+varname+")");
                    
                    itm = [];
                    
                    if(itm2.length == 2) {
                        itm[0] = itm2[0];
                        for(j=0;j<itm1.length;j++) {
                            if(typeof itm[j] !== "string"){
                                itm[j] = "";
                            }
                            itm[j] += itm1;
                        }
                        itm[itm.length] = itm2[1];
                        window.debugMe = itm;
                        script[i] = itm;
                        script = script.flat(Infinity);
                    }
                    itm = script[i];
                    
                    console.log(script);
                    console.log(itm)
                    */
                    
                    varname = item.split(")")[0];
                    
                    
                    itm=itm.replace("("+varname+")", lustla.getVar(varname));
                    
                }
            });
            
            if(script[line] !== undefined) {
            if(itm === "-end-") {
                
                safeRun("log:The \"-end-\" function is deprecated. Use \"end\" instead.");
                line = script.length;
                
            } else if(itm === "end") {
                
                line = script.length;
                
            } else if(itm.startsWith("goto ")) {
                
                line = script.indexOf("start "+itm.split("goto ")[1]);
                
            } else if(itm.startsWith("if ")) {
                correctTypes = ["!=", "=", ">", "<"];
                
                dat = itm.split("if ")[1];
                
                type = dat.match(/(!=)|(=)|(>)|(<)/g)
                
                if(type !== null && type.length === 1) {
                    type = type[0];
                    
                    numify = "String";
                    
                    if(type == ">" || type == "<") {
                        
                        numify = "Number";
                        
                    }
                    
                    dat1 = dat.split(type)[0];
                    dat2 = dat.split(type)[1];
                    
                    type = type.replace("=", "==");
                    
                    dat3 = "err";
                    if(dat2.includes(" goto ")) {
                        
                        dat2 = dat2.split(" goto ")[0];
                        dat3 =  dat.split(" goto ")[1];
                        
                        eval("out = ("+numify+"(dat1)"+type+numify+"(dat2));");
                        if(out === "true" || out === true) {
                            line = script.indexOf("start "+dat3);
                        }
                    }
                } else {
                    type = parseInt(dat);
                    data = dat;
                    
                    if(type === 1) {
                        
                        
                        data_out = data.substr(data.indexOf(String(type))+1);
                        
                        dat3 = "err";
                        if(data_out.includes(" goto ")) {
                            
                            dat3 = data_out.split(" goto ")[1];
                            
                            line = script.indexOf("start "+dat3);
                            
                        }
                        
                    } else if(type !== 0) {
                        
                        safeRun("error:TypeError Unknown or non-boolean value passed to if statement.");
                        
                    }
                    
                }
                
                
            } else if(itm.startsWith("start ")) {
                
                safeRun("warn: A \"start\" command was placed before \"end\". This will cause your sections to run when not called.");
                
            } else if(itm.startsWith("wait ")) {
                
                nm = Number(itm.split("wait ")[1])
                if(!isNaN(nm)) {
                    waitTime = nm;
                } else {
                    safeRun("error:TypeError Invalid number used with the wait command.")
                }
                
            } else {
                
                var a = lustla.req.run(itm, script);
                if(typeof a == "number") {
                    line = a;
                }
                
                
            }
            line++;
            helper++;
            
            if(line<script.length) {
                
                //nn = 
                /*requestAnimationFrame(()=>{*/
                if(waitTime!==0||(helper%lustla.renderInterval==0&&lustla.renderInterval!==-1)){
                    
                    setTimeout(noodle, waitTime);
                    
                } else {
                    
                    noodle();
                    
                }/*})*/;
                //clearTimeout(nn);
                
                
            } else {
                
                endScript();
                
            }
            
            } else {
                
                console.log("???");
                endScript();
                
            }
        }
        noodle();
    })();
    })
};



lustla.req = {};
lustla.req.functionCache = lustla.functions;

String.prototype.splitAtFirst = function(splitter = "") {
    if(this.includes(splitter))
        return [this.substr(0,this.indexOf(splitter)), this.substr(this.indexOf(splitter)+splitter.length)];
    else
        return [this];
    
    // Thanks for the help, StackOverflow!
    
}

lustla.setVar = function(name, value) {
    
    lustla.variables[name] = value;
    
};

lustla.getVar = function(varname) {
    
    out = "undefined"
    
    if(varname.startsWith("%")) {
        
        tv = varname.split("%")[1];
        if(kk.includes(tv)) {
            
            out = 1;
            
        } else {
            
            out = 0;
            
        }
        
        
    } else {
        
        out1 = lustla.variables[varname];
        if(out1 !== undefined) {
            out = out1;
        } else {
            
            safeRun("error:ReferenceError Undefined variable.")
            
        }
    }
    
    return out;
    
}


lustla.req.setDefaultVar = function(name, value) {
    
    lustla.defaultVariables[name] = value;
    
};

lustla.req.setDefaultVar("#commands", Object.keys(lustla.req.functionCache).join(", "));

lustla.req.run = function(script, context){
    
    //return (function(){
        
        var inputScript = script.splitAtFirst(":");
        if(typeof inputScript[1] === "undefined") {
            
            inputScript[1] = "";
            
        }
        
        inputScript[0] = inputScript[0].replace(/^\s+/g, '');
        inputScript[1] = inputScript[1].replace(/^\s+/g, '');
        
        if(inputScript[0] !== "") { 
            /*for(i=2;i<inputScript.length;i++) {
                
                inputScript[1]+=":"+inputScript[i];
                
            }*/
            
            if(inputScript[0] in lustla.req.functionCache) {
                
                var inp = inputScript[1]
                var cmdn = inputScript[0]
                
                var cmd = lustla.req.functionCache[cmdn];
                
                
                if(typeof cmd === "function") {
                    lustla.setVar("#lastCommand", script);
                    return cmd(inputScript[1], inputScript[0], context);
                } else if(typeof cmd === "string") {
                    
                    return lustla.req.run(cmdn+":"+inp)
                    
                }
            } else {
                
                safeRun("error: SyntaxError Function \""+inputScript[0]+"\" is undefined.");
                
            }
        }
    //})();
};
lustla.req.fts = function(func){
    func = func.toString();
    func = func.substr(func.indexOf('{')+1,func.length).substr(0,func.substr(func.indexOf('{')+1,func.length).lastIndexOf('}'))
    return func;
};
lustla.req.random = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}
})()
