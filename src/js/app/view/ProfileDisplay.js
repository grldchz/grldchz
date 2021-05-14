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
	"appUtils"
], function ( $, React, Bootstrap, appUtils ) {
	var App = React.createClass({
		getInitialState: function() {
			return {
			  profile:{},
			  image:null
			};
		},
		render : function(){
			return (
				<div className="modal fade" role="dialog">
					<div className="modal-dialog">
						<div ref="modalContent" className="modal-content">
							<div className="modal-header">								
								<button ref="closeButton" type="button" className="gcotd-btn btn btn-default btn-lg pull-right" 
									 data-dismiss="modal">
								  <span className="glyphicon gcotd-icon icon-close" aria-hidden="true"></span>
								</button>
								<div><span className="glyphicon gcotd-icon icon-profile" aria-hidden="true"></span> Profile</div>
							</div>
							<div className="modal-body">
								{this.renderImg()}
								<div>{this.getFullName()}</div>
								<div>{this.getMemberSince()}</div>
								<div>{appUtils.getUnescapedText(this.state.profile.description)}</div>
							</div>
						</div>
					</div>
				</div>
			);
		},
		getFullName:function(){
			return (appUtils.capitalizeFirstLetter(appUtils.getUnescapedText(this.state.profile.first_name)) + " " +
				appUtils.capitalizeFirstLetter(appUtils.getUnescapedText(this.state.profile.last_name)));
		},
		getMemberSince:function(){
			return ("Member since " + appUtils.getUnescapedText(this.state.profile.user_date_time));
		},
		open : function(profile, image){
			this.setState({profile:profile, image:image});
			$(React.findDOMNode(this)).modal("show");
			$(React.findDOMNode(this)).on('hidden.bs.modal', function () {
				if($('.modal').hasClass('in')) {
					$('body').addClass('modal-open');
				}    
			});
		},
		loadProfile:function(){
			var self = this;
			$.ajax({            
				type: "GET",
				url: gcotd+"/service.php?get=profile&userpage="+this.props.userpage,
				success: function(data, status){
					var jsonData = JSON.parse(data);
					if(!jsonData.status){
						var newState = {};
						newState["userProfile"] = jsonData;
						self.setState(newState);
					}
					else if(jsonData.status == "TERMS"){
						self.showTerms();
					}
					else{
						self.showLogin();
					}
				},
				error: function(error){
					console.log(error);
					self.showLogin();
				}
			});
		},
		renderImg : function(){
			if(this.state.profile.img_file){
				var img_src = gcotd + "/media/"
					+ this.state.profile.user_name + "/" + this.state.profile.img_file;
				return (
					<div>
					<img className="profile-img" src={img_src} onClick={this.openImageViewer}/>
					</div>
				);
			}
			else{
				return (<span className="noProfileImg glyphicon glyphicon-user"></span>);				
			}
		},
		openImageViewer : function(){
			this.props.openImageViewer(this.state.image);
		}
	});
	return App;
});