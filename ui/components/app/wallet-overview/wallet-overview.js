import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { useSelector } from 'react-redux';
import { getSelectedInternalAccount, getSelectedStatus } from '../../../selectors';
import { IconName, Tag } from '../../component-library';
import { getBalance } from '../../../remote'
import { Color, TextVariant } from '../../../helpers/constants/design-system';
import { KeyringType } from '../../../../shared/constants/keyring';
import { getAccountLabel } from '../../../helpers/utils/accounts';
import { getBalanceError } from '../../../ducks/swaps/swaps';

const WalletOverview = ({ balance, buttons, className }) => {
  const selectedAccount = useSelector(getSelectedInternalAccount);
  const selectedStatus = useSelector(getSelectedStatus);
  const { keyring } = selectedAccount.metadata;
  const label = selectedStatus ? "Remote" : null;
  return (
    <div className={classnames('wallet-overview', className)}>
      <div className="wallet-overview__balance">
        {balance}
        {label ? (
          <Tag
            label={label}
            labelProps={{
              variant: TextVariant.bodyXs,
              color: Color.textAlternative,
            }}
            startIconName={
              keyring.type === KeyringType.snap ? IconName.Snaps : null
            }
          />
        ) : null}
      </div>
      <div className="wallet-overview__buttons">{buttons}</div>
    </div>
  );
};

WalletOverview.propTypes = {
  balance: PropTypes.element.isRequired,
  buttons: PropTypes.element.isRequired,
  className: PropTypes.string,
};

export default WalletOverview;
