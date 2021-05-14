/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	ProfileForm.js is part of GRLDCHZ
	
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
	"bootstrap",
	"jsx!view/Alert"
], function ( $, React, Bootstrap, Alert ) {
	var App = React.createClass({
		componentDidMount:function(){
			$(React.findDOMNode(this)).toggle();
		},
		getInitialState : function(){
			return { firstname: "", lastname : "", email : "", userdesc: "", error: "" };
		},
		onChange : function(e){
			var data = {};
			data[e.currentTarget.name] = e.currentTarget.value;
			this.setState(data);
		},
		render : function(){
			return (
				<form role="form" onSubmit={this.onSubmit} className="grldForm">
					<Alert ref="alert">{this.state.error}</Alert>
					<div className="grld-form form-group">
						<label for="firstname">Your First Name</label>
						<input className="form-control" name="firstname" onChange={this.onChange}
							value={this.getUnescapedText(this.state.firstname)}></input>
						<label for="lastname">Your Last Name</label>
						<input className="form-control" name="lastname" onChange={this.onChange}
							value={this.getUnescapedText(this.state.lastname)}></input>
						<label for="email">Your Email</label>
						<input className="form-control" name="email" onChange={this.onChange}
							value={this.getUnescapedText(this.state.email)}></input>
						<label for="userdesc">Your Description</label>
						<textarea className="form-control" name="userdesc" onChange={this.onChange}
							value={this.getUnescapedText(this.state.userdesc)}></textarea>
					</div>
					<button type="submit" className="btn btn-default">Submit</button>
					<button type="button" className="btn btn-default" onClick={this.toggle}>Cancel</button>
				</form>			
			);
		},
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
			$(React.findDOMNode(this.refs.alert)).hide();
			if(this.props.parentId){
				var data = {};
				data["parentId"] = this.props.parentId;
				this.setState(data);
			}
			else if(this.props.userProfile){
				var data = {};
				data["firstname"] = this.props.userProfile.first_name;
				data["lastname"] = this.props.userProfile.last_name;
				data["email"] = this.props.userProfile.email;
				data["userdesc"] = this.props.userProfile.description;
				this.setState(data);
			}
		},
		onSubmit : function(e){
			var self = this;
			e.preventDefault();
			var postData = this.state;
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						$(React.findDOMNode(self.refs.alert)).hide();
						$(React.findDOMNode(self)).toggle();
						self.props.onProfile();
					}
					else{
						var newState = self.state;
						newState.error = data.msg;
						self.setState(newState);
						$(React.findDOMNode(self.refs.alert)).show();
					}
				},
				error: function(error){
					var newState = self.state;
					newState.error = error.statusText+" - "+error.responseText;
					self.setState(newState);
					$(React.findDOMNode(self.refs.alert)).show();
				}
		    });
		},
		getUnescapedText:function (escapedText) {
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
			}
	});
	return App;
});