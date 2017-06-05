import { HttpClient, json } from "aurelia-fetch-client"
import { autoinject } from "aurelia-framework"
import { Router } from 'aurelia-router'

@autoinject
export class messages {

    public lgroupBy;
    public lgroupByHaving;
    public louterJoin;
    public lrecursive;
    public lgecorreleerd;

    public groupBy: boolean;
    public groupByHaving: boolean;
    public outerJoin: boolean;
    public recursive: boolean;
    public gecorreleerd: boolean;

    constructor(private http: HttpClient, private router: Router) {
        this.groupBy = false;
        this.groupByHaving = false;
        this.outerJoin = false;
        this.recursive = false;
        this.gecorreleerd = false;
    }

    fetchGroupBy() {
        this.groupBy = true;

        this.http.fetch('fun/groupby')
            .then(response => response.json())
            .then(data => {
                this.lgroupBy = data;
            });
    }

    fetchOuterJoin() {
        this.outerJoin = true;

        this.http.fetch('fun/outerjoin')
            .then(response => response.json())
            .then(data => {
                this.louterJoin = data;
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

    fetchRecursive() {
        this.recursive = true;

        this.http.fetch('fun/recursive')
            .then(response => response.json())
            .then(data => {
                this.lrecursive = data;
            });
    } 

    fetchGecorreleerde() {
        this.gecorreleerd = true;

        this.http.fetch('fun/gecorreleerd')
            .then(response => response.json())
            .then(data => {
                this.lgecorreleerd = data;
            });
    } 
}




