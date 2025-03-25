

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormControl, FormGroup, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserserviceService } from '../userservice.service';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  
  selectedHobbies: string[] = [];

  hobbiesList: string[] = ['Reading', 'Traveling', 'Music', 'Sports'];
  
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
    Maharashtra:['Mumbai', 'Aurangabad']
  };

  talukaData: { [key: string]: string[] } = {
    'Ahmedabad': ['Sanand', 'Dholka'],
    'Bharuch': ['Ankleshwar', 'Jhagadia'],
    'Dehradun': ['Raipur', 'Rishikesh'],
    'Haridwar': ['Roorkee', 'Khanpur'],
    'Kullu': ['Manali', 'Nirmand'],
    'Shimla': ['Rampur'],
    'Mumbai': ['Andheri', 'Borivali'],
    'Aurangabad': ['Kannad', 'Phulambri']


  };

  villageData: { [key: string]: string[] } = {
    'Sanand': ['Changodar'],
    'Dholka': ['Chandisar'],
    'Ankleshwar': ['Kosamadi','Kapodara'],
    'Jhagadia': ['Ambos', 'Amod'],
    'Raipur': ['Banarsi'],
    'Rishikesh': ['Ashram'],
    'Roorkee': ['Rampur','chandapur'],
    'Khanpur': ['Limadiya'],
    'Manali': ['Kothi'],
    'Nirmand': ['Tegubehar'],
    'Rampur': ['Karai'],
    'Andheri': ['Juhu'],
    'Borivali': ['Kandivali', 'Dahisar'],
    'Kannad': ['Amba'],
    'Phulambri': ['Alad'],
  };

  fileError: boolean = false;
  selectedFile: File | null = null;
  userId: number | null = null;
  

  editForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
    dob: new FormControl('', Validators.required),
    gender: new FormControl('', Validators.required),
    hobbies: new FormArray([], Validators.required),
    address: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    taluka: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    village: new FormControl('', Validators.required),
    // file: new FormControl(null)
  });

  
  constructor(
    private route: ActivatedRoute,
    private userService: UserserviceService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const userId = params.get('id'); 
      if (userId) {
        this.userId = +userId;
        this.loadUserDetails(userId);
      } else {
        console.error('User ID not found in route');
      }
    });
  }
  

loadUserDetails(userId: string) {
  this.userService.getUserById(+userId).subscribe(
    (userData) => {
      console.log("Fetched User Data:", userData);

      this.editForm.patchValue({
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        dob: userData.dob,
        gender: userData.gender,
        address: userData.address,
        state: userData.state,
        district: userData.district,
        taluka: userData.taluka,
        village: userData.village
      });

      // Populate dropdowns
      this.districts = this.districtData[userData.state] || [];
      this.talukas = this.talukaData[userData.district] || [];
      this.villages = this.villageData[userData.taluka] || [];

      if (!this.districts.includes(userData.district)) {
        this.editForm.patchValue({ district: '' }); 
      }
      if (!this.talukas.includes(userData.taluka)) {
        this.editForm.patchValue({ taluka: '' });
      }
      if (!this.villages.includes(userData.village)) {
        this.editForm.patchValue({ village: '' });
      }

      // this.onStateChange({ target: { value: userData.state } });
      // this.onDistrictChange({ target: { value: userData.district } });
      // this.onTalukaChange({ target: { value: userData.taluka } });

      //  Fixing hobbies handling
      const hobbiesArray = this.editForm.get('hobbies') as FormArray;
      hobbiesArray.clear(); // Clear any existing values

      if (userData.hobbies) {
        const selectedHobbies = userData.hobbies.split(',').map((h: string) => h.trim());
        this.hobbiesList.forEach(hobby => {
          hobbiesArray.push(new FormControl(selectedHobbies.includes(hobby)));
        });
      } else {
        this.hobbiesList.forEach(() => hobbiesArray.push(new FormControl(false)));
      }
    },
    (error) => {
      console.error("Error fetching user details:", error);
    }
  );
}

  
get hobbies(): FormArray {  
  return this.editForm.get('hobbies') as FormArray; 
}

  onCheckboxChange(event: any, index: number) {
    const hobbiesArray: FormArray = this.editForm.get('hobbies') as FormArray;
    hobbiesArray.at(index).setValue(event.target.checked);
  }

  
 // Handling state, taluka, district, and village changes
 // Handling state change -> Load districts
onStateChange(event: any) {
  const selectedState = event.target.value;
  this.districts = this.districtData[selectedState] || [];
  this.talukas = [];
  this.villages = [];
  this.editForm.patchValue({ district: '', taluka: '', village: '' });
}

// Handling district change -> Load talukas
onDistrictChange(event: any) {
  const selectedDistrict = event.target.value;
  this.talukas = this.talukaData[selectedDistrict] || [];
  this.villages = [];
  this.editForm.patchValue({ taluka: '', village: '' });
}

// Handling taluka change -> Load villages
onTalukaChange(event: any) {
  const selectedTaluka = event.target.value;
  this.villages = this.villageData[selectedTaluka] || [];
  this.editForm.patchValue({ village: '' });
}

  onSubmit() {
    if (this.editForm.valid) {
      const formData = new FormData();
      
      Object.keys(this.editForm.controls).forEach((key) => {
        const control = this.editForm.get(key);
        
        if (control instanceof FormArray) {
          // Only send selected hobbies
          const selectedHobbies = this.hobbiesList
            .filter((_, index) => control.value[index]) 
            .join(',');
          formData.append(key, selectedHobbies);
        } else {
          formData.append(key, control?.value);
        }
      });
  
      this.userService.updateUser(this.userId!, formData).subscribe(
        (response) => {
          console.log('User updated successfully:', response);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Error updating user:', error);
        }
      );
    } else {
      this.editForm.markAllAsTouched(); // Show validation errors
    }
  }
  
 
  resetForm() {
    this.editForm.reset();
    this.selectedFile = null;
  }
}





  

  // loadUserDetails(userId: string) {
  //   this.userService.getUserById(+userId).subscribe(
  //     (userData) => {
  //       this.editForm.patchValue({
  //         name: userData.name,
  //         email: userData.email,
  //         phone: userData.phone,
  //         dob: userData.dob,
  //         gender: userData.gender,
  //         address: userData.address,
  //         state: userData.state,
  //         taluka: userData.taluka,
  //         district: userData.district,
  //         village: userData.village
  //       });

  //       // Populate dropdowns based on selected values
  //       this.onStateChange({ target: { value: userData.state } });
  //       this.onTalukaChange({ target: { value: userData.taluka } });
  //       this.onDistrictChange({ target: { value: userData.district } });

  //       //  Ensure hobbies are set properly
  //       const hobbiesArray = this.editForm.get('hobbies') as FormArray;
  //       hobbiesArray.clear(); 

  //       const hobbies = Array.isArray(userData.hobbies)
  //         ? userData.hobbies
  //         : userData.hobbies?.split(',').map((hobby: string) => hobby.trim()) || [];

  //       hobbies.forEach((hobby: string) => {
  //         hobbiesArray.push(new FormControl(hobby));
  //       });
  //     },
  //     (error) => {
  //       console.error('Error fetching user details:', error);
  //     }
  //   );
  // }










  
// loadUserDetails(userId: string) {
//   this.userService.getUserById(+userId).subscribe(
//     (userData) => {
//       console.log("Fetched User Data:", userData);

//       this.editForm.patchValue({
//         name: userData.name,
//         email: userData.email,
//         phone: userData.phone,
//         dob: userData.dob,
//         gender: userData.gender,
//         address: userData.address,
//         state: userData.state,
//         district: userData.district,
//         taluka: userData.taluka,
//         village: userData.village
//       });

//       // Populate dropdowns
//       this.districts = this.districtData[userData.state] || [];
//       this.talukas = this.talukaData[userData.district] || [];
//       this.villages = this.villageData[userData.taluka] || [];

//       //  Fixing hobbies pre-selection
//       const hobbiesArray = this.editForm.get('hobbies') as FormArray;
//       hobbiesArray.clear(); // Clear any existing values

//       // Convert hobbies string into an array
      
//       // const selectedHobbies = userData.hobbies ? userData.hobbies.split(',').map(h => h.trim()) : [];
//     //   const selectedHobbies: string[] = userData.hobbies 
//     //   ? userData.hobbies.split(',').map((h: string) => h.trim()) 
//     //   : [];
    
//     //   this.hobbiesList.forEach(hobby => {
//     //     hobbiesArray.push(new FormControl(selectedHobbies.includes(hobby))); //  Set true/false for each hobby
//     //   });
//     // },
//     const selectedHobbies: string[] = userData.hobbies 
//     //   ? userData.hobbies.split(',').map((h: string) => h.trim()) 
//     //   : [];        
//         this.hobbiesList.forEach(hobby => {
//           hobbiesArray.push(new FormControl(this.selectedHobbies.includes(hobby))); //  Set true/false for each hobby
//         });
//       },
//     (error) => {
//       console.error("Error fetching user details:", error);
//     }
//   );
// }