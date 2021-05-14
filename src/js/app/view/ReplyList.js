/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	ReplyList.js is part of GRLDCHZ
	
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
], function ( $, React, Bootstrap, CommentDisplay ) {
	var App = React.createClass({
		render:function(){
			return (
			<div>
				<ul className="media-list">{
					this.props.children.replies.map(function(item, index){
						return this.renderReply(item);
					}.bind(this))
				}</ul>
			</div>
			);
		},
		renderReply : function(item){
			var buttonClassName = "gcotd-btn btn btn-default btn-lg pull-right";
			var buttonVisibility = "";
			if(item.user_name != this.props.userProfile.name){
				buttonVisibility = " noButton";
			}
			var replyContainerClassName = "replyContainer"
			if(item.replies == 0){
				replyContainerClassName += " hide";
			}
			var mediaContainerClassName = "media replyContainer"
			if(item.shared && item.shared == 1){
				mediaContainerClassName += " share";
				buttonClassName = " noButton";
			}
			return (
				<li href="#" className={mediaContainerClassName}>
					<CommentDisplay buttonClassName={buttonClassName} 
						buttonVisibility={buttonVisibility}
						onComment={this.props.onComment}
						openProfileDisplay={this.props.openProfileDisplay}
						openMediaDisplay={this.props.openMediaDisplay}>{item}</CommentDisplay>
						<ul className="media-list">{
								item.replies.map(function(reply, index){
									return this.renderReply(reply);
								}.bind(this))
							}</ul>
				</li>
			);
			
		}
	});
	return App;
});