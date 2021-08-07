import { Component } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { University } from './university';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  constructor(public http: HttpClient) {

  }
  SERVER_URL = "http://dev.cs.smu.ca:8128";

  title = 'universityApp';
  universities = [new University("Name", "Address", "Phone")];

  universityName = '';
  universityAddress = '';
  universityPhone = '';
  search = '';

  validateUniversityInfo() {

    //first get the values from the fields 
    var name = this.universityName.replace(/^\s+|\s+$/g, "");
    var address = this.universityAddress.replace(/^\s+|\s+$/g, "");
    var phone = this.universityPhone.replace(/^\s+|\s+$/g, "");
    //get element of input
    var nameEl = <HTMLElement>document.getElementById('name');
    var addressEl = <HTMLElement>document.getElementById('address');
    var phoneEl = <HTMLElement>document.getElementById('phone');
    var searchEl = <HTMLElement>document.getElementById('search');
    //check empty fields
    if (name == '') {
      alert("Please enter the name of the university!");
      nameEl.focus();
      return false;
    }

    if (address == '') {
      alert("Please enter the address of the university!");
      addressEl.focus();
      return false;
    }

    if (phone == '') {
      alert("Please enter the phone number of the university!");
      phoneEl.focus();
      return false;
    }

    //check if address start with number
    var firstChar = address.trim().substr(0, 1);
    if (typeof firstChar === "string" && Number.isNaN(Number(firstChar))) {
      alert("Address should start with a number!");
      searchEl.focus();
      return false;
    }
    //check if phone is consists of hyphen and number
    var tokens = phone.split('-');
    for (var i = 0; i < tokens.length; i++) {
      if (typeof firstChar === "string" && Number.isNaN(Number(tokens[i]))) {
        alert("Please use only numbers or hyphens on phone number!");
        phoneEl.focus();
        return false;
      }//end if
    }//end for

    // check if address contains letters
    var pattern = /[a-z]/i;
    if (!(pattern.test(address))) {
      alert("Address should contain letters!");
      addressEl.focus();
      return false;
    }
    // all validation passed, return true
    return true;


  }

  saveInformation() {
    if (this.validateUniversityInfo()) {
      const httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
      };
      var university = {
        name: this.universityName.replace(/^\s+|\s+$/g, ""),
        address: this.universityAddress.replace(/^\s+|\s+$/g, ""),
        phone: this.universityPhone.replace(/^\s+|\s+$/g, "")
      };
      this.http.post(this.SERVER_URL + "/saveuniversity", university, httpOptions).subscribe((response) => {
        alert("Result saved successfully!");
      }, error => alert('oops ' + error.responseText))
    }
  }

  deleteInformation() {
    if (this.validateUniversityInfo()) {
      var university = {
        name: this.universityName.replace(/^\s+|\s+$/g, ""),
        address: this.universityAddress.replace(/^\s+|\s+$/g, ""),
        phone: this.universityPhone.replace(/^\s+|\s+$/g, "")
      };
      //first grab the name of the university
      var key = this.universityName.replace(/^\s+|\s+$/g, "");

    }
  }
  display(universities: any) {
    this.universities.length = 1;
    //go through each record
    for (var i = 0; i < universities.length; i++) {

      var name = universities[i].name;//Name attribute
      var address = universities[i].address; // Address attribute
      var phone = universities[i].phone; //PhoneNumber attribute

      this.universities.push(new University(name, address, phone));


    }//end for
  }

  searchInfo() {
    var searchEl = <HTMLInputElement>document.getElementById('search');
    //validate search input
    var universityName = this.search.replace(/^\s+|\s+$/g, "");

    //check empty fields
    if (universityName == '') {
      alert("Please enter the name of searching university!");
      searchEl.focus();
      return;
    }
    this.http.get(this.SERVER_URL + '/find/' + universityName).subscribe(response => {
      // code when succeeded
      // data can contain the returned data from server
      console.log(response);
      this.display(response);
    }, error => alert('oops ' + error.responseText)
    );

  }


  displayRecords() {
    this.http.get(this.SERVER_URL + '/queryuniversitylist').subscribe(response => {
      // code when succeeded
      // data can contain the returned data from server
      console.log(response);
      this.display(response);
    }, error => alert('oops ' + error.responseText)
    );
  }
}
