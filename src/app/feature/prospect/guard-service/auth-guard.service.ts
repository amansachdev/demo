import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {

  constructor(private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const currentState = this.router.getCurrentNavigation();
    if (currentState.extras.state && currentState.extras.state.selectedTable) {
      return true;
    } else {
      this.router.navigateByUrl('/prospect');
      return false;
    }
  }
}
