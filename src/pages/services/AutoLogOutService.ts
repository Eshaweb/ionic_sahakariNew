import { Injectable, Inject } from '@angular/core';
import { Router } from '@angular/router'
import { NavController, App } from 'ionic-angular';
import { LoginPage } from '../login/login';
import { StorageService } from './Storage_Service';

const MINUTES_UNITL_AUTO_LOGOUT = 5 // in mins
const CHECK_INTERVAL = 15000 // in ms
const STORE_KEY = 'lastAction';
@Injectable()
export class AutoLogoutService {
    private navCtrl: NavController;
  public getLastAction() {
    return parseInt(StorageService.GetItem(STORE_KEY));
  }
  public setLastAction(lastAction: number) {
    StorageService.SetItem(STORE_KEY, lastAction.toString());
  }

  constructor(private app:App) {
    this.navCtrl = app.getActiveNav();
    console.log('object created');
    this.check();
    this.initListener();
    this.initInterval();
  }

  initListener() {
    document.body.addEventListener('click', () => this.reset());
    document.body.addEventListener('mouseover', () => this.reset());
    document.body.addEventListener('mouseout', () => this.reset());
    document.body.addEventListener('keydown', () => this.reset());
    document.body.addEventListener('keyup', () => this.reset());
    document.body.addEventListener('keypress', () => this.reset());
  }

  reset() {
    this.setLastAction(Date.now());
  }

  initInterval() {
    setInterval(() => {
      this.check();
    }, CHECK_INTERVAL);
  }

  check() {
    const now = Date.now();
    const timeleft = this.getLastAction() + MINUTES_UNITL_AUTO_LOGOUT * 60 * 1000;
    const diff = timeleft - now;
    const isTimeout = diff < 0;

    if (isTimeout) {
      StorageService.RemoveItem("lastAction");
      this.navCtrl.push(LoginPage);
    }
  }
}