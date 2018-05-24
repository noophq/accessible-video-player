import * as React from "react";

import * as classnames from "classnames";

interface ProgressBarProps {
    className?: string;
    currentValue?: number; // Progress in percent
    seekHandler?: any;
    tooltipHandler?: any;
}

interface ProgressBarState {
    over: boolean; // Over or focused
    overValue: number; // Over value in percent
    displayTooltip: boolean; // Display tooltip?
}

export default class ProgressBar extends React.Component<ProgressBarProps, ProgressBarState> {
    private containerElement: HTMLDivElement;
    private tooltipCloseTimer: any;

    public static defaultProps: Partial<ProgressBarProps> = {
        currentValue: 0,
    };

    public constructor(props: ProgressBarProps) {
        super(props);

        this.state = {
            over: false,
            overValue: props.currentValue,
            displayTooltip: false,
        };

        this.handleMouseClick = this.handleMouseClick.bind(this);
        this.handleMouseLeave = this.handleMouseLeave.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
        this.handleFocus = this.handleFocus.bind(this);
        this.handleBlur = this.handleBlur.bind(this);
        this.setContainerElement = this.setContainerElement.bind(this);
    }

    public closeTooltip() {
        if (this.tooltipCloseTimer) {
            clearTimeout(this.tooltipCloseTimer);
        }
        if (this.state.displayTooltip) {
            this.tooltipCloseTimer = setTimeout(() => {
                    this.setState({displayTooltip: false});
                },
                500
            );
        }
    }

    public handleKeyUp(event: any) {
        const keyName = event.key;

        if (["ArrowRight", "ArrowLeft"].indexOf(keyName) > -1) {
            if (this.props.seekHandler) {
                this.props.seekHandler(this.state.overValue);
            }
        }

        this.closeTooltip();
    }

    public handleKeyDown(event: any) {
        const keyName = event.key;
        let overValue = this.state.overValue;

        if (keyName === "ArrowRight") {
            overValue = Math.min(100, overValue + 5);
        } else if (keyName === "ArrowLeft") {
            overValue = Math.max(0, overValue - 5);
        }

        this.setState({
            overValue,
            displayTooltip: true,
        });
    }

    public handleMouseClick() {
        if (this.props.seekHandler) {
            this.props.seekHandler(this.state.overValue);
        }
    }

    public handleBlur() {
        this.setState({
            over: false,
            displayTooltip: false,
        });
    }

    public handleFocus() {
        this.setState({
            over: true,
        });
    }

    public handleMouseLeave() {
        this.setState({
            over: (document.activeElement === this.containerElement),
            overValue: this.props.currentValue,
            displayTooltip: false,
        });
    }

    public handleMouseMove(event: any) {
        const rects = this.containerElement.getClientRects();
        const rect = rects[0];
        const percent = ((event.clientX - rect.left)/rect.width)*100;

        this.setState({
            over: true,
            overValue: percent,
            displayTooltip: true,
        });
    }

    public setContainerElement(element: any) {
        this.containerElement = element;
    }

    public componentDidMount() {
        this.containerElement.addEventListener(
            "mousemove",
            this.handleMouseMove,
        );
        this.containerElement.addEventListener(
            "mouseleave",
            this.handleMouseLeave,
        );
        this.containerElement.addEventListener(
            "click",
            this.handleMouseClick,
        );
        this.containerElement.addEventListener(
            "keydown",
            this.handleKeyDown,
        );
        this.containerElement.addEventListener(
            "keyup",
            this.handleKeyUp,
        );
        this.containerElement.addEventListener(
            "focus",
            this.handleFocus,
        );
        this.containerElement.addEventListener(
            "blur",
            this.handleBlur,
        );
    }

    public componentWillUnmount() {
        this.containerElement.removeEventListener(
            "mousemove",
            this.handleMouseMove,
        );
        this.containerElement.removeEventListener(
            "mouseleave",
            this.handleMouseLeave,
        );
        this.containerElement.removeEventListener(
            "click",
            this.handleMouseClick,
        );
        this.containerElement.removeEventListener(
            "keydown",
            this.handleKeyDown,
        );
        this.containerElement.removeEventListener(
            "keyup",
            this.handleKeyUp,
        );
        this.containerElement.removeEventListener(
            "focus",
            this.handleFocus,
        );
        this.containerElement.removeEventListener(
            "blur",
            this.handleBlur,
        );
    }

    public render(): React.ReactElement<{}> {
        const containerClassNames = ["progress-bar-container"];
        const tooltipClassNames = ["progress-bar-tooltip"];

        if (this.state.over) {
            containerClassNames.push("over");
        }

        if (this.state.displayTooltip) {
            tooltipClassNames.push("open");
        }

        return (
            <div className={this.props.className}>
                <div className="progress-bar-wrapper">
                    <div
                        className={classnames(containerClassNames)}
                        ref={this.setContainerElement}
                        tabIndex={0}
                    >
                        <div
                            className="progress-bar-full">
                        &nbsp;
                        </div>
                        <div
                            className="progress-bar-current"
                            style={{width: this.props.currentValue+"%"}}>
                        &nbsp;
                        </div>
                        <div
                            className="progress-bar-cursor"
                            style={{left: this.props.currentValue+"%"}}>
                        &nbsp;
                        </div>
                        <div
                            className="progress-bar-over"
                            style={{width: this.state.overValue+"%"}}>
                        &nbsp;
                        </div>
                    </div>
                    { (this.props.tooltipHandler) && (
                        <div
                            className={classnames(tooltipClassNames)}
                            style={{left: this.state.overValue+"%"}}>
                        {
                            this.props.tooltipHandler(this.state.overValue)
                        }
                        </div>
                    )}
                </div>
            </div>
        );
    }
}
