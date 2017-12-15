import * as React from 'react'
import { observer } from 'mobx-react'

import { withStyles, WithStyles } from 'material-ui/styles'
import { common } from 'material-ui/colors'

import RequestItem from './RequestItem'

import RequestsStore from '../../../stores/RequestsStore'
import RequestListCommon from '../../common/RequestList/RequestList'

interface Props {
	store: RequestsStore
}

type ClassKeys = (
	'root'
	| 'headline'
	| 'requestList'
)

const decorate = withStyles<ClassKeys>(() => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center'
	},
	headline: {
		color: common['lightBlack'],
		marginBottom: 8
	},
	requestList: {
		marginBottom: 32
	}
}))

@observer
class RequestList extends React.Component<Props & WithStyles<ClassKeys>> {
	render() {
		return(
			<div className={this.props.classes.root}>
				<RequestListCommon
					header="Zažádané palety"
					requests={this.props.store}
					type="requested"
					withPaper
					mapListItemFunction={(r => (
						<RequestItem
							key={r.id}
							request={r}
							deliver={() => this.props.store.deliver(r.id)}
							complete={() => this.props.store.complete(r.id)}
						/>
					))}
					className={this.props.classes.requestList}
				/>

				<RequestListCommon
					header="Palety k vraceni"
					requests={this.props.store}
					type="toReturn"
					withPaper
					mapListItemFunction={(r => (
						<RequestItem
							key={r.id}
							request={r}
							deliver={() => this.props.store.deliver(r.id)}
							complete={() => this.props.store.complete(r.id)}
						/>
					))}
					className={this.props.classes.requestList}
				/>

				<RequestListCommon
					header="Vyvezene palety"
					requests={this.props.store}
					type="delivered"
					className={this.props.classes.requestList}
				/>
			</div>
		)
	}
}

export default decorate(RequestList)