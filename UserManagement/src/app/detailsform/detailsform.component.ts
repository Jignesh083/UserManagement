import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserserviceService } from '../userservice.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detailsform',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './detailsform.component.html',
  styleUrls: ['./detailsform.component.css']
})
export class DetailsformComponent {
  
  detailsform: FormGroup;
  fileError: boolean = false;

  // Dropdown Data
  states = ['Gujarat', 'Uttarakhand', 'HimachalPradesh', 'Maharashtra'];
  districts: string[] = [];
  talukas: string[] = [];
  villages: string[] = [];

  // Static Data for Cascading Dropdowns
  districtData: { [key: string]: string[] } = {
    Gujarat: ['Ahmedabad', 'Bharuch'],
    Uttarakhand: ['Dehradun', 'Haridwar'],
    HimachalPradesh: ['Kullu', 'Shimla'],
    Maharashtra:['Mumbai', 'Aurangabad'],
  };

  talukaData: { [key: string]: string[] } = {
    'Ahmedabad': ['Sanand', 'Dholka'],
    'Bharuch': ['Ankleshwar', 'Jhagadia'],
    'Dehradun': ['Raipur', 'Rishikesh'],
    'Haridwar': ['Roorkee', 'Khanpur'],
    'Kullu': ['Manali', 'Nirmand'],
    'Shimla': ['Rampur', 'Chirgaon'],
    'Mumbai': ['Andheri', 'Borivali'],
    'Aurangabad': ['Kannad', 'Phulambri']


  };

  villageData: { [key: string]: string[] } = {
    'Sanand': ['Changodar', 'Chekhla'],
    'Dholka': ['Chandisar', '	Vejalka'],
    'Ankleshwar': ['Kosamadi','Kapodara'],
    'Jhagadia': ['Ambos', 'Amod'],
    'Raipur': ['Banarsi'],
    'Rishikesh': ['Ashram'],
    'Roorkee': ['Rampur','chandapur'],
    'Khanpur': ['Limadiya'],
    'Manali': ['Kothi', 'Gulaba'],
    'Nirmand': ['Tegubehar'],
    'Rampur': ['Jarasi'],
    'Chirgaon': ['Limbra'],
    'Andheri': ['Juhu'],
    'Borivali': ['Kandivali', 'Dahisar'],
    'Kannad': ['Amba'],
    'Phulambri': ['Alad'],


  };

  // Hobby List
  hobbiesList = ['Reading', 'Music', 'Sports', 'Traveling'];

  constructor(private userService : UserserviceService,
    private router: Router
  ) {
    this.detailsform = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
      dob: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      hobbies: new FormArray([], Validators.required),
      address: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      district: new FormControl('', Validators.required),
      taluka: new FormControl('', Validators.required),
      village: new FormControl('', Validators.required),
      file: new FormControl(null, Validators.required)
    });
  }

  // Handle Checkbox Selection for Hobbies
  onCheckboxChange(event: any) {
    const formArray: FormArray = this.detailsform.get('hobbies') as FormArray;
    if (event.target.checked) {
      formArray.push(new FormControl(event.target.value));
    } else {
      let index = formArray.controls.findIndex(x => x.value === event.target.value);
      formArray.removeAt(index);
    }
  }

  // Handle State Change → Update Districts
  onStateChange(event: any) {
    const selectedState = event.target.value;
    this.districts = this.districtData[selectedState] || [];
    this.talukas = [];
    this.villages = [];
    this.detailsform.controls['district'].reset();
    this.detailsform.controls['taluka'].reset();
    this.detailsform.controls['village'].reset();
  }

  // Handle District Change → Update Talukas
  onDistrictChange(event: any) {
    const selectedDistrict = event.target.value;
    this.talukas = this.talukaData[selectedDistrict] || [];
    this.villages = [];
    this.detailsform.controls['taluka'].reset();
    this.detailsform.controls['village'].reset();
  }

  // Handle Taluka Change → Update Villages
  onTalukaChange(event: any) {
    const selectedTaluka = event.target.value;
    this.villages = this.villageData[selectedTaluka] || [];
    this.detailsform.controls['village'].reset();
  }

  // Handle File Upload (ZIP only)
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file && file.name.endsWith('.zip')) {
      this.fileError = false;
      this.detailsform.patchValue({ file });
    } else {
      this.fileError = true;
      this.detailsform.patchValue({ file: null });
    }
  }

  
  submitfunction() {
    console.log('Submit function triggered');
    console.log('Form validity:', this.detailsform.valid);
    console.log('Form values:', this.detailsform.value);
  
      if (this.detailsform.valid) {
        console.log('Form is valid, preparing data...'); 
  
        const formData = new FormData();
    
        Object.keys(this.detailsform.value).forEach((key) => {
          const value = this.detailsform.get(key)?.value;
          if (key === 'file' && value instanceof File) {
            formData.append(key, value);
          } 
          else if (key === 'hobbies') {
            // Append hobbies as a comma-separated string
            formData.append(key, value.join(','));
          }
          else if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        });
    
        console.log("Sending form data:", formData); 
  
        this.userService.registerUser(formData).subscribe({
          next: (response) => {
            console.log('User registered successfully:', response);
            alert('User registered successfully');
            this.router.navigate(['/dashboard']); // Redirect to dashboard on success
  
          },
          error: (error) => {
            console.error('Error registering user:', error);
            if (error.status === 200) {
              alert('Backend returaned a 200 status, but the response is not as expected. Check backend response format.');
            }
          },
          complete: () => {
            console.log('Request completed.');
          },
        });    
        
      } else {
        console.warn('Form is invalid!');
      }
    }

  // Reset Form
  resetForm() {
    this.detailsform.reset();
    this.districts = [];
    this.talukas = [];
    this.villages = [];
    this.fileError = false;
  }
}
