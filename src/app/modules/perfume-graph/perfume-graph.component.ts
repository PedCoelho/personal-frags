import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import * as d3 from 'd3';
import { UserPerfume } from '../collection/models/collection.models';

interface NoteLink {
  source: number;
  target: number;
  notes: string[];
}
interface AccordLink {
  source: number;
  target: number;
  accords: string[];
}

@Component({
  selector: 'perfume-graph',
  templateUrl: './perfume-graph.component.html',
  styleUrls: ['./perfume-graph.component.scss'],
})
export class PerfumeGraphComponent implements OnInit {
  @ViewChild('container', { static: true })
  chartContainer!: ElementRef;

  @Input() collection: any[] = [];

  constructor() {}

  ngOnInit(): void {
    console.log(this.chartContainer);
    this.getChart();
  }

  private generateAccordLinks(collection: UserPerfume[]) {
    const getPerfumeAccords = (p: UserPerfume) =>
      Object.values(p.accords)
        .flat()
        .map((accord) => accord.name);

    let links: AccordLink[] = [];

    collection.forEach((perfume, i) => {
      const perfumeAccords = getPerfumeAccords(perfume);
      console.log(perfumeAccords);
      const matches: AccordLink[] = collection
        .filter((other: UserPerfume, j) => Boolean(i !== j))
        .map((other: UserPerfume, j) => ({
          source: i,
          target: collection.indexOf(other),
          accords: getPerfumeAccords(other).filter((accord) =>
            perfumeAccords.some((ogAccord) => ogAccord === accord)
          ),
        }))
        .filter(
          (match) =>
            match.accords.length &&
            links.every((link) => link.source !== match.target)
        );

      links = links.concat(matches);
    });
    return links;
  }

  private generateNoteLinks(collection: UserPerfume[]) {
    const getPerfumeNotes = (p: UserPerfume) =>
      Object.values(p.notes)
        .flat()
        .map((note) => note.name);

    let links: NoteLink[] = [];

    collection.forEach((perfume, i) => {
      const perfumeNotes = getPerfumeNotes(perfume);
      console.log(perfumeNotes);
      const matches: NoteLink[] = collection
        .filter((other: UserPerfume, j) => Boolean(i !== j))
        .map((other: UserPerfume, j) => ({
          source: i,
          target: collection.indexOf(other),
          notes: getPerfumeNotes(other).filter((note) =>
            perfumeNotes.some((ogNote) => ogNote === note)
          ),
        }))
        .filter(
          (match) =>
            match.notes.length &&
            links.every((link) => link.source !== match.target)
        );

      links = links.concat(matches);
    });
    return links;
  }

  private async getChart() {
    const data: UserPerfume[] | undefined = await d3.json('assets/data.json');
    const links_data: NoteLink[] | undefined = await d3.json(
      'assets/links.json'
    );

    if (data === undefined || links_data === undefined) return;

    // Specify the color scale.
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const CHART_SIZE = 800;
    const IMAGE_SIZE = CHART_SIZE / 15;
    const width = CHART_SIZE,
      height = CHART_SIZE;

    // The force simulation mutates links and nodes, so create a copy
    // so that re-evaluating this cell produces the same result.
    const links: d3.SimulationLinkDatum<d3.SimulationNodeDatum>[] =
      links_data.map((d: any, i) => ({
        ...d,
      }));
    const nodes: d3.SimulationNodeDatum[] = data.map((d: any, i) => ({
      ...d,
    }));

    // Create a simulation with several forces.
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any, i) => i)
          .distance((d: any) => CHART_SIZE / 2 / d.notes.length)
          .strength((d: any) => d.notes.length * 1.2)
      )
      .force('collide', d3.forceCollide(IMAGE_SIZE / 2).iterations(10))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(-30))
      .on('tick', ticked);

    console.log(links);

    // Create the SVG container.
    const svg = d3
      .select(this.chartContainer.nativeElement)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .attr('viewBox', [0, 0, width, height])
      .attr('style', 'max-width: 100%; height: auto;');

    // Add a line for each link, and a circle for each node.
    const link = svg
      .append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll()
      .data(links)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.notes.length));

    const node = svg
      .append('g')
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5)
      .selectAll()
      .data(nodes)
      .join('svg:image')
      .attr('xlink:href', (d: any) => d.thumbnail)
      .attr('width', IMAGE_SIZE)
      .attr('height', IMAGE_SIZE);
    // .join('circle')
    // .attr('r', (d: any) => 10)
    // .attr('fill', (d: any) => d.accords[0].background);

    node.append('text').text((d: any, i) => d.name);

    node.append('title').text((d: any) => d.name);

    // // Add a drag behavior.
    node.call(
      //@ts-ignore
      d3
        .drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended)
    );

    // Set the position attributes of links and nodes each time the simulation ticks.
    function ticked() {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      // node.attr('cx', (d: any) => d.x).attr('cy', (d: any) => d.y);

      node
        .attr('x', (d: any) => d.x - IMAGE_SIZE / 2)
        .attr('y', (d: any) => d.y - IMAGE_SIZE / 2);
    }

    // Reheat the simulation when drag starts, and fix the subject position.
    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    // Update the subject (dragged node) position during drag.
    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    // Restore the target alpha so the simulation cools after dragging ends.
    // Unfix the subject position now that it’s no longer being dragged.
    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return svg.node();
  }
}
