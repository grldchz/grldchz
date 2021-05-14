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
	"jsx!view/MediaContainer"
], function ( $, React, Bootstrap, appUtils, MediaController, MediaContainer ) {
	var App = React.createClass({
		start : 0,
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
							<div className="modal-body medialist-modal-body">
								{this.renderMedia()}
								<button ref="moreMediaBtn" type="button" className="gcotd-btn btn btn-default btn-lg pull-right" 
									onClick={this.getMoreMedia}>
								  <span className="glyphicon gcotd-icon icon-more" aria-hidden="true"></span>
								</button>
							</div>
						</div>
					</div>
				</div>
			);
		},
		renderMedia: function() {
			var buttonVisibility = "";
			var self = this;
			var render = false;
			var itemViews = this.state.store.map(function(item, index) {
				
				if(item.user_name != self.props.userProfile.name){
					buttonVisibility = " hide";
				}
				else{
					buttonVisibility = "";
				}
				if(index >= self.start){
					render = true;
				}
				else{
					render = false;
				}
			    return (<MediaContainer render={render} openImageViewer={self.props.openImageViewer} 
					mediaButtonClassName={self.state.mediaButtonClassName} media={item} 
					buttonVisibility={buttonVisibility} />);
			});
			return (
			  <div>
				{itemViews}
			  </div>
			);
		},
		open:function(searchTerm, fromDate, toDate){
			this.props.toggleProgressBar();
			this.replaceState(this.getInitialState());
			$(React.findDOMNode(this.refs.moreMediaBtn)).hide();
			$(React.findDOMNode(this)).modal("show");
			$(React.findDOMNode(this)).on('hidden.bs.modal', function () {
				if($(React.findDOMNode(this)).hasClass('in')) {
					$('body').addClass('modal-open');
				}    
			});
			this.searchTerm = searchTerm;
			this.fromDate = fromDate;
			this.toDate = toDate;
			this.loadMedia();
		},
		loadMedia: function(more){
			if(more){
				this.start = this.start + 10;
			}
			else{
				this.start = 0;
			}
			MediaController.searchMedia(this.start, null, this.searchTerm, this.fromDate, this.toDate)
			.done(function(response){
				this.props.toggleProgressBar();
				if(response.status && response.status == "FAIL"){
					$(React.findDOMNode(this)).modal("hide");
					this.props.toggleList();
					this.props.toggleLogin();
				}
				else{
					var mediaButtonClassName = this.state.mediaButtonClassName;
					
					mediaButtonClassName += " hide";
					if(mediaButtonClassName.indexOf("hide")>-1){
						var indexOfHide = mediaButtonClassName.indexOf("hide");
						mediaButtonClassName = mediaButtonClassName.substring(0, indexOfHide-1);
					}

					var store = response.results;
					if(more){
						var newStore = this.state.store;
						store.map(function(item, index){
							newStore.push(item);
						});
						store = newStore;
					}
					this.replaceState({store:store,
						mediaButtonClassName : mediaButtonClassName});
					$(React.findDOMNode(this.refs.moreMediaBtn)).show();
				}
			}.bind(this));
		},
		getMoreMedia : function(e){
			e.preventDefault();
			this.props.toggleProgressBar();
			this.loadMedia(true);
		}
	});
	return App;
});