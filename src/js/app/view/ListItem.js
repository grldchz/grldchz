/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	ListItem.js is part of GRLDCHZ
	
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
	"jsx!view/CommentDisplay", 
	"jsx!view/ReplyList", 
	"jsx!view/Upload"
], function ( $, React, Bootstrap,
	CommentDisplay, ReplyList, Upload) {
	var App = React.createClass({
//		componentDidMount : function(){
//			setTimeout(this.refs.mediaScroller.init);
//		},
		render:function(){
			var buttonClassName = "gcotd-btn btn btn-default btn-lg pull-right";
			var buttonVisibility = "";
			var mediaNavBarClassName = "media-navbar";
			var mediaCount = parseInt(this.props.children.num_photos) + parseInt(this.props.children.num_videos);
			if(mediaCount == 0 && this.props.children.image == null 
				&& this.props.children.user_name != this.props.userProfile.name){
				//buttonClassName = buttonClassName + " hide";
				mediaNavBarClassName = mediaNavBarClassName + " hide";
			}
			if(this.props.children.user_name != this.props.userProfile.name){
				buttonVisibility = " hide";
			}
			var replyContainerClassName = "replyContainer"
			if(this.props.children.replies == 0){
				replyContainerClassName += " hide";
			}
			return (
				<li href="#" className="grldListItemContainer">
					<CommentDisplay buttonClassName={buttonClassName} 
						buttonVisibility={buttonVisibility}
						openMediaScroller={this.openMediaScroller}
						onComment={this.onComment}
						openProfileDisplay={this.props.openProfileDisplay}
						openMediaDisplay={this.props.openMediaDisplay}>{this.props.children}</CommentDisplay>
					<div className={mediaNavBarClassName}>
						<div className="navbar-brand"></div>
						<Upload className={buttonVisibility} ref="uploadForm" id={this.props.children.id}
							loadPosts={this.props.loadPosts}/>
					</div>
						<ReplyList
							userProfile={this.props.userProfile}
							onComment={this.onComment}
							openProfileDisplay={this.props.openProfileDisplay}
							openMediaDisplay={this.props.openMediaDisplay}>{this.props.children}</ReplyList>
				</li>
			);
		},
		openMediaScroller : function(e){
			e.stopPropagation();
			this.refs.uploadForm.reset();
			this.props.openMediaDisplay(this.props.children);
			return false;
		},
		onComment:function(){
			this.props.loadPosts();
		}		
	});
	return App;
});