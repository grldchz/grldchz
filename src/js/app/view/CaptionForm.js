/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	CaptionForm.js is part of GRLDCHZ
	
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
	"appUtils",
	"jsx!view/Alert"
], function ( $, React, Bootstrap, appUtils, Alert ) {
	var App = React.createClass({
		componentDidMount : function(){
			$(React.findDOMNode(this)).toggle();
		},
		getInitialState : function(){
			return { caption: "", media_id : "", error: "" };
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
						<textarea className="form-control" name="caption" onChange={this.onChange}
							value={this.state.caption}></textarea>
					</div>
					<button type="submit" className="btn btn-default">Submit</button>
					<button type="button" className="btn btn-default" onClick={this.toggle}>Cancel</button>
						{this.props.children}
				</form>			
			);
		},
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
			if(this.props.editCaption){
				var data = {};
				data["caption"] = this.props.editCaption.title!=this.props.editCaption.file?this.props.editCaption.title:"";
				data["media_id"] = this.props.editCaption.id;
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
						$(React.findDOMNode(self)).toggle();
						self.props.onCaption(self.state.caption);
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
		}
	});
	return App;
});