import React, { Component, RefObject } from 'react';
import cx from 'classnames';
import { css } from 'glamor';

interface IProps {
  delay?: number;
  className?: string;
  maskClassName?: string;
  maskStyle?: React.CSSProperties;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  iframeClassName?: string;
  iframeStyle?: React.CSSProperties;
  children?: React.ReactNode;
  containerChildren?: React.ReactNode;
  onMount?: (refs: {
    mask: HTMLDivElement | null;
    frame: HTMLIFrameElement | null;
  }) => void;
  onUnmount?: (refs: {
    mask: HTMLDivElement | null;
    frame: HTMLIFrameElement | null;
  }) => void;
  onLoad?: (refs: {
    mask: HTMLDivElement | null;
    frame: HTMLIFrameElement | null;
  }) => void;
  selectedElement?: HTMLElement;
}

interface IState {
  isVisible: boolean;
  isMinimized: boolean;
}

const frameClass = css({
  background: 'rgba(125,125,125,.8)',
  minHeight: '200px',
  border: 'none',
  width: '100%',
  borderRadius: '8px 0 0 8px',
  boxShadow: '-1px 1px 8px rgba(0,0,0,.15)',
  top: '40%',
  position: 'relative',
});

const maskClass = css({
  display: 'none',
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  cursor: 'pointer',
  zIndex: 9999,
});

const maskVisibleClass = css({
  display: 'block',
});

const containerClass = css({
  position: 'fixed',
  top: '40%',
  right: '0px',
  width: '65%',
  maxWidth: '250px',
  padding: '8px',
  boxSizing: 'border-box',
  transform: 'translateX(100%)',
  transition: 'transform .45s cubic-bezier(0, 0, 0.3, 1)',
  zIndex: 10000,
});

const containerVisibleClass = css({
  transform: 'translate3d(0,0,0)',
});

const containerMinimizedClass = css({
  cursor: 'pointer',
  transform: 'translateX(84%)',
  ':hover': {
    transform: 'translateX(82%)',
  },
  '& > iframe': {
    pointerEvents: 'none',
  },
});

const FRAME_TOGGLE_FUNCTION = 'chromeIframeSheetToggle';

export class Frame extends Component<IProps, IState> {
  private maskRef: RefObject<HTMLDivElement> = React.createRef();
  private frameRef: RefObject<HTMLIFrameElement> = React.createRef();
  private _visibleRenderTimeout: ReturnType<typeof setTimeout> | undefined;

  static defaultProps: IProps = {
    delay: 500,
    maskClassName: '',
    maskStyle: {},
    containerClassName: '',
    containerStyle: {},
    iframeClassName: '',
    iframeStyle: {},
    onMount: () => {},
    onUnmount: () => {},
    onLoad: () => {},
  };

  mask: HTMLDivElement | null = null;
  frame: HTMLIFrameElement | null = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      isVisible: false,
      isMinimized: false,
    };
  }

  componentDidMount(): void {
    const { delay, onMount } = this.props;

    window[FRAME_TOGGLE_FUNCTION] = this.toggleFrame;

    onMount?.({
      mask: this.mask,
      frame: this.frame,
    });

    this._visibleRenderTimeout = setTimeout(() => {
      this.setState({
        isVisible: true,
      });
    }, delay);
  }

  componentWillUnmount(): void {
    const { onUnmount } = this.props;

    onUnmount?.({
      mask: this.mask,
      frame: this.frame,
    });

    delete window[FRAME_TOGGLE_FUNCTION];
    clearTimeout(this._visibleRenderTimeout as NodeJS.Timeout);
  }

  onLoad = (): void => {
    const { onLoad } = this.props;

    onLoad?.({
      mask: this.mask,
      frame: this.frame,
    });
  };

  onMaskClick = (): void => {
    this.setState({
      isMinimized: true,
    });
  };

  onFrameClick = (): void => {
    this.setState({
      isMinimized: false,
    });
  };

  toggleFrame = (): void => {
    this.setState({
      isMinimized: !this.state.isMinimized,
    });
  };

  static isReady(): boolean {
    return typeof window[FRAME_TOGGLE_FUNCTION] !== 'undefined';
  }

  static toggle(): void {
    if (window[FRAME_TOGGLE_FUNCTION]) {
      window[FRAME_TOGGLE_FUNCTION]();
    }
  }

  render() {
    const { isVisible, isMinimized } = this.state;
    const {
      maskClassName,
      maskStyle,
      containerClassName,
      containerStyle,
      iframeClassName,
      iframeStyle,
      children,
    } = this.props;

    return (
      <div>
        <div
          className={cx({
            [maskClass.toString()]: true,
            [maskVisibleClass.toString()]:
              !isMinimized || this.props.selectedElement,
            [maskClassName || '']: true,
          })}
          style={maskStyle}
          onClick={this.onMaskClick}
          ref={(mask) => (this.mask = mask)}
        />
        <div
          className={cx({
            [containerClass.toString()]: true,
            [containerVisibleClass.toString()]: isVisible,
            [containerMinimizedClass.toString()]:
              isMinimized && !this.props.selectedElement,
            [containerClassName || '']: true,
          })}
          style={containerStyle}
          onClick={this.onFrameClick}
        >
          <div
            className={cx({
              [frameClass.toString()]: true,
              [iframeClassName || '']: true,
            })}
            style={iframeStyle}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default Frame;
