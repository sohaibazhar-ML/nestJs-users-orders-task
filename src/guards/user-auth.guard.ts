import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class UserAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    // Example logic: Check if the user is authenticated
    // This could be checking for a token in the headers or a session variable
    const userId = request.headers['x-user-id']; // Assuming user ID is passed in headers

    if (!userId) {
      return false; // Reject access if user ID is not present
    }

    // You can add more complex logic here, such as verifying the user ID
    // against a database or an external service.

    return true; // Allow access if the user is authenticated
  }
}