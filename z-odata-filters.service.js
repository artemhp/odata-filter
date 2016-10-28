(function () {

    'use strict';
    angular.module('hp.odata', []);

    angular.module('hp.odata').factory('hpOdataFilters', hpOdataFilters);

    hpOdataFilters.$inject = [];

    function hpOdataFilters() {

        return {
            filterOrder: filterOrder,
            filterSearch: filterSearch,
            populateArray: populateArray
        };

        function filterOrder(orderBy) {
            var filterOrder;
            if (orderBy) {
                filterOrder = '$orderby=' + orderBy.type + ' ' + orderBy.direction;
            }
            return filterOrder;
        }

        function filterSearch(collection, strict, prePopulatedFilter) {
            var filterSearch = '';
            if (prePopulatedFilter) {
                filterSearch = '&$filter=' + prePopulatedFilter;
            }
            if (collection) {
                collection.map(function (el, index) {
                    if (index == 0 && !prePopulatedFilter) {
                        filterSearch += '&$filter=';
                    } else {
                        filterSearch += ' and ';
                    }
                    if (!strict) {
                        filterSearch += '(contains(cast(' + convertChild(el.prop) + ', \'Edm.String\'),\'' + el.value + '\'))';
                    } else {
                        filterSearch += '(' + el.prop.replace("___", "/") + ' eq ' + el.value + ')';
                    }
                });
            }
            return filterSearch;
        }

        function populateArray(obj) {
            var value = '';
            var resultArray = [];
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    if (obj[key] instanceof Object) {
                        value = obj[key].value;
                    } else {
                        value = obj[key];
                    }
                    resultArray.push({'prop': key, 'value': convertChild(value)});
                }
            }
            return resultArray;
        }

        function convertChild(el) {
            if (isNaN(el)) {
                return el.replace("___", "/");
            } else {
                return el;
            }
        }

    }

})();