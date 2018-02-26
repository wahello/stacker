import { observer } from 'mobx-react'
import * as React from 'react'

import AddIcon from 'material-ui-icons/Add'
import BlockIcon from 'material-ui-icons/Block'
import ForwardIcon from 'material-ui-icons/Forward'
import Button from 'material-ui/Button'
import { withStyles, WithStyles } from 'material-ui/styles'

import PalletRequest from '../../../stores/interfaces/PalletRequest'
import PalletSelectStore from '../../../stores/PalletSelectStore'
import PalletStore from '../../../stores/PalletStore'
import RequestsStore from '../../../stores/RequestsStore'

import ErrorSnackbar from '../../common/ErrorSnackbar'
import RequestList from '../../common/RequestList/RequestList'
import RequestListItemUser from '../../common/RequestList/RequestListItemUser'
import PalletInput from './PalletInput'
import PalletSelect from './PalletSelect'

interface Props {
	selectStore: PalletSelectStore,
	requests: RequestsStore,
	palletStore: PalletStore
}

type ClassKeys = (
	'root'
	| 'request'
	| 'inputs'
	| 'button'
	| 'requests'
)

const decorate = withStyles<ClassKeys>(() => ({
	root: {
		marginTop: 100
	},
	request: {
		display: 'flex',
		marginBottom: 64
	},
	inputs: {
		width: 400
	},
	button: {
		width: 48,
		height: 48,
		marginLeft: 16
	},
	requests: {
		marginBottom: 16
	}
}))

interface ItemProps { store: RequestsStore, request: PalletRequest }
const ListRequestedItem: React.SFC<ItemProps> = (props: ItemProps) => {
	const handleCancelRequest = () => this.props.store.cancel(props.request.id)

	return(
		<RequestListItemUser
			key={props.request.id}
			request={props.request}
			actionName="Zrušit"
			actionIcon={<BlockIcon />}
			handleAction={handleCancelRequest}
		/>
	)
}

const ListToDeliverItem: React.SFC<ItemProps> = (props: ItemProps) => {
	const handleReturnRequest = () => this.props.store.return(props.request.id)

	return(
		<RequestListItemUser
			key={props.request.id}
			request={props.request}
			actionName="Vrátit"
			actionIcon={<ForwardIcon />}
			handleAction={handleReturnRequest}
		/>
	)
}

@observer
class RequestPalletView extends React.Component<Props & WithStyles<ClassKeys>> {
	mapRequestedPallets = ((r: PalletRequest) => (
		<ListRequestedItem store={this.props.requests} request={r} />
	))

	mapToReturnPallets = ((r: PalletRequest) =>  (
		<ListToDeliverItem store={this.props.requests} request={r} />
	))

	handleCreateRequest = () => this.props.selectStore.createRequest()

	mapErrorHandler = (instance: ErrorSnackbar) => {
		if (instance) {
			this.props.selectStore.errorHandler = instance
		}
	}

	render() {
		return(
			<div className={this.props.classes.root}>
				<div className={this.props.classes.request}>
					<div className={this.props.classes.inputs}>
						<PalletInput
							store={this.props.selectStore}
						/>

						<PalletSelect
							store={this.props.selectStore}
						/>
					</div>

					<Button
						variant="fab"
						color="primary"
						aria-label="add"
						className={this.props.classes.button}
						disabled={this.props.selectStore.formMissingValues()}
						onClick={this.handleCreateRequest}
					>
						<AddIcon />
					</Button>
					<ErrorSnackbar ref={this.mapErrorHandler} />
				</div>

				<RequestList
					header="Zažádané palety"
					requests={this.props.requests}
					className={this.props.classes.requests}
					type="requested"
					mapListItemFunction={this.mapRequestedPallets}
				/>

				<RequestList
					header="Převzaté palety"
					requests={this.props.requests}
					className={this.props.classes.requests}
					type="delivered"
					mapListItemFunction={this.mapToReturnPallets}
				/>
			</div>
		)
	}
}

export default decorate(RequestPalletView)
