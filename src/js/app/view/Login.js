/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	Login.js is part of GRLDCHZ
	
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
		componentDidMount : function(){
			$(React.findDOMNode(this)).toggle();
		},
		getInitialState : function(){
			return { login: "Login", 
				//username:"guest", password:"changeme", 
				error: ""};
		},
		onChange : function(e){
			var data = {};
			data[e.currentTarget.name] = e.currentTarget.value;
			this.setState(data);
		},	
		render : function(){
			return (
				<form ref="loginForm" role="form" onSubmit={this.onSubmit}>
					<Alert ref="alert">{this.state.error}</Alert>
					<div className="grld-form form-group">
						<label for="username">User Name or Email address:</label>
						<input type="username" className="form-control" name="username" onChange={this.onChange} value={this.state.username}/>
					</div>
					<div className="form-group">
						<label for="password">Password:</label>
						<input type="password" className="form-control" name="password" onChange={this.onChange} value={this.state.password}/>
					</div>
					<button type="submit" className="btn btn-default">Submit</button>
					<button type="button" className="btn btn-default" onClick={this.props.openRegister}>Register</button>
					<button type="button" className="btn btn-default" onClick={this.props.openForgot}>Forgot</button>
					<a href="/grldchz-ts" className="btn btn-primary" style={{margin:"3px"}} role="button">NEW GRLDCHZ</a>
				</form>			
			);
		},
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
		},
		show : function(){
			this.props.hideRegister();
			$(React.findDOMNode(this)).show();
		},
		onSubmit : function(e){
			var self = this;
			e.preventDefault();
			$.ajax({            
				type: "POST",
				url: gcotd+"/auth/service.php",
				data: this.state,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						$(React.findDOMNode(self)).toggle();
						self.props.onLogin();
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
		openRegister : function(e){
			this.toggle()
			this.register.open();
		}
	});
	return App;
});