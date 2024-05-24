import { connect } from 'react-redux';
import { getSendErrors } from '../../../../../../ducks/send';
import {
  getSelectedStatus,
  getRemoteAmountErrors,
} from '../../../../../../selectors';
import SendRowErrorMessage from './send-row-error-message.component';

export default connect(mapStateToProps)(SendRowErrorMessage);

function mapStateToProps(state, ownProps) {
  const selectedStatus = getSelectedStatus(state);
  return {
    errors: selectedStatus ? getRemoteAmountErrors(state) :getSendErrors(state),
    errorType: ownProps.errorType,
  };
}
``