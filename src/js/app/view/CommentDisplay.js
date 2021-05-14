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
	"jsx!view/CommentForm",
	"jsx!view/Confirmation"
], function ( $, React, Bootstrap, CommentForm, Confirmation ) {
	var App = React.createClass({
		render : function(){
			return (<div>
					<div className="media-left">
						{this.renderImg()}
					</div>
					<div id={this.props.children.id} className="media-body">
						<h4 className="media-heading">
							{this.props.children.first_name} @ {this.props.children.post_date_time}
							<button type="button" className={this.props.buttonClassName} 
								onClick={this.toggleShareCommentForm}>
							  <span className="glyphicon gcotd-icon icon-share" aria-hidden="true"></span>
							</button>
							<button type="button" className={this.props.buttonClassName} 
								onClick={this.toggleReplyCommentForm}>
							  <span className="glyphicon gcotd-icon icon-reply" aria-hidden="true"></span>
							</button>
							<button type="button" className={this.props.buttonClassName+this.props.buttonVisibility} 
								onClick={this.toggleDeleteConfirm}>
							  <span className="glyphicon gcotd-icon icon-delete" aria-hidden="true"></span>
							</button>
							<button type="button" className={this.props.buttonClassName+this.props.buttonVisibility} 
								onClick={this.toggleEditCommentForm}>
							  <span className="glyphicon gcotd-icon icon-edit" aria-hidden="true"></span>
							</button>
						</h4>
						{this.renderMainImage()}
						<p className="media-text" 
							dangerouslySetInnerHTML={{__html: this.getComment()}}></p>
					</div>
					<CommentForm ref="editCommentForm" editComment={this.props.children} onComment={this.props.onComment}/>
					<CommentForm ref="replyCommentForm" parentId={this.props.children.id} onComment={this.props.onComment}/>
					<CommentForm ref="shareCommentForm" shareId={this.props.children.id} onComment={this.props.onComment}>
					<p className="pull-right"><a href={this.getShareUrl()}>{this.getShareUrl()}</a> </p>
					<br/><br/><br/></CommentForm>
					<Confirmation ref="deleteConfirm" confirm={this.onConfirm}>
						Are you sure you want to delete this message?
					</Confirmation>
					</div>
			);
		},
		getShareUrl : function(){
			var url = window.location.href;
			if(url.indexOf("?")>-1){
				url = url.substring(0, url.indexOf("?")-1);
			}
			return url + "?content_id=" + this.props.children.id;
		},
		renderMainImage:function(){
			var buttonClassName = "gcotd-btn btn btn-default btn-lg pull-right";
			var buttonVisibility = "";
			var mainImageClassName = "mainImage";
			var mediaNavBarClassName = "media-navbar";
			var imageButtonClassName = buttonClassName;
			var videoButtonClassName = buttonClassName;
			if(this.props.children.image == null){
				mainImageClassName = mainImageClassName + " hide";
			}
			var mediaCount = parseInt(this.props.children.num_photos) + parseInt(this.props.children.num_videos);
			if(mediaCount == 0 && this.props.children.image == null){
				mediaNavBarClassName = mediaNavBarClassName + " hide";
			}
			if(parseInt(this.props.children.num_photos) == 0){
				imageButtonClassName = imageButtonClassName + " hide";
			}
			if(parseInt(this.props.children.num_videos) == 0){
				videoButtonClassName = videoButtonClassName + " hide";
			}
			var src = gcotd+"/getfile.php?media=media/"
				+ this.props.children.user_name+ "/" 
				+ this.props.children.image;
			return (
			<div>
				<img src={src} className={mainImageClassName} onClick={this.openMediaScroller}/>
				<button type="button" className={imageButtonClassName} onClick={this.openMediaScroller}>
				  <span className="glyphicon gcotd-icon icon-picture" aria-hidden="true"></span>
				  <div className="mediaCount">{this.props.children.num_photos>0?this.props.children.num_photos:""}</div>
				</button>
				<button type="button" className={videoButtonClassName} onClick={this.openMediaScroller}>
				  <span className="glyphicon gcotd-icon icon-video" aria-hidden="true"></span>
				  <div className="mediaCount">{this.props.children.num_videos>0?this.props.children.num_videos:""}</div>
				</button>
				</div>
			);
		},
		openMediaScroller : function(e){
			e.stopPropagation();
			this.props.openMediaDisplay(this.props.children);
			return false;
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
		toggleEditCommentForm:function(){
			this.refs.editCommentForm.toggle();
		},
		toggleReplyCommentForm:function(){
			this.refs.replyCommentForm.toggle();
		},
		toggleShareCommentForm:function(){
			this.refs.shareCommentForm.toggle();
		},
		toggleDeleteConfirm:function(){
			this.refs.deleteConfirm.toggle();
		},
		onConfirm:function(){
			var self = this;
			var postData = {deleteid:this.props.children.id};
			$.ajax({            
				type: "POST",
				data:postData,
				url: gcotd+"/service.php",
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						self.refs.deleteConfirm.toggle();
						self.props.onComment();
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
		getComment:function () {
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
			var str = this.props.children.comment;
			return (str + '')
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
				})
			}
	});
	return App;
});