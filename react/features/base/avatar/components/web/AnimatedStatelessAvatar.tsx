import { withStyles } from '@mui/styles';
import anime from 'animejs';
import Avatar from 'avataaars';
import clsx from 'clsx';
import React from 'react';

import Icon from '../../../icons/components/Icon';
import { JitsiTrackEvents } from '../../../lib-jitsi-meet';
import AbstractStatelessAvatar, { type Props as AbstractProps } from '../AbstractStatelessAvatar';
import { PRESENCE_AVAILABLE_COLOR, PRESENCE_AWAY_COLOR, PRESENCE_BUSY_COLOR, PRESENCE_IDLE_COLOR } from '../styles';

// @ts-ignore
window.anime = anime;

type Props = AbstractProps & {
    _animationRef: any;

    _participantId: any;

    audioTrack: any;

    avatarSettings: any;

    /**
     * External class name passed through props.
     */
    className?: string;

    /**
     * An object containing the CSS classes.
     */
    classes: any;

    /**
     * The default avatar URL if we want to override the app bundled one (e.g. AlwaysOnTop).
     */
    defaultAvatar?: string;

    /**
     * ID of the component to be rendered.
     */
    id?: string;

    /**
     * One of the expected status strings (e.g. 'available') to render a badge on the avatar, if necessary.
     */
    status?: string;

    /**
     * TestId of the element, if any.
     */
    testId?: string;

    /**
     * Indicates whether to load the avatar using CORS or not.
     */
    useCORS?: boolean;
};

/**
 * Creates the styles for the component.
 *
 * @returns {Object}
 */
const styles = () => {
    return {
        avatar: {
            backgroundColor: '#AAA',
            borderRadius: '50%',
            color: 'rgba(255, 255, 255, 1)',
            fontWeight: '100',
            objectFit: 'cover' as const,
            textAlign: 'center' as const,

            '&.avatar-small': {
                height: '28px !important',
                width: '28px !important'
            },

            '&.avatar-xsmall': {
                height: '16px !important',
                width: '16px !important'
            },

            '& .jitsi-icon': {
                transform: 'translateY(50%)'
            },

            '& .avatar-svg': {
                height: '100%',
                width: '100%'
            }
        },

        badge: {
            position: 'relative' as const,

            '&.avatar-badge:after': {
                borderRadius: '50%',
                content: '""',
                display: 'block',
                height: '35%',
                position: 'absolute',
                bottom: 0,
                width: '35%'
            },

            '&.avatar-badge-available:after': {
                backgroundColor: PRESENCE_AVAILABLE_COLOR
            },

            '&.avatar-badge-away:after': {
                backgroundColor: PRESENCE_AWAY_COLOR
            },

            '&.avatar-badge-busy:after': {
                backgroundColor: PRESENCE_BUSY_COLOR
            },

            '&.avatar-badge-idle:after': {
                backgroundColor: PRESENCE_IDLE_COLOR
            }
        }
    };
};

/**
 * Implements a stateless avatar component that renders an avatar purely from what gets passed through
 * props.
 */
class AnimatedStatelessAvatar extends AbstractStatelessAvatar<Props> {
    private _mouthTest;
    private _glasses;

    /**
     * Instantiates a new {@code Component}.
     *
     * @inheritdoc
     */
    constructor(props: Props) {
        super(props);

        this._onAvatarLoadError = this._onAvatarLoadError.bind(this);
        this._updateLevel = this._updateLevel.bind(this);

        if (this.props.audioTrack) {
            const { jitsiTrack } = this.props.audioTrack;

            jitsiTrack?.on(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, this._updateLevel);
        }

        // eslint-disable-next-line max-len
    }

    // eslint-disable-next-line require-jsdoc
    _updateLevel(level): void {
        console.log('[tinkerday] level changed', level);
        this._mouthTest = anime({
            targets: `.${this.props._participantId} #Mouth\\/Smile path`,
            d: [ 'M 43 15 C 43 15 43 17 54 16 C 65 17 64 15 65 15 Z',
                'M 43 15 C 43 15 41 25 54 29 C 67 25 64 15 65 15 Z',
                'M 43 15 C 43 15 48 19 54 18 C 61 19 65 15 65 15 Z',
                'M 43 15 C 43 15 39 26 49 26 C 68 26 65 15 65 15 Z',
                'M 43 15 C 43 15 48 17 54 16 C 61 17 65 15 65 15 Z',
                'M 43 15 C 43 15 39 31 54 32 C 69 31 65 15 65 15 Z',
                'M 43 15 C 43 15 43 17 54 16 C 65 17 64 15 65 15 Z'
            ],
            easing: 'easeInOutSine',
            duration: 600
        });
        this._glasses = anime({
            targets: '.${this.props._participantId} #${this.props.avatarSettings?.accessoriesType} path',
            easing: 'easeInOutSine',
            direction: 'alternate',
            duration: 5000,

            // loop: true,
            keyframes: [

                // {rotateZ: 5},
                { translateY: 3 },
                { translateX: 6 },
                { translateY: -3 },
                { translateX: -6 }
            ]
        });

        if (level > 0.015) {
            this._mouthTest.play();
            this._glasses.play();

            console.log('[tinkerday] level > 0.015, animations started');
        } else {
            console.log('[tinkerday] level < 0.015');
        }
    }

    // eslint-disable-next-line require-jsdoc
    componentDidMount(): void {
        //
    }

    // eslint-disable-next-line require-jsdoc
    // componentDidUpdate(prevProps): void {
    //     console.log('[tinkerday] componentDidUpdate', prevProps._participantId, this.props._participantId);
    //     if (prevProps._participantId !== this.props._participantId) {
    //         if (this.props.audioTrack) {
    //             const { jitsiTrack } = this.props.audioTrack;

    //             jitsiTrack?.on(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, this._updateLevel);
    //         }
    //     }
    // }

    // eslint-disable-next-line require-jsdoc
    componentWillUnmount() {
        if (this.props.audioTrack) {
            console.log('[tinkerday] componentWillUnmount');
            const { jitsiTrack } = this.props.audioTrack;

            jitsiTrack?.off(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, this._updateLevel);
        }
    }

    /**
     * Implements {@code Component#render}.
     *
     * @inheritdoc
     */
    render() {
        const { url, useCORS } = this.props;

        console.log('[tinkerday]render AnimatedStatelessAvatar');
        console.log('[tinkerday] INITIALS', this.props.initials);

        // TODO - to be removed
        const initials = 'TEST' || this.props.initials;

        if (this._isIcon(url)) {
            return (
                <div
                    className = { clsx(this._getAvatarClassName(), this._getBadgeClassName()) }
                    data-testid = { this.props.testId }
                    id = { this.props.id }
                    style = { this._getAvatarStyle(this.props.color) }>
                    <Icon
                        size = '50%'
                        src = { url } />
                </div>
            );
        }

        if (url) {
            return (
                <div className = { this._getBadgeClassName() }>
                    <img
                        alt = 'avatar'
                        className = { this._getAvatarClassName() }
                        crossOrigin = { useCORS ? '' : undefined }
                        data-testid = { this.props.testId }
                        id = { this.props.id }
                        onError = { this._onAvatarLoadError }
                        src = { url }
                        style = { this._getAvatarStyle() } />
                </div>
            );
        }

        if (initials) {
            return (
                <div
                    // eslint-disable-next-line max-len
                    className = { clsx(this._getAvatarClassName(), this._getBadgeClassName(), this._getParticipantId()) }
                    data-testid = { this.props.testId }
                    id = { this.props.id }
                    style = { this._getAvatarStyle(this.props.color) }>
                    {/* <svg
                        className = 'avatar-svg'
                        viewBox = '0 0 100 100'
                        xmlns = 'http://www.w3.org/2000/svg'
                        xmlnsXlink = 'http://www.w3.org/1999/xlink'>
                        <text
                            dominantBaseline = 'central'
                            fill = 'rgba(255,255,255,1)'
                            fontSize = '40pt'
                            textAnchor = 'middle'
                            x = '50'
                            y = '50'>
                            { initials }
                        </text>
                    </svg> */}

                    {/* <FaceAvatar /> */}


                    <div id = { this.props._participantId } >
                        <Avatar
                            accessoriesType = { this.props.avatarSettings?.accessoriesType }
                            avatarStyle = 'Circle'
                            clotheColor = 'PastelBlue'
                            clotheType = 'Hoodie'
                            eyeType = 'Happy'
                            eyebrowType = 'Default'
                            facialHairType = 'Blank'
                            hairColor = 'BrownDark'
                            mouthType = 'Smile'
                            skinColor = 'Light'
                            // eslint-disable-next-line react-native/no-inline-styles
                            style = {{
                                width: '100%',
                                height: '100%'
                            }}
                            topType = { this.props.avatarSettings?.topType } />
                    </div>

                </div>
            );
        }

        // default avatar
        return (
            <div className = { this._getBadgeClassName() }>
                <img
                    alt = 'avatar'
                    className = { this._getAvatarClassName('defaultAvatar') }
                    data-testid = { this.props.testId }
                    id = { this.props.id }
                    src = { this.props.defaultAvatar || 'images/avatar.png' }
                    style = { this._getAvatarStyle() } />
            </div>
        );
    }

    /**
     * Constructs a style object to be used on the avatars.
     *
     * @param {string} color - The desired background color.
     * @returns {Object}
     */
    _getAvatarStyle(color?: string) {
        const { size } = this.props;

        return {
            background: color || undefined,
            fontSize: size ? size * 0.5 : '180%',
            height: size || '100%',
            width: size || '100%'
        };
    }

    /**
     * Constructs a list of class names required for the avatar component.
     *
     * @param {string} additional - Any additional class to add.
     * @returns {string}
     */
    _getAvatarClassName(additional?: string) {
        return clsx('avatar', additional, this.props.className, this.props.classes.avatar);
    }

    /**
     * Generates a class name to render a badge on the avatar, if necessary.
     *
     * @returns {string}
     */
    _getBadgeClassName() {
        const { status } = this.props;

        if (status) {
            return clsx('avatar-badge', `avatar-badge-${status}`, this.props.classes.badge);
        }

        return '';
    }

    // eslint-disable-next-line require-jsdoc
    _getParticipantId() {
        return this.props._participantId ?? '';
    }

    /**
     * Handles avatar load errors.
     *
     * @returns {void}
     */
    _onAvatarLoadError() {
        const { onAvatarLoadError, onAvatarLoadErrorParams } = this.props;

        if (typeof onAvatarLoadError === 'function') {
            onAvatarLoadError(onAvatarLoadErrorParams);
        }
    }
}

export default withStyles(styles)(AnimatedStatelessAvatar);


