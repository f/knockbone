/**
 * Backbone Knockout.js v0.1
 *
 * Manages Views and Models of Backbone.
 *
 * Author: Fatih Kadir AKIN
 * License: MIT
 * Year: 2012
 */
(function (Backbone, _, $, ko) {

    "use strict";

    //Knockbone prototype
    var Knockbone = {

        knockbone: function(options) {

            var self = this;

            //Argumanla gelen diğerini eziyor.
            if (options.model)
                this.model = options.model;

            //Hala model yoksa hiç gelmemiş.
            if (!this.model || typeof this.model != 'object')
                throw new Error("You cannot use views without models on Knockbones.");

            //Scope içi düzen sağlanıyor.
            var model = this.model;
            model.isKnocked = true;

            var toObserve = options.observe || model.attributes;

            _.each(toObserve, function(value, key) {
                if (_.isArray(toObserve))
                {
                    key = toObserve[key]; value = model.attributes[key];
                }
                model.attributes[key] = ko[_.isArray(value)?'observableArray':'observable'](value);
            });

            var __setter = model.set;

            function isObservable(attr) {
                return !!(typeof attr == 'function' && attr.name.match(/^observable/) || typeof attr.name == 'undefined');
            }

            model.set = function(key, value) {
                var attrs;
                if (_.isObject(key)) {
                    attrs = key;
                    options = value;
                } else {
                    attrs = {};
                    attrs[key] = value;
                }

                for (var _key in attrs) {
                    if (_.indexOf(_.isArray(toObserve)?toObserve:_.keys(toObserve), _key) >= 0)
                    {
                        try {
                            if (isObservable(this.attributes[_key]))
                                this.attributes[_key](attrs[_key]);
                        } catch (e) {}
                    }
                }
            };

            model.get = function(attr) {
                return this.attributes[attr]();
            };

            if (this.bindings)
                $.extend(model.attributes, this.bindings);

            //Birden fazla view gelebilir.
            $(this.el).each(function() {
                ko.applyBindings(model.attributes, this);
            });

        }

    };
    //Eğer child initializer üzerine yazarsa, this.knockbone.apply(this, arguments); demeli
    Knockbone.initialize = Knockbone.knockbone;

    //Mixin.
    Backbone.View = Backbone.View.extend(Knockbone);

}).call(this, this.Backbone, this._, this.jQuery, this.ko);