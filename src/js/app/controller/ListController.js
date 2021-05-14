/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	ListController.js is part of GRLDCHZ
	
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
	"jquery"
], function ( $ ) {
	var getPosts = function (start, content_id, searchTerm, fromDate, toDate) {
			
			// load posts from server	
		var queryString = 'limit=10&sort=[{"property":"id","direction":"desc"}]';
		if(start){
			queryString += '&start='+start;
		}
		else{
			queryString += '&start=0';
		}
		if(content_id){
			queryString += '&content_id='+content_id;
		}
		else if(getParameterByName("content_id")){
			queryString += '&content_id='+getParameterByName("content_id");
		}
		if(searchTerm){
			queryString += '&searchTerm='+searchTerm;
		}
		if(fromDate){
			queryString += '&fromDate='+fromDate;
		}
		if(toDate){
			queryString += '&toDate='+toDate;
		}
		var deferred = $.Deferred();
		$.ajax({            
				type: "get",
				url: gcotd+"/service.php?get=posts",
				data: queryString,
				contentType:"application/json; charset=utf-8",
				dataType: "json",
				success: successFunc,
				error: errorFunc
		});
	
		function successFunc(data, status){
			deferred.resolve(data);
		}

		function errorFunc(error){
			deferred.resolve(error);
		}	
		return deferred.promise();		
	};	
	// public interface
	return {
		getPosts : getPosts
	};

	// private methods
	function getRandomInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function getParameterByName(name) {
		name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
		var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
			results = regex.exec(location.search);
		return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
	}
});