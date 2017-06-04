import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class messages {

    public context;

    constructor(private http: HttpClient, private router: Router) { }

    fetchGroupBy() {
        this.http.fetch('fun/groupby')
            .then(response => response.json())
            .then(data => {
                this.context = data;
            });
    }
}




