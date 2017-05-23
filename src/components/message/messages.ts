import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"

@autoinject
export class messages {

    public messages: MessageModel[] = [];

    constructor(private http: HttpClient) {
        this.fetchMessages();
    }

    fetchMessages() {
        this.http.fetch('message/index', {
              body: json(this.router.currentInstruction.params.id)
            })
            .then(response => response.json())
            .then(data => {
                this.messages = data;
            });
    }
}

export class MessageModel {
    id: number;
    forum: string;
    user: string;
    software: string;
    subject: string;
    message: string;
}


