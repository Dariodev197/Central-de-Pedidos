import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PoPageModule,
  PoWidgetModule,
  PoTableModule,
  PoTableColumn,
  PoLoadingModule,
  PoNotificationService,
  PoPageAction,
} from '@po-ui/ng-components';
import { PedidoService } from '../../services/pedido.service';
import { PedidoFaturado } from '../../models/pedido.model';

/**
 * Pedidos Faturados — visão de acompanhamento.
 * Tabela clássica (po-table): consulta, volume maior, ordenação.
 * Colunas alinhadas com o JSON da API TLPP (v6):
 *   pedido, nome, vendedor, emissao, nfiscal, serie, valor
 */
@Component({
  selector: 'app-faturados',
  standalone: true,
  imports: [
    CommonModule,
    PoPageModule,
    PoWidgetModule,
    PoTableModule,
    PoLoadingModule,
  ],
  templateUrl: './faturados.component.html',
})
export class FaturadosComponent implements OnInit {
  pedidos: PedidoFaturado[] = [];
  carregando = false;

  colunas: PoTableColumn[] = [
    { property: 'pedido',   label: 'Pedido',      width: '10%' },
    { property: 'nome',     label: 'Cliente',     width: '30%' },
    { property: 'vendedor', label: 'Vendedor',    width: '12%' },
    { property: 'emissao',  label: 'Emissão',     width: '12%' },
    { property: 'nfiscal',  label: 'Nota Fiscal', width: '12%' },
    { property: 'serie',    label: 'Série',       width: '8%'  },
    { property: 'valor',    label: 'Valor',       width: '16%', type: 'currency', format: 'BRL' },
  ];

  acoesPagina: PoPageAction[] = [
    { label: 'Atualizar', icon: 'po-icon-refresh', action: () => this.carregar() },
  ];

  constructor(
    private service: PedidoService,
    private notification: PoNotificationService
  ) {}

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.service.listarFaturados().subscribe({
      next: (resp) => {
        this.pedidos = resp.items ?? [];
        this.carregando = false;
      },
      error: () => {
        this.notification.error('Erro ao carregar pedidos faturados.');
        this.carregando = false;
      },
    });
  }

  get valorFaturado(): number {
    return this.pedidos.reduce((s, p) => s + (p.valor || 0), 0);
  }
}
