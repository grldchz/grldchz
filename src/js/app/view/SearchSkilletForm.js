/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	SearchSkilletForm.js is part of GRLDCHZ
	
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
	"jsx!view/ProgressBar",
	"jsx!view/Alert",
	"jsx!view/SkilletListItem"
], function ( $, React, Bootstrap, ProgressBar, Alert, SkilletListItem ) {
	var App = React.createClass({
		getInitialState : function(){
			return { skilletSearchTerm: "", error: "", skillets:[] };
		},
		onChange : function(e){
			var data = {};
			var val = $(React.findDOMNode(this.refs.term)).val();
			data["skilletSearchTerm"] = val;
			this.setState(data);
			if(val && val.trim()!=null){
				this.timeout = 0;
				this.timeoutLoopDone=false;
				this.timeoutLoop(this);
			}
		},
		timeout:0,
		timeoutLoopDone:false,
		timeoutLoop:function(self){
			if(self.timeout > 1000){
				self.timeoutLoopDone=true;
				self.onSubmit();
			}
			else{
				self.timeout = self.timeout + 250;
				setTimeout(
					function(){
						if(!self.timeoutLoopDone)self.timeoutLoop(self);
					}
				, 250);
			}
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
								<div>
									<span className="glyphicon gcotd-icon icon-skillet" aria-hidden="true"></span>
									{this.props.headerTitle}
								</div>
							</div>
							<div className="modal-body">
									<Alert ref="alert">{this.state.error}</Alert>
										<input ref="term" className="form-control" name="skilletSearchTerm" onChange={this.onChange}></input>
								<ProgressBar ref="progressBar"/>
								<ul ref="list" className="media-list grldForm">{
									this.state.skillets.map(function(item, index){
										return (
											<SkilletListItem openProfileDisplay={this.props.openProfileDisplay}
												openImageViewer={this.openImageViewer}
												userProfile={this.props.userProfile}>
												{item}
											</SkilletListItem>
										);
									}.bind(this))
								}</ul>
								
							</div>
						</div>
					</div>
				</div>
			);
		},
		toggle : function(userSkillet){
			$(React.findDOMNode(this.refs.term)).val("");
			$(React.findDOMNode(this)).modal("toggle");
			$(React.findDOMNode(this.refs.alert)).hide();
			var newState = this.getInitialState();
			this.setState(newState);			
		},
		onSubmit : function(userSkillet){
			if((this.state.skilletSearchTerm && this.state.skilletSearchTerm.trim() != null)
				|| userSkillet){
				var postState = this.state;
				postState.skillets = [];
				postState.error = "";
				if(userSkillet){
					postState["skilletUserId"] = this.props.userProfile.id;
				}
			var self = this;
			this.replaceState(postState);
			var postData = postState;
			this.refs.progressBar.toggle();
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				success: function(data, status){
					data = JSON.parse(data);
					self.refs.progressBar.toggle();
					if(!data.status){
						self.setState({skillets:data.results});
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
		}
	});
	return App;
});