/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	Forgot.js is part of GRLDCHZ
	
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
	"jsx!view/Alert",
	"jsx!view/Info"
], function ( $, React, Bootstrap, Alert, Info ) {
	var App = React.createClass({
		googleCaptcha:null,
		componentDidMount : function(){
			$(React.findDOMNode(this)).toggle();
		},
		getInitialState : function(){
			return { 
				forgot: "Forgot", 
				username : "", 
				email: "", 
				"g-recaptcha-response": "",
				info: "",
				error: ""				
			};
		},
		onChange : function(e){
			var data = {};
			data[e.currentTarget.name] = e.currentTarget.value;
			this.setState(data);
		},	
		render : function(){
			return (
				<form role="form" onSubmit={this.onSubmit}>
					<Info ref="info">{this.state.info}</Info>
					<Alert ref="error">{this.state.error}</Alert>
					<div className="form-group">
						<label for="username">User Name:</label>
						<input type="text" className="form-control" name="username" onChange={this.onChange} value={this.state.username}/>
					</div>
					<strong>Or</strong>
					<div className="form-group">
						<label for="email">Email:</label>
						<input type="text" className="form-control" name="email" onChange={this.onChange} value={this.state.email}/>
					</div>
					<div ref="recaptchaTarget" id="recaptchaTarget"></div>
					<button type="submit" className="btn btn-default">Reset Password</button>
					<button type="button" className="btn btn-default" onClick={this.props.hideForgot}>Cancel</button>
				</form>			
			);
		},
		show : function(){
			$(React.findDOMNode(this)).show();
			var self = this;
			this.googleCaptcha = grecaptcha.render(this.refs.recaptchaTarget.getDOMNode(), {
				//'sitekey' : '6LeiI9IZAAAAABsaKqRtuXCphxxDoTnZzD_QYo_q',//localhost
				'sitekey' : '6LenJNIZAAAAANmQNGHTVxocvodjsCV_Qlvwm11p',//grilledcheeseoftheday
				'callback' : function(response) {
					var e = {};
					e["currentTarget"]={};
					e.currentTarget["name"]="g-recaptcha-response";
					e.currentTarget["value"]=response;
					self.onChange(e);
				}
			});
		},
		hide : function(){
			$(React.findDOMNode(this)).hide();
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
					var newState = self.state;
					if(!data.status){
						newState = self.getInitialState();
						newState.info = data;
						self.setState(newState);
						$(React.findDOMNode(self.refs.info)).show();						
					}
					else{
						newState.error = data.msg;
						self.setState(newState);
						$(React.findDOMNode(self.refs.error)).show();
					}
					grecaptcha.reset(self.googleCaptcha);
				},
				error: function(error){
					var newState = self.state;
					newState.error = error.statusText+" - "+error.responseText;
					self.setState(newState);
					$(React.findDOMNode(self.refs.error)).show();
				}
		});
		}
	});
	return App;
});