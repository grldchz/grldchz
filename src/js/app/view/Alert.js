/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	Alert.js is part of GRLDCHZ
	
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
			$(React.findDOMNode(this)).hide();
		},
		render : function(){
			return (
				<div className="alert alert-danger" role="alert">
				  <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
				  <span className="sr-only">Error:</span>
				  {this.props.children}
				</div>
			);
		}
	});
	return App;
});