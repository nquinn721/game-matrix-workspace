import { physics } from "../game/matteritem";
import { mapElement } from "../game/mapElement";
import { IMatrixSegment, TItem, TPlayer } from "game-matrix/types";
import { Item } from "../game/item";

export class MatrixSegment implements IMatrixSegment {
  public items: TItem[] = [];
  public players: TPlayer[] = [];
  public x: number = 0;
  public y: number = 0;
  public endx: number = 0;
  public endy: number = 0;
  public w: number = 0;
  public h: number = 0;
  public id: string = "";
  public loaded: boolean = false;

  constructor(segmentSize: any, public row: number, public col: number) {
    const x = col * segmentSize;
    const y = row * segmentSize;
    this.x = col > 0 ? x + 1 : x;
    this.y = row > 0 ? y + 1 : y;
    this.endx = x + segmentSize;
    this.endy = y + segmentSize;
    this.w = segmentSize;
    this.h = segmentSize;
    this.id = `grid-row-${row}-col-${col}`;
  }

  addItem(obj: any) {
    obj.id = `${obj.type}-${this.row}-${this.col}-${this.items.length}`;
    obj.matrixSegment = { row: this.row, col: this.col };
    if (this.loaded) {
      obj = mapElement.create(obj);
      obj.load && obj.load();
    }
    this.items.push(obj);
  }

  hasItem(obj: TItem): boolean {
    return !!this.items.find(v => v.id === obj.id);
  }

  loadItems() {
    if (!this.loaded) {
      this.loaded = true;
      this.items = this.items.map(mapElement.create.bind(mapElement));
    }
  }

  unloadItems() {
    if (!this.players.length) {
      this.loaded = false;
      this.items.forEach(physics.destroyItem);
      this.items = this.items.map(v => v.plain());
    }
  }

  getItem(id: any) {
    id = typeof id === "string" ? id : id.id;
    return this.items.find(v => v.id === id);
  }

  destroyItem(id: any) {
    id = typeof id === "string" ? id : id.id;
    this.items = this.items.filter(v => v.id !== id);
  }

  getTrackedItems() {
    return this.items.filter(v => v.positionalTracking).map(v => v.plain());
  }

  addPlayer(id: any) {
    this.players.push(id);
  }

  removePlayer(id: any) {
    id = typeof id === "string" ? id : id.id;
    this.players = this.players.filter(v => v !== id);
  }

  getPlainItems() {
    return this.items.map(v => (v && v.plain ? v.plain() : v));
  }

  getPlainPlayers(player: TPlayer) {
    if (player) return this.players.filter(v => v.id !== player.id);
    return this.players;
  }

  getAllPlayers() {
    return this.players.concat(this.players);
  }

  plain() {
    return {
      x: this.x,
      y: this.y,
      endx: this.endx,
      endy: this.endy,
      col: this.col,
      row: this.row,
    };
  }
}