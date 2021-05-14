/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	ImageViewer.js is part of GRLDCHZ
	
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
	"jquery.panzoom",
	"jquery.mousewheel",
	"jquery.doubletap"
], function ( $, React, Bootstrap, ProgressBar, Alert ) {
	var App = React.createClass({
		img : {}, 
		error : "",
		zoomOut:false,
		open:function(img){
			this.img=img;
			var self = this;
			$(React.findDOMNode(this.refs.setAsMainBtn)).show();
			$(React.findDOMNode(this.refs.setAsProfileBtn)).show();
			//$(React.findDOMNode(this.refs.unsetProfileBtn)).hide();
			if(img.user_name != this.props.userProfile.name){
				$(React.findDOMNode(this.refs.setAsMainBtn)).hide();
				$(React.findDOMNode(this.refs.setAsProfileBtn)).hide();
			}
			else if(this.props.userProfile.img_file && this.props.userProfile.img_file.indexOf(img.file) > -1){
				$(React.findDOMNode(this.refs.setAsProfileBtn)).hide();
				$(React.findDOMNode(this.refs.unsetProfileBtn)).show();
			}
			if(img.file.indexOf("img_profile_") > -1){
				$(React.findDOMNode(this.refs.setAsMainBtn)).hide();
			}
			this.refs.progressBar.hide();
			$(React.findDOMNode(this.refs.alert)).hide();
			$(React.findDOMNode(this.refs.img)).hide();
			$(React.findDOMNode(this.refs.loading)).show();
			$(React.findDOMNode(this.refs.img)).load(function() {
				$(React.findDOMNode(self.refs.img)).show();
				$(React.findDOMNode(self.refs.loading)).hide();
			}).attr('src', img.href);
			$(React.findDOMNode(this.refs.img)).width($(window).width()-30);
			$(React.findDOMNode(this)).modal("show");
			$(React.findDOMNode(this.refs.modalBody)).height($(window).height()-90);

			$panzoom=$(React.findDOMNode(this.refs.img)).panzoom();
			$(React.findDOMNode(this.refs.modalBody)).on('mousewheel.focal', function( e, delta ) {
				e.preventDefault();
				e.stopPropagation();
				var zoomOut = delta ? delta < 0 : e.originalEvent.deltaY > 0;
				$panzoom.panzoom('zoom', zoomOut, {
					increment: 0.1,
					animate: true,
					focal: e
				});
			});
			$(React.findDOMNode(this.refs.img)).addSwipeEvents().bind('doubletap', function(e, touch) {
				e.preventDefault();
				e.stopPropagation();
				e["clientX"] = touch.currentX;
				e["clientY"] = touch.currentY-200;
				$panzoom.panzoom('zoom', self.zoomOut, {
					increment: 1.5,
					animate: true,
					focal: e
				});
			});
			$(React.findDOMNode(this.refs.img)).dblclick(function(e) {
				e.preventDefault();
				e.stopPropagation();
				$panzoom.panzoom('zoom', self.zoomOut, {
					increment: 1.0,
					animate: true,
					focal: e
				});
			});
			$(React.findDOMNode(this.refs.img)).on("panzoomzoom", function(e, panzoom){
				self.zoomOut = !self.zoomOut;
			});
			$(React.findDOMNode(this)).on('hidden.bs.modal', function () {
				$panzoom.panzoom("reset");
				self.zoomOut = false;
				if($('.modal').hasClass('in')) {
					$('body').addClass('modal-open');
				}
			});
			$(React.findDOMNode(this.refs.downloadBtn)).attr('href', img.download);
		},
		render: function() {
			return (
				<div className="modal fade" role="dialog">
					<div className="modal-dialog">
						<div className="modal-content">
							<div className="modal-header">
								<button type="button" className="gcotd-btn btn btn-default btn-lg pull-right" 
									 data-dismiss="modal">
								  <span className="glyphicon gcotd-icon icon-close" aria-hidden="true"></span>
								</button>

								<div className="gcotd-btn dropdown pull-right">
								  <button className="btn btn-default dropdown-toggle" type="button" id="dropdownMenu1" 
									data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
									Image  <span className="caret"></span>
								  </button>
								  <ul className="dropdown-menu" aria-labelledby="dropdownMenu1">
									<li><a className="dropdown-item" href="" 
										download={this.img.file} ref="downloadBtn">Download Original</a></li>
									<li><a className="dropdown-item" href="#" 
										onClick={this.setMainImage} ref="setAsMainBtn">Set As Main Image</a></li>
									<li><a className="dropdown-item" href="#" 
										onClick={this.setProfileImage} ref="setAsProfileBtn">Set As Profile Image</a></li>
									<li><a className="dropdown-item" href="#" 
										onClick={this.setProfileImage} ref="unsetProfileBtn">Unset Profile Image</a></li>
								  </ul>
								</div>
								
								<Alert ref="alert">{this.error}</Alert>
								<ProgressBar ref="progressBar"/>
							</div>
							<div ref="modalBody" className="modal-body">
								<img ref="loading" src="img/blue-loading.gif" />
								<img ref="img" src="" className="media-img" />
							</div>
						</div>
					</div>
				</div>
			);
		},
		setMainImage:function(e){
			var postData = {
				main_img:this.img.file, 
				content_id:this.img.content_id
			};
			this.setImage(postData, this.setMainImageCallback)
		},
		setMainImageCallback:function(data, status){
			data = JSON.parse(data);
			this.refs.progressBar.toggle();
			if(!data.status){
				$(React.findDOMNode(this.refs.setAsMainBtn)).toggle();
			}
			else{
				this.error = data.msg;
				$(React.findDOMNode(this.refs.alert)).show();
			}
			
		},
		setProfileImage: function(e){
			var postData = {
				profile_img:this.img.file, 
				content_id:this.img.content_id
			};
			if(e.currentTarget.innerHTML.indexOf("Unset") > -1){
				postData["unset"] = true;
			}
			this.setImage(postData, this.setProfileImageCallback);
			
		},
		setProfileImageCallback:function(data, status){
			data = JSON.parse(data);
			this.refs.progressBar.toggle();
			if(!data.status){
				$(React.findDOMNode(this.refs.setAsProfileBtn)).toggle();
				$(React.findDOMNode(this.refs.unsetProfileBtn)).toggle();
				this.props.updateProfileImage(data);
			}
			else{
				this.error = data.msg;
				$(React.findDOMNode(this.refs.alert)).show();
			}
		},
		setImage:function(postData, setImageCallback){
			this.refs.progressBar.toggle();
			$.ajax({            
				type: "POST",
				url: gcotd+"/service.php",
				data: postData,
				context: this,
				success: setImageCallback,
				error: function(error){
					this.refs.progressBar.toggle();
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