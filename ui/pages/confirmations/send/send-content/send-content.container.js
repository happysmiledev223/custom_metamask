import { connect } from 'react-redux';
import {
  getIsEthGasPriceFetched,
  getNoGasPriceFetched,
  checkNetworkOrAccountNotSupports1559,
  getIsMultiLayerFeeNetwork,
  getSelectedStatus,
  getRemoteSendAsset
} from '../../../../selectors';
import {
  getIsBalanceInsufficient,
  getSendAsset,
  getAssetError,
  getRecipient,
  acknowledgeRecipientWarning,
  getRecipientWarningAcknowledgement,
} from '../../../../ducks/send';
import SendContent from './send-content.component';

function mapStateToProps(state) {
  const recipient = getRecipient(state);
  const recipientWarningAcknowledged =
    getRecipientWarningAcknowledgement(state);

  const selectedStatus = getSelectedStatus(state);
  const asset = selectedStatus ? getRemoteSendAsset(state) : getSendAsset(state) ;
  return {
    isEthGasPrice: getIsEthGasPriceFetched(state),
    noGasPrice: getNoGasPriceFetched(state),
    networkOrAccountNotSupports1559:
      checkNetworkOrAccountNotSupports1559(state),
    getIsBalanceInsufficient: getIsBalanceInsufficient(state),
    asset: asset,
    assetError: getAssetError(state),
    recipient,
    recipientWarningAcknowledged,
    isMultiLayerFeeNetwork: getIsMultiLayerFeeNetwork(state),
  };
}

function mapDispatchToProps(dispatch) {
  return {
    acknowledgeRecipientWarning: () => dispatch(acknowledgeRecipientWarning()),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(SendContent);
