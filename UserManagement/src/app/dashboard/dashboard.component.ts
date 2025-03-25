import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet } from '@angular/router';
import { UserserviceService } from '../userservice.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgMultiSelectDropDownModule} from 'ng-multiselect-dropdown';

@Component({
  selector: 'app-dashboard',
  imports: [RouterOutlet, FormsModule, CommonModule, NgMultiSelectDropDownModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  users: any[] = [];                //Holds the list of all users fetched from the backend.
  filteredUsers: any[] = [];        //Holds the filtered list of users based on selected filters.

  // Used to hold filter values and selections from the dropdowns.

  filterName: string = '';
  filterGender: string = '';

  selectedStates: any[] = [];
  selectedDistricts: any[] = [];
  selectedTalukas: any[] = [];
  selectedVillages: any[] = [];

  // Stores unique values for State, District, Taluka, and Village to populate the multi-select dropdowns.
  uniqueStates: any[] = [];
  uniqueDistricts: any[] = [];
  uniqueTalukas: any[] = [];
  uniqueVillages: any[] = [];

  // Configures the multi-select dropdowns.
  dropdownSettings = {
    singleSelection: false,
    idField: 'item',
    textField: 'item',
    selectAllText: 'Select All',
    unSelectAllText: 'Unselect All',
    allowSearchFilter: true
  };

  constructor(private userService: UserserviceService, private router: Router, private http: HttpClient) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url === '/dashboard') {
        this.fetchUsers();
      }
    });

    this.userService.userUpdatedObservable().subscribe(updated => {
      if (updated) {
        this.loadUsers();
      }
    });
  }

  ngOnInit(): void {
    this.fetchUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchUsers() {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error("No token found!");
      return;
    }

    const httpHeaders = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('http://localhost:8080/api/users/all', { headers: httpHeaders }).subscribe(
      (response) => {
        console.log('Users fetched:', response);
        this.users = response;
        this.filteredUsers = response;

        this.uniqueStates = [...new Set(response.map(user => user.state))].map(item => ({ item }));
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  // When State is selected
  onStateSelect() {
    if (this.selectedStates.length > 0) {           //Check if any states are selected.
      const selectedStateNames = this.selectedStates.map(s => s.item);

      const districtsInSelectedStates = this.users
        .filter(user => selectedStateNames.includes(user.state))
        .map(user => user.district);

      this.uniqueDistricts = [...new Set(districtsInSelectedStates)].map(item => ({ item }));
    } else {
      this.uniqueDistricts = [];
    }

    this.selectedDistricts = [];
    this.selectedTalukas = [];
    this.selectedVillages = [];

    this.applyFilters();
  }

  // When District is selected
  onDistrictSelect() {
    if (this.selectedDistricts.length > 0) {
      const selectedDistrictNames = this.selectedDistricts.map(d => d.item);

      const talukasInSelectedDistricts = this.users
        .filter(user => selectedDistrictNames.includes(user.district))
        .map(user => user.taluka);

      this.uniqueTalukas = [...new Set(talukasInSelectedDistricts)].map(item => ({ item }));
    } else {
      this.uniqueTalukas = [];
    }

    this.selectedTalukas = [];
    this.selectedVillages = [];

    this.applyFilters();
  }

  // When Taluka is selected
  onTalukaSelect() {
    if (this.selectedTalukas.length > 0) {
      const selectedTalukaNames = this.selectedTalukas.map(t => t.item);

      const villagesInSelectedTalukas = this.users
        .filter(user => selectedTalukaNames.includes(user.taluka))
        .map(user => user.village);

      this.uniqueVillages = [...new Set(villagesInSelectedTalukas)].map(item => ({ item }));
    } else {
      this.uniqueVillages = [];
    }

    this.selectedVillages = [];

    this.applyFilters();
  }

  applyFilters() {
    this.filteredUsers = this.users.filter(user =>
      (this.filterName ? user.name.toLowerCase().startsWith(this.filterName.toLowerCase()) : true) &&
      (this.filterGender ? user.gender === this.filterGender : true) &&
      (this.selectedStates.length ? this.selectedStates.some(state => state.item === user.state) : true) &&
      (this.selectedDistricts.length ? this.selectedDistricts.some(district => district.item === user.district) : true) &&
      (this.selectedTalukas.length ? this.selectedTalukas.some(taluka => taluka.item === user.taluka) : true) &&
      (this.selectedVillages.length ? this.selectedVillages.some(village => village.item === user.village) : true)
    );
  }

  editUser(user: any) {
    this.router.navigate(['/edit-user', user.id]);
  }

  navigateToDetailsForm() {
    this.router.navigate(['/detailsform']);
  }

  deleteUser(userId: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
        this.fetchUsers();
      });
    }
  }

  logout() {
    localStorage.removeItem('authToken');
    this.router.navigate(['/login']);
  }
}

