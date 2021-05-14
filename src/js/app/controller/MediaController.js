/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	MediaController.js is part of GRLDCHZ
	
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
	var searchMedia = function (start, content_id, searchTerm, fromDate, toDate) {
			
			// load posts from server	
		var queryString = 'get=media&limit=10&sort=[{"property":"id","direction":"desc"}]';
		if(start){
			queryString += '&start='+start;
		}
		else{
			queryString += '&start=0';
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
		return service("GET", queryString);			
	};	
	var getMedia = function (content_id, id) {
			
			// load posts from server	
		var queryString = 'get=media&content_id='+content_id;
		if(id){
			queryString += "&" + "media_id=" + id;
		}
		return service("GET", queryString);		
	};
	var deleteMedia = function(mediaItem){
		var data = {deletefile:mediaItem.file, id:mediaItem.content_id};
		return service("POST", data);		
	};
	var rotateMedia = function(mediaItem, right){
		var data = {rotatefile:mediaItem.file, id:mediaItem.content_id};
		if(right){
			data["orientation"]=2;
		}
		else{
			data["orientation"]=1;
		}
		return service("POST", data);		
	};
	var reprocessMedia = function(mediaItem){
		var data = {reprocessFile:mediaItem.file, id:mediaItem.content_id};
		return service("POST", data);		
	};
	// public interface
	return {
		searchMedia : searchMedia,
		getMedia : getMedia,
		deleteMedia : deleteMedia,
		rotateMedia : rotateMedia,
		reprocessMedia : reprocessMedia
	};

	// private methods
	function getRandomInt (min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	function service(type, data){
		var deferred = $.Deferred();
		$.ajax({            
				type: type,
				url: gcotd+"/service.php",
				data: data,
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
		
	}
});
