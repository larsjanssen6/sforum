var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('app',["require", "exports", "aurelia-framework", "aurelia-router", "aurelia-fetch-client", "aurelia-authentication", "aurelia-authentication", "aurelia-event-aggregator", "jwt-decode"], function (require, exports, aurelia_framework_1, aurelia_router_1, aurelia_fetch_client_1, aurelia_authentication_1, aurelia_authentication_2, aurelia_event_aggregator_1, jwt_decode) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var App = (function () {
        function App(http, config, authService, event) {
            this.http = http;
            this.config = config;
            this.authService = authService;
            this.event = event;
            this.configHttp();
            this.authenticated = this.authService.authenticated;
            this.title = this.authService.authenticated ? "Welkom " + jwt_decode(this.authService.getAccessToken()).name : "SFORUM";
        }
        App.prototype.configureRouter = function (config, router) {
            this.router = router;
            var step = new AuthorizeStep(this.authService);
            config.addAuthorizeStep(step);
            config.title = 'Aurelia';
            config.map([
                {
                    route: ['corporatie/nieuw'],
                    name: 'newCorporation',
                    moduleId: 'components/corporation/newCorporation'
                },
                {
                    route: ['forum/bewerk/:id'],
                    name: 'editForum',
                    moduleId: 'components/dashboard/editForum'
                },
                {
                    route: ['forum/nieuw',],
                    name: 'newForum',
                    moduleId: 'components/dashboard/newForum'
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
        };
        App.prototype.configHttp = function () {
            this.http.configure(function (config) {
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
                    request: function (request) {
                        console.log("Requesting " + request.method + " " + request.url);
                        return request;
                    },
                    response: function (response) {
                        console.log("Received " + response.status + " " + response.url);
                        return response;
                    }
                });
            });
            this.config.configure(this.http);
        };
        App.prototype.created = function (owningView, myView) {
            this.currUrl = window.location.pathname;
        };
        App.prototype.attached = function () {
            var _this = this;
            this.event.subscribe('signedIn', function (response) {
                _this.authenticated = response;
                _this.title = "Welkom " + jwt_decode(_this.authService.getAccessToken()).name;
            });
        };
        App.prototype.logout = function () {
            var _this = this;
            return this.authService.logout()
                .then(function () {
                _this.authenticated = _this.authService.authenticated;
                _this.router.navigate("login");
                _this.title = "SFORUM";
                swal({
                    title: "Bedankt voor uw bezoek",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
            });
        };
        return App;
    }());
    App = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient,
            aurelia_authentication_1.FetchConfig,
            aurelia_authentication_2.AuthService,
            aurelia_event_aggregator_1.EventAggregator])
    ], App);
    exports.App = App;
    var AuthorizeStep = (function () {
        function AuthorizeStep(authService) {
            this.authService = authService;
        }
        AuthorizeStep.prototype.run = function (navigationInstruction, next) {
            if (navigationInstruction.getAllInstructions().some(function (i) { return i.config.auth; })) {
                var isLoggedIn = this.authService.isAuthenticated();
                if (!isLoggedIn) {
                    return next.cancel(new aurelia_router_1.Redirect('login'));
                }
            }
            return next();
        };
        return AuthorizeStep;
    }());
    AuthorizeStep = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_authentication_2.AuthService])
    ], AuthorizeStep);
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,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VTt5Q0FFMEIsb0NBQVc7T0FEMUMsYUFBYSxDQWNsQiIsImZpbGUiOiJhcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnO1xyXG5pbXBvcnQgeyBSb3V0ZXIsIFJvdXRlckNvbmZpZ3VyYXRpb24sIE5leHQsIFJlZGlyZWN0LCBOYXZpZ2F0aW9uSW5zdHJ1Y3Rpb24gfSBmcm9tICdhdXJlbGlhLXJvdXRlcidcclxuaW1wb3J0IHsgSHR0cENsaWVudCB9IGZyb20gJ2F1cmVsaWEtZmV0Y2gtY2xpZW50JztcclxuaW1wb3J0IHsgRmV0Y2hDb25maWcgfSBmcm9tICdhdXJlbGlhLWF1dGhlbnRpY2F0aW9uJztcclxuaW1wb3J0IHsgQ29udGFpbmVyIH0gZnJvbSAnYXVyZWxpYS1kZXBlbmRlbmN5LWluamVjdGlvbic7XHJcbmltcG9ydCB7IEF1dGhTZXJ2aWNlIH0gZnJvbSAnYXVyZWxpYS1hdXRoZW50aWNhdGlvbic7XHJcbmltcG9ydCB7IEV2ZW50QWdncmVnYXRvciB9IGZyb20gJ2F1cmVsaWEtZXZlbnQtYWdncmVnYXRvcic7XHJcbmltcG9ydCAqIGFzIGp3dF9kZWNvZGUgZnJvbSAnand0LWRlY29kZSc7XHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgQXBwIHtcclxuICAgIHJvdXRlcjogUm91dGVyO1xyXG4gICAgYXV0aGVudGljYXRlZDogYm9vbGVhbjtcclxuICAgIGN1cnJVcmw6IHN0cmluZztcclxuICAgIHRpdGxlOiBzdHJpbmc7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50LFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBjb25maWc6IEZldGNoQ29uZmlnLFxyXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBhdXRoU2VydmljZTogQXV0aFNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgICBwcml2YXRlIGV2ZW50OiBFdmVudEFnZ3JlZ2F0b3IpXHJcbiAgICB7XHJcbiAgICAgICAgdGhpcy5jb25maWdIdHRwKCk7XHJcbiAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU2VydmljZS5hdXRoZW50aWNhdGVkO1xyXG4gICAgICAgIHRoaXMudGl0bGUgPSB0aGlzLmF1dGhTZXJ2aWNlLmF1dGhlbnRpY2F0ZWQgPyBcIldlbGtvbSBcIiArIGp3dF9kZWNvZGUodGhpcy5hdXRoU2VydmljZS5nZXRBY2Nlc3NUb2tlbigpKS5uYW1lIDogXCJTRk9SVU1cIjtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWd1cmVSb3V0ZXIoY29uZmlnLCByb3V0ZXIpIHtcclxuICAgICAgICB0aGlzLnJvdXRlciA9IHJvdXRlcjtcclxuXHJcbiAgICAgICAgbGV0IHN0ZXAgPSBuZXcgQXV0aG9yaXplU3RlcCh0aGlzLmF1dGhTZXJ2aWNlKTtcclxuICAgICAgICBjb25maWcuYWRkQXV0aG9yaXplU3RlcChzdGVwKTtcclxuXHJcbiAgICAgICAgY29uZmlnLnRpdGxlID0gJ0F1cmVsaWEnO1xyXG4gICAgICAgIGNvbmZpZy5tYXAoW1xuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnY29ycG9yYXRpZS9uaWV1dyddLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ25ld0NvcnBvcmF0aW9uJyxcclxuICAgICAgICAgICAgICAgIG1vZHVsZUlkOiAnY29tcG9uZW50cy9jb3Jwb3JhdGlvbi9uZXdDb3Jwb3JhdGlvbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnZm9ydW0vYmV3ZXJrLzppZCddLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2VkaXRGb3J1bScsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvZGFzaGJvYXJkL2VkaXRGb3J1bSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnZm9ydW0vbmlldXcnLF0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnbmV3Rm9ydW0nLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL2Rhc2hib2FyZC9uZXdGb3J1bSdcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnZGFzaGJvYXJkJ10sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnZGFzaGJvYXJkJyxcclxuICAgICAgICAgICAgICAgIG1vZHVsZUlkOiAnY29tcG9uZW50cy9kYXNoYm9hcmQvZGFzaGJvYXJkJyxcclxuICAgICAgICAgICAgICAgIGF1dGg6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnY29ycG9yYXRpZXMnLF0sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAnY29ycG9yYXRpb25zJyxcclxuICAgICAgICAgICAgICAgIG1vZHVsZUlkOiAnY29tcG9uZW50cy9jb3Jwb3JhdGlvbi9jb3Jwb3JhdGlvbnMnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogWydnZWJydWlrZXJzJ10sXHJcbiAgICAgICAgICAgICAgICBuYW1lOiAndXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgbW9kdWxlSWQ6ICdjb21wb25lbnRzL3VzZXIvdXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgYXV0aDogdHJ1ZVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICByb3V0ZTogWydzb2Z0d2FyZSddLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ3NvZnR3YXJlcycsXHJcbiAgICAgICAgICAgICAgICBtb2R1bGVJZDogJ2NvbXBvbmVudHMvc29mdHdhcmUvc29mdHdhcmVzJyxcclxuICAgICAgICAgICAgICAgIGF1dGg6IHRydWVcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgcm91dGU6IFsnLycsICdsb2dpbiddLFxyXG4gICAgICAgICAgICAgICAgbmFtZTogJ2xvZ2luJyxcclxuICAgICAgICAgICAgICAgIG1vZHVsZUlkOiAnY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbidcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICBdKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25maWdIdHRwKCk6IHZvaWQge1xyXG4gICAgICAgIHRoaXMuaHR0cC5jb25maWd1cmUoY29uZmlnID0+IHtcclxuICAgICAgICAgICAgY29uZmlnXHJcbiAgICAgICAgICAgICAgICAud2l0aEJhc2VVcmwoJ2FwaS8nKVxyXG4gICAgICAgICAgICAgICAgLndpdGhEZWZhdWx0cyh7XHJcbiAgICAgICAgICAgICAgICAgICAgbWV0aG9kOiBcIlBPU1RcIixcclxuICAgICAgICAgICAgICAgICAgICBjcmVkZW50aWFsczogJ3NhbWUtb3JpZ2luJyxcclxuICAgICAgICAgICAgICAgICAgICBoZWFkZXJzOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdBY2NlcHQnOiAnYXBwbGljYXRpb24vanNvbicsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICdYLVJlcXVlc3RlZC1XaXRoJzogJ0ZldGNoJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAud2l0aEludGVyY2VwdG9yKHtcclxuICAgICAgICAgICAgICAgICAgICByZXF1ZXN0KHJlcXVlc3QpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlcXVlc3RpbmcgJHtyZXF1ZXN0Lm1ldGhvZH0gJHtyZXF1ZXN0LnVybH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlcXVlc3Q7XHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZShyZXNwb25zZTogUmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coYFJlY2VpdmVkICR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnVybH1gKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLmNvbmZpZy5jb25maWd1cmUodGhpcy5odHRwKTtcclxuICAgIH1cclxuXHJcbiAgICBjcmVhdGVkKG93bmluZ1ZpZXcsIG15Vmlldykge1xyXG4gICAgICAgIHRoaXMuY3VyclVybCA9IHdpbmRvdy5sb2NhdGlvbi5wYXRobmFtZTtcclxuICAgIH1cclxuXHJcbiAgICBhdHRhY2hlZCgpIHtcclxuICAgICAgICB0aGlzLmV2ZW50LnN1YnNjcmliZSgnc2lnbmVkSW4nLCByZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuYXV0aGVudGljYXRlZCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICB0aGlzLnRpdGxlID0gXCJXZWxrb20gXCIgKyBqd3RfZGVjb2RlKHRoaXMuYXV0aFNlcnZpY2UuZ2V0QWNjZXNzVG9rZW4oKSkubmFtZTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBsb2dvdXQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuYXV0aFNlcnZpY2UubG9nb3V0KClcclxuICAgICAgICAgICAgLnRoZW4oKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5hdXRoZW50aWNhdGVkID0gdGhpcy5hdXRoU2VydmljZS5hdXRoZW50aWNhdGVkO1xyXG4gICAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoXCJsb2dpblwiKTtcclxuICAgICAgICAgICAgICAgIHRoaXMudGl0bGUgPSBcIlNGT1JVTVwiO1xyXG5cclxuICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiBcIkJlZGFua3Qgdm9vciB1dyBiZXpvZWtcIixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcInN1Y2Nlc3NcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxufVxyXG5cclxuQGF1dG9pbmplY3RcclxuY2xhc3MgQXV0aG9yaXplU3RlcCB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGF1dGhTZXJ2aWNlOiBBdXRoU2VydmljZSkge31cclxuXHJcbiAgICBydW4obmF2aWdhdGlvbkluc3RydWN0aW9uOiBOYXZpZ2F0aW9uSW5zdHJ1Y3Rpb24sIG5leHQ6IE5leHQpOiBQcm9taXNlPGFueT4ge1xyXG4gICAgICAgIGlmIChuYXZpZ2F0aW9uSW5zdHJ1Y3Rpb24uZ2V0QWxsSW5zdHJ1Y3Rpb25zKCkuc29tZShpID0+IGkuY29uZmlnLmF1dGgpKSB7XHJcbiAgICAgICAgICAgIGxldCBpc0xvZ2dlZEluID0gdGhpcy5hdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmICghaXNMb2dnZWRJbikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIG5leHQuY2FuY2VsKG5ldyBSZWRpcmVjdCgnbG9naW4nKSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiBuZXh0KCk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('authConfig',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var config = {
        providers: {
            google: {
                name: 'google',
                clientId: '833710645751-q02snmqimmijs2jdk9orckpmfdvi53dt.apps.googleusercontent.com'
            }
        }
    };
    exports.default = config;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImF1dGhDb25maWcudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBQUEsSUFBSSxNQUFNLEdBQUc7UUFDVCxTQUFTLEVBQUU7WUFDUCxNQUFNLEVBQUU7Z0JBQ0osSUFBSSxFQUFFLFFBQVE7Z0JBQ2QsUUFBUSxFQUFFLDBFQUEwRTthQUN2RjtTQUNKO0tBQ0osQ0FBQTtJQUVELGtCQUFlLE1BQU0sQ0FBQyIsImZpbGUiOiJhdXRoQ29uZmlnLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGNvbmZpZyA9IHtcbiAgICBwcm92aWRlcnM6IHtcbiAgICAgICAgZ29vZ2xlOiB7XG4gICAgICAgICAgICBuYW1lOiAnZ29vZ2xlJyxcbiAgICAgICAgICAgIGNsaWVudElkOiAnODMzNzEwNjQ1NzUxLXEwMnNubXFpbW1panMyamRrOW9yY2twbWZkdmk1M2R0LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJ1xuICAgICAgICB9XG4gICAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBjb25maWc7Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('environment',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = {
        debug: true,
        testing: true
    };
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVudmlyb25tZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztJQUFBLGtCQUFlO1FBQ2IsS0FBSyxFQUFFLElBQUk7UUFDWCxPQUFPLEVBQUUsSUFBSTtLQUNkLENBQUMiLCJmaWxlIjoiZW52aXJvbm1lbnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCB7XG4gIGRlYnVnOiB0cnVlLFxuICB0ZXN0aW5nOiB0cnVlXG59O1xuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('main',["require", "exports", "./environment", "./authConfig"], function (require, exports, environment_1, authConfig_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(aurelia) {
        aurelia.use
            .standardConfiguration()
            .feature('resources')
            .plugin('aurelia-authentication', function (baseConfig) {
            baseConfig.configure(authConfig_1.default);
        });
        if (environment_1.default.debug) {
            aurelia.use.developmentLogging();
        }
        if (environment_1.default.testing) {
            aurelia.use.plugin('aurelia-testing');
        }
        aurelia.start().then(function () { return aurelia.setRoot(); });
    }
    exports.configure = configure;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm1haW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBSUEsbUJBQTBCLE9BQWdCO1FBQ3RDLE9BQU8sQ0FBQyxHQUFHO2FBQ04scUJBQXFCLEVBQUU7YUFDdkIsT0FBTyxDQUFDLFdBQVcsQ0FBQzthQUNwQixNQUFNLENBQUMsd0JBQXdCLEVBQ2hDLFVBQUMsVUFBVTtZQUNQLFVBQVUsQ0FBQyxTQUFTLENBQUMsb0JBQU0sQ0FBQyxDQUFDO1FBQ2pDLENBQUMsQ0FBQyxDQUFDO1FBRVAsRUFBRSxDQUFDLENBQUMscUJBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3BCLE9BQU8sQ0FBQyxHQUFHLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUNyQyxDQUFDO1FBRUQsRUFBRSxDQUFDLENBQUMscUJBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLENBQUM7UUFDMUMsQ0FBQztRQUVELE9BQU8sQ0FBQyxLQUFLLEVBQUUsQ0FBQyxJQUFJLENBQUMsY0FBTSxPQUFBLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBakIsQ0FBaUIsQ0FBQyxDQUFDO0lBQ2xELENBQUM7SUFsQkQsOEJBa0JDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXJlbGlhIH0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnXG5pbXBvcnQgZW52aXJvbm1lbnQgZnJvbSAnLi9lbnZpcm9ubWVudCc7XG5pbXBvcnQgY29uZmlnIGZyb20gJy4vYXV0aENvbmZpZydcblxuZXhwb3J0IGZ1bmN0aW9uIGNvbmZpZ3VyZShhdXJlbGlhOiBBdXJlbGlhKSB7XG4gICAgYXVyZWxpYS51c2VcbiAgICAgICAgLnN0YW5kYXJkQ29uZmlndXJhdGlvbigpXG4gICAgICAgIC5mZWF0dXJlKCdyZXNvdXJjZXMnKVxuICAgICAgICAucGx1Z2luKCdhdXJlbGlhLWF1dGhlbnRpY2F0aW9uJyxcbiAgICAgICAgKGJhc2VDb25maWcpID0+IHtcbiAgICAgICAgICAgIGJhc2VDb25maWcuY29uZmlndXJlKGNvbmZpZyk7XG4gICAgICAgIH0pO1xuXG4gICAgaWYgKGVudmlyb25tZW50LmRlYnVnKSB7XG4gICAgICAgIGF1cmVsaWEudXNlLmRldmVsb3BtZW50TG9nZ2luZygpO1xuICAgIH1cblxuICAgIGlmIChlbnZpcm9ubWVudC50ZXN0aW5nKSB7XG4gICAgICAgIGF1cmVsaWEudXNlLnBsdWdpbignYXVyZWxpYS10ZXN0aW5nJyk7XG4gICAgfVxuXG4gICAgYXVyZWxpYS5zdGFydCgpLnRoZW4oKCkgPT4gYXVyZWxpYS5zZXRSb290KCkpO1xufSJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('resources/index',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function configure(config) {
    }
    exports.configure = configure;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJlc291cmNlcy9pbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7SUFFQSxtQkFBMEIsTUFBOEI7SUFFeEQsQ0FBQztJQUZELDhCQUVDIiwiZmlsZSI6InJlc291cmNlcy9pbmRleC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7RnJhbWV3b3JrQ29uZmlndXJhdGlvbn0gZnJvbSAnYXVyZWxpYS1mcmFtZXdvcmsnO1xuXG5leHBvcnQgZnVuY3Rpb24gY29uZmlndXJlKGNvbmZpZzogRnJhbWV3b3JrQ29uZmlndXJhdGlvbikge1xuICAvL2NvbmZpZy5nbG9iYWxSZXNvdXJjZXMoW10pO1xufVxuIl0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define('components/authentication/login',["require", "exports", "sweetalert", "aurelia-framework", "aurelia-fetch-client", "aurelia-authentication", "aurelia-event-aggregator", "aurelia-router"], function (require, exports, swal, aurelia_framework_1, aurelia_fetch_client_1, aurelia_authentication_1, aurelia_event_aggregator_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var login = (function () {
        function login(auth, http, event, router) {
            this.auth = auth;
            this.http = http;
            this.event = event;
            this.router = router;
            this.email = "";
            this.password = "";
        }
        login.prototype.login = function () {
            var _this = this;
            this.auth.login({
                email: this.email,
                password: this.password
            }).then(function (response) {
                _this.event.publish('signedIn', true);
                swal({
                    title: "U bent succesvol ingelogd",
                    type: "success",
                    showConfirmButton: false,
                    timer: 2000
                });
                _this.router.navigate("dashboard");
            })
                .catch(function (err) {
                swal({
                    title: "Inloggegevens zijn onjuist",
                    type: "warning",
                    showCancelButton: true,
                    showConfirmButton: false,
                    closeOnConfirm: true
                });
            });
        };
        login.prototype.logout = function () {
            this.auth.logout('');
        };
        login.prototype.test = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2];
                });
            });
        };
        return login;
    }());
    login = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_authentication_1.AuthService,
            aurelia_fetch_client_1.HttpClient,
            aurelia_event_aggregator_1.EventAggregator,
            aurelia_router_1.Router])
    ], login);
    exports.login = login;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvYXV0aGVudGljYXRpb24vbG9naW4udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFRQSxJQUFhLEtBQUs7UUFLZCxlQUFvQixJQUFpQixFQUNqQixJQUFnQixFQUNoQixLQUFzQixFQUN0QixNQUFjO1lBSGQsU0FBSSxHQUFKLElBQUksQ0FBYTtZQUNqQixTQUFJLEdBQUosSUFBSSxDQUFZO1lBQ2hCLFVBQUssR0FBTCxLQUFLLENBQWlCO1lBQ3RCLFdBQU0sR0FBTixNQUFNLENBQVE7WUFObEMsVUFBSyxHQUFHLEVBQUUsQ0FBQztZQUNYLGFBQVEsR0FBRyxFQUFFLENBQUM7UUFNVixDQUFDO1FBRUwscUJBQUssR0FBTDtZQUFBLGlCQXlCQztZQXhCRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztnQkFDWixLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUs7Z0JBQ2pCLFFBQVEsRUFBRSxJQUFJLENBQUMsUUFBUTthQUMxQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFDWixLQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxVQUFVLEVBQUUsSUFBSSxDQUFDLENBQUM7Z0JBRXJDLElBQUksQ0FBQztvQkFDRCxLQUFLLEVBQUUsMkJBQTJCO29CQUNsQyxJQUFJLEVBQUUsU0FBUztvQkFDZixpQkFBaUIsRUFBRSxLQUFLO29CQUN4QixLQUFLLEVBQUUsSUFBSTtpQkFDZCxDQUFDLENBQUM7Z0JBRUQsS0FBSSxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxVQUFBLEdBQUc7Z0JBQ04sSUFBSSxDQUFDO29CQUNELEtBQUssRUFBRSw0QkFBNEI7b0JBQ25DLElBQUksRUFBRSxTQUFTO29CQUNmLGdCQUFnQixFQUFFLElBQUk7b0JBQ3RCLGlCQUFpQixFQUFFLEtBQUs7b0JBQ3hCLGNBQWMsRUFBRSxJQUFJO2lCQUN2QixDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCxzQkFBTSxHQUFOO1lBQ0ksSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDekIsQ0FBQztRQUVLLG9CQUFJLEdBQVY7Ozs7OztTQUVDO1FBQ0wsWUFBQztJQUFELENBN0NBLEFBNkNDLElBQUE7SUE3Q1ksS0FBSztRQURqQiw4QkFBVTt5Q0FNbUIsb0NBQVc7WUFDWCxpQ0FBVTtZQUNULDBDQUFlO1lBQ2QsdUJBQU07T0FSekIsS0FBSyxDQTZDakI7SUE3Q1ksc0JBQUsiLCJmaWxlIjoiY29tcG9uZW50cy9hdXRoZW50aWNhdGlvbi9sb2dpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHN3YWwgZnJvbSAnc3dlZXRhbGVydCc7XHJcbmltcG9ydCB7IGF1dG9pbmplY3QgfSBmcm9tIFwiYXVyZWxpYS1mcmFtZXdvcmtcIlxyXG5pbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgQXV0aFNlcnZpY2UgfSBmcm9tIFwiYXVyZWxpYS1hdXRoZW50aWNhdGlvblwiXHJcbmltcG9ydCB7IEV2ZW50QWdncmVnYXRvciB9IGZyb20gJ2F1cmVsaWEtZXZlbnQtYWdncmVnYXRvcic7XHJcbmltcG9ydCB7IFJvdXRlciB9IGZyb20gJ2F1cmVsaWEtcm91dGVyJ1xyXG5cclxuQGF1dG9pbmplY3RcclxuZXhwb3J0IGNsYXNzIGxvZ2luIHtcclxuXHJcbiAgICBlbWFpbCA9IFwiXCI7XHJcbiAgICBwYXNzd29yZCA9IFwiXCI7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBhdXRoOiBBdXRoU2VydmljZSxcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgaHR0cDogSHR0cENsaWVudCxcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgZXZlbnQ6IEV2ZW50QWdncmVnYXRvcixcclxuICAgICAgICAgICAgICAgIHByaXZhdGUgcm91dGVyOiBSb3V0ZXJcclxuICAgICkgeyB9XHJcblxyXG4gICAgbG9naW4oKSB7XHJcbiAgICAgICAgdGhpcy5hdXRoLmxvZ2luKHtcclxuICAgICAgICAgICAgZW1haWw6IHRoaXMuZW1haWwsXHJcbiAgICAgICAgICAgIHBhc3N3b3JkOiB0aGlzLnBhc3N3b3JkXHJcbiAgICAgICAgfSkudGhlbihyZXNwb25zZSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuZXZlbnQucHVibGlzaCgnc2lnbmVkSW4nLCB0cnVlKTtcclxuXHJcbiAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgdGl0bGU6IFwiVSBiZW50IHN1Y2Nlc3ZvbCBpbmdlbG9nZFwiLFxyXG4gICAgICAgICAgICAgICAgdHlwZTogXCJzdWNjZXNzXCIsXHJcbiAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB0aW1lcjogMjAwMFxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgdGhpcy5yb3V0ZXIubmF2aWdhdGUoXCJkYXNoYm9hcmRcIik7XHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIC5jYXRjaChlcnIgPT4ge1xyXG4gICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiSW5sb2dnZWdldmVucyB6aWpuIG9uanVpc3RcIixcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBcIndhcm5pbmdcIixcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICBjbG9zZU9uQ29uZmlybTogdHJ1ZVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGxvZ291dCgpIHtcclxuICAgICAgICB0aGlzLmF1dGgubG9nb3V0KCcnKTtcclxuICAgIH1cclxuXHJcbiAgICBhc3luYyB0ZXN0KCkge1xyXG5cclxuICAgIH1cclxufSAiXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/corporation/corporations',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var corporations = (function () {
        function corporations(http) {
            this.http = http;
            this.corporations = [];
            this.fetchCorporations();
        }
        corporations.prototype.fetchCorporations = function () {
            var _this = this;
            this.http.fetch('corporation/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.corporations = data;
            });
        };
        corporations.prototype.destroy = function (forum) {
            var _this = this;
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder deze corporatie',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (isOk) {
                if (isOk) {
                    _this.http.fetch('corporation/destroy', {
                        body: aurelia_fetch_client_1.json(forum)
                    }).then(function (data) {
                        _this.corporations = _this.corporations.filter(function (obj) { return obj.id != forum.id; });
                        swal({
                            title: 'Verwijderd',
                            text: 'Corporatie is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    });
                }
            });
        };
        return corporations;
    }());
    corporations = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], corporations);
    exports.corporations = corporations;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29ycG9yYXRpb24vY29ycG9yYXRpb25zLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUlBLElBQWEsWUFBWTtRQUtyQixzQkFBb0IsSUFBZ0I7WUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUhwQyxpQkFBWSxHQUFHLEVBQUUsQ0FBQztZQUlkLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxDQUFDO1FBQzdCLENBQUM7UUFFRCx3Q0FBaUIsR0FBakI7WUFBQSxpQkFNQztZQUxHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLG1CQUFtQixDQUFDO2lCQUMvQixJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2lCQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUNOLEtBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO1lBQzdCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELDhCQUFPLEdBQVAsVUFBUSxLQUFLO1lBQWIsaUJBeUJDO1lBeEJHLElBQUksQ0FBQztnQkFDRCxLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixJQUFJLEVBQUUsU0FBUztnQkFDZixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixpQkFBaUIsRUFBRSw4QkFBOEI7Z0JBQ2pELGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLGtCQUFrQixFQUFFLFNBQVM7YUFDaEMsRUFBRSxVQUFDLElBQUk7Z0JBQ0osRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztvQkFDUCxLQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxxQkFBcUIsRUFBRTt3QkFDbkMsSUFBSSxFQUFFLDJCQUFJLENBQUMsS0FBSyxDQUFDO3FCQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTt3QkFDUixLQUFJLENBQUMsWUFBWSxHQUFHLEtBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFsQixDQUFrQixDQUFDLENBQUM7d0JBRTFFLElBQUksQ0FBQzs0QkFDRCxLQUFLLEVBQUUsWUFBWTs0QkFDbkIsSUFBSSxFQUFFLG9DQUFvQzs0QkFDMUMsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsaUJBQWlCLEVBQUUsS0FBSzs0QkFDeEIsS0FBSyxFQUFFLElBQUk7eUJBQ2QsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxtQkFBQztJQUFELENBM0NBLEFBMkNDLElBQUE7SUEzQ1ksWUFBWTtRQUR4Qiw4QkFBVTt5Q0FNbUIsaUNBQVU7T0FMM0IsWUFBWSxDQTJDeEI7SUEzQ1ksb0NBQVkiLCJmaWxlIjoiY29tcG9uZW50cy9jb3Jwb3JhdGlvbi9jb3Jwb3JhdGlvbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3MgY29ycG9yYXRpb25zIHtcclxuXHJcbiAgICBjb3Jwb3JhdGlvbnMgPSBbXTtcclxuXHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XHJcbiAgICAgICAgdGhpcy5mZXRjaENvcnBvcmF0aW9ucygpO1xyXG4gICAgfVxyXG5cclxuICAgIGZldGNoQ29ycG9yYXRpb25zKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnY29ycG9yYXRpb24vaW5kZXgnKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5jb3Jwb3JhdGlvbnMgPSBkYXRhO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBkZXN0cm95KGZvcnVtKSB7XHJcbiAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgIHRpdGxlOiAnV2VldCB1IGhldCB6ZWtlcj8nLFxyXG4gICAgICAgICAgICB0eXBlOiAnd2FybmluZycsXHJcbiAgICAgICAgICAgIHNob3dDYW5jZWxCdXR0b246IHRydWUsXHJcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25UZXh0OiAnSmEgdmVyd2lqZGVyIGRlemUgY29ycG9yYXRpZScsXHJcbiAgICAgICAgICAgIGNhbmNlbEJ1dHRvblRleHQ6ICdTdG9wIScsXHJcbiAgICAgICAgICAgIGNvbmZpcm1CdXR0b25Db2xvcjogJyMwMDJlNWInLFxyXG4gICAgICAgIH0sIChpc09rKSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpc09rKSB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ2NvcnBvcmF0aW9uL2Rlc3Ryb3knLCB7XHJcbiAgICAgICAgICAgICAgICAgICAgYm9keToganNvbihmb3J1bSlcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5jb3Jwb3JhdGlvbnMgPSB0aGlzLmNvcnBvcmF0aW9ucy5maWx0ZXIoKG9iaikgPT4gb2JqLmlkICE9IGZvcnVtLmlkKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVyd2lqZGVyZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQ6ICdDb3Jwb3JhdGllIGlzIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyOiAzMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/corporation/newCorporation',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var newCorporation = (function () {
        function newCorporation(http) {
            this.http = http;
        }
        newCorporation.prototype.store = function () {
        };
        return newCorporation;
    }());
    newCorporation = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], newCorporation);
    exports.newCorporation = newCorporation;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvY29ycG9yYXRpb24vbmV3Q29ycG9yYXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O0lBSUEsSUFBYSxjQUFjO1FBRXZCLHdCQUFvQixJQUFnQjtZQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1FBQUksQ0FBQztRQUV6Qyw4QkFBSyxHQUFMO1FBRUEsQ0FBQztRQUNMLHFCQUFDO0lBQUQsQ0FQQSxBQU9DLElBQUE7SUFQWSxjQUFjO1FBRDFCLDhCQUFVO3lDQUdtQixpQ0FBVTtPQUYzQixjQUFjLENBTzFCO0lBUFksd0NBQWMiLCJmaWxlIjoiY29tcG9uZW50cy9jb3Jwb3JhdGlvbi9uZXdDb3Jwb3JhdGlvbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBuZXdDb3Jwb3JhdGlvbiB7XHJcblxyXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7IH1cclxuXHJcbiAgICBzdG9yZSgpIHtcclxuICAgICAgIFxyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

define('components/shared/sideBar',["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var sideBar = (function () {
        function sideBar() {
        }
        return sideBar;
    }());
    exports.sideBar = sideBar;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc2hhcmVkL3NpZGVCYXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0lBQUE7UUFBQTtRQUFzQixDQUFDO1FBQUQsY0FBQztJQUFELENBQXRCLEFBQXVCLElBQUE7SUFBViwwQkFBTyIsImZpbGUiOiJjb21wb25lbnRzL3NoYXJlZC9zaWRlQmFyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGNsYXNzIHNpZGVCYXIge30iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/dashboard',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var dashboard = (function () {
        function dashboard(http) {
            this.http = http;
            this.forums = [];
            this.fetchForums();
        }
        dashboard.prototype.fetchForums = function () {
            var _this = this;
            this.http.fetch('forum/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.forums = data;
            });
        };
        dashboard.prototype.destroy = function (forum) {
            var _this = this;
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder dit forum',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (isOk) {
                if (isOk) {
                    _this.http.fetch('forum/destroy', {
                        body: aurelia_fetch_client_1.json(forum)
                    }).then(function (data) {
                        _this.forums = _this.forums.filter(function (obj) { return obj.id != forum.id; });
                        swal({
                            title: 'Verwijderd',
                            text: 'Het forum is succesvol verwijderd',
                            type: 'success',
                            showConfirmButton: false,
                            timer: 3000
                        });
                    });
                }
            });
        };
        dashboard.prototype.isEmpty = function (forums) {
            return forums == [];
        };
        return dashboard;
    }());
    dashboard = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], dashboard);
    exports.dashboard = dashboard;
    var ForumModel = (function () {
        function ForumModel() {
        }
        return ForumModel;
    }());
    exports.ForumModel = ForumModel;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJQSxJQUFhLFNBQVM7UUFJbEIsbUJBQW9CLElBQWdCO1lBQWhCLFNBQUksR0FBSixJQUFJLENBQVk7WUFGN0IsV0FBTSxHQUFpQixFQUFFLENBQUM7WUFHN0IsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ3ZCLENBQUM7UUFFRCwrQkFBVyxHQUFYO1lBQUEsaUJBTUM7WUFMRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLENBQUM7aUJBQ3pCLElBQUksQ0FBQyxVQUFBLFFBQVEsSUFBSSxPQUFBLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBZixDQUFlLENBQUM7aUJBQ2pDLElBQUksQ0FBQyxVQUFBLElBQUk7Z0JBQ04sS0FBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7WUFDdkIsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQsMkJBQU8sR0FBUCxVQUFRLEtBQUs7WUFBYixpQkF5QkM7WUF4QkcsSUFBSSxDQUFDO2dCQUNELEtBQUssRUFBRSxtQkFBbUI7Z0JBQzFCLElBQUksRUFBRSxTQUFTO2dCQUNmLGdCQUFnQixFQUFFLElBQUk7Z0JBQ3RCLGlCQUFpQixFQUFFLHdCQUF3QjtnQkFDM0MsZ0JBQWdCLEVBQUUsT0FBTztnQkFDekIsa0JBQWtCLEVBQUUsU0FBUzthQUNoQyxFQUFFLFVBQUMsSUFBSTtnQkFDSixFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUNQLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsRUFBRTt3QkFDN0IsSUFBSSxFQUFFLDJCQUFJLENBQUMsS0FBSyxDQUFDO3FCQUNwQixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTt3QkFDUixLQUFJLENBQUMsTUFBTSxHQUFHLEtBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQUMsR0FBRyxJQUFLLE9BQUEsR0FBRyxDQUFDLEVBQUUsSUFBSSxLQUFLLENBQUMsRUFBRSxFQUFsQixDQUFrQixDQUFDLENBQUM7d0JBRTlELElBQUksQ0FBQzs0QkFDRCxLQUFLLEVBQUUsWUFBWTs0QkFDbkIsSUFBSSxFQUFFLG1DQUFtQzs0QkFDekMsSUFBSSxFQUFFLFNBQVM7NEJBQ2YsaUJBQWlCLEVBQUUsS0FBSzs0QkFDeEIsS0FBSyxFQUFFLElBQUk7eUJBQ2QsQ0FBQyxDQUFDO29CQUNQLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFFRCwyQkFBTyxHQUFQLFVBQVEsTUFBTTtZQUNWLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1FBQ3hCLENBQUM7UUFDTCxnQkFBQztJQUFELENBOUNBLEFBOENDLElBQUE7SUE5Q1ksU0FBUztRQURyQiw4QkFBVTt5Q0FLbUIsaUNBQVU7T0FKM0IsU0FBUyxDQThDckI7SUE5Q1ksOEJBQVM7SUFnRHRCO1FBQUE7UUFJQSxDQUFDO1FBQUQsaUJBQUM7SUFBRCxDQUpBLEFBSUMsSUFBQTtJQUpZLGdDQUFVIiwiZmlsZSI6ImNvbXBvbmVudHMvZGFzaGJvYXJkL2Rhc2hib2FyZC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBkYXNoYm9hcmQge1xyXG5cclxuICAgIHB1YmxpYyBmb3J1bXM6IEZvcnVtTW9kZWxbXSA9IFtdO1xyXG5cclxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCkge1xyXG4gICAgICAgIHRoaXMuZmV0Y2hGb3J1bXMoKTtcbiAgICB9XHJcblxyXG4gICAgZmV0Y2hGb3J1bXMoKSB7XG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnZm9ydW0vaW5kZXgnKVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3J1bXMgPSBkYXRhO1xuICAgICAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVzdHJveShmb3J1bSkge1xyXG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ1dlZXQgdSBoZXQgemVrZXI/JyxcclxuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ0phIHZlcndpamRlciBkaXQgZm9ydW0nLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnU3RvcCEnLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMDAyZTViJyxcclxuICAgICAgICB9LCAoaXNPaykgPT4ge1xyXG4gICAgICAgICAgICBpZiAoaXNPaykge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5odHRwLmZldGNoKCdmb3J1bS9kZXN0cm95Jywge1xyXG4gICAgICAgICAgICAgICAgICAgIGJvZHk6IGpzb24oZm9ydW0pXHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuZm9ydW1zID0gdGhpcy5mb3J1bXMuZmlsdGVyKChvYmopID0+IG9iai5pZCAhPSBmb3J1bS5pZCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1ZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0ZXh0OiAnSGV0IGZvcnVtIGlzIHN1Y2Nlc3ZvbCB2ZXJ3aWpkZXJkJyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHRpbWVyOiAzMDAwXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlzRW1wdHkoZm9ydW1zKSB7XHJcbiAgICAgICAgcmV0dXJuIGZvcnVtcyA9PSBbXTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IGNsYXNzIEZvcnVtTW9kZWwge1xyXG4gICAgaWQ6IG51bWJlcjtcclxuICAgIG5hbWU6IHN0cmluZztcclxuICAgIGRlc2NyaXB0aW9uOiBzdHJpbmc7XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/editForum',["require", "exports", "aurelia-fetch-client", "aurelia-framework", "aurelia-router"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1, aurelia_router_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var editForum = (function () {
        function editForum(http, router) {
            this.http = http;
            this.router = router;
        }
        editForum.prototype.created = function () {
            this.getForum();
        };
        editForum.prototype.getForum = function () {
            var _this = this;
            this.http.fetch('forum/show', {
                body: aurelia_fetch_client_1.json(this.router.currentInstruction.params.id)
            })
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.forum = data;
            });
        };
        editForum.prototype.update = function () {
            this.http.fetch('forum/update', {
                body: aurelia_fetch_client_1.json(this.forum)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Forum succesvol geupdatet",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                }
            });
        };
        return editForum;
    }());
    editForum = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient, aurelia_router_1.Router])
    ], editForum);
    exports.editForum = editForum;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGFzaGJvYXJkL2VkaXRGb3J1bS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFLQSxJQUFhLFNBQVM7UUFJbEIsbUJBQW9CLElBQWdCLEVBQVUsTUFBYztZQUF4QyxTQUFJLEdBQUosSUFBSSxDQUFZO1lBQVUsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUc1RCxDQUFDO1FBRUQsMkJBQU8sR0FBUDtZQUNJLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBRUQsNEJBQVEsR0FBUjtZQUFBLGlCQVFDO1lBUEcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsWUFBWSxFQUFFO2dCQUMxQixJQUFJLEVBQUUsMkJBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUM7YUFDdkQsQ0FBQztpQkFDRyxJQUFJLENBQUMsVUFBQSxRQUFRLElBQUksT0FBQSxRQUFRLENBQUMsSUFBSSxFQUFFLEVBQWYsQ0FBZSxDQUFDO2lCQUNqQyxJQUFJLENBQUMsVUFBQSxJQUFJO2dCQUNOLEtBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDO1lBQ3RCLENBQUMsQ0FBQyxDQUFDO1FBQ1gsQ0FBQztRQUVELDBCQUFNLEdBQU47WUFDSSxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUU7Z0JBQzVCLElBQUksRUFBRSwyQkFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7YUFDekIsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLFFBQVE7Z0JBQ1osRUFBRSxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sSUFBSSxHQUFHLENBQUMsQ0FBQyxDQUFDO29CQUN6QixJQUFJLENBQUM7d0JBQ0QsS0FBSyxFQUFFLDJCQUEyQjt3QkFDbEMsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsaUJBQWlCLEVBQUUsS0FBSzt3QkFDeEIsS0FBSyxFQUFFLElBQUk7cUJBQ2QsQ0FBQyxDQUFDO2dCQUNQLENBQUM7WUFDTCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxnQkFBQztJQUFELENBckNBLEFBcUNDLElBQUE7SUFyQ1ksU0FBUztRQURyQiw4QkFBVTt5Q0FLbUIsaUNBQVUsRUFBa0IsdUJBQU07T0FKbkQsU0FBUyxDQXFDckI7SUFyQ1ksOEJBQVMiLCJmaWxlIjoiY29tcG9uZW50cy9kYXNoYm9hcmQvZWRpdEZvcnVtLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwganNvbiB9IGZyb20gXCJhdXJlbGlhLWZldGNoLWNsaWVudFwiXHJcbmltcG9ydCB7IGF1dG9pbmplY3QgfSBmcm9tIFwiYXVyZWxpYS1mcmFtZXdvcmtcIlxyXG5pbXBvcnQgeyBSb3V0ZXIgfSBmcm9tICdhdXJlbGlhLXJvdXRlcidcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBlZGl0Rm9ydW0ge1xyXG5cclxuICAgIGZvcnVtOiB7fTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQsIHByaXZhdGUgcm91dGVyOiBSb3V0ZXIpIHtcbiAgICAgICAgXG4gICAgICAgIC8vdGhpcy5nZXRGb3J1bSgpO1xuICAgIH1cblxuICAgIGNyZWF0ZWQoKSB7XG4gICAgICAgIHRoaXMuZ2V0Rm9ydW0oKTtcbiAgICB9XG5cbiAgICBnZXRGb3J1bSgpIHtcbiAgICAgICAgdGhpcy5odHRwLmZldGNoKCdmb3J1bS9zaG93Jywge1xuICAgICAgICAgICAgYm9keToganNvbih0aGlzLnJvdXRlci5jdXJyZW50SW5zdHJ1Y3Rpb24ucGFyYW1zLmlkKVxuICAgICAgICB9KVxyXG4gICAgICAgICAgICAudGhlbihyZXNwb25zZSA9PiByZXNwb25zZS5qc29uKCkpXHJcbiAgICAgICAgICAgIC50aGVuKGRhdGEgPT4ge1xyXG4gICAgICAgICAgICAgICAgdGhpcy5mb3J1bSA9IGRhdGE7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHVwZGF0ZSgpIHtcclxuICAgICAgICB0aGlzLmh0dHAuZmV0Y2goJ2ZvcnVtL3VwZGF0ZScsIHtcclxuICAgICAgICAgICAgYm9keToganNvbih0aGlzLmZvcnVtKVxyXG4gICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICBpZiAocmVzcG9uc2Uuc3RhdHVzID09IDIwMCkge1xyXG4gICAgICAgICAgICAgICAgc3dhbCh7XHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRm9ydW0gc3VjY2Vzdm9sIGdldXBkYXRldFwiLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgICAgICB0aW1lcjogMjAwMFxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgIH1cclxufSJdLCJzb3VyY2VSb290Ijoic3JjIn0=

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/dashboard/newForum',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var newForum = (function () {
        function newForum(http) {
            this.http = http;
        }
        newForum.prototype.store = function () {
            var _this = this;
            this.http.fetch('forum/store', {
                body: aurelia_fetch_client_1.json(this.forum)
            }).then(function (response) {
                if (response.status == 200) {
                    swal({
                        title: "Forum succesvol aangemaakt",
                        type: "success",
                        showConfirmButton: false,
                        timer: 2000
                    });
                    _this.forum.name = "";
                    _this.forum.description = "";
                }
            });
        };
        return newForum;
    }());
    newForum = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], newForum);
    exports.newForum = newForum;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvZGFzaGJvYXJkL25ld0ZvcnVtLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUlBLElBQWEsUUFBUTtRQUlqQixrQkFBb0IsSUFBZ0I7WUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFJLENBQUM7UUFFekMsd0JBQUssR0FBTDtZQUFBLGlCQWdCQztZQWZHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRTtnQkFDdkIsSUFBSSxFQUFFLDJCQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQzthQUN6QixDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsUUFBUTtnQkFDZCxFQUFFLENBQUMsQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7b0JBQ3pCLElBQUksQ0FBQzt3QkFDRCxLQUFLLEVBQUUsNEJBQTRCO3dCQUNuQyxJQUFJLEVBQUUsU0FBUzt3QkFDZixpQkFBaUIsRUFBRSxLQUFLO3dCQUN4QixLQUFLLEVBQUUsSUFBSTtxQkFDZCxDQUFDLENBQUM7b0JBRUgsS0FBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsRUFBRSxDQUFDO29CQUNyQixLQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxFQUFFLENBQUM7Z0JBQ2hDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxlQUFDO0lBQUQsQ0F2QkEsQUF1QkMsSUFBQTtJQXZCWSxRQUFRO1FBRHBCLDhCQUFVO3lDQUttQixpQ0FBVTtPQUozQixRQUFRLENBdUJwQjtJQXZCWSw0QkFBUSIsImZpbGUiOiJjb21wb25lbnRzL2Rhc2hib2FyZC9uZXdGb3J1bS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEh0dHBDbGllbnQsIGpzb24gfSBmcm9tIFwiYXVyZWxpYS1mZXRjaC1jbGllbnRcIlxyXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcclxuXHJcbkBhdXRvaW5qZWN0XHJcbmV4cG9ydCBjbGFzcyBuZXdGb3J1bSB7XHJcblxyXG4gICAgZm9ydW06IHsgbmFtZTogXCJcIiwgZGVzY3JpcHRpb246IFwiXCIgfTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHsgfVxyXG5cclxuICAgIHN0b3JlKCkge1xyXG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnZm9ydW0vc3RvcmUnLCB7XHJcbiAgICAgICAgICAgICAgICBib2R5OiBqc29uKHRoaXMuZm9ydW0pXHJcbiAgICAgICAgICAgIH0pLnRoZW4ocmVzcG9uc2UgPT4ge1xyXG4gICAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT0gMjAwKSB7XHJcbiAgICAgICAgICAgICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgdGl0bGU6IFwiRm9ydW0gc3VjY2Vzdm9sIGFhbmdlbWFha3RcIixcclxuICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IFwic3VjY2Vzc1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgc2hvd0NvbmZpcm1CdXR0b246IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgdGltZXI6IDIwMDBcclxuICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICB0aGlzLmZvcnVtLm5hbWUgPSBcIlwiO1xyXG4gICAgICAgICAgICAgICAgICB0aGlzLmZvcnVtLmRlc2NyaXB0aW9uID0gXCJcIjtcclxuICAgICAgICAgICAgICB9ICAgICAgICAgIFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59Il0sInNvdXJjZVJvb3QiOiJzcmMifQ==

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/user/users',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var users = (function () {
        function users(http) {
            this.http = http;
            this.users = [];
            this.fetchUsers();
        }
        users.prototype.fetchUsers = function () {
            var _this = this;
            this.http.fetch('user/index')
                .then(function (response) { return response.json(); })
                .then(function (data) {
                _this.users = data;
            });
        };
        users.prototype.destroy = function (forum) {
            var _this = this;
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder dit forum',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (forum) {
                _this.http.fetch('forum/destroy').then(function (data) {
                    swal({
                        title: 'Verwijderd',
                        text: 'Het forum is succesvol verwijderd',
                        type: 'success',
                        showConfirmButton: false,
                    });
                });
            });
        };
        return users;
    }());
    users = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], users);
    exports.users = users;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvdXNlci91c2Vycy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7SUFJQSxJQUFhLEtBQUs7UUFJZCxlQUFvQixJQUFnQjtZQUFoQixTQUFJLEdBQUosSUFBSSxDQUFZO1lBRnBDLFVBQUssR0FBRyxFQUFFLENBQUM7WUFHUCxJQUFJLENBQUMsVUFBVSxFQUFFLENBQUM7UUFDdEIsQ0FBQztRQUVELDBCQUFVLEdBQVY7WUFBQSxpQkFNQztZQUxHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQztpQkFDeEIsSUFBSSxDQUFDLFVBQUEsUUFBUSxJQUFJLE9BQUEsUUFBUSxDQUFDLElBQUksRUFBRSxFQUFmLENBQWUsQ0FBQztpQkFDakMsSUFBSSxDQUFDLFVBQUEsSUFBSTtnQkFDTixLQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQztZQUN0QixDQUFDLENBQUMsQ0FBQztRQUNYLENBQUM7UUFFRCx1QkFBTyxHQUFQLFVBQVEsS0FBSztZQUFiLGlCQWtCQztZQWpCRyxJQUFJLENBQUM7Z0JBQ0QsS0FBSyxFQUFFLG1CQUFtQjtnQkFDMUIsSUFBSSxFQUFFLFNBQVM7Z0JBQ2YsZ0JBQWdCLEVBQUUsSUFBSTtnQkFDdEIsaUJBQWlCLEVBQUUsd0JBQXdCO2dCQUMzQyxnQkFBZ0IsRUFBRSxPQUFPO2dCQUN6QixrQkFBa0IsRUFBRSxTQUFTO2FBQ2hDLEVBQUUsVUFBQyxLQUFLO2dCQUNMLEtBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGVBQWUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUk7b0JBQ3RDLElBQUksQ0FBQzt3QkFDRCxLQUFLLEVBQUUsWUFBWTt3QkFDbkIsSUFBSSxFQUFFLG1DQUFtQzt3QkFDekMsSUFBSSxFQUFFLFNBQVM7d0JBQ2YsaUJBQWlCLEVBQUUsS0FBSztxQkFDM0IsQ0FBQyxDQUFDO2dCQUNQLENBQUMsQ0FBQyxDQUFDO1lBQ1AsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBQ0wsWUFBQztJQUFELENBbkNBLEFBbUNDLElBQUE7SUFuQ1ksS0FBSztRQURqQiw4QkFBVTt5Q0FLbUIsaUNBQVU7T0FKM0IsS0FBSyxDQW1DakI7SUFuQ1ksc0JBQUsiLCJmaWxlIjoiY29tcG9uZW50cy91c2VyL3VzZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSHR0cENsaWVudCwganNvbiB9IGZyb20gXCJhdXJlbGlhLWZldGNoLWNsaWVudFwiXG5pbXBvcnQgeyBhdXRvaW5qZWN0IH0gZnJvbSBcImF1cmVsaWEtZnJhbWV3b3JrXCJcblxuQGF1dG9pbmplY3RcbmV4cG9ydCBjbGFzcyB1c2VycyB7XG5cbiAgICB1c2VycyA9IFtdO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBodHRwOiBIdHRwQ2xpZW50KSB7XG4gICAgICAgIHRoaXMuZmV0Y2hVc2VycygpO1xuICAgIH1cblxuICAgIGZldGNoVXNlcnMoKSB7XG4gICAgICAgIHRoaXMuaHR0cC5mZXRjaCgndXNlci9pbmRleCcpXHJcbiAgICAgICAgICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAgICAgLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICB0aGlzLnVzZXJzID0gZGF0YTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICB9XG5cbiAgICBkZXN0cm95KGZvcnVtKSB7XG4gICAgICAgIHN3YWwoe1xyXG4gICAgICAgICAgICB0aXRsZTogJ1dlZXQgdSBoZXQgemVrZXI/JyxcclxuICAgICAgICAgICAgdHlwZTogJ3dhcm5pbmcnLFxyXG4gICAgICAgICAgICBzaG93Q2FuY2VsQnV0dG9uOiB0cnVlLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uVGV4dDogJ0phIHZlcndpamRlciBkaXQgZm9ydW0nLFxyXG4gICAgICAgICAgICBjYW5jZWxCdXR0b25UZXh0OiAnU3RvcCEnLFxyXG4gICAgICAgICAgICBjb25maXJtQnV0dG9uQ29sb3I6ICcjMDAyZTViJyxcclxuICAgICAgICB9LCAoZm9ydW0pID0+IHtcbiAgICAgICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnZm9ydW0vZGVzdHJveScpLnRoZW4oZGF0YSA9PiB7XG4gICAgICAgICAgICAgICAgc3dhbCh7XG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVmVyd2lqZGVyZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdGV4dDogJ0hldCBmb3J1bSBpcyBzdWNjZXN2b2wgdmVyd2lqZGVyZCcsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ3N1Y2Nlc3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIHNob3dDb25maXJtQnV0dG9uOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XG4gICAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6InNyYyJ9

var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define('components/software/softwares',["require", "exports", "aurelia-fetch-client", "aurelia-framework"], function (require, exports, aurelia_fetch_client_1, aurelia_framework_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var softwares = (function () {
        function softwares(http) {
            this.http = http;
            this.softwares = [];
            this.fetchSoftwares();
        }
        softwares.prototype.fetchSoftwares = function () {
        };
        softwares.prototype.destroy = function (forum) {
            var _this = this;
            swal({
                title: 'Weet u het zeker?',
                type: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Ja verwijder dit forum',
                cancelButtonText: 'Stop!',
                confirmButtonColor: '#002e5b',
            }, function (forum) {
                _this.http.fetch('forum/destroy').then(function (data) {
                    swal({
                        title: 'Verwijderd',
                        text: 'Het forum is succesvol verwijderd',
                        type: 'success',
                        showConfirmButton: false,
                    });
                });
            });
        };
        return softwares;
    }());
    softwares = __decorate([
        aurelia_framework_1.autoinject,
        __metadata("design:paramtypes", [aurelia_fetch_client_1.HttpClient])
    ], softwares);
    exports.softwares = softwares;
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNvbXBvbmVudHMvc29mdHdhcmUvc29mdHdhcmVzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7OztJQUlBLElBQWEsU0FBUztRQUlsQixtQkFBb0IsSUFBZ0I7WUFBaEIsU0FBSSxHQUFKLElBQUksQ0FBWTtZQUZwQyxjQUFTLEdBQUcsRUFBRSxDQUFDO1lBR1gsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQzFCLENBQUM7UUFFRCxrQ0FBYyxHQUFkO1FBUUEsQ0FBQztRQUVELDJCQUFPLEdBQVAsVUFBUSxLQUFLO1lBQWIsaUJBa0JDO1lBakJHLElBQUksQ0FBQztnQkFDRCxLQUFLLEVBQUUsbUJBQW1CO2dCQUMxQixJQUFJLEVBQUUsU0FBUztnQkFDZixnQkFBZ0IsRUFBRSxJQUFJO2dCQUN0QixpQkFBaUIsRUFBRSx3QkFBd0I7Z0JBQzNDLGdCQUFnQixFQUFFLE9BQU87Z0JBQ3pCLGtCQUFrQixFQUFFLFNBQVM7YUFDaEMsRUFBRSxVQUFDLEtBQUs7Z0JBQ0wsS0FBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsZUFBZSxDQUFDLENBQUMsSUFBSSxDQUFDLFVBQUEsSUFBSTtvQkFDdEMsSUFBSSxDQUFDO3dCQUNELEtBQUssRUFBRSxZQUFZO3dCQUNuQixJQUFJLEVBQUUsbUNBQW1DO3dCQUN6QyxJQUFJLEVBQUUsU0FBUzt3QkFDZixpQkFBaUIsRUFBRSxLQUFLO3FCQUMzQixDQUFDLENBQUM7Z0JBQ1AsQ0FBQyxDQUFDLENBQUM7WUFDUCxDQUFDLENBQUMsQ0FBQztRQUNQLENBQUM7UUFDTCxnQkFBQztJQUFELENBckNBLEFBcUNDLElBQUE7SUFyQ1ksU0FBUztRQURyQiw4QkFBVTt5Q0FLbUIsaUNBQVU7T0FKM0IsU0FBUyxDQXFDckI7SUFyQ1ksOEJBQVMiLCJmaWxlIjoiY29tcG9uZW50cy9zb2Z0d2FyZS9zb2Z0d2FyZXMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBIdHRwQ2xpZW50LCBqc29uIH0gZnJvbSBcImF1cmVsaWEtZmV0Y2gtY2xpZW50XCJcclxuaW1wb3J0IHsgYXV0b2luamVjdCB9IGZyb20gXCJhdXJlbGlhLWZyYW1ld29ya1wiXHJcblxyXG5AYXV0b2luamVjdFxyXG5leHBvcnQgY2xhc3Mgc29mdHdhcmVzIHtcclxuXHJcbiAgICBzb2Z0d2FyZXMgPSBbXTtcclxuXHJcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGh0dHA6IEh0dHBDbGllbnQpIHtcclxuICAgICAgICB0aGlzLmZldGNoU29mdHdhcmVzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgZmV0Y2hTb2Z0d2FyZXMoKSB7XHJcbiAgICAgICAgLy90aGlzLmh0dHAuZmV0Y2goJ3NvZnR3YXJlL2luZGV4Jywge1xyXG4gICAgICAgIC8vICAgICAgICBib2R5OiBqc29uKClcclxuICAgICAgICAvLyAgICB9KVxyXG4gICAgICAgIC8vICAgIC50aGVuKHJlc3BvbnNlID0+IHJlc3BvbnNlLmpzb24oKSlcclxuICAgICAgICAvLyAgICAudGhlbihkYXRhID0+IHtcclxuICAgICAgICAvLyAgICAgICAgdGhpcy5zb2Z0d2FyZXMgPSBkYXRhO1xyXG4gICAgICAgIC8vICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGRlc3Ryb3koZm9ydW0pIHtcclxuICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgdGl0bGU6ICdXZWV0IHUgaGV0IHpla2VyPycsXHJcbiAgICAgICAgICAgIHR5cGU6ICd3YXJuaW5nJyxcclxuICAgICAgICAgICAgc2hvd0NhbmNlbEJ1dHRvbjogdHJ1ZSxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvblRleHQ6ICdKYSB2ZXJ3aWpkZXIgZGl0IGZvcnVtJyxcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uVGV4dDogJ1N0b3AhJyxcclxuICAgICAgICAgICAgY29uZmlybUJ1dHRvbkNvbG9yOiAnIzAwMmU1YicsXHJcbiAgICAgICAgfSwgKGZvcnVtKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuaHR0cC5mZXRjaCgnZm9ydW0vZGVzdHJveScpLnRoZW4oZGF0YSA9PiB7XHJcbiAgICAgICAgICAgICAgICBzd2FsKHtcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ1ZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRleHQ6ICdIZXQgZm9ydW0gaXMgc3VjY2Vzdm9sIHZlcndpamRlcmQnLFxyXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdzdWNjZXNzJyxcclxuICAgICAgICAgICAgICAgICAgICBzaG93Q29uZmlybUJ1dHRvbjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcbn1cclxuXHJcbiJdLCJzb3VyY2VSb290Ijoic3JjIn0=

define('text!app.html', ['module'], function(module) { module.exports = "<template bindable=\"router\">\r\n  <require from=\"sweetalert/dist/sweetalert.css\"></require>\r\n  <div id=\"app\">\r\n    <div class=\"strip strip__top\"></div>\r\n    <nav class=\"navbar navbar-default navbar-static-top\">\r\n      <div class=\"container\">\r\n        <div class=\"navbar-header\">\r\n\r\n          <!-- Collapsed Hamburger -->\r\n          <button type=\"button\" class=\"navbar-toggle collapsed\" data-toggle=\"collapse\" data-target=\"#app-navbar-collapse\">\r\n            <span class=\"sr-only\">Toggle Navigation</span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n            <span class=\"icon-bar\"></span>\r\n          </button>\r\n\r\n          <a class=\"navbar-brand hidden-xs\" href=\"/\">\r\n            ${title}\r\n          </a>\r\n        </div>\r\n\r\n        <div class=\"collapse navbar-collapse\" id=\"app-navbar-collapse\">\r\n          <!-- Right Side Of Navbar -->\r\n          <ul class=\"nav navbar-nav navbar-right\">\r\n            <li>\r\n              <a route-href=\"route: dashboard\" class=\"${currUrl == 'dashboard' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Dashboard\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a route-href=\"route: corporations\" class=\"${currUrl == 'corporations' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Corporaties\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a route-href=\"route: users\" class=\"${currUrl == 'users' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Gebruikers\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a route-href=\"route: softwares\" class=\"${currUrl == 'softwares' ? 'active' : ''}\" show.bind=\"authenticated\">\r\n                Software\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a href=\"#\" click.delegate=\"logout()\" show.bind=\"authenticated\">\r\n                Uitloggen\r\n              </a>\r\n            </li>\r\n\r\n            <li>\r\n              <a href=\"#\" class=\"${currUrl == 'register' ? 'active' : ''}\" show.bind=\"!authenticated\">\r\n                Registreer\r\n              </a>\r\n            </li>\r\n          </ul>\r\n        </div>\r\n      </div>\r\n    </nav>\r\n\r\n    <router-view></router-view>\r\n  </div>\r\n\r\n  <div id=\"footer\">\r\n    <p>SFORUM 2017</p>\r\n  </div>\r\n  <div class=\"strip strip__footer\"></div>\r\n</template>\r\n"; });
define('text!components/authentication/login.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Login</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-heading\">\r\n            SFORUM \r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" id=\"form\" role=\"form\" method=\"POST\" submit.delegate=\"login()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"email\" class=\"col-md-4 control-label\">E-Mail</label>\r\n\r\n                <div class=\"col-md-6\">\n                  <input id=\"email\" type=\"email\" class=\"form-control\" name=\"email\" value.bind=\"email\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"password\" class=\"col-md-4 control-label\">Wachtwoord</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input id=\"password\" type=\"password\" class=\"form-control\" name=\"password\" value.bind=\"password\" required>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-8 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                      Login\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/corporation/corporations.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from='../shared/sideBar'></require>\r\n\r\n  <div class=\"bar\">\r\n    <h1>Corporaties</h1>\r\n  </div>\r\n\r\n  <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <side-bar>\r\n        <div slot=\"buttons\">\r\n          <a route-href=\"route: newCorporation\" class=\"btn btn-primary btn-block margin__bottom__small\">Maak Corporatie</a>\r\n        </div>\r\n      </side-bar>\r\n\r\n      <div class=\"col-md-10\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            <table class=\"table table-hover\">\r\n              <thead>\r\n                <tr>\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Naam\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Adres\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Postcode\r\n                  </th>\r\n                </tr>\r\n              </thead>\r\n\r\n              <tbody>\r\n                <tr repeat.for=\"corporation of corporations\">\r\n                  <td class=\"col-md-3\">\r\n                    ${corporation.name}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${corporation.address}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${corporation.zip}\r\n                  </td>\r\n\r\n                  <td>\r\n                    <i class=\"material-icons\" click.delegate=\"destroy(corporation)\">&#xE872;</i>\r\n\r\n                    <a>\r\n                      <i class=\"material-icons\">&#xE254;</i>\r\n                    </a>\r\n                  </td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>"; });
define('text!components/corporation/newCorporation.html', ['module'], function(module) { module.exports = "<template>\n  <template>\r\n    <div class=\"bar\">\r\n      <h1>Nieuwe Corporatie</h1>\r\n    </div>\r\n\r\n    <div class=\"container\">\r\n      <div class=\"row\">\r\n        <div class=\"col-md-8 col-md-offset-2\">\r\n          <div class=\"panel panel-primary\">\r\n            <div class=\"panel-heading\">\r\n              <span>Nieuwe corporatie</span>\r\n            </div>\r\n\r\n            <div class=\"panel-body\">\r\n              <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"store()\">\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                  <div class=\"col-md-6\">\r\n                    <input value.bind=\"corporation.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                  </div>\r\n                </div>\r\n\r\n                <div class=\"form-group\">\r\n                  <label for=\"address\" class=\"col-md-4 control-label\">Adres</label>\r\n\r\n                  <div class=\"col-md-6\">\r\n                    <input value.bind=\"corporation.address\" id=\"address\" type=\"text\" class=\"form-control\" name=\"address\">\r\n                  </div>\r\n                </div>\n\n                <div class=\"form-group\">\r\n                  <label for=\"zip\" class=\"col-md-4 control-label\">Postcode</label>\r\n\r\n                  <div class=\"col-md-6\">\r\n                    <input value.bind=\"corporation.zip\" id=\"zip\" type=\"text\" class=\"form-control\" name=\"zip\">\r\n                  </div>\r\n                </div>\n\n                <div class=\"form-group\">\r\n                  <label for=\"email\" class=\"col-md-4 control-label\">Email</label>\r\n\r\n                  <div class=\"col-md-6\">\r\n                    <input value.bind=\"corporation.email\" id=\"zip\" type=\"text\" class=\"form-control\" name=\"email\">\r\n                  </div>\r\n                </div>\n\r\n                <div class=\"form-group\">\r\n                  <div class=\"col-md-6 col-md-offset-4\">\r\n                    <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                      Maak corporatie\r\n                    </button>\r\n                  </div>\r\n                </div>\r\n              </form>\r\n            </div>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </template>\r\n\n</template>"; });
define('text!components/dashboard/dashboard.html', ['module'], function(module) { module.exports = "<template>\r\n  <require from='../shared/sideBar'></require>\r\n\r\n  <div class=\"bar\" >\r\n    <h1>Forum</h1>\r\n  </div>\r\n\r\n <div class=\"container-custom\">\r\n    <div class=\"row\">\r\n      <side-bar>\r\n          <div slot=\"buttons\">\r\n              <a route-href=\"route: newForum\" class=\"btn btn-primary btn-block margin__bottom__small\">Maak Forum</a>\r\n          </div>\r\n      </side-bar>\r\n\r\n      <div class=\"col-md-10\">\r\n        <div class=\"panel panel-default\">\r\n          <div class=\"panel-body\">\r\n            <table class=\"table table-hover\">\r\n              <thead>\r\n                <tr>\r\n                  <th class=\"col-md-5 table__title\">\r\n                    Naam\r\n                  </th>\r\n\r\n                  <th class=\"col-md-3 table__title\">\r\n                    Omschrijving\r\n                  </th>\r\n                </tr>\r\n              </thead>\r\n\r\n              <tbody>\r\n                <tr repeat.for=\"forum of forums\">\r\n                  <td class=\"col-md-4\">\r\n                    ${forum.name}\r\n                  </td>\r\n\r\n                  <td class=\"col-md-3\">\r\n                    ${forum.description}\r\n                  </td>\r\n\r\n                  <td>\r\n                    <i class=\"material-icons\" click.delegate=\"destroy(forum)\">&#xE872;</i>\r\n\r\n                    <a route-href=\"route: editForum; params.bind: { id:forum.id }\">\r\n                      <i class=\"material-icons\">&#xE254;</i>\r\n                    </a>\r\n                  </td>\r\n                </tr>\r\n              </tbody>\r\n            </table>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n </div>\r\n</template>"; });
define('text!components/dashboard/editForum.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Bewerk forum</h1>\r\n  </div>\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>bewerk forum</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"update()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"description\" class=\"col-md-4 control-label\">Beschrijving</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.description\" id=\"description\" type=\"description\" class=\"form-control\" name=\"description\">\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Update forum\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/dashboard/newForum.html', ['module'], function(module) { module.exports = "<template>\r\n  <div class=\"bar\">\r\n    <h1>Nieuw forum</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <div class=\"row\">\r\n      <div class=\"col-md-8 col-md-offset-2\">\r\n        <div class=\"panel panel-primary\">\r\n          <div class=\"panel-heading\">\r\n            <span>Nieuw forum</span>\r\n          </div>\r\n\r\n          <div class=\"panel-body\">\r\n            <form class=\"form-horizontal\" role=\"form\" method=\"POST\" submit.delegate=\"store()\">\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"name\" class=\"col-md-4 control-label\">Naam</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.name\" id=\"name\" type=\"text\" class=\"form-control\" name=\"name\" required autofocus>\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <label for=\"description\" class=\"col-md-4 control-label\">Beschrijving</label>\r\n\r\n                <div class=\"col-md-6\">\r\n                  <input value.bind=\"forum.description\" id=\"description\" type=\"description\" class=\"form-control\" name=\"description\">\r\n                </div>\r\n              </div>\r\n\r\n              <div class=\"form-group\">\r\n                <div class=\"col-md-6 col-md-offset-4\">\r\n                  <button id=\"submit\" type=\"submit\" class=\"btn btn-primary\">\r\n                    Maak forum\r\n                  </button>\r\n                </div>\r\n              </div>\r\n            </form>\r\n          </div>\r\n        </div>\r\n      </div>\r\n    </div>\r\n  </div>\r\n</template>\r\n"; });
define('text!components/shared/sideBar.html', ['module'], function(module) { module.exports = "<template>\n  <div class=\"col-md-2 col-lg-2\">\r\n    <slot name=\"buttons\"></slot>\r\n\r\n    <ul class=\"list-group sidebar\">\r\n      <li class=\"list-group-item menu\">\r\n        <h4>Menu</h4>\r\n      </li>\r\n\r\n      <a href=\"#\">\r\n        <li class=\"list-group-item\">\r\n          <h4>Nieuwe berichten</h4>\r\n        </li>\r\n      </a>\r\n\r\n      <a href=\"#\">\r\n        <li class=\"list-group-item\">\r\n          <h4>Mijn berichten</h4>\r\n        </li>\r\n      </a>\r\n\r\n      <li class=\"list-group-item\">\r\n        <input id=\"searchInput\"\r\n               onkeydown=\"if (event.keyCode == 13) document.getElementById('search').click()\"\r\n               class=\"form-control\"\r\n               placeholder=\"Zoeken\">\r\n\r\n        <button id=\"search\" onclick=\"search()\" class=\"btn btn-primary btn-block margin__top__small\">\r\n            Zoeken\r\n        </button>\r\n      </li>\r\n    </ul>\r\n  </div>\r\n\r\n\n</template>\n"; });
define('text!components/software/softwares.html', ['module'], function(module) { module.exports = "<template>\r\n  <style>\r\n    .bar {\r\n      display: flex;\r\n      justify-content: center;\r\n      align-items: center;\r\n      background: #002e5b;\r\n      color: #FFFFFF;\r\n      height: 100px;\r\n      margin-bottom: 20px;\r\n      font-weight: 300;\r\n      font-size: 50px;\r\n      text-transform: uppercase;\r\n    }\r\n\r\n    }\r\n\r\n    navbar {\r\n      margin: 0px !important;\r\n    }\r\n  </style>\r\n\r\n  <div class=\"bar\">\r\n    <h1>Software</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <table class=\"table table-hover\">\r\n      <thead>\r\n        <tr>\r\n          <th class=\"col-md-5\">\r\n            Naam\r\n        </tr>\r\n      </thead>\r\n\r\n      <tbody>\r\n        <tr repeat.for=\"software of softwares\">\r\n          <td class=\"col-md-4\">\r\n            ${software.name}\r\n          </td>\r\n\r\n          <td></td>\r\n\r\n          <td>\r\n            <i class=\"material-icons\" click.trigger=\"destroy(forum)\">&#xE872;</i>\r\n\r\n            <a href=\"#\">\r\n              <i class=\"material-icons\">&#xE254;</i>\r\n            </a>\r\n          </td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n</template>"; });
define('text!components/user/users.html', ['module'], function(module) { module.exports = "<template>\r\n  <style>\r\n    .bar {\r\n      display: flex;\r\n      justify-content: center;\r\n      align-items: center;\r\n      background: #002e5b;\r\n      color: #FFFFFF;\r\n      height: 100px;\r\n      margin-bottom: 20px;\r\n      font-weight: 300;\r\n      font-size: 50px;\r\n      text-transform: uppercase;\r\n    }\r\n\r\n    }\r\n\r\n    navbar {\r\n      margin: 0px !important;\r\n    }\r\n  </style>\r\n\r\n  <div class=\"bar\">\r\n    <h1>Gebruikers</h1>\r\n  </div>\r\n\r\n  <div class=\"container\">\r\n    <table class=\"table table-hover\">\r\n      <thead>\r\n        <tr>\r\n          <th class=\"col-md-5\">\r\n            Naam\r\n          </th>\r\n\r\n          <th class=\"col-md-3\">\r\n            Achternaam\r\n          </th>\r\n          <th class=\"col-md-3\">\r\n            Email\r\n          </th>\r\n        </tr>\r\n      </thead>\r\n\r\n      <tbody>\r\n        <tr repeat.for=\"user of users\">\r\n          <td class=\"col-md-4\">\r\n            ${user.name}\r\n          </td>\r\n\r\n          <td class=\"col-md-3\">\r\n            ${user.lastName}\r\n          </td>\r\n\r\n          <td class=\"col-md-3\">\r\n            ${user.email}\r\n          </td>\r\n\r\n          <td></td>\r\n\r\n          <td>\r\n            <i class=\"material-icons\" click.trigger=\"destroy(corporation)\">&#xE872;</i>\r\n\r\n            <a href=\"#\">\r\n              <i class=\"material-icons\">&#xE254;</i>\r\n            </a>\r\n          </td>\r\n        </tr>\r\n      </tbody>\r\n    </table>\r\n  </div>\r\n</template>"; });
//# sourceMappingURL=app-bundle.js.map