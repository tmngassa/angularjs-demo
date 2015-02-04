/**
 * Created by tomson.ngassa on 2/26/14.
 */

'use strict';

angular.module('bham.filters', [])

    .filter('pagination', function(){
        return function(inputArray, selectedPage, pageSize) {
            var start = parseInt(selectedPage)* parseInt(pageSize);
            var extractedArray = [];
            if(inputArray){
                var end = start + parseInt(pageSize);
                extractedArray = inputArray.slice(start, end);
            }
            return extractedArray;
        };
    })
    .filter('toPercentage', ['$log', function($log){
        return function(fraction) {

            if(!isNaN(fraction) && ( Math.floor(fraction*100)<= 100) ){
                var percentNumber = 100 * fraction;
                return parseInt(percentNumber) === 0 ? 0: percentNumber + "%";
            }else{
                $log.error("Bham.filter, cannot convert to fraction: " + fraction);
                return "";
            }

//
//            var fractionStr = fraction.toString();
//            var indexOfDot = fractionStr.indexOf(".");
//            if( ( (indexOfDot == 0) && parseInt(fraction) === 1) )|| ((indexOfDot == 1)  &&  parseInt( fractionStr.substring(0,indexOfDot ))*   ){
//
//            }
//            if((fraction.lenght()===1 && (parseInt(fraction) === 1) ) ||( fraction.toString().indexOf(".")==1) ) {
//                var percentNumber = 100 * fraction;
//                return percentNumber + "%";
//            }else{
//                $log.error("Bham.filter, cannot convert to fraction: " + fraction);
//                return fraction;
//            }

        };
    }]);
