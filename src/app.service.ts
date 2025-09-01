import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return `
📌 <b>API Testing Documentation</b><br><br>

=============================<br>
<b>USERS ROUTES</b><br>
=============================<br>
1. POST /users <br>
   ➝ Create a new user <br>
   📝 Body:<br>
   {<br>
     "email": "user@example.com",<br>
     "name": "John Doe"<br>
   }<br><br>

2. GET /users <br>
   ➝ Retrieve all users <br><br>

3. GET /users/:id <br>
   ➝ Retrieve a specific user by ID <br><br>

4. PUT /users/:id <br>
   ➝ Update a specific user by ID <br>
   📝 Body:<br>
   {<br>
     "email": "newmail@example.com",<br>
     "name": "Updated Name"<br>
   }<br><br>

5. DELETE /users/:id <br>
   ➝ Delete a specific user by ID <br><br>

=============================<br>
<b>ORDERS ROUTES</b><br>
=============================<br>
1. POST /orders <br>
   ➝ Create a new order <br>
   📝 Body:<br>
   {<br>
     "userId": 1,<br>
     "product": "Laptop"<br>
   }<br><br>

2. GET /orders <br>
   ➝ Retrieve all orders <br><br>

3. GET /orders/:id <br>
   ➝ Retrieve a specific order by ID <br><br>

4. PUT /orders/:id <br>
   ➝ Update a specific order by ID <br>
   📝 Body:<br>
   {<br>
     "userId": 1,<br>
     "product": "Updated Laptop"<br>
   }<br><br>

5. DELETE /orders/:id <br>
   ➝ Delete a specific order by ID <br><br>

6. GET /orders/user/:userId <br>
   ➝ Retrieve all orders for a specific user
    `;
  }
}
