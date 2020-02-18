import React from 'react';
import './Terminal.css';

interface terminalProps {

}

interface terminalState {
    messages: string[];
}

class Terminal extends React.Component<terminalProps,terminalState> {
    constructor(props: terminalState) {
        super(props);
        this.state = {
            messages: ["testint","todo: change font to something hacky","todo: hook up to mongodb changestreams"]
        };
    }


    render() {
        return (
            <div className="main">
                {this.state.messages.map(message => {
                    return (
                        <div className="message">
                            <div className="messageHeader">
                                > SIGINT-2020-1:~ CRISIS$
                            </div>
                            <div className="messageBody">
                                {message}
                            </div>
                        </div>
                    )
                })}
                
            </div>
        );
    }
}

export default Terminal;
