import React from 'react';

class Clock extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			data: new Date(),
			font_style: {
				'color':'#fff',
				'fontSize':'2em',
				'fontWeight':800,
				'letterSpacing':'0.1em'
			},
			div_style: {
				'margin': '20px auto'
			}
		}
	}

	componentDidMount () {
		this.timerID = setInterval(
			() => this.tick(),
			1000
		)
	}

	componentWillMount () {
		clearInterval(this.timerID);
	}

	tick () {
		this.setState({
			data:new Date()
		})
	}

	render () {
		return (
			<div style={this.state.div_style}>
				<center style={this.state.font_style}>{this.state.data.toLocaleTimeString()}</center>
			</div>
		)
	}
}


export default Clock;