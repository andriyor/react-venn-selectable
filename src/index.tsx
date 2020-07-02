import React from 'react';

import * as d3 from 'd3';
import * as venn from 'venn.js';

import { propTypes } from "props/props";
import {GElement, IntersectionAreasMapping, VennSet} from "../types/venn.js";

export interface VennProps {
  sets?: VennSet[];
  selectors?: string[];
}

export class Venn extends React.Component<VennProps> {

  state = {
    selectors: [],
    sets: [],
  };

  static propTypes = propTypes;

  getIntersectionAreasMapping() {
    let intersectionAreasMapping = {};
    let vennAreas = d3.selectAll(".venn-area");
    vennAreas.each((areaData, areaIdx, areas) => {
      let area = areas[areaIdx];
      let areaSets = (areaData as VennSet).sets;
      let areaSelection = d3.select(area);
      let areaD = areaSelection.select("path").attr("d");
      let areaSetsId = (area as GElement).dataset.vennSets;
      let intersectedAreas = d3.selectAll(".venn-area")
        .filter((cAreaData, cAreaIdx, cAreas) => {
          // @ts-ignore
          let cAreaSetsId = (cAreas as NodeList)[cAreaIdx].dataset.vennSets;
          let cAreaSets = (cAreaData as VennSet).sets;
          // @ts-ignore
          let isContained = areaSets.every((setId: number) => cAreaSets.indexOf(setId) > -1);
          return (isContained && cAreaSetsId !== areaSetsId);
        })
        .nodes()
        .map(intersectedArea => {
          let intersectedAreaSelection = d3.select(intersectedArea);
          return {
            sets: (intersectedAreaSelection.data()[0] as VennSet).sets,
            d: intersectedAreaSelection.select("path").attr("d")
          }
        });

      (intersectionAreasMapping as IntersectionAreasMapping)[areaSetsId] = {
        vennArea: {
          sets: areaSets,
          d: areaD
        },
        intersectedAreas: intersectedAreas
      };
    });
    return intersectionAreasMapping;
  }

  appendVennAreaParts(svg: Selection, intersectionAreasMapping: IntersectionAreasMapping) {
    for (let areaSetsId in intersectionAreasMapping) {
      let intersectionAreasItem = intersectionAreasMapping[areaSetsId];
      let vennArea = intersectionAreasItem.vennArea;
      let intersectedAreas = intersectionAreasItem.intersectedAreas;
      let partId = this.getPartId(vennArea, intersectedAreas);
      let d = [vennArea.d].concat(intersectedAreas.map(intersectedArea => intersectedArea.d));
      this.appendVennAreaPart(svg, d.join(""), partId);
    }
  }

  appendLabels(svg: Selection, labels: Selection) {
    // @ts-ignore
    labels.nodes().forEach(label => {
      // @ts-ignore
      svg.append(function() {
        return label;
      });
    });
  }

  appendVennAreaPart(svg, d, partId) {
    svg.append("g")
      .attr("class", "venn-area-part")
      .attr("venn-area-part-id", partId)
      .append("path")
      .attr("d", d)
      .attr("fill-rule", "evenodd");
  }

  appendPatterns(defs) {
    let colors = ["none", "#009fdf"];
    colors.forEach((color, idx) => {
      let diagonal = defs.append("pattern")
        .attr("id", "diagonal" + idx)
        .attr("patternUnits", "userSpaceOnUse")
        .attr("width", "10")
        .attr("height", "10");
      diagonal.append('rect')
        .attr("width", "10")
        .attr("height", "10")
        .attr("x", "0")
        .attr("y", "0")
        .attr("fill", color)
        .attr("fill-opacity", "0.15");
      diagonal.append("path")
        .attr("d", "M-1,1 l2,-2 M0,10 l10,-10 M9,11 l2,-2")
        .attr("stroke", "#000000")
        .attr("opacity", "1")
        .attr("stroke-width", "1");
    })
  }

  getPartId(vennArea, intersectedAreas) {
    let partId = "(" + vennArea.sets.join("∩") + ")";
    partId += intersectedAreas.length > 1 ? "\\(" : "";
    partId += intersectedAreas.length === 1 ? "\\" : "";
    partId += intersectedAreas.map(intersectedArea => intersectedArea.sets).map(set => "(" + set.join("∩") + ")").join("∪");
    partId += intersectedAreas.length > 1 ? ")" : "";
    return partId;
  }

  bindVennAreaPartListeners(div) {
    div.selectAll("g")
      .on("mouseover", function(d, i) {
        // @ts-ignore
        let node = d3.select(this);
        let nodePath = node.select("path");
        let nodeAlreadySelected = node.classed("selected");
        nodePath.attr("style", nodeAlreadySelected ? "fill: url(#diagonal1)" : "fill: #009fdf; fill-opacity: 0.15");
      })
      .on("mouseout", function(d, i) {
        // @ts-ignore
        let node = d3.select(this);
        let nodePath = node.select("path");
        let nodeAlreadySelected = node.classed("selected");
        nodePath.attr("style", nodeAlreadySelected ? "fill: url(#diagonal0)" : "fill: #ffffff");
      })
      .on("click", function(d,i) {
        // @ts-ignore
        let node = d3.select(this);
        let nodePath = node.select("path");
        let nodeAlreadySelected = node.classed("selected");
        let nodePathStyle = (!nodeAlreadySelected ? "fill: url(#diagonal1)" : "fill: #ffffff");
        nodePath.attr("style", nodePathStyle);
        node.classed("selected", !nodeAlreadySelected);
      });
  }

  removeOriginalVennAreas() {
    d3.selectAll("g.venn-area").remove();
  }

  clear() {
    d3.selectAll("g").classed("selected", false);
    d3.selectAll("path").attr("style", "fill: #ffffff");
  }

  selectNode(DOMnode) {
    let node = d3.select(DOMnode);
    let nodePath = node.select("path");
    let nodeAlreadySelected = node.classed("selected");
    let nodePathStyle = (!nodeAlreadySelected ? "fill: url(#diagonal0)" : "fill: #ffffff");
    nodePath.attr("style", nodePathStyle);
    node.classed("selected", !nodeAlreadySelected);
  }

  fillVenn = () => {
    // @ts-ignore
    for (const selector of this.props.selectors) {
      const relationSelector = selector.replace(String.fromCharCode(92), String.fromCharCode(92,92));
      const select = `g[venn-area-part-id='${relationSelector}']`;
      // @ts-ignore
      const node = this.state.svg.select(select).node();
      if (node) {
        this.selectNode(node);
      }
    }
  }

  componentDidMount () {
    const chart = venn.VennDiagram();
    // @ts-ignore
    const div = d3.select(this.div).datum(this.props.sets).call(chart);
    const svg = div.select("svg");
    const defs = svg.append("defs");
    const labels = div.selectAll("text").remove();

    this.appendPatterns(defs);
    // @ts-ignore
    this.intersectionAreasMapping = this.getIntersectionAreasMapping();
    // @ts-ignore
    this.appendVennAreaParts(svg, this.intersectionAreasMapping);
    // @ts-ignore
    this.appendLabels(svg, labels);
    this.bindVennAreaPartListeners(div);
    this.removeOriginalVennAreas();

    this.setState({svg: svg}, () => {
      // @ts-ignore
      if (this.props.selectors) {
        this.fillVenn()
      }
    });
  }

  componentDidUpdate(prevProps) {
    // @ts-ignore
    if (this.props.selectors !== prevProps.selectors && this.props.selectors) {
      this.clear();
      this.fillVenn();
    }
  }

  render () {
    return (
      // @ts-ignore
      <div id="venn" ref={ div => this.div = div }>
      </div>
    )
  }
}
