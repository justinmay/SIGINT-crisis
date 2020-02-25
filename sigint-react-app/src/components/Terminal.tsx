import React from 'react';
import './Terminal.css';
import {
    Stitch,
    AnonymousCredential,
    RemoteMongoClient,
    StitchAppClient,
    RemoteMongoCollection,
    BSON
  } from "mongodb-stitch-browser-sdk";

interface terminalProps {

}

interface message {
    messages: string[]
}

interface terminalState {
    messages: string[];
    client: StitchAppClient;
    messageCollection?: RemoteMongoCollection<any>;
    text: string;
    documentid: BSON.ObjectId;
}

class Terminal extends React.Component<terminalProps,terminalState> {

    constructor(props: terminalState) {
        super(props);
        this.state = {
            messages: [],
            client: Stitch.initializeDefaultAppClient("sigint-stitch-xfunj"), // Initialize the App Client
            text: "",
            documentid: new BSON.ObjectId("5e545ab16cc1a80fbf8f7f0d"),
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    componentDidMount() {
        // Get a MongoDB Service Client
        // This is used for logging in and communicating with Stitch
        const mongodb = this.state.client.getServiceClient(
          RemoteMongoClient.factory,
          "mongodb-atlas"
        );
        const messageCollection = mongodb.db("sigint-messages").collection("messages");
        const query = { "_id": this.state.documentid };
        const options = {};
        messageCollection!.findOne(query, options)
        .then((result) => {
            if (result) {
            console.log(`Successfully found document: ${result}.`);
            const messageObj: any = result;
            const messages: string[] = messageObj.message;
            this.setState({messages});
            } else {
            console.log('No document matches the provided query.');
            }
        })
        .catch((err) => console.error(`Failed to find document: ${err}`));
        // Get a reference to the todo database
        this.setState({
            messageCollection,
        });
        this.loginAnonymous();
    }

    updateMessages() {
        const query = { "_id": this.state.documentid };
        const options = {};
        this.state.messageCollection!.findOne(query, options)
        .then((result) => {
            if (result) {
            console.log(`Successfully found document: ${result}.`);
            const messageObj: any = result;
            const messages: string[] = messageObj.message;
            this.setState({messages});
            } else {
            console.log('No document matches the provided query.');
            }
        })
        .catch((err) => console.error(`Failed to find document: ${err}`));
    }

    sendMessage(message: string) {
        const query = { "_id": this.state.documentid };
        const update = { "$push": { "message": message } };
        const options = { "upsert": false };
        this.state.messageCollection!.updateOne(query, update, options)
        .then(result => {
            const { matchedCount, modifiedCount } = result;
            if(matchedCount && modifiedCount) {
            console.log(`Successfully updated the item.`)
            this.updateMessages();
            }
        })
        .catch(err => console.error(`Failed to update the item: ${err}`))
        /**
         * this.state.messageCollection!.insertOne(newMessage)
        .then(result => console.log(`Successfully inserted item with _id: ${result.insertedId}`))
        .catch(err => console.error(`Failed to insert item: ${err}`))
         */
    }

    loginAnonymous() {
        // Allow users to log in anonymously
        const credential = new AnonymousCredential();
        return this.state.client.auth.loginWithCredential(credential);
    }

    handleSubmit(event: any){
        event.preventDefault();
        this.sendMessage(this.state.text);
        this.setState({text: ""});
    }

    handleChange(event: any) {
        this.setState({text: event.target.value});
    }


    render() {
        return (
            <div className="main">
                <div className="messageContainer">
                {this.state.messages.map((message,i) => {
                    return (
                        <div key={i} className="message">
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

            <form onSubmit={this.handleSubmit}>
                <label>
                Name:
                <input type="text" value={this.state.text} onChange={this.handleChange} />
                </label>
            </form>

            </div>
        );
    }
}

export default Terminal;