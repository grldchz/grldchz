/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	SearchForm.js is part of GRLDCHZ
	
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
	"jsx!view/Alert"
], function ( $, React, Bootstrap, Alert ) {
	var App = React.createClass({
		componentDidMount:function(){
			$(React.findDOMNode(this)).toggle();
		},
		getInitialState : function(){
			return { term: "", error: "", fromDate: "", toDate: "", searchMedia: false};
		},
		onChange : function(e){
			var data = {};
			data[e.currentTarget.name] = e.currentTarget.value;
			this.setState(data);
		},
		onCheck : function(e){
			var data = {};
			data[e.currentTarget.name] = e.currentTarget.checked;
			this.setState(data);
		},
		render : function(){
			return (
				<form role="form" onSubmit={this.onSubmit} className="grldForm">
					<Alert ref="alert">{this.state.error}</Alert>
					<div className="grld-form form-group">
						<label for="term">Search Term</label>
						<input ref="term" className="form-control" name="term" onChange={this.onChange}></input>
						<label for="fromDate">From</label>
						<input ref="fromDate" className="form-control" name="fromDate" onChange={this.onChange}
						    type="date" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"></input>
						<label for="toDate">To</label>
						<input ref="toDate" className="form-control" name="toDate" onChange={this.onChange}
						    type="date" pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" placeholder="YYYY-MM-DD"></input>
						<div className="checkbox">
							<label>
								<input type="checkbox" ref="searchMedia" name="searchMedia" 
								onChange={this.onCheck} id="searchMedia"></input>Search Media Only</label>
						</div>  
					</div>
					<button type="submit" className="btn btn-default">Submit</button>
					<button type="button" className="btn btn-default" onClick={this.toggle}>Cancel</button>
					<button type="button" className="btn btn-default" onClick={this.clear}>Clear</button>
				</form>			
			);
		},
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
			$(React.findDOMNode(this.refs.alert)).hide();
		},
		clear : function(){
			$(React.findDOMNode(this.refs.term)).val("");
			$(React.findDOMNode(this.refs.fromDate)).val("");
			$(React.findDOMNode(this.refs.toDate)).val("");
			this.setState({ term: "", error: "", fromDate: "", toDate: ""});
		},
		onSubmit : function(e){
			e.preventDefault();
			this.props.onSearch(this.state.term, this.state.fromDate, this.state.toDate, this.state.searchMedia);
			$(React.findDOMNode(this)).toggle();
		}
	});
	return App;
});