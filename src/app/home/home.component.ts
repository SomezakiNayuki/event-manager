import { Component, OnInit } from '@angular/core';
import { User } from '../models/user.model';
declare var $: any;

@Component({
  selector: 'em-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {

  protected user: User;
  protected isSideBarOpen: boolean;
  protected weekUpAuthenticationInitialization: boolean;
  protected searchContent: string;

  protected isBrowseActive: boolean;
  protected isTicketsActive: boolean;
  protected isAccountActive: boolean;
  protected isEventsActive: boolean;
  protected isMessagesActive: boolean;
  protected isDetail: boolean;

  constructor() { }

  public ngOnInit() {
    this.user = undefined;
    this.isSideBarOpen = false;
    this.weekUpAuthenticationInitialization = false;
    this.searchContent = undefined;

    this.isBrowseActive = true;
    this.isTicketsActive = false;
    this.isAccountActive = false;
    this.isEventsActive = true;
    this.isMessagesActive = false;
    this.isDetail = false;
  }

  private initializeAuthenticationComponent(): void {
    this.weekUpAuthenticationInitialization = !this.weekUpAuthenticationInitialization;
  }

  protected toggleSideBar(): void {
    const navBar = document.getElementById("MobileNav");
    if (navBar.classList.contains("hide")) {
      navBar.classList.remove("hide");
    } else {
      navBar.classList.add("hide");
    }
  }

  protected openLoginModal(): void {
    this.initializeAuthenticationComponent();
    $('#LoginModal').modal('show');
  }

  protected openRegisterModal(): void {
    this.initializeAuthenticationComponent();
    $('#RegisterModal').modal('show');
  }

  protected receiveLoginEvent($event: any): void {
    this.user = $event;
    this.searchContent = undefined;
  }

  protected logout(): void {
    this.user = undefined;
    this.searchContent = undefined;
    this.clearActivePage();
    this.isBrowseActive = true;
    this.isEventsActive = true;
  }

  private clearActivePage(): void {
    this.isBrowseActive = false;
    this.isTicketsActive = false;
    this.isAccountActive = false;
    this.isEventsActive = false;
    this.isMessagesActive = false;
  }

  protected openBrowsePage(): void {
    this.clearActivePage();
    this.isBrowseActive = true;
  }

  protected openTicketsPage(): void {
    this.clearActivePage();
    this.isTicketsActive = true;
  }

  protected openAccountPage(): void {
    this.clearActivePage();
    this.isAccountActive = true;
  }

  protected openEventsPage(): void {
    this.clearActivePage();
    this.isEventsActive = true;
  }

  protected openMessagesPage(): void {
    this.clearActivePage();
    this.isMessagesActive = true;
  }

  protected changeInterfaceMode(): void {
    this.isDetail = !this.isDetail;
  }

}
