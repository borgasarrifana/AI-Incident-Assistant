import ReactFlow from "reactflow";
import "reactflow/dist/style.css";

export default function IncidentCorrelationGraph() {

  const nodes = [

    {
      id: "1",
      data: {
        label: "API Timeout"
      },
      position: {
        x: 100,
        y: 100
      }
    },

    {
      id: "2",
      data: {
        label: "Database Slow"
      },
      position: {
        x: 350,
        y: 100
      }
    },

    {
      id: "3",
      data: {
        label: "Kubernetes Restart"
      },
      position: {
        x: 600,
        y: 100
      }
    },

    {
      id: "4",
      data: {
        label:
          "Authentication Failure"
      },
      position: {
        x: 850,
        y: 100
      }
    }

  ];

  const edges = [

    {
      id: "e1-2",
      source: "1",
      target: "2"
    },

    {
      id: "e2-3",
      source: "2",
      target: "3"
    },

    {
      id: "e3-4",
      source: "3",
      target: "4"
    }

  ];

  return (

    <div className="
      bg-slate-900
      border border-slate-800
      rounded-3xl
      h-[400px]
    ">

      <ReactFlow
        nodes={nodes}
        edges={edges}
        fitView
      />

    </div>

  );

}