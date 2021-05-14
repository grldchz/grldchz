/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	CommentForm.js is part of GRLDCHZ
	
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
			return { comment: "", shareId : "", parentId : "", editId : "", error: "" };
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
						<textarea className="form-control" name="comment" onChange={this.onChange}
							value={this.state.comment}></textarea>
					</div>
					<button type="submit" className="btn btn-default">Submit</button>
					<button type="button" className="btn btn-default" onClick={this.toggle}>Cancel</button>
						{this.props.children}
				</form>			
			);
		},
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
			if(this.props.parentId){
				var data = {};
				data["parentId"] = this.props.parentId;
				this.setState(data);
			}
			else if(this.props.shareId){
				var data = {};
				data["shareId"] = this.props.shareId;
				this.setState(data);
			}
			else if(this.props.editComment){
				var data = {};
				data["editId"] = this.props.editComment.id;
				data["parentId"] = this.props.editComment.parent_id;
				data["comment"] = appUtils.getUnescapedText(this.props.editComment.comment);
				this.setState(data);
			}
		},
		onSubmit : function(e){
			var self = this;
			e.preventDefault();
			var postData = this.state;
			postData["dateTime"]=this.getDateTime();
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						$(React.findDOMNode(self)).toggle();
						self.props.onComment();
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
		getDateTime:function(){
			var currentTime = new Date();
			var year = currentTime.getFullYear();
			var month = currentTime.getMonth()+1;
			var day = currentTime.getDate();
			var hours = currentTime.getHours();
			var minutes = currentTime.getMinutes();
			var seconds = currentTime.getSeconds();
			if (month < 10){
				month = "0" + month;
			}
			if (day < 10){
				day = "0" + day;
			}
			if (hours < 10){
				hours = "0" + hours;
			}
			if (minutes < 10){
				minutes = "0" + minutes;
			}
			if (seconds < 10){
				seconds = "0" + seconds;
			}
			var submitDate=year+"-"+month+"-"+day+" "+hours + ":" + minutes + ":"+seconds;
			return submitDate;
		}
	});
	return App;
});