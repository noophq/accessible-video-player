import * as React from "react";

import { Player } from "app/react/components/Player";

export class App extends React.Component<undefined, undefined> {
    public render(): React.ReactElement<{}> {
        return (
            <div>
                <Player/>
            </div>
        );
    }
}
