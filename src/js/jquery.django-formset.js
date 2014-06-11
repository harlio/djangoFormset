/*!
 * jQuery Multi Django Formset UI Handler
 * Original author: @harleyjessop
 * Licensed under the MIT license
 */

;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = "multiFormset",
        defaults = {
            formset:    '.formset',
            formsetRow: '.formset-row',
            addRowBtn:  '.js--add-formset-row',
            delRowBtn:  '.js--del-formset-row',
            prefix:     null,
        };

    // The actual plugin constructor
    function Plugin( element, options ) {
        this.element = element;

        this.options = $.extend( {}, defaults, options) ;

        this._defaults = defaults;
        this._name = pluginName;

        this.init();
    }

    Plugin.prototype = {

        init: function() {
            // Place initialization logic here
            // You already have access to the DOM element and
            // the options via the instance, e.g. this.element
            // and this.options
            // you can add more functions like the one below and
            // call them like so: this.yourOtherFunction(this.element, this.options).
            var self = this,
                formset = this.element;

            var rows = $(formset).find(self.options.formsetRow),
                prefix = self.options.prefix || $(formset).data('prefix');

            $(formset).on('click', self.options.addRowBtn, function(){
                self.addRow(formset, rows, prefix);
            });
        
            $(formset).on('click', self.options.delRowBtn, function(){
                self.delRow(this, formset, rows, prefix);
            });
        },

        addRow: function(formset, rows, prefix) {

            var total_rows = parseInt($('#id_' + prefix + '-TOTAL_FORMS').val()),
                new_row = rows.first().clone(),
                counter = new_row.data('counter');

            $(new_row).find('input, select').each(function(){
                $(this).val('').attr({
                     name: $(this).attr('name').replace(counter, total_rows),
                     id:   $(this).attr('id').replace(counter, total_rows)
                });
            });

            $(new_row).data('counter', total_rows).attr({
                'id': prefix + '_' + total_rows,
                'data-counter': total_rows
            });

            $('#id_' + prefix + '-TOTAL_FORMS').attr('value', total_rows + 1);

            $(formset).find(this.options.formsetRow).last().after(new_row);
            $(new_row).show();
        },

        delRow: function(el, formset, rows, prefix) {
            var row = $(el).parents(this.options.formsetRow);
            var id = $(row).data('counter');

            $(row).find('#id_' + prefix + '-' + id + '-DELETE').attr('checked', 'checked');
            $(formset).prepend('<input type="hidden" name="' + prefix + '-' + id + '-DELETE" value="on" />');

            $(row).hide();

            if (!$(this.options.formsetRow + ':visible').length){
                this.addRow(formset, rows, prefix, row);
            }
        }
    };

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName,
                new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );