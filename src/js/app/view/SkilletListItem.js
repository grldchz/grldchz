/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	CommentDisplay.js is part of GRLDCHZ
	
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
	"jsx!view/CommentForm",
	"jsx!view/Confirmation"
], function ( $, React, Bootstrap, appUtils, CommentForm, Confirmation ) {
	var App = React.createClass({
		render : function(){
			var buttonClassName = "gcotd-btn btn btn-default btn-lg pull-right";
			var requestVisibility = " hide";
			var removeVisibility = " hide";
			var hideVisibility = " hide";
			var unhideVisibility = " hide";
			var acceptVisibility = " hide";
			var rejectVisibility = " hide";

			if(this.props.children.outgoing_request == null && this.props.children.incoming_request == null){
				requestVisibility = "";
			}
			else if(this.props.children.outgoing_request != null){
				var accepted = this.props.children.outgoing_request[0]==0?true:false;
				var hidden = this.props.children.outgoing_request[1]==0?false:true;//back-ass-wards
				if(accepted && !hidden){
					hideVisibility = "";
				}
				else if(accepted && hidden){
					unhideVisibility = "";
				}
				removeVisibility = "";
			}
			else if(this.props.children.incoming_request != null){
				var accepted = this.props.children.incoming_request[0]==0?true:false;
				var hidden = this.props.children.incoming_request[1]==0?false:true;//back-ass-wards
				if(accepted && !hidden){
					hideVisibility = "";
					removeVisibility = "";
				}
				else if(accepted && hidden){
					unhideVisibility = "";
					removeVisibility = "";
				}
				else if(!accepted){
					acceptVisibility = "";
					rejectVisibility = "";
				}
			}
			return (
				<li href="#" className="grldListItemContainer">
					<div className="media-left">
						{this.renderImg()}
					</div>
					<div id={this.props.children.id} className="media-body">
						<h4 className="media-heading">
							{this.getFullName()}
							<button ref="requestButton" type="button" className={buttonClassName+requestVisibility} 
								onClick={this.toggleRequestConfirm}>
							  <span className="glyphicon gcotd-icon icon-request-user" aria-hidden="true"></span>
							</button>
							<button ref="removeButton" type="button" className={buttonClassName+removeVisibility} 
								onClick={this.toggleRemoveConfirm}>
							  <span className="glyphicon gcotd-icon icon-remove-user" aria-hidden="true"></span>
							</button>
							<button ref="hideButton" type="button" className={buttonClassName+hideVisibility} 
								onClick={this.hideUnhide}>
							  <span className="glyphicon gcotd-icon icon-hide-user" aria-hidden="true"></span>
							</button>
							<button ref="unhideButton" type="button" className={buttonClassName+unhideVisibility} 
								onClick={this.hideUnhide}>
							  <span className="glyphicon gcotd-icon icon-unhide-user" aria-hidden="true"></span>
							</button>
							<button ref="acceptButton" type="button" className={buttonClassName+acceptVisibility} 
								onClick={this.toggleAcceptConfirm}>
							  <span className="glyphicon gcotd-icon icon-accept-user" aria-hidden="true"></span>
							</button>
							<button ref="rejectButton" type="button" className={buttonClassName+rejectVisibility} 
								onClick={this.toggleRejectConfirm}>
							  <span className="glyphicon gcotd-icon icon-reject-user" aria-hidden="true"></span>
							</button>
						</h4>
						<div>{this.getMemberSince()}</div>
					</div>
					<Confirmation ref="requestConfirm" confirm={this.onRequestConfirm}>
						Are you sure you want to send a request to this user?
					</Confirmation>
					<Confirmation ref="removeConfirm" confirm={this.onRemoveConfirm}>
						Are you sure you want to remove this user?  You will no longer see their posts and they will no longer see yours.
					</Confirmation>
					<Confirmation ref="acceptConfirm" confirm={this.onAcceptConfirm}>
						Are you sure you want to accept the request from this user?  You will see their posts and they will see yours.
					</Confirmation>
					<Confirmation ref="rejectConfirm" confirm={this.onRejectConfirm}>
						Are you sure you want to reject the request from this user?  You will not see their posts and they will not see yours.
					</Confirmation>
				</li>
			);
		},
		getFullName:function(){
			return (appUtils.capitalizeFirstLetter(appUtils.getUnescapedText(this.props.children.first_name)) + " " +
				appUtils.capitalizeFirstLetter(appUtils.getUnescapedText(this.props.children.last_name)));
		},
		getMemberSince:function(){
			return ("Member since " + appUtils.getUnescapedText(this.props.children.user_date_time));
		},
		renderImg : function(){
			if(this.props.children.img_file){
				var img_src = gcotd + "/media/"
					+ this.props.children.user_name + "/" + this.props.children.img_file;
				return (
					<div>
					<img className="profile-img" src={img_src} onClick={this.openProfileDisplay}/>
					</div>
				);
			}
			else{
				return (
					<div>
						<button type="button" className="gcotd-btn btn btn-default btn-lg" 
							 onClick={this.openProfileDisplay}>
							<span className="noProfileImg glyphicon glyphicon-user"></span>					
						</button>
					</div>
				);				
			}
		},
		openProfileDisplay : function(){
			this.props.openProfileDisplay(this.props.children);
		},
		toggleRequestConfirm:function(){
			this.refs.requestConfirm.toggle();
		},
		toggleRemoveConfirm:function(){
			this.refs.removeConfirm.toggle();
		},
		toggleAcceptConfirm:function(){
			this.refs.acceptConfirm.toggle();
		},
		toggleRejectConfirm:function(){
			this.refs.rejectConfirm.toggle();
		},
		onRequestConfirm:function(){
			var self = this;
			var postData = {requestUser:this.props.children.id}
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						self.refs.requestConfirm.toggle();
						$(React.findDOMNode(self.refs.requestButton)).addClass('hide');
						$(React.findDOMNode(self.refs.removeButton)).removeClass('hide');
						$(React.findDOMNode(self.refs.hideButton)).removeClass('hide');
						alert(data);
						//TODO refresh posts
					}
					else{
						self.refs.requestConfirm.toggle();
						$(React.findDOMNode(self.refs.requestButton)).addClass('hide');
						$(React.findDOMNode(self.refs.removeButton)).removeClass('hide');
						$(React.findDOMNode(self.refs.hideButton)).removeClass('hide');
						alert(data.msg);
					}
				},
				error: function(error){
					alert(error.statusText+" - "+error.responseText);
				}
			});
		},
		onRemoveConfirm:function(){
			var self = this;
			var postData = {removeUser:this.props.children.id}
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						self.refs.removeConfirm.toggle();
						$(React.findDOMNode(self.refs.removeButton)).addClass('hide');
						$(React.findDOMNode(self.refs.requestButton)).removeClass('hide');
						$(React.findDOMNode(self.refs.hideButton)).addClass('hide');
						$(React.findDOMNode(self.refs.unhideButton)).addClass('hide');
						//TODO refresh posts
					}
					else{
						alert(data.msg);
					}
				},
				error: function(error){
					alert(error.statusText+" - "+error.responseText);
				}
			});
		},
		hideUnhide:function(){
			var self = this;
			var postData = {hideUnhideUser:this.props.children.id}
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						if($(React.findDOMNode(self.refs.hideButton)).hasClass("hide")){
							$(React.findDOMNode(self.refs.hideButton)).removeClass('hide');
							$(React.findDOMNode(self.refs.unhideButton)).addClass('hide');
						}
						else{
							$(React.findDOMNode(self.refs.hideButton)).addClass('hide');
							$(React.findDOMNode(self.refs.unhideButton)).removeClass('hide');
						}
						//TODO refresh posts
					}
					else{
						alert(data.msg);
					}
				},
				error: function(error){
					alert(error.statusText+" - "+error.responseText);
				}
			});
		},
		onAcceptConfirm:function(){
			var self = this;
			var postData = {acceptUser:this.props.children.id}
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						self.refs.acceptConfirm.toggle();
						$(React.findDOMNode(self.refs.acceptButton)).addClass('hide');
						$(React.findDOMNode(self.refs.rejectButton)).addClass('hide');
						$(React.findDOMNode(self.refs.removeButton)).removeClass('hide');
						$(React.findDOMNode(self.refs.hideButton)).removeClass('hide');
						//TODO refresh posts
					}
					else{
						alert(data.msg);
					}
				},
				error: function(error){
					alert(error.statusText+" - "+error.responseText);
				}
			});
		},
		onRejectConfirm:function(){
			var self = this;
			var postData = {rejectUser:this.props.children.id}
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						self.refs.rejectConfirm.toggle();
						$(React.findDOMNode(self.refs.acceptButton)).addClass('hide');
						$(React.findDOMNode(self.refs.rejectButton)).addClass('hide');
						$(React.findDOMNode(self.refs.requestButton)).removeClass('hide');
						$(React.findDOMNode(self.refs.hideButton)).addClass('hide');
						$(React.findDOMNode(self.refs.unhideButton)).addClass('hide');
						//TODO refresh posts
					}
					else{
						alert(data.msg);
					}
				},
				error: function(error){
					alert(error.statusText+" - "+error.responseText);
				}
			});
		},
	});
	return App;
});