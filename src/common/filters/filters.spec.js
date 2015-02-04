/**
 * Created by tomson.ngassa on 3/3/14.
 */

'use strict';

describe('bham.filters module', function(){
    var module;

    beforeEach(function() {
        module = angular.module("bham.filters");
    });

    it("should be registered", function() {
        expect(module).not.toEqual(null);
    });
});

describe('Pagination filter', function () {

    var paginationFilter;

    beforeEach(module('bham.filters'));

    beforeEach(inject(function (_paginationFilter_) {
        paginationFilter = _paginationFilter_;
    }));

    it('should return a slice of the input array', function () {

        var input = [1, 2, 3, 4, 5, 6];

        expect(paginationFilter(input, 0, 2)).toEqual([1, 2]);
        expect(paginationFilter(input, 2, 2)).toEqual([5, 6]);

        expect(paginationFilter(input, 0, 3)).toEqual([1, 2, 3]);
        expect(paginationFilter(input, 1, 3)).toEqual([4, 5, 6]);
    });

    it('should return empty array for out-of bounds', function () {

        var input = [1, 2];
        expect(paginationFilter(input, 2, 2)).toEqual([]);
    });
});

describe('ToPercentage filter', function () {

    var toPercentageFilter;

    beforeEach(module('bham.filters'));

    beforeEach(inject(function (_toPercentageFilter_) {
        toPercentageFilter = _toPercentageFilter_;
    }));

    it('should convert valid fraction percentage', function () {
        var fraction = 0.21;
        expect(toPercentageFilter(fraction)).toEqual('21%');

        fraction = 0.99;
        expect(toPercentageFilter(fraction)).toEqual('99%');

        fraction = 1;
        expect(toPercentageFilter(fraction)).toEqual('100%');

        fraction = 0;
        expect(toPercentageFilter(fraction)).toEqual(0);
    });

    it('should not convert invalid fraction', function () {
        var fraction = 2;
        expect(toPercentageFilter(fraction)).toEqual('');

        fraction = 10000;
        expect(toPercentageFilter(fraction)).toEqual('');

        fraction = "apapa";
        expect(toPercentageFilter(fraction)).toEqual('');
    });
});
