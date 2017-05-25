import { autoinject } from 'aurelia-framework';
import { Router, RouterConfiguration, Next, Redirect, NavigationInstruction } from 'aurelia-router'
import { HttpClient } from 'aurelia-fetch-client';
import { FetchConfig } from 'aurelia-authentication';
import { Container } from 'aurelia-dependency-injection';
import { AuthService } from 'aurelia-authentication';
import { EventAggregator } from 'aurelia-event-aggregator';
import * as jwt_decode from 'jwt-decode';


@autoinject
export class App {
    router: Router;
    authenticated: boolean;
    currUrl: string;
    title: string;

    constructor(private http: HttpClient,
                private config: FetchConfig,
                private authService: AuthService,
                private event: EventAggregator)
    {
        this.configHttp();
        this.authenticated = this.authService.authenticated;
        this.title = this.authService.authenticated ? "Welkom " + jwt_decode(this.authService.getAccessToken()).name : "SFORUM";
    }

    configureRouter(config, router) {
        this.router = router;

        let step = new AuthorizeStep(this.authService);
        config.addAuthorizeStep(step);

        config.title = 'Aurelia';
        config.map([
            {
                route: ['bericht/:id'],
                name: 'message',
                moduleId: 'components/message/message',
                auth: true
            },
            {
                route: ['berichten/:id/nieuw'],
                name: 'newMessage',
                moduleId: 'components/message/newMessage',
                auth: true
            },
            {
                route: ['berichten/:id'],
                name: 'messages',
                moduleId: 'components/message/messages',
                auth: true
            },
            {
                route: ['corporatie/nieuw'],
                name: 'newCorporation',
                moduleId: 'components/corporation/newCorporation',
                auth: true
            },
            {
                route: ['forum/bewerk/:id'],
                name: 'editForum',
                moduleId: 'components/dashboard/editForum',
                auth: true
            },
            {
                route: ['forum/nieuw',],
                name: 'newForum',
                moduleId: 'components/dashboard/newForum',
                auth: true
            },
            {
                route: ['dashboard'],
                name: 'dashboard',
                moduleId: 'components/dashboard/dashboard',
                auth: true
            },
            {
                route: ['corporaties',],
                name: 'corporations',
                moduleId: 'components/corporation/corporations',
                auth: true
            },
            {
                route: ['gebruikers'],
                name: 'users',
                moduleId: 'components/user/users',
                auth: true
            },
            {
                route: ['software'],
                name: 'softwares',
                moduleId: 'components/software/softwares',
                auth: true
            },
            {
                route: ['/', 'login'],
                name: 'login',
                moduleId: 'components/authentication/login'
            },
        ]);
    }

    configHttp(): void {
        this.http.configure(config => {
            config
                .withBaseUrl('api/')
                .withDefaults({
                    method: "POST",
                    credentials: 'same-origin',
                    headers: {
                        'Accept': 'application/json',
                        'X-Requested-With': 'Fetch'
                    }
                })
                .withInterceptor({
                    request(request) {
                        console.log(`Requesting ${request.method} ${request.url}`);
                        return request;
                    },
                    response(response: Response) {
                        console.log(`Received ${response.status} ${response.url}`);
                        return response;
                    }
                });
        });

        this.config.configure(this.http);
    }

    created(owningView, myView) {
        this.currUrl = window.location.pathname;
    }

    attached() {
        this.event.subscribe('signedIn', response => {
            this.authenticated = response;
            this.title = "Welkom " + jwt_decode(this.authService.getAccessToken()).name;
        });
    }

    logout() {
        return this.authService.logout()
            .then(() => {
                this.authenticated = this.authService.authenticated;
                this.router.navigate("login");
                this.title = "SFORUM";

                swal({
                    title: "Bedankt voor uw bezoek",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            });
    }
}

@autoinject
class AuthorizeStep {
    constructor(private authService: AuthService) {}

    run(navigationInstruction: NavigationInstruction, next: Next): Promise<any> {
        if (navigationInstruction.getAllInstructions().some(i => i.config.auth)) {
            let isLoggedIn = this.authService.isAuthenticated();

            if (!isLoggedIn) {
                return next.cancel(new Redirect('login'));
            }
        }

        return next();
    }
}

