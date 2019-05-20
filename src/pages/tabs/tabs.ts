import { Component } from '@angular/core';
import { GlobalPage } from '../Global/global';
import { GammaPage } from '../gamma/gamma';
import { DeltaPage } from '../Delta/delta';
import { HomePage } from '../home/home';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab2Root = GammaPage;
  tab3Root = DeltaPage;
  tab4Root = GlobalPage;

  constructor() {

  }
}
