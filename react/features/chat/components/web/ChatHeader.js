// @flow

import React, { useCallback } from 'react';
import { connect } from 'react-redux';

import { translate } from '../../../base/i18n/functions';
import Icon from '../../../base/icons/components/Icon';
import { IconCloseLarge } from '../../../base/icons/svg';
import { toggleChat } from '../../actions.web';

type Props = {

    /**
     * Function to be called when pressing the close button.
     */
    onCancel: Function,

    /**
     * An optional class name.
     */
    className: string,

    /**
     * Whether the polls feature is enabled or not.
     */
    isPollsEnabled: boolean,

    /**
     * Invoked to obtain translated strings.
     */
    t: Function
};

/**
 * Custom header of the {@code ChatDialog}.
 *
 * @returns {React$Element<any>}
 */
function Header({ onCancel, className, isPollsEnabled, t }: Props) {

    const onKeyPressHandler = useCallback(e => {
        if (onCancel && (e.key === ' ' || e.key === 'Enter')) {
            e.preventDefault();
            onCancel();
        }
    }, [ onCancel ]);

    return (
        <div
            className = { className || 'chat-dialog-header' }>
            <span
                aria-level = { 1 }
                role = 'heading'>
                { t(isPollsEnabled ? 'chat.titleWithPolls' : 'chat.title') }
            </span>
            <Icon
                ariaLabel = { t('toolbar.closeChat') }
                onClick = { onCancel }
                onKeyPress = { onKeyPressHandler }
                role = 'button'
                src = { IconCloseLarge }
                tabIndex = { 0 } />
        </div>
    );
}

const mapDispatchToProps = { onCancel: toggleChat };

export default translate(connect(null, mapDispatchToProps)(Header));
