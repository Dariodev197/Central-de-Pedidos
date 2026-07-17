import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  PoMenuModule,
  PoMenuItem,
  PoToolbarModule,
  PoToolbarAction,
} from '@po-ui/ng-components';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PoMenuModule, PoToolbarModule],
  templateUrl: './app.component.html',
})
export class AppComponent {
  menuCollapsed = false;

  toolbarActions: PoToolbarAction[] = [
    { icon: 'po-icon-menu', label: 'Menu', type: 'icon', action: () => this.toggle() },
  ];

  menus: PoMenuItem[] = [
    {
      label: 'Financeiro',
      icon: 'po-icon-finance',
      subItems: [
        { label: 'Liberação de Crédito', link: '/liberacao', icon: 'po-icon-unlock' },
        { label: 'Pedidos Faturados', link: '/faturados', icon: 'po-icon-ok' },
      ],
    },
  ];

  toggle(): void {
    this.menuCollapsed = !this.menuCollapsed;
  }
}
