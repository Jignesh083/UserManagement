import { Component } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthServiceService } from '../auth-service.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms'
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-loginpage',
  imports: [FormsModule, RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './loginpage.component.html',
  styleUrl: './loginpage.component.css'
})

export class LoginpageComponent 
{

  loginpage = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    password: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  constructor(private authService: AuthServiceService, private router: Router) {} // Inject Router

  submitfunction()
  {
    const credentials = {
      name: this.loginpage.get('name')?.value as string,
      password: this.loginpage.get('password')?.value as string,
    };
    console.log(credentials);
    console.log("Calling generateToken..."); 

    this.authService.generateToken(credentials).subscribe(
      (response: any) => {
        console.log('Login successful:', response);

        if (response.token)  {
          this.authService.saveTokens(response.token, response.refreshToken); // Store token
          alert('Login successful');
          this.router.navigate(['/dashboard']);
        }
        else 
        {
          alert('Token not received');
        }
      },
      (error: any) => {
        console.error('Login failed:', error);
        alert('Invalid credentials');
      }
    );
  }
}

