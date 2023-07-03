import React, { useEffect, useState } from 'react';
import { xml2js } from 'xml-js';
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  Panel,
  useNodesState,
  useEdgesState,
  Background,
  Controls
} from 'reactflow';
import dagre from 'dagre';
import 'reactflow/dist/style.css';
import { SAXParser } from 'sax';
import { positionByBfs } from '../utils/bfs'


export async function fetchData(filename, setXmlData) {
  try {
    const response = await fetch(filename);
    const data = await response.text();
    setXmlData(data);
  } catch (error) {
    console.error('Error fetching XML data:', error);
  }
}


function stringToHtml(str) {
  return <div dangerouslySetInnerHTML={{ __html: str }} />;
}

export function transformData(xmlData) {

  const nodes = [];
  const edges = [];
  const parsedEdges = [];
  
  let currentNode = null;
  let currentGeometry = null;
  let currentEdge = null;
  
  // We use a set to keep track of seen edges
  const seenEdges = new Set();

  const parser = new SAXParser(true, { lowercase: true });

  parser.onopentag = (node) => {
    if (node.name === 'mxCell' && node.attributes.vertex === '1') {
      currentNode = {
        id: node.attributes.id,
        data: { label: stringToHtml(node.attributes.value) },
        position: { x: 0, y: 0 },
        type: 'input',
      };

      if (node.attributes.style && node.attributes.style.includes('rounded=0')) {
        currentNode.type = 'default';
      }
    } else if (node.name === 'mxGeometry') {
      currentGeometry = node.attributes;
    } else if (node.name === 'mxCell' && node.attributes.source && node.attributes.target) {
      currentEdge = {
        id: `e${node.attributes.source}-${node.attributes.target}`,
        source: node.attributes.source,
        target: node.attributes.target,
      };
    }
  };

  parser.onclosetag = (tagName) => {

    if (tagName === 'mxCell' && currentNode) {
      const { x, y } = currentGeometry;
      currentNode.position = { x: parseFloat(x), y: parseFloat(y) };
      nodes.push(currentNode);
      currentNode = null;
      currentGeometry = null;
    } else if (tagName === 'mxCell' && currentEdge) {
      parsedEdges.push(currentEdge);
      currentEdge = null;
    }
  };

  parser.write(xmlData).close();


  const validEdges = parsedEdges.filter(edge => {
    const sourceNodeExists = nodes.some(node => node.id === edge.source);
    const targetNodeExists = nodes.some(node => node.id === edge.target);
    const edgeIdentity = `${edge.source}-${edge.target}`;
    
    if (!sourceNodeExists || !targetNodeExists || edge.source === edge.target || seenEdges.has(edgeIdentity)) {
      return false;
    }
    
    seenEdges.add(edgeIdentity);
    return true;
  });


  const positionedNodes = positionByBfs(nodes, validEdges);

  return { nodes: positionedNodes, edges: validEdges };
}



const XMLDisplay = ({ filename }) => {
 
  const [xmlData, setXmlData] = useState(null);
  const [nodes, setNodes] = useState([]);
  const [edges, setEdges] = useState([]);

  useEffect(() => {
    fetchData(filename, setXmlData);
  }, [filename]);

  useEffect(() => {
    const { nodes: transformedNodes, edges: transformedEdges } = transformData(xmlData);
    setNodes(transformedNodes);
    setEdges(transformedEdges);
  }, [xmlData]);


  return (
    <div style={{ width: '100%', height: '1200px' }}>
      {
        nodes && edges && nodes.length > 0 && edges.length > 0 ? 
          <div style={{ height: '100%' }}>
            <ReactFlow nodes={nodes} edges={edges}>
              <Background />
              <Controls />
            </ReactFlow>
          </div>
        : 
          <p>"F"</p>
      }
    </div>
  );
};

export default XMLDisplay;
