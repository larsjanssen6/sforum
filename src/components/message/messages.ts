import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class messages {

    public messages: MessageModel[] = [];
    public forumId: number;

    constructor(private http: HttpClient, private router: Router) {}

    created() {
        this.forumId = this.router.currentInstruction.params.id;
        this.fetchMessages();
    }

    fetchMessages() {
        this.http.fetch('message/index', {
              body: json(this.forumId)
            })
            .then(response => response.json())
            .then(data => {
                this.messages = data;
            });
    }

    isEmpty(messages) {
        return messages == [];
    }

    link(message) {
        this.router.navigate("bericht/" + message.id);
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


