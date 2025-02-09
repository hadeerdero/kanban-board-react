

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { Link, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";

// const KanbanBoard = ({ onEditLead }) => {
//   const [stages, setStages] = useState([]);

//   // Fetch stages and leads
//   const fetchStages = async () => {
//     axios.defaults.baseURL = 'http://127.0.0.1:8000';
//     const response = await axios.get("/api/stages/");
//     setStages(response.data);
//   };

//   useEffect(() => {
//     fetchStages();
//   }, []);

//   // Handle drag-and-drop
//   const onDragEnd = async (result) => {
//     const { source, destination, draggableId } = result;

//     if (!destination) return;

//     const sourceStageIndex = stages.findIndex(
//       (stage) => stage.id === parseInt(source.droppableId)
//     );
//     const destinationStageIndex = stages.findIndex(
//       (stage) => stage.id === parseInt(destination.droppableId)
//     );

//     const [movedLead] = stages[sourceStageIndex].leads.splice(source.index, 1);
//     stages[destinationStageIndex].leads.splice(destination.index, 0, movedLead);

//     setStages([...stages]);

//     // Update lead's stage in the backend
//     await axios.patch(`/api/leads/${draggableId}/`, {
//       stage: stages[destinationStageIndex].id,
//     });
//   };

//   return (
//     <div>
//     <h1>Kanban Board</h1>
         
//             <Link to="/add-lead">
//                 <button>Add Lead</button>
//             </Link>
//             <Link to="/add-stage">
//                 <button>Add Stage</button>
//             </Link>
//     <DragDropContext onDragEnd={onDragEnd}>
//       <div className="kanban-board">
//         {stages.map((stage) => (
//           <Droppable key={stage.id} droppableId={stage.id.toString()}>
//             {(provided) => (
//               <div
//                 className="kanban-column"
//                 {...provided.droppableProps}
//                 ref={provided.innerRef}
//               >
//                 <h3>{stage.name}</h3>
//                 {stage.leads.map((lead, index) => (
//                   <Draggable
//                     key={lead.id}
//                     draggableId={lead.id.toString()}
//                     index={index}
//                   >
//                     {(provided) => (
//                       <div
//                         className="kanban-card"
//                         ref={provided.innerRef}
//                         {...provided.draggableProps}
//                         {...provided.dragHandleProps}
//                         onClick={() => onEditLead(lead.id)}
//                       >
//                         {lead.name}
//                       </div>
//                     )}
//                   </Draggable>
//                 ))}
//                 {provided.placeholder}
//               </div>
//             )}
//           </Droppable>
//         ))}
//       </div>
//     </DragDropContext>
//     </div>
//   );
// };

// export default KanbanBoard;



// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
// import { Link } from "react-router-dom";
// import { useNavigate } from 'react-router-dom';
// const KanbanBoard = ({  }) => {
//     const navigate = useNavigate();

//     const handleEditLead = (lead) => {
//         console.log(`Edit lead with ID: ${lead.id}`);
      
//         navigate("/edit-lead", { state: { lead: lead } });

//     };
//     const [stages, setStages] = useState([]);
//     const [websocket, setWebsocket] = useState(null);

//     // Fetch stages and leads
//     const fetchStages = async () => {
//         axios.defaults.baseURL = 'http://127.0.0.1:8000';
//         const response = await axios.get("/api/stages/");
//         setStages(response.data);
//     };

//     useEffect(() => {
//         fetchStages();

//         // Establish WebSocket connection
//         const ws = new WebSocket("ws://127.0.0.1:8000/ws/kanban/");
//         setWebsocket(ws);

//         // Handle incoming WebSocket messages
//         ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             const { lead_id, new_stage_id } = data;

//             setStages((prevStages) =>
//                 prevStages.map((stage) => ({
//                     ...stage,
//                     leads: stage.id === new_stage_id
//                         ? [...stage.leads, prevStages.flatMap(s => s.leads).find(lead => lead.id === lead_id)]
//                         : stage.leads.filter((lead) => lead.id !== lead_id),
//                 }))
//             );
//         };

//         ws.onclose = () => {
//             console.log("WebSocket connection closed");
//         };

//         return () => {
//             ws.close();
//         };
//     }, []);

//     // Handle drag-and-drop
//     const onDragEnd = (result) => {
//         const { source, destination, draggableId } = result;

//         if (!destination) return;

//         const sourceStageIndex = stages.findIndex(
//             (stage) => stage.id === parseInt(source.droppableId)
//         );
//         const destinationStageIndex = stages.findIndex(
//             (stage) => stage.id === parseInt(destination.droppableId)
//         );

//         const [movedLead] = stages[sourceStageIndex].leads.splice(source.index, 1);
//         stages[destinationStageIndex].leads.splice(destination.index, 0, movedLead);

//         setStages([...stages]);

//         // Send update via WebSocket
//         if (websocket) {
//             websocket.send(
//                 JSON.stringify({
//                     lead_id: draggableId,
//                     new_stage_id: stages[destinationStageIndex].id,
//                 })
//             );
//         }
//     };

//     return (
//         <div>
//             <h1>Kanban Board</h1>
//             <Link to="/add-lead">
//                 <button>Add Lead</button>
//             </Link>
//             <Link to="/add-stage">
//                 <button>Add Stage</button>
//             </Link>
//             <DragDropContext onDragEnd={onDragEnd}>
//                 <div className="kanban-board">
//                     {stages.map((stage) => (
//                         <Droppable key={stage.id} droppableId={stage.id.toString()}>
//                             {(provided) => (
//                                 <div
//                                     className="kanban-column"
//                                     {...provided.droppableProps}
//                                     ref={provided.innerRef}
//                                 >
//                                     <h3>{stage.name}</h3>
//                                     {stage.leads.map((lead, index) => (
//                                         <Draggable
//                                             key={lead.id}
//                                             draggableId={lead.id.toString()}
//                                             index={index}
//                                         >
//                                             {(provided) => (
//                                                 <div
//                                                     className="kanban-card"
//                                                     ref={provided.innerRef}
//                                                     {...provided.draggableProps}
//                                                     {...provided.dragHandleProps}
//                                                     onClick={() => handleEditLead(lead)}
//                                                 >
//                                                     {lead.name}
//                                                 </div>
//                                             )}
//                                         </Draggable>
//                                     ))}
//                                     {provided.placeholder}
//                                 </div>
//                             )}
//                         </Droppable>
//                     ))}
//                 </div>
//             </DragDropContext>
//         </div>
//     );
// };

// export default KanbanBoard;


 import React, { useEffect, useState } from "react";
import axios from "axios";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Link, useNavigate } from "react-router-dom";

const KanbanBoard = () => {
    const navigate = useNavigate();
    const [stages, setStages] = useState([]);
    const [websocket, setWebsocket] = useState(null);

    const handleEditLead = (lead) => {
        console.log(`Edit lead with ID: ${lead.id}`);
        navigate("/edit-lead", { state: { lead: lead } });
    };

    // Fetch stages and leads
    const fetchStages = async () => {
        axios.defaults.baseURL = "http://127.0.0.1:8000";
        const response = await axios.get("/api/stages/");
        setStages(response.data);
    };

    useEffect(() => {
        fetchStages();

        // Establish WebSocket connection
        const ws = new WebSocket("ws://127.0.0.1:8000/ws/kanban/");
        setWebsocket(ws);

        // Handle incoming WebSocket messages
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const { lead_id, new_stage_id } = data;

            setStages((prevStages) => {
                let movedLead = null;

                const updatedStages = prevStages.map((stage) => {
                    if (stage.leads.some((lead) => lead.id === lead_id)) {
                        // Remove the lead from its current stage
                        movedLead = stage.leads.find((lead) => lead.id === lead_id);
                        return { ...stage, leads: stage.leads.filter((lead) => lead.id !== lead_id) };
                    }
                    return stage;
                });

                // Add the lead to the new stage
                return updatedStages.map((stage) => {
                    if (stage.id === new_stage_id && movedLead) {
                        return { ...stage, leads: [...stage.leads, movedLead] };
                    }
                    return stage;
                });
            });
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        return () => {
            ws.close();
        };
    }, []);

    // Handle drag-and-drop
    const onDragEnd = (result) => {
        const { source, destination, draggableId } = result;

        if (!destination) return;

        const sourceStageIndex = stages.findIndex(
            (stage) => stage.id === parseInt(source.droppableId)
        );
        const destinationStageIndex = stages.findIndex(
            (stage) => stage.id === parseInt(destination.droppableId)
        );

        if (sourceStageIndex === -1 || destinationStageIndex === -1) return;

        const sourceStage = stages[sourceStageIndex];
        const destinationStage = stages[destinationStageIndex];

        // Find the lead being moved
        const [movedLead] = sourceStage.leads.splice(source.index, 1);

        if (!movedLead) return;

        // Add the lead to the destination stage
        destinationStage.leads.splice(destination.index, 0, movedLead);

        // Create new stages array immutably
        const updatedStages = stages.map((stage) => {
            if (stage.id === sourceStage.id) {
                return { ...stage, leads: [...sourceStage.leads] };
            }
            if (stage.id === destinationStage.id) {
                return { ...stage, leads: [...destinationStage.leads] };
            }
            return stage;
        });

        setStages(updatedStages);

        // Send update via WebSocket
        if (websocket) {
            websocket.send(
                JSON.stringify({
                    lead_id: draggableId,
                    new_stage_id: destinationStage.id,
                })
            );
        }
    };

    return (
        <div>
            <h1>Kanban Board</h1>
            <Link to="/add-lead">
                <button>Add Lead</button>
            </Link>
            <Link to="/add-stage">
                <button>Add Stage</button>
            </Link>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="kanban-board">
                    {stages.map((stage) => (
                        <Droppable key={stage.id} droppableId={stage.id.toString()}>
                            {(provided) => (
                                <div
                                    className="kanban-column"
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                >
                                    <h3>{stage.name}</h3>
                                    {stage.leads.map((lead, index) => (
                                        <Draggable
                                            key={lead.id}
                                            draggableId={lead.id.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    className="kanban-card"
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    onClick={() => handleEditLead(lead)}
                                                >
                                                    {lead.name}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
};

export default KanbanBoard;
