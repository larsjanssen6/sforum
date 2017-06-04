import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class messages {

    public lgroupBy;
    public lgroupByHaving;

    public groupBy: boolean;
    public groupByHaving: boolean;

    constructor(private http: HttpClient, private router: Router) {
        this.groupBy = false;
        this.groupByHaving = false;
    }

    fetchGroupBy() {
        this.groupBy = true;

        this.http.fetch('fun/groupby')
            .then(response => response.json())
            .then(data => {
                this.lgroupBy = data;
            });
    }


    fetchGroupByHaving() {
        this.groupByHaving = true;

        this.http.fetch('fun/groupbyhaving')
            .then(response => response.json())
            .then(data => {
                this.lgroupByHaving = data;
            });
    } 
}




