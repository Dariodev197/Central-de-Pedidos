import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  PoPageModule,
  PoWidgetModule,
  PoTableModule,
  PoTableColumn,
  PoLoadingModule,
  PoFieldModule,
  PoNotificationService,
  PoPageAction,
} from '@po-ui/ng-components';
import { PedidoService } from '../../services/pedido.service';
import { PedidoFaturado } from '../../models/pedido.model';

/**
 * Pedidos Faturados — visão de acompanhamento.
 * Tabela clássica (po-table) com filtro local por pedido,
 * cliente ou nota fiscal (client-side: a listagem já vem
 * completa da API, filtrar em memória é instantâneo).
 */
@Component({
  selector: 'app-faturados',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    PoPageModule,
    PoWidgetModule,
    PoTableModule,
    PoLoadingModule,
    PoFieldModule,
  ],
  templateUrl: './faturados.component.html',
})
export class FaturadosComponent implements OnInit {
  pedidos: PedidoFaturado[] = [];
  filtro = '';
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

  /** Lista exibida na tabela: aplica o filtro por pedido, cliente ou NF. */
  get pedidosFiltrados(): PedidoFaturado[] {
    const termo = this.filtro.trim().toLowerCase();
    if (!termo) {
      return this.pedidos;
    }
    return this.pedidos.filter(p =>
      (p.pedido  || '').toLowerCase().includes(termo) ||
      (p.nome    || '').toLowerCase().includes(termo) ||
      (p.nfiscal || '').toLowerCase().includes(termo)
    );
  }

  get valorFaturado(): number {
    return this.pedidosFiltrados.reduce((s, p) => s + (p.valor || 0), 0);
  }
}
