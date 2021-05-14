/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	ProgressBar.js is part of GRLDCHZ
	
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
	"jquery",
	"react",	
	"bootstrap"
], function ( $, React, Bootstrap ) {
	var App = React.createClass({
		componentDidMount : function(){
			$(React.findDOMNode(this)).toggle();
		},
		hide : function(){
			$(React.findDOMNode(this)).hide();
		},
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
		},
		render:function(){
			return (
			<div className="progressBarContainer navbar navbar-default navbar-fixed-top" ref="nav">
				 <div className="progress">
				     <div className="progressBar progress-bar progress-bar-striped active" role="progressbar"
				         aria-valuenow="99" aria-valuemin="0" aria-valuemax="100">
				     </div>
				</div>
			</div>
			);
		}
	});
	return App;
});