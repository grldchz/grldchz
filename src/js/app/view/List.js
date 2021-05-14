/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	List.js is part of GRLDCHZ
	
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
	"jsx!view/ListItem",
	"controller/ListController"
], function ( $, React, Bootstrap, ProgressBar, ListItem, ListController ) {
	var App = React.createClass({
		start : 0,
		getInitialState:function(){
			return {
				store:[]
			};
		},
		searchPosts : function(searchTerm, fromDate, toDate){
			this.searchTerm = searchTerm;
			this.fromDate = fromDate;
			this.toDate = toDate;
			this.loadPosts();
		},
		loadPosts : function(more){
			this.refs.progressBar.toggle();
			if(more){
				this.start = this.start + 10;
			}
			else{
				this.start = 0;
			}
			ListController.getPosts(this.start, null, this.searchTerm, this.fromDate, this.toDate).done(function(response){
				this.refs.progressBar.toggle();
				if(response.status && response.status == "FAIL"){
					this.props.showLogin();
				}
				else if(response.status && response.status == "TERMS"){
					this.props.showTerms();
				}
				else{
					var store = response.results;
					if(more){
						var newStore = this.state.store;
						store.map(function(item, index){
							newStore.push(item);
						});
						store = newStore;
					}
					this.replaceState({store:store});
					$(React.findDOMNode(this.refs.moreBtn)).show();
				}
			}.bind(this));
		},
		componentDidMount:function(){
			$(React.findDOMNode(this.refs.moreBtn)).hide();
		},
		render:function(){
			return (
			<div>
				<ul ref="list" className="media-list">{
					this.state.store.map(function(item, index){
						return (
							<ListItem toggleLogin={this.props.toggleLogin} toggleList={this.toggle}
								 loadPosts={this.loadPosts}
								 userProfile={this.props.userProfile}
								openProfileDisplay={this.props.openProfileDisplay}
								openMediaDisplay={this.props.openMediaDisplay}>{item}</ListItem>
						);
					}.bind(this))
				}</ul>
				<button ref="moreBtn" type="button" className="gcotd-btn btn btn-default btn-lg pull-right" 
					onClick={this.getMorePosts}>
				  <span className="glyphicon gcotd-icon icon-more" aria-hidden="true"></span>
				</button>
				<ProgressBar ref="progressBar"/>
			</div>
			);
		},
		getMorePosts : function(e){
			this.loadPosts(true);
			e.preventDefault();
		},
		toggle : function(){
			$(React.findDOMNode(this.refs.list)).toggle();
			$(React.findDOMNode(this.refs.moreBtn)).toggle();
		}
	});
	return App;
});