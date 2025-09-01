import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Check for user id in headers
    const userId = request.headers['x-user-id'];

    if (!userId) {
      throw new UnauthorizedException('Missing x-user-id header');
    }

    // You can add more validation here, e.g.:
    // - check if userId exists in DB
    // - validate JWT instead of plain header
    // - etc.

    // Attach user info to request (optional)
    request.user = { id: userId };

    return true; // Allow access
  }
}
