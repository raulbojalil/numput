(function($) {
 
 
    var methods = {
        init : function(options) {
            
			var data = {
				opts: $.extend({}, $.fn.numput.defaults, options),
				_isNull: false,
				_isEnabled: true,
				_isCurrency: false,
				$helpTextContainer: $('<div class="ui-numput-helptext"></div>'),
				$inputsContainer: $('<div class="ui-numput-inputs"></div>'),
				integerInputs: [],
				mantisaInputs: [],
				$container: $('<div class="ui-numput"></div>')
				
			}
            
          	this.attr("data-origval", this.val());
            this.css("opacity", "0");
            this.css("position", "absolute");
            this.css("z-index", "-999");



            this.before(data.$container);
            data.$container.append(this);
            
            if(this.attr("data-type") == "currency")
            {
                data._isCurrency = true;
                data.opts.maxDecimals = 2;
                data.opts.prefixCharacter = data.opts.currencySymbol;
            }
            else if(this.attr("data-type") == "percentage")
            {
                data.opts.maxDecimals = 0;
                data.opts.prefixCharacter = data.opts.percentSymbol;
            }
            else if(this.attr("data-type") == "integer")
                data.opts.maxDecimals = 0;
            

            if(this.attr("data-number-max-decimals"))
                data.opts.maxDecimals = parseFloat(this.attr("data-number-max-decimals"));
        
            if(this.attr("data-val-range-min"))
                data.opts.minRange = parseFloat(this.attr("data-val-range-min"));
            
            if(this.attr("data-val-range-max"))
                data.opts.maxRange = parseFloat(this.attr("data-val-range-max"));
           
            this.change(function() {
               
                _setValue.bind(this)(this.val());
                this.val(getValue.bind(this)());
                
            }.bind(this));
            
            this.focus(data, function(e) {
                
                setTimeout(function(){
                    e.data.integerInputs[0].focus();
                }, 100);
                
            }.bind(this));
            
            
            data.$inputsContainer.empty();
             data.integerInputs = [];
             data.mantisaInputs = [];


             //Prefijo
            if(data.opts.prefixCharacter)
                data.$inputsContainer.append('<span class="ui-numput-prefix">' + data.opts.prefixCharacter + '</span>');
            
            //Inputs para la parte entera
            var cl = "ui-numput-hunds";
    
            for(var i=0; i < 9; i++)
            {
                if(i == 3)
                    cl = "ui-numput-thous";
                else if(i == 6)
                    cl = "ui-numput-mills";
                
                data.integerInputs.push($('<input type="text" tabindex="-1" class="ui-numput-integer-input ' + cl + '"/>'));
                
                if(i == 0)
                    data.integerInputs[0].val("0");
                
            }

            for(var i = 9; i >=0; i--)
            {
                
                data.$inputsContainer.append(data.integerInputs[i]);
                
                if(i > 0 && i != 9 && (i % data.opts.groupSize == 0))
                {   
                    data.$inputsContainer.append('<span class="ui-numput-groupseparator">' + (data._isCurrency ? data.opts.currencyGroupSeparator : data.opts.groupSeparator) + "</span>"); 
                    
                }
            }
            
            //Punto decimal
            
            if(data.opts.maxDecimals > 0)
            {
                data.$inputsContainer.append('<span class="ui-numput-decimalseparator">' + (data._isCurrency ? data.opts.currencyDecimalSeparator : data.opts.decimalSeparator) + '</span>');
            }
            
            //Inputs para los decimales

            for(var i=0; i < data.opts.maxDecimals; i++)
            {
                data.mantisaInputs.push($('<input type="text" tabindex="-1" value="0" class="ui-numput-mantisa-input"/>'));
                data.$inputsContainer.append(data.mantisaInputs[i]);
            }
            
            //Eventos

            //Para que al enfocar los inputs de los números enteros se enfoque el primero que es donde el usuario escribe
            //la parte entera
            for(var i=1; i < data.integerInputs.length; i++)
            {
                data.integerInputs[i].focus(data, function(e) {
                 
                    e.data.integerInputs[0].focus();
           
                }.bind(this));
            }
            
            //Input donde se escribe la parte entera
            data.integerInputs[0].keydown(data, function(e) {
               
                for(var i=0; i < e.data.mantisaInputs.length; i++)
                {
                    if(!e.data.mantisaInputs[i].val())
                        e.data.mantisaInputs[i].val("0");
                }


                if(e.which == 8) //backspace
                {
                    _removeChar.bind(this)();
                    return false;
                }
                
               if(e.which == 110 || e.which == 190) //punto
               {
                   if(data.mantisaInputs.length > 0)
                       data.mantisaInputs[0].select();
                   return false;
               }
                
                if(data.integerInputs[data.integerInputs.length-1].val() != "")
                    return false;
                
                var num = -1;
                    if(e.which >= 48 && e.which <= 57)
                        num = e.which - 48; //Números
                    else if(e.which >= 96 && e.which <= 105)
                        num = e.which - 96;  //Números en NumPad
                
                if(num != -1)
                {
                    _addChar.bind(this)(num);
                    return false;
                }
                
                if(!(e.which == 13 || e.which == 9 || e.which == 27 || e.which == 17 || 
                     e.which == 112 || e.which == 113 || e.which == 114 || e.which == 115 || e.which == 116 || 
                     e.which == 117 || e.which == 118 || e.which == 119 || e.which == 120 || e.which == 121 || 
                     e.which == 123 
                )) //Enter || Tab || ESCAPE || CTRL || F1 - F12 (excepto F11)
                    return false;

               
                
            }.bind(this));
            

            //Inputs donde se escribe la mantisa
            for(var i=0; i < data.mantisaInputs.length; i++)
            {

                data.mantisaInputs[i].keydown({ i: i, data: data },function(e) {
                  

                    for(var i=0; i < e.data.data.mantisaInputs.length; i++)
                    {
                        if(!e.data.data.mantisaInputs[i].val())
                            e.data.data.mantisaInputs[i].val("0");
                    }

                    if(!e.data.data.integerInputs[0].val())
                        e.data.data.integerInputs[0].val("0");

                    if(e.which == 8) //backspace
                    {
                        e.data.data.mantisaInputs[e.data.i].val("0");
                        
                       if(e.data.i > 0)
                           e.data.data.mantisaInputs[e.data.i-1].select();
                        else
                           e.data.data.integerInputs[0].focus();
                        this.val(getValue.bind(this)());
                        
                       return false;
                    }
                    
                    
                    var num = -1;
                    if(e.which >= 48 && e.which <= 57)
                        num = e.which - 48; //Números
                    else if(e.which >= 96 && e.which <= 105)
                        num = e.which - 96;  //Números en NumPad
                    
                    if(num != -1)
                    {
                        var beforeVal = getValue.bind(this)();
                        e.data.data.mantisaInputs[e.data.i].val(num);
                        
                        var val = getValue.bind(this)();
                        if(val > e.data.data.opts.maxRange)
                        {
                            this.val(beforeVal); 
                            _setValue.bind(this)(beforeVal);
                        }
                        else
                        {
                            if(e.data.i < e.data.data.mantisaInputs.length-1)
                                e.data.data.mantisaInputs[e.data.i+1].select();
                            else
                                e.data.data.mantisaInputs[e.data.i].select();
                        
                            this.val(getValue.bind(this)());
                        }
                    }
                    
                    if(!(e.which == 13 || e.which == 9 || e.which == 27 || e.which == 17 || 
                     e.which == 112 || e.which == 113 || e.which == 114 || e.which == 115 || e.which == 116 || 
                     e.which == 117 || e.which == 118 || e.which == 119 || e.which == 120 || e.which == 121 || 
                     e.which == 123 
                     )) //Enter || Tab || ESCAPE || CTRL || F1 - F12 (excepto F11)
                    return false;
                    
                }.bind(this));


            }
            
            data.$helpTextContainer.html("Please enter a value between " + _formatNumber(data.opts.minRange, data.opts.maxDecimals) + " and " + _formatNumber(data.opts.maxRange, data.opts.maxDecimals));

            data.$container.append(data.$inputsContainer);
            data.$container.after(data.$helpTextContainer);
            
			this.data("numput", data);
			
            this.change();
 
          
        },
        
        clear: function() {

			var data = this.data("numput");
			
            this.val("");
            for(var i=0; i < data.integerInputs.length; i++)
            {
               data.integerInputs[i].val("");
            }
            
            for(var i=0; i < data.mantisaInputs.length; i++)
            {
               data.mantisaInputs[i].val("");
            }

        },
        
        reset: function() {
            
			
            this.val("");
            methods.refresh.bind(this)();
        },
        
        setHelpTextLabel: function(txt)
        {
			var data = this.data("numput");
        	data.$helpTextContainer.html(txt);
        },
        
        refresh: function () {

            _setValue.bind(this)(this.val());
            this.val(getValue.bind(this)());
        },

        show: function()
        {
			var data = this.data("numput");
            this.parent().show();
            data.$helpTextContainer.show();
        },

        hide: function()
        {
			var data = this.data("numput");
            this.parent().hide();
            data.$helpTextContainer.hide();
        }
    };
   

  
   
    function _formatNumber(n, maxDecimals) {

	
            n = "" + n;
            if(n == "0") return n;

            var integer = null;
            var mantissa = null;

            if(n.indexOf(".") != -1)
            {
                integer = n.substr(0, n.indexOf("."));
                mantissa = n.substr(n.indexOf(".") + 1);

                if(maxDecimals < mantissa.length)
                    mantissa = mantissa.substr(0, maxDecimals);
          
            }
            else integer = n;

            var l = 3;
            var inc = 1;
            while(integer.length >= l+inc)
            {
                integer = integer.substr(0,integer.length -l-(inc-1)) + "," + integer.substr(integer.length -l-(inc-1)); 
                l += 3;
                inc++;
            }

            if(mantissa)
                n = integer + "." + mantissa;
            else n = integer;

            return n;
 
        }
   
    function _addChar(ch)
        {
			
			var data = this.data("numput");
            if(!(data.integerInputs[0].val() == "0" && data.integerInputs[1].val() == ""))
            {
                for(var i=data.integerInputs.length - 2; i >= 0; i-- )
                {
                    data.integerInputs[i+1].val(data.integerInputs[i].val());
                }
            }
            
            data.integerInputs[0].val(ch);
            var val = getValue.bind(this)();
           
            if(val <= data.opts.maxRange)
                this.val(val);
            else
                _removeChar.bind(this)();
            
        }
        
        function _removeChar()
        {
			var data = this.data("numput");
            for(var i=0; i < data.integerInputs.length-1; i++)
            {
                data.integerInputs[i].val(data.integerInputs[i+1].val());
            }
            data.integerInputs[data.integerInputs.length-1].val("");
            
            if(data.integerInputs[0].val() == "")
                data.integerInputs[0].val("0");
            
            this.val(getValue.bind(this)());
        }
        
        function getValue()
        {
			var data = this.data("numput");
            if(data._isNull) return "";

            var val = [];

            for(var i=data.integerInputs.length-1; i >= 0; i--)
            {
                val.push(data.integerInputs[i].val());
            }
            
            if(data.opts.maxDecimals > 0)
                val.push((data._isCurrency ? data.opts.currencyDecimalSeparator : data.opts.decimalSeparator));
            
            for(var i=0; i < data.mantisaInputs.length; i++)
            {
                var m = data.mantisaInputs[i].val();
                if(m) val.push(m);
                else val.push("0");
            }

            //console.log(val.join(""));

            return val.join("");
        }
    
     function _setValue(val)
        {
			var data = this.data("numput");
            if(data._isNull)
            {
                this.val("");
                for(var i=0; i < data.integerInputs.length; i++)
                {
                   data.integerInputs[i].val("");
                }
            
                for(var i=0; i < data.mantisaInputs.length; i++)
                {
                   data.mantisaInputs[i].val("");
                }

                return;
            }

            var val = val + "";
            if(val == "")
                val = "0";

            var integer = "0";
            var mantisa = "0";
            
                       
            if(val != "" && !isNaN(parseFloat(val)))
            {
                var dotPos = val.indexOf(".");
                if(dotPos != -1)
                {
                    integer = val.substr(0, dotPos);
                    mantisa = val.substr(dotPos+1, opts.maxDecimals);
                    
                    
                }
                else
                {
                    
                        integer = val;
                    
                }
                
                if(integer.length > 9)
                    integer = integer.substr(integer.length - 9);
                
                
            }
               
            integer = integer.split("");
            mantisa = mantisa.split("");
        
            if(integer.length < 9)
            {
                for(var i=integer.length; i < 9; i++ )
                {
                    integer.splice(0,0,"0");
                }
            }

                if(mantisa.length < data.opts.maxDecimals)
                {
                    for(var i=mantisa.length; i < data.opts.maxDecimals; i++)
                    {
                        mantisa.push("0");
                    }
                }
            
            
            var leadingZero = true;
            for(var i=0; i < data.integerInputs.length; i++)
            {
                if(integer[i] != "0")
                {
                    data.integerInputs[data.integerInputs.length-1-i].val(integer[i]);
                    leadingZero = false;
                }
                else if(leadingZero) 
                    data.integerInputs[data.integerInputs.length-1-i].val("");
                else 
                    data.integerInputs[data.integerInputs.length-1-i].val("0");            
            }
            
            if(data.integerInputs[0].val() == "")
                data.integerInputs[0].val("0");
            
            for(var i=0; i < data.mantisaInputs.length; i++)
            {
                data.mantisaInputs[i].val(mantisa[i]);
            }

            
                
        } 
   
   
   
     $.fn.numput = function(optionsOrMethodName) {
    	  if (methods[optionsOrMethodName])
            return methods[optionsOrMethodName].apply(this, Array.prototype.slice.call(arguments,1));
        else if (typeof optionsOrMethodName === 'object' || ! optionsOrMethodName)
            return methods.init.apply(this, arguments);
         else 
            $.error('Invalid option name: ' +  optionsOrMethodName);
        
  
        return this;
    };
 
    $.fn.numput.defaults = {
        minRange: 0,
        maxRange: 999999999.99,
        maxDecimals: 2,
        prefixCharacter: "",
        currencySymbol: "$",
        percentSymbol: "%",
        groupSeparator: ",",
        currencyGroupSeparator: ",",
        decimalSeparator: ".",
        currencyDecimalSeparator: ".",
        groupSize: 3
    };
    
}(jQuery));
