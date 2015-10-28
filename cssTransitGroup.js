var React = require('react');
var _ = require('lodash');
var cx = require('classnames');

var CssTransitGroup = React.createClass({
	timeouts : [],
	getDefaultProps: function() {
		return {
			enterClassName : 'enter',
			leaveClassName : 'leave',
			timeout : 250
		};
	},
	getInitialState: function() {
		return {
			children: _.indexBy(this.props.children, 'key'),
			transitClasses : {}
		};
	},
	componentWillReceiveProps: function(nextProps){
		var self = this;
		var newChildren = _.indexBy(nextProps.children, 'key');

		var childrenEntering = _.filter(newChildren, function(child, key){
			return !self.state.children[key];
		})
		this.addChildren(childrenEntering);

		var childrenLeaving = _.filter(self.state.children, function(child, key){
			return !newChildren[key];
		})
		this.removeChildren(childrenLeaving);

		//always add all new children to state, updating their properties
		_.each(newChildren, function(child){
			self.state.children[child.key] = child;
		});

		self.setState({
			children : self.state.children,
			transitClasses : self.state.transitClasses
		});
	},
	componentWillUnmount: function() {
		_.each(this.timeouts, function(timeout){
			clearInterval(timeout);
		});
	},

	addChildren : function(children){
		var self = this;
		if(!children.length) return;
		_.each(children, function(child){
			self.state.transitClasses[child.key] = self.props.enterClassName
		});

		//Remove the enter transit class after timeout
		var timeoutID = setTimeout(function(){
			_.each(children, function(child){
				self.state.transitClasses[child.key] = '';
			});
			self.timeouts = _.pull(self.timeouts, timeoutID);
			self.setState({
				transitClasses : self.state.transitClasses
			})
		}, this.props.timeout);
		this.timeouts.push(timeoutID);
	},

	removeChildren : function(children){
		var self = this;
		if(!children.length) return;
		_.each(children, function(child){
			self.state.transitClasses[child.key] = self.props.leaveClassName
		});

		var timeoutID = setTimeout(function(){
			_.each(children, function(child){
				delete self.state.children[child.key];
				delete self.state.transitClasses[child.key];
			});
			self.timeouts = _.pull(self.timeouts, timeoutID);
			self.setState({
				children : self.state.children,
				transitClasses : self.state.transitClasses
			});
		}, this.props.timeout);
		this.timeouts.push(timeoutID);
	},

	renderChildren : function(){
		var self = this;
		return _.map(this.state.children, function(child){
			return React.cloneElement(child, {
				className : cx(child.props.className, self.state.transitClasses[child.key])
			});
		})
	},

	render : function(){
		return React.createElement(
			'span',
			{ className: cx('cssTransitGroup', this.props.className) },
			this.renderChildren()
		);
	},
});

module.exports = CssTransitGroup;