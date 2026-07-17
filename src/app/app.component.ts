import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  PoMenuModule,
  PoMenuItem,
  PoToolbarModule,
  PoToolbarAction,
} from '@po-ui/ng-components';
import { TemaService } from './services/tema.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PoMenuModule, PoToolbarModule],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  menuCollapsed = false;
  toolbarActions: PoToolbarAction[] = [];

  constructor(public tema: TemaService) {}

  ngOnInit(): void {
    this.tema.aplicarTemaSalvo();
    this.montarAcoes();
  }

  /** Reconstroi as acoes da toolbar (chamado no init e a cada troca de tema). */
  private montarAcoes(): void {
    this.toolbarActions = [
      { icon: 'po-icon-menu', label: 'Menu', type: 'icon', action: () => this.toggle() },
      {
        icon: this.tema.escuro ? 'an an-sun' : 'an an-moon',
        label: this.tema.escuro ? 'Modo claro' : 'Modo escuro',
        type: 'icon',
        action: () => this.alternarTema(),
      },
    ];
  }

  alternarTema(): void {
    this.tema.alternar();
    this.montarAcoes();   // novo array = toolbar re-renderiza com o icone trocado
  }

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
