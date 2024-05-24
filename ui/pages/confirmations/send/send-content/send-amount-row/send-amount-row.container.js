import { connect } from 'react-redux';
import {
  updateSendAmount,
  getSendAmount,
  sendAmountIsInError,
  getSendAsset,
} from '../../../../../ducks/send';
import {
  getSelectedStatus,
  checkAmountsVariable
} from '../../../../../selectors';
import {
  updateRemoteAmount
} from '../../../../../store/actions';
import SendAmountRow from './send-amount-row.component';

export default connect(mapStateToProps, mapDispatchToProps)(SendAmountRow);

function mapStateToProps(state) {
  const selectedStatus = getSelectedStatus(state);
  return {
    amount: getSendAmount(state),
    inError: selectedStatus ? checkAmountsVariable(state) : sendAmountIsInError(state),
    asset: getSendAsset(state),
    selectedStatus:  getSelectedStatus(state)
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateSendAmount: (newAmount) => dispatch(updateSendAmount(newAmount)),
    updateRemoteAmount: (newAmount) => dispatch(updateRemoteAmount(newAmount)),
  };
}
