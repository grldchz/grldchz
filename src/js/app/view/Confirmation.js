/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	Confirmation.js is part of GRLDCHZ
	
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
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
		},
		render:function(){
			return (
				 <div className="confirmation">
				     <h3 className="confirmMsg">{this.props.children}</h3>
					<button type="button" className="btn btn-default"
						onClick={this.props.confirm}>Yes</button>
					<button type="button" className="btn btn-default" 
						onClick={this.toggle}>Cancel</button>
				</div>
			);
		}
	});
	return App;
});