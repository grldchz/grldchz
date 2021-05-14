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
	"appUtils",
	"controller/MediaController",
	"jsx!view/MediaContainer",
	"jsx!view/ProgressBar"
], function ( $, React, Bootstrap, appUtils, MediaController, MediaContainer, ProgressBar ) {
	var App = React.createClass({
		getInitialState:function(){
			return {
				store:[], 
				mediaButtonClassName : "gcotd-btn btn btn-default btn-lg pull-right"				
			};			
		},
		render : function(){
			return (
				<div className="modal fade" role="dialog">
					<div className="closeButtonContainer navbar navbar-default navbar-fixed-top" ref="nav">							
						<button type="button" 
							className="gcotd-fixed-modal-btn btn btn-default btn-lg pull-right" 
							data-dismiss="modal">
						  <span className="glyphicon gcotd-icon icon-close" aria-hidden="true"></span>
						</button>
					</div>
					<div className="modal-dialog">
						<div ref="modalContent" className="modal-content">
							<div className="modal-header">	
								<div><span className="glyphicon gcotd-icon icon-picture" aria-hidden="true"></span></div>
							</div>
							<div className="modal-body">
								<ProgressBar ref="progressBar"/>
								{this.renderMedia()}
							</div>
						</div>
					</div>
				</div>
			);
		},
		renderMedia: function() {
			var buttonVisibility = "";
			var self = this;
			var render = true;
			var itemViews = this.state.store.map(function(item, index) {
				if(item.user_name != self.props.userProfile.name){
					buttonVisibility = " hide";
				}
				else{
					buttonVisibility = "";
				}
			    return (<MediaContainer render={render} openImageViewer={self.props.openImageViewer} 
					mediaButtonClassName={self.state.mediaButtonClassName} 
					media={item} buttonVisibility={buttonVisibility} />);
			});
			return (
			  <div>
				{itemViews}
			  </div>
			);
		},
		open:function(listItem){
			this.setState({store : []});
			this.refs.progressBar.toggle();
			$(React.findDOMNode(this)).modal("show");
			$(React.findDOMNode(this)).on('hidden.bs.modal', function () {
				if($(React.findDOMNode(this)).hasClass('in')) {
					$('body').addClass('modal-open');
				}    
			});
			MediaController.getMedia(listItem.id).done(function(response){
				this.refs.progressBar.toggle();
				if(response.status && response.status == "FAIL"){
					$(React.findDOMNode(this)).modal("hide");
					this.props.toggleList();
					this.props.toggleLogin();
				}
				else{
					var store = this.state.store;
					var mediaButtonClassName = this.state.mediaButtonClassName;
					if(listItem.user_name != this.props.userProfile.name){
						mediaButtonClassName += " hide";
					}
					else if(mediaButtonClassName.indexOf("hide")>-1){
						var indexOfHide = mediaButtonClassName.indexOf("hide");
						mediaButtonClassName = mediaButtonClassName.substring(0, indexOfHide-1);
					}
					this.setState({store : store.concat(response.results),
						mediaButtonClassName : mediaButtonClassName});
				}
			}.bind(this));
		}
	});
	return App;
});