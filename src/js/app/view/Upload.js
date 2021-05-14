/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	Upload.js is part of GRLDCHZ
	
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
	"jsx!view/Alert", "jquery.ui.widget", "jquery.iframe-transport", "jquery.fileupload"
], function ( $, React, Bootstrap, Alert ) {
	var App = React.createClass({
		doneAll:false,
		getInitialState : function(){
			return { error: ""};
		},
		componentDidMount : function(){
			this.initializedUpload();
		},
		componentDidUpdate : function(){
			this.initializedUpload();
		},
		render : function(){
			return (
				<div className={this.props.className}>
					<Alert ref="alert">{this.state.error}</Alert>
					<span className="gcotd-btn btn btn-default btn-lg pull-right fileinput-button">
						<span className="glyphicon gcotd-icon icon-upload" aria-hidden="true"></span>
						<input ref="fileupload" type="file" name="upl[]" multiple/>
					</span>
					<br/>
					<div ref="progress" className="progress">
						<div className="progress-bar progress-bar-success"></div>
					</div>
					<div ref="files" className="files"></div>
				</div>
			);
		},
		reset : function(){
			$(React.findDOMNode(this.refs.progress)).hide();
			$(React.findDOMNode(this.refs.files)).empty();
			$(React.findDOMNode(this.refs.progress)).find('.progress-bar').css(
				'width', '0%'
			);
			this.setState({ error: ""});
			$(React.findDOMNode(this.refs.alert)).hide();

		},
		initializedUpload : function(){
			// Change this to the location of your server-side upload handler:
			var url = gcotd + "/upload.php?id=" + this.props.id;
			var self = this;
			$(React.findDOMNode(self.refs.progress)).hide();
			$(React.findDOMNode(this.refs.fileupload)).fileupload({
				url: url,
				dataType: 'json',
				sequentialUploads: true,
				add: function (e, data) {
						self.reset();
					var submitFiles = [];
					$.each(data.files, function (index, file) {
						console.log('Added file: ' + file.name);
						if(self.isImage(file.name) || self.isMp4(file.name)){
							submitFiles.push(file);
						}
						else{
							$('<div class="upload-failure">').html('<div><span class="glyphicon glyphicon-remove-sign"></span> '+file.name+': Only image files and MP4s allowed.</div>')
								.appendTo($(React.findDOMNode(self.refs.files)));
						}
					});
					data.files = submitFiles;
					data.submit();
				},
				done: function (e, data) {
					if(data.result.status == "success"){
						$.each(data.files, function (index, file) {						
							$('<div class="upload-ok">').html('<div><span class="glyphicon glyphicon-ok-sign"></span> '+file.name+'</div>')
								.appendTo($(React.findDOMNode(self.refs.files)));
						});
						if(self.doneAll==true){
							self.props.loadPosts();
							self.reset();
						}	
					}
					else{
						var newState = self.state;
						newState.error = data.result.msg;
						self.setState(newState);
						$(React.findDOMNode(self.refs.alert)).show();
					}
				},
				progressall: function (e, data) {
					var progress = parseInt(data.loaded / data.total * 100, 10);
					$(React.findDOMNode(self.refs.progress)).show();
					$(React.findDOMNode(self.refs.progress)).find('.progress-bar').css(
						'width',
						progress + '%'
					);
					if(data.loaded == data.total){
						self.doneAll=true;
					}
				}
			}).prop('disabled', !$.support.fileInput)
				.parent().addClass($.support.fileInput ? undefined : 'disabled');

		},
		
		getExtension : function(filename) {
			var parts = filename.split('.');
			return parts[parts.length - 1];
		},

		isImage : function(filename) {
			var ext = this.getExtension(filename);
			switch (ext.toLowerCase()) {
			case 'jpg':
			case 'gif':
			case 'bmp':
			case 'png':
            case 'jpe':
            case 'jpeg':
            case 'ico':
            case 'tiff':
            case 'tif':
            case 'svg':
            case 'svgz':
				return true;
			}
			return false;
		},

		isVideo : function(filename) {
			var ext = this.getExtension(filename);
			switch (ext.toLowerCase()) {
			case 'm4v':
			case 'avi':
			case 'mpg':
			case 'mp4':
			case 'mov':
            case 'qt':
            case 'flv':
            case 'wmv':
            case 'webm':
            case 'ogv':
            case 'rm':
				return true;
			}
			return false;
		},
		isMp4 : function(filename) {
			var ext = this.getExtension(filename);
			if(ext.toLowerCase() === 'mp4') {
				return true;
			}
			return false;
		}
	});
	return App;
});