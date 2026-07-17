import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  PedidoBloqueado,
  PedidoFaturado,
  PedidoDetalhe,
} from '../models/pedido.model';

/**
 * Serviço de comunicação com a API TLPP (PEDIDOAPI).
 * Central de Liberação de Crédito de Pedidos de Venda.
 */
@Injectable({ providedIn: 'root' })
export class PedidoService {
  private readonly baseUrl = `${environment.apiUrl}/api/pedidos`;

  constructor(private http: HttpClient) {}

  /** GET: só Authorization (Protheus rejeita GET com Content-Type). */
  private headersGet(): HttpHeaders {
    return new HttpHeaders({
      Authorization: 'Basic ' + btoa('admin:99'),
    });
  }

  /** POST: com Content-Type JSON. */
  private headersBody(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + btoa('admin:99'),
    });
  }

  /** Lista pedidos bloqueados por crédito, aguardando liberação. */
  listarBloqueados(): Observable<{ items: PedidoBloqueado[] }> {
    return this.http.get<{ items: PedidoBloqueado[] }>(
      `${this.baseUrl}/bloqueados`,
      { headers: this.headersGet() }
    );
  }

  /** Lista pedidos já faturados. */
  listarFaturados(): Observable<{ items: PedidoFaturado[] }> {
    return this.http.get<{ items: PedidoFaturado[] }>(
      `${this.baseUrl}/faturados`,
      { headers: this.headersGet() }
    );
  }

  /** Detalhe de um pedido (cabeçalho + itens + crédito do cliente). */
 // No pedido.service.ts, troca:
buscarDetalhe(num: string): Observable<PedidoDetalhe> {
  return this.http.get<PedidoDetalhe>(`${this.baseUrl}/detalhe/${num}`, {  // ← adiciona /detalhe/
    headers: this.headersGet(),
  });
}

  /** Libera o crédito de um pedido (chama MaLibDoFat no backend). */
  liberar(num: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/liberar`,
      { num },
      { headers: this.headersBody() }
    );
  }

  /** Rejeita a liberação de crédito de um pedido. */
  rejeitar(num: string): Observable<any> {
    return this.http.post(
      `${this.baseUrl}/rejeitar`,
      { num },
      { headers: this.headersBody() }
    );
  }
}
