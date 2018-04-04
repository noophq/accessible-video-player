import * as React from "react";

import { Player } from "app/components/Player";

interface States {
    play: boolean;
    fullscreen: boolean;
}

export class App extends React.Component<undefined, States> {

    public constructor() {
        super(undefined);

        this.state = {
            play: true,
            fullscreen: false,
        };
    }

    public render(): React.ReactElement<{}> {
        return (
            <div>
                <Player/>
            </div>
        );
    }
}
