/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	MediaContainer.js is part of GRLDCHZ
	
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
	"controller/MediaController",
	"jsx!view/CaptionForm",
	"jsx!view/Confirmation",
	"jsx!view/ProgressBar"
], function ( $, React, MediaController, CaptionForm, Confirmation, ProgressBar ) {
	var App = React.createClass({
		getInitialState: function() {
			return {
			  media:null
			};
		},
		componentWillMount: function() {
			if(this.props.media){
				this.setState({media:this.getMedia(this.props.media)});
			}
		},
		componentDidMount:function(){
			this.setupComponent();
		},
		componentDidUpdate:function(){
			this.setupComponent();
		},
		setupComponent: function(){
			var self = this;
			if(this.props.render && this.props.render == true){
				$(React.findDOMNode(this.refs.img)).hide();
				$(React.findDOMNode(this.refs.loading)).show();
				$(React.findDOMNode(this.refs.img)).load(function() {
					self.hideLoading();
				}.bind(this)).attr('src', this.state.media.src);
				if(!this.state.media.is_image){
					this.hideLoading();
				}
			}
		},
		hideLoading:function(){
			$(React.findDOMNode(this.refs.img)).show();
			$(React.findDOMNode(this.refs.loading)).hide();
			if($(React.findDOMNode(this.refs.img)).width() > $(window).width()){
				$(React.findDOMNode(this.refs.img)).width($(window).width()-70);
			}
		},
		toggleReprocessConfirm:function(){
			this.refs.reprocessConfirm.toggle();
		},
		toggleRotateRightConfirm:function(){
			this.refs.rotateRightConfirm.toggle();
		},
		toggleRotateLeftConfirm:function(){
			this.refs.rotateLeftConfirm.toggle();
		},
		toggleDeleteMeConfirm:function(){
			this.refs.deleteMeConfirm.toggle();
		},
		rotateRight:function(){
			this.rotate(true);
		},
		rotateLeft:function(){
			this.rotate();
		},
		rotate:function(right){
			if(right){
				this.toggleRotateRightConfirm();
			}
			else{
				this.toggleRotateLeftConfirm();
			}
			this.refs.progressBar.toggle();
			MediaController.rotateMedia(this.state.media).done(function(response){
				if(response.status && response.status == "FAIL"){
					this.refs.progressBar.toggle();
					alert(response.msg);
				}
				else{
					var newId = response;
					MediaController.getMedia(this.state.media.content_id, newId)
							.done(function(response){
						this.refs.progressBar.toggle();
						if(response.status && response.status == "FAIL"){
							alert(response.msg);
						}
						else{
							this.setState({media:this.getMedia(response.results[0])});
						}
					}.bind(this));
				}
			}.bind(this));
		},
		reprocessMedia:function(){
			this.toggleReprocessConfirm();
			this.refs.progressBar.toggle();
			MediaController.reprocessMedia(this.state.media).done(function(response){
				if(response.status && response.status == "FAIL"){
					this.refs.progressBar.toggle();
					alert(response.msg);
				}
				else{
					var newId = response;
					MediaController.getMedia(this.state.media.content_id, newId)
							.done(function(response){
						this.refs.progressBar.toggle();
						if(response.status && response.status == "FAIL"){
							alert(response.msg);
						}
						else{
							this.setState({media:this.getMedia(response[0])});
						}
					}.bind(this));
				}
			}.bind(this));
		},
		deleteMe:function(){
			this.refs.progressBar.toggle();
			MediaController.deleteMedia(this.state.media).done(function(response){
				this.refs.progressBar.toggle();
				if(response.status && response.status == "FAIL"){
					alert(response.msg);
				}
				else{
					$(React.findDOMNode(this)).hide();
				}
			}.bind(this));
		},
		render: function() {
			var media = this.renderMedia();
			var reprocessBtnCss = "hide";//this.props.mediaButtonClassName;
			var rotateBtnCss = "hide";
			if(this.state.media.is_image){
				reprocessBtnCss = "hide";
				rotateBtnCss = this.props.mediaButtonClassName+this.props.buttonVisibility;
			}
			return (
				<div className="mediaContainer">
					<div className="mediaButtons">
						<button type="button" className={reprocessBtnCss} 
							onClick={this.toggleReprocessConfirm}>
						  <span className="glyphicon gcotd-icon icon-reprocess" aria-hidden="true"></span>
						</button>
						<button type="button" className={rotateBtnCss} 
							onClick={this.toggleRotateRightConfirm}>
						  <span className="glyphicon gcotd-icon icon-rotate-right" aria-hidden="true"></span>
						</button>
						<button type="button" className={this.props.mediaButtonClassName+this.props.buttonVisibility} 
							onClick={this.toggleDeleteMeConfirm}>
						  <span className="glyphicon gcotd-icon icon-delete" aria-hidden="true"></span>
						</button>
					<button type="button" className={this.props.mediaButtonClassName+this.props.buttonVisibility} 
						onClick={this.toggleEditCaptionForm}>
					  <span className="glyphicon gcotd-icon icon-edit" aria-hidden="true"></span>
					</button>
					</div>
					<CaptionForm ref="editCaptionForm" editCaption={this.state.media} onCaption={this.onCaption}/>
					<Confirmation ref="deleteMeConfirm" confirm={this.deleteMe}>
						Are you sure you want to delete this media?
					</Confirmation>
					<Confirmation ref="reprocessConfirm" confirm={this.reprocessMedia}>
						Are you sure you want to reprocess this media?
					</Confirmation>
					<Confirmation ref="rotateRightConfirm" confirm={this.rotateRight}>
						Are you sure you want to rotate this media to the right?
					</Confirmation>
					<Confirmation ref="rotateLeftConfirm" confirm={this.rotateLeft}>
						Are you sure you want to rotate this media to the left?
					</Confirmation>
					<ProgressBar ref="progressBar"/>
					{media}
				</div>
			);
		},
		renderMedia:function(){
			var views = " views: " + this.state.media.num_hits;
			var title = this.getCaption();
			if(this.state.media.is_image){
				return (
				    <div className="mediaContainerMedia">
					<img ref="loading" src="img/blue-loading.gif" />
					<img ref="img" src="" 
						title={title} className="media-img"
						onClick={this.openImageViewer}/>
					<div ref="mediaCaption" className="mediaTitle">{title}</div>
					<div className="mediaViews">{views}</div>
					</div>
				);
			}
			else{
				return  (
				    <div className="mediaContainerMedia">
					<div className="embed-responsive embed-responsive-16by9">
						<video controls="true" className="embed-responsive-item"
							poster={this.state.media.poster}>
							<source src={this.state.media.mp4src} type="video/mp4" />
						</video>
					</div>					
					<div className="mediaTitle">{title}</div>
					<div className="mediaViews">{views}</div>
					</div>
				);
			}
			
		},
		onCaption:function(newCaption){
			var newState = this.state;
			newState.media.title = newCaption;
			this.setState(newState);
		},
		toggleEditCaptionForm:function(){
			this.refs.editCaptionForm.toggle();
		},
		getMedia:function(media){
			if(media.is_image){
				var src = gcotd+"/getfile.php?media=media/"
					+ media.user_name+ "/" 
					+ media.content_id + "/img_slide_" 
					+ media.file + ".jpeg";
				media["src"] = src;
				var href = gcotd+"/getfile.php?media=media/"
					+ media.user_name+ "/" 
					+ media.content_id + "/img_full_" 
					+ media.file + ".jpeg";
				media["href"] = href;
				var download = gcotd+"/getfile.php?media=media/"
					+ media.user_name+ "/" 
					+ media.content_id + "/src/" 
					+ media.file;
				media["download"] = download + "&original=true";
			}
			else{
				var webmsrc = gcotd+"/getfile.php?media=media/"
					+ media.user_name+ "/" 
					+ media.content_id + "/proxy_med_" 
					+ media.file + ".webm";
				var mp4src = gcotd+"/getfile.php?media=media/"
					+ media.user_name+ "/" 
					+ media.content_id + "/proxy_mp4_" 
					+ media.file + ".mp4";
				var poster = gcotd+"/getfile.php?media=media/"
					+ media.user_name+ "/" 
					+ media.content_id + "/vid_frame_" 
					+ media.file + ".jpeg";
				media["webmsrc"] = webmsrc;
				media["mp4src"] = mp4src;
				media["poster"] = poster;
			}
			return media;
		},
		openImageViewer:function(e){
			e.stopPropagation();
			this.props.openImageViewer(this.state.media);
			return false;
		},
		getCaption:function () {
			// copied from http://locutusjs.io/php/strings/stripslashes/
			//       discuss at: http://locutusjs.io/php/stripslashes/
			//      original by: Kevin van Zonneveld (http://kvz.io)
			//      improved by: Ates Goral (http://magnetiq.com)
			//      improved by: marrtins
			//      improved by: rezna
			//         fixed by: Mick@el
			//      bugfixed by: Onno Marsman (https://twitter.com/onnomarsman)
			//      bugfixed by: Brett Zamir (http://brett-zamir.me)
			//         input by: Rick Waldron
			//         input by: Brant Messenger (http://www.brantmessenger.com/)
			// reimplemented by: Brett Zamir (http://brett-zamir.me)
			//        example 1: stripslashes('Kevin\'s code')
			//        returns 1: "Kevin's code"
			//        example 2: stripslashes('Kevin\\\'s code')
			//        returns 2: "Kevin\'s code"
			var title = this.state.media.title;
			var file = this.state.media.file;
			ret = "";
			if(title != file){
				ret = (title + '')
				.replace(/\\(.?)/g, function (s, n1) {
					switch (n1) {
						case '\\':
							return '\\'
						case '0':
							return '\u0000'
						case '':
							return ''
						default:
							return n1
					}
				});
			}
			return ret;
		}
	});
	return App;
});