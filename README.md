# react-csstransitgroup
Replacement for [React's css transition group addon](https://facebook.github.io/react/docs/animation.html). It's API and feature set are much simpler, but is has far less dependacies than React's does.

### install

`npm install react-csstransitgroup`


### how to use

```
var CssTransitGroup = require('react-csstransitgroup');

var TodoList = React.createClass({
	getDefaultProps: function() {
		return {
			items : []
		};
	},

	render : function(){
		return <CssTransitGroup className='todoList' timeout={500}>
			{this.props.items}
		</CssTransitGroup>
	},
})
```

### props

CssTransitGroup has three props you can pass it:

* `enterClassName` *default: 'enter'* - the class given to the items upon entering. Removed after the timeout.
* `leaveClassName` *default: 'leave'* - the class given to the items upon leaving. Removed after the timeout.
* `timeout` *default: 250* - Number of milliseconds your animations are.

**note** : All children must have keys. Otherwise React will be mad.