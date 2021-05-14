/**
    GRLDCHZ - Social network built with jquery+react+bootstrap
	Terms.js is part of GRLDCHZ
	
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
		componentDidMount : function(){
			$(React.findDOMNode(this)).toggle();
		},
		getInitialState : function(){
			return { accept: "Terms", terms_accepted : 0,
				error: ""};
		},
		render : function(){
			return (
				<form ref="termsForm" role="form" onSubmit={this.onSubmit} className="termsForm">
					<Alert ref="alert">{this.state.error}</Alert>
<br/>
<blockquote>
Grilled Cheese of the Day is a free social networking platform  where you can post text,  
photos, and videos to share with friends and family.  
Grilled Cheese of the Day does not share information to anyone, period.  
Your account is completely private unless 
you accept somebody's Skillet request or somebody else accepts your Skillet 
request thereby allowing them to see your posts and you their's.  
There are no third party applications on 
Grilled Cheese of the Day.
</blockquote>
<br/>
<br/>
By registering for GRLDCHZ you agree to the following terms:
<br/>
<br/>
<ul>
<li>
You have provided your real first name, real last name, and real email address.
</li>
<li>
You shall upload only content (photos and videos) that were produced by you.
</li>
<li>  
You shall not upload copyrighted material that was copyrighted by someone other than you.
</li>
<li>
You shall not upload content (photos or videos) that: is hateful, threatening, or 
pornographic; incites violence; or contains nudity or graphic or gratuitous violence.
</li>
<li>
You will not upload viruses or other malicious code.
</li>
<li>
You will not post unauthorized commercial communications (such as spam) on 
Grilled Cheese of the Day.
</li>
<li>
You will not collect users' content or information, or otherwise access 
Grilled Cheese of the Day, using automated means (such as harvesting bots, robots, 
spiders, or scrapers) without my permission.
</li>
<li>
You will not engage in unlawful multi-level marketing, such as a pyramid scheme, on 
Grilled Cheese of the Day.
</li>
<li>
You will not solicit login information or access an account belonging to someone else.
</li>
<li>
You will not bully, intimidate, or harass any user.
</li>
<li>
You will not publicize or offer any contest, giveaway, or sweepstakes (“promotion”) on 
Grilled Cheese of the Day.
</li>
<li>
You will not use Grilled Cheese of the Day to do anything unlawful, misleading, malicious, 
or discriminatory.
</li>
<li>
You will not do anything that could disable, overburden, or impair the proper working of 
Grilled Cheese of the Day, such as a denial of service attack.
</li>
<li>
You will not facilitate or encourage any violations of these terms.
</li><li>
You will not provide any false personal information on Grilled Cheese of the Day, or create an 
account for anyone other than yourself without permission.
</li><li>
You will not create more than one personal profile.
</li><li>
If we disable your account, you will not create another one without our permission.
</li><li>
You will not use your personal profile for your own commercial gain (such as selling your 
status update to an advertiser).
</li><li>
You will not use Grilled Cheese of the Day if you are under 13.
</li><li>
You will not use Grilled Cheese of the Day if you are a convicted sex offender.
</li><li>
You will keep your contact information accurate and up-to-date.
</li><li>
You will not share your password, let anyone else access your account, or do anything 
else that might jeopardize the security of your account.
</li><li>
You will not post content or take any action on Grilled Cheese of the Day that infringes 
or violates someone else's rights or otherwise violates the law.
</li><li>
We can remove any content or information you post on Grilled Cheese of the Day if we believe 
that it violates this Statement.
</li><li>
If we remove your content for infringing someone else's copyright, and you believe we removed 
it by mistake, we will provide you with an opportunity to appeal.
</li><li>
If you repeatedly infringe other people's intellectual property rights, we will disable your 
account when appropriate.
</li><li>
If you collect information from users, you will: obtain their consent, make it clear you (and 
not Grilled Cheese of the Day) are the one collecting their information, and post a privacy 
policy explaining what information you collect and how you will use it.
</li><li>
You will not post anyone's identification documents or sensitive financial information on 
Grilled Cheese of the Day.
</li>
</ul>
			<nav className="navbar navbar-default navbar-fixed-bottom">
						<input type="hidden" 
							name="terms_accepted" 
							value="0"/>
			<button type="submit" className="btn btn-default btn-lg pull-right">Accept Terms</button>
			</nav>
				</form>			
			);
		},
		toggle : function(){
			$(React.findDOMNode(this)).toggle();
		},
		show : function(){
			$(React.findDOMNode(this)).show();
		},
		onSubmit : function(e){
			var self = this;
			e.preventDefault();
			$.ajax({            
				type: "POST",
				url: gcotd+"/auth/service.php",
				data: this.state,
				success: function(data, status){
					data = JSON.parse(data);
					if(!data.status){
						$(React.findDOMNode(self)).toggle();
						self.props.onAccept();
					}
					else{
						var newState = self.state;
						newState.error = data.msg;
						self.setState(newState);
						$(React.findDOMNode(self.refs.alert)).show();
					}
				},
				error: function(error){
					var newState = self.state;
					newState.error = error.statusText+" - "+error.responseText;
					self.setState(newState);
					$(React.findDOMNode(self.refs.alert)).show();
				}
			});
		},
		openRegister : function(e){
			this.toggle()
			this.register.open();
		}
	});
	return App;
});