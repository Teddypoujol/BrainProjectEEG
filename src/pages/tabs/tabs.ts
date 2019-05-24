import { Component } from '@angular/core';
import { GlobalPage } from '../Global/global';
import { HomePage } from '../home/home';
import { ClusterPage } from '../Cluster/cluster';


@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = HomePage;
  tab4Root = GlobalPage;
  tab6Root = ClusterPage;

  constructor() {

  }
}
