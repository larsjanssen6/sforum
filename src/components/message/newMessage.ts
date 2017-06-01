import { HttpClient, json } from "aurelia-fetch-client"
import * as jwt_decode from 'jwt-decode';
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'
import { AuthService } from 'aurelia-authentication';

@autoinject
export class newMessage {

    public message = new Message();
    public softwares: Software[] = [];

    constructor(private http: HttpClient, private router: Router, private authService: AuthService) {
        this.fetchSoftware();
    }

    fetchSoftware() {
        this.http.fetch('software/index', {
                body: json(jwt_decode(this.authService.getAccessToken()).corporation_id)
            })
            .then(response => response.json())
            .then(data => {
                this.softwares = data;
            });
    }

    store() {
        this.message.forum = this.router.currentInstruction.params.id;

        this.http.fetch('message/store', {
            body: json(this.message)
        }).then(response => {
            if (response.status == 200) {
                swal({
                    title: "Bericht succesvol aangemaakt",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });

                this.router.navigate("berichten/" + this.router.currentInstruction.params.id);
              }
        });
    }
}

export class Software {
    corporation_id: number;
    name: string;
}

export class Message {
    id: number;
    message: string;
    subject: string;
    forum: number;
    software: number;
}




