/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	Menu.js is part of GRLDCHZ
	
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
	"jsx!view/CommentForm",	
	"jsx!view/ProfileForm",	
	"jsx!view/SearchForm"
], function ( $, React, CommentForm, ProfileForm, SearchForm ) {
	var App = React.createClass({
		didScroll : false,
		lastScrollTop : 0,
		componentDidMount : function(){
			var self = this;
			$(window).scroll(function(event){
				self.didScroll = true;
			});
			setInterval(function() {
				if (self.didScroll) {
					self.hasScrolled();
					self.didScroll = false;
				}
			}, 250);
			
		},
		hasScrolled : function(){
			var delta = 5;
			var navbarHeight = $(React.findDOMNode(this)).outerHeight();
			var st = $(window).scrollTop();
			
			// Make sure they scroll more than delta
			if(Math.abs(this.lastScrollTop - st) <= delta)
				return;
			
			// If they scrolled down and are past the navbar, add class .nav-up.
			// This is necessary so you never see what is "behind" the navbar.
			if (st > this.lastScrollTop && st > navbarHeight){
				// Scroll Down
				$(React.findDOMNode(this)).removeClass('nav-down').addClass('nav-up');
			} else {
				// Scroll Up
				if(st + $(window).height() < $(document).height()) {
					$(React.findDOMNode(this)).removeClass('nav-up').addClass('nav-down');
				}
			}
			
			this.lastScrollTop = st;
		},
		render:function(){
			var imageButtonClassName = "gcotd-btn btn btn-default btn-lg pull-right";
			var guestLoginButtonClassName = 'hide';
			if(this.props.userProfile.name == 'guest'){
				guestLoginButtonClassName = 'btn btn-success';
			}
			return (
				<nav className="grldMenuBrown navbar navbar-default navbar-fixed-top">
					<button type="button" className={imageButtonClassName} onClick={this.props.onRefresh}>
					  <span className="glyphicon gcotd-icon icon-refresh" aria-hidden="true"></span>
					</button>
					<button type="button" className={imageButtonClassName} onClick={this.toggleCommentForm}>
					  <span className="glyphicon gcotd-icon icon-new" aria-hidden="true"></span>
					</button>
					<button type="button" className={imageButtonClassName} onClick={this.toggleProfileForm}>
					  <span className="glyphicon gcotd-icon icon-profile" aria-hidden="true"></span>
					</button>
					<button type="button" className={imageButtonClassName} onClick={this.toggleSearchForm}>
					  <span className="glyphicon gcotd-icon icon-search" aria-hidden="true"></span>
					</button>
					<button type="button" className={imageButtonClassName} onClick={this.props.toggleSearchSkilletForm}>
					  <span className="glyphicon gcotd-icon icon-search-users" aria-hidden="true"></span>
					</button>
					<button type="button" className={imageButtonClassName} onClick={this.props.toggleUserSkilletForm}>
					  <span className="glyphicon gcotd-icon icon-friends" aria-hidden="true"></span>
					</button>
					<button type="button" className={imageButtonClassName} onClick={this.props.openMediaList}>
					  <span className="glyphicon gcotd-icon icon-picture" aria-hidden="true"></span>
					</button>
					<a href="#" className={guestLoginButtonClassName} style={{margin:"3px"}} role="button" 
						onClick={this.props.showLogin}>Login</a>
					<CommentForm ref="commentForm" onComment={this.props.onComment}/>
					<ProfileForm ref="profileForm" onProfile={this.props.onProfile} 
						userProfile={this.props.userProfile}/>
					<SearchForm ref="searchForm" onSearch={this.props.onSearch}/>
				</nav>
			);
		},
		toggleCommentForm:function(){
			this.refs.commentForm.toggle();
		},
		toggleProfileForm:function(){
			this.refs.profileForm.toggle();
		},
		toggleSearchForm:function(e){
			this.refs.searchForm.toggle();
		}
	});
	return App;
});