/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	app.js is part of GRLDCHZ
	
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
	"jsx!view/Menu",
	"jsx!view/List",
	"jsx!view/Login",
	"jsx!view/Register",
	"jsx!view/Forgot",
	"jsx!view/Terms",	
	"jsx!view/SearchSkilletForm",
	"jsx!view/ProfileDisplay",
	"jsx!view/ImageViewer",
	"jsx!view/MediaDisplay",
	"jsx!view/MediaList",
	"jsx!view/ProgressBar"
], function ( $, React, Menu, List, Login, Register, Forgot, Terms, 
		SearchSkilletForm, ProfileDisplay, ImageViewer, MediaDisplay, MediaList, ProgressBar ) {
	var App = React.createClass({
		getInitialState : function(){
			return { userProfile: "" };
		},
		componentWillMount : function(){
			this.loadPosts();
		},
		render:function(){
			return (
				<div className="app">
					<Login ref="loginForm" onLogin={this.onLogin} 
						openRegister={this.showRegister} hideRegister={this.hideRegister} 
						openForgot={this.showForgot}/>
					<Register ref="registerForm" hideRegister={this.hideRegister}/>
					<Forgot ref="forgotForm" hideForgot={this.hideForgot}/>
					<Terms ref="termsForm" onAccept={this.onLogin}/>
					<SearchSkilletForm ref="searchSkilletForm" openProfileDisplay={this.openProfileDisplay} 
						onSearch={this.props.onSkilletSearch}
						userProfile={this.state.userProfile} headerTitle="Search Users"/>
					<SearchSkilletForm ref="userSkilletForm" openProfileDisplay={this.openProfileDisplay} 
						onSearch={this.props.onSkilletSearch}
						userProfile={this.state.userProfile} headerTitle="Your Friends"/>
					<ProfileDisplay ref="profileDisplay" openImageViewer={this.openImageViewer}/>
					<MediaList ref="mediaList" 
						toggleLogin={this.toggleLogin}
						toggleList={this.toggleList}
						toggleProgressBar={this.toggleProgressBar}
						userProfile={this.state.userProfile}
						openImageViewer={this.openImageViewer}/>				
					<ProgressBar ref="progressBar"/>
					<MediaDisplay ref="mediaDisplay" 
						toggleLogin={this.toggleLogin}
						toggleList={this.toggleList}
						userProfile={this.state.userProfile}
						openImageViewer={this.openImageViewer}/>				
					<ImageViewer ref="imageViewer" userProfile={this.state.userProfile} updateProfileImage={this.updateProfileImage}/>
					<Menu ref="menu" toggleCommentForm={this.toggleCommentForm}
						onComment={this.onComment} onProfile={this.onProfile}
						onSearch={this.onSearch} onRefresh={this.onRefresh}
						userProfile={this.state.userProfile}
						toggleSearchSkilletForm={this.toggleSearchSkilletForm}
						toggleUserSkilletForm={this.toggleUserSkilletForm}
						openMediaList={this.openMediaList} showLogin={this.showLogin}/>
					<List ref="list" showLogin={this.showLogin} 
						showTerms={this.showTerms}
						userProfile={this.state.userProfile}
						openProfileDisplay={this.openProfileDisplay}
						openMediaDisplay={this.openMediaDisplay}/>
				</div>
			);
		},
		showLogin : function(){
			this.refs.loginForm.show();
		},
		showRegister : function(){
			this.refs.loginForm.toggle();
			this.refs.registerForm.show();
		},
		hideRegister : function(){
			this.refs.loginForm.toggle();
			this.refs.registerForm.hide();
		},
		showForgot : function(){
			this.refs.loginForm.toggle();
			this.refs.forgotForm.show();
		},
		hideForgot : function(){
			this.refs.loginForm.toggle();
			this.refs.forgotForm.hide();
		},
		showTerms : function(){
			this.refs.termsForm.show();
		},
		hideTerms : function(){
			this.refs.termsForm.hide();
		},
		toggleLogin : function(){
			this.refs.loginForm.toggle();
		},
		toggleList : function(){
			this.refs.list.toggle();
		},
		toggleProgressBar : function(){
			this.refs.progressBar.toggle()
		},
		onLogin : function(){
			window.location.reload();
			//this.loadPosts();
		},
		onRefresh:function(){
			this.refs.list.searchTerm = null;
			this.refs.list.loadPosts();
		},
		onComment:function(){
			this.refs.list.loadPosts();
		},
		onProfile:function(){
			this.loadPosts();
		},
		onSkilletSearch:function(){
			this.loadPosts();
		},
		onSearch:function(term, from, to, searchMedia){
			if(searchMedia){
				this.refs.mediaList.open(term, from, to);
			}
			else{
				this.refs.list.searchPosts(term, from, to);
			}
		},
		loadPosts : function(){
			var self = this;
			$.ajax({            
				type: "GET",
				url: gcotd+"/service.php?get=profile",
				success: function(data, status){
					var jsonData = JSON.parse(data);
					if(!jsonData.status){
						var newState = {};
						newState["userProfile"] = jsonData;
						self.setState(newState);
						self.refs.list.loadPosts();
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
		toggleSearchSkilletForm : function(e){
			e.stopPropagation();
			this.refs.searchSkilletForm.toggle();
			return false;
		},
		toggleUserSkilletForm : function(e){
			e.stopPropagation();
			this.refs.userSkilletForm.toggle(true);
			this.refs.userSkilletForm.onSubmit(true);
			return false;
		},
		openImageViewer:function(image){
			if(this.refs.imageViewer){
				this.refs.imageViewer.open(image);
			}
			return false;
		},
		openMediaDisplay:function(listItem, e){
			if(this.refs.mediaDisplay){
				this.refs.mediaDisplay.open(listItem);
			}
		},
		openMediaList:function(e){
			if(this.refs.mediaList){
				this.refs.mediaList.open();
			}
		},
		openProfileDisplay:function(profileDisplay){
			// preload the imageViewer
			var img = null;
			if(profileDisplay.img_file){
				var href_file = profileDisplay.img_file.replace(/img_thumb_/, "img_full_");
				var img_href = gcotd + "/getfile.php?media=media/"
					+ profileDisplay.user_name + "/" + href_file;
				img = {
					href:img_href, 
					user_name:profileDisplay.user_name, 
					content_id:profileDisplay.img_file.split("/")[0],
					file:profileDisplay.img_file.split("/")[1].replace(/img_thumb_/, "img_profile_")
				};	
			}
			this.refs.profileDisplay.open(profileDisplay, img);
			return false;
		},
		updateProfileImage:function(img){
			var newProfile = this.state.userProfile;
			newProfile.img_file = img;
			this.setState({userProfile:newProfile});
		}
	});
	return App;
});