/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	require.js is part of GRLDCHZ
	
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
// Sets the require.js configuration for your application.
require.config( {
	baseUrl: "js/app",

	paths: {
		bootstrap: "../lib/bootstrap-3.3.5-dist/js/bootstrap.min",
		jquery: "../lib/jquery-1.11.3.min",
		jsx: "../lib/jsx",
		JSXTransformer: "../lib/JSXTransformer-0.13.3",
		react: "../lib/react-0.13.3.min",
		"jquery.ui.widget":"../lib/jQuery-File-Upload-9.11.2/js/vendor/jquery.ui.widget",
		"jquery.iframe-transport":"../lib/jQuery-File-Upload-9.11.2/js/jquery.iframe-transport",
		"jquery.fileupload":"../lib/jQuery-File-Upload-9.11.2/js/jquery.fileupload",
		"jquery.panzoom":"../lib/jquery.panzoom.min",
		"jquery.mousewheel":"../lib/jquery.mousewheel",
		"jquery.doubletap":"../lib/jquery.doubletap"
	},

	shim: {

		bootstrap: {
			deps: [ "jquery" ],
			exports: "Bootstrap"
		},
        JSXTransformer: {
            exports: "JSXTransformer"
        },
		react: {
			exports: "React"
		},
		"jquery.doubletap":{
			deps: [ "jquery" ],
			exports: "doubletap"
		}
	}

});