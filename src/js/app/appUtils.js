/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	ListController.js is part of GRLDCHZ
	
    Copyright (C) 2021 grilledcheeseoftheday.com

    GRLDCHZ is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    GRLDCHZ is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
**/
define([
	"jquery"
], function ( $ ) {
	var getUnescapedText = function (escapedText) {
		// copied from http://locutusjs.io/php/strings/stripslashes/
		//       discuss at: http://locutusjs.io/php/stripslashes/
		//      original by: Kevin van Zonneveld (http://kvz.io)
		//      improved by: Ates Goral (http://magnetiq.com)
		//      improved by: marrtins
		//      improved by: rezna
		//         fixed by: Mick@el
		//      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
		//      bugfixed by: Brett Zamir (http://brett-zamir.me)
		//         input by: Rick Waldron
		//         input by: Brant Messenger (http://www.brantmessenger.com/)
		// reimplemented by: Brett Zamir (http://brett-zamir.me)
		//        example 1: stripslashes('Kevin\'s code')
		//        returns 1: "Kevin's code"
		//        example 2: stripslashes('Kevin\\\'s code')
		//        returns 2: "Kevin\'s code"
		var str = escapedText;
		return (str + '')
			.replace(/\\(.?)/g, function (s, n1) {
				switch (n1) {
					case '\\':
						return '\\'
					case '0':
						return '\u0000'
					case '':
						return ''
					default:
						return n1
				}
			})
	};
	var capitalizeFirstLetter = function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	};
	// public interface
	return {
		getUnescapedText : getUnescapedText,
		capitalizeFirstLetter : capitalizeFirstLetter
	};
});