// import React, { useState } from "react";
// import KanbanBoard from "./components/KanbanBoard";
// import FormPage from "./components/FormPage";

// const App = () => {
//   const [selectedLeadId, setSelectedLeadId] = useState(null);

//   return (
//     <div className="App">
//     <div>
//     <button>Add lead</button>
//     </div>
//       {selectedLeadId ? (
//         <FormPage
//           leadId={selectedLeadId}
//           onFormSubmit={() => setSelectedLeadId(null)}
//         />
//       ) : (
//         <KanbanBoard onEditLead={setSelectedLeadId} />
//       )}
//     </div>
//   );
// };

// export default App;

// App.js
// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import KanbanBoard from "./components/KanbanBoard";
// import FormPage from "./components/FormPage";

// const App = () => (
//   <Router>
//     <Routes>
//       <Route path="/" element={<KanbanBoard />} />
//       <Route path="/edit-lead/:id" element={<FormPage />} />
//       <Route path="/add-lead" element={<FormPage />} />
//     </Routes>
//   </Router>
// );

// export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import KanbanBoard from "./components/KanbanBoard";
import FormPage from "./components/FormPage";
import AddStage from "./components/AddStage";
// import { useNavigate } from 'react-router-dom';

const App = () => {
    //  const navigate = useNavigate(); // Correctly define navigate here
    //  const handleEditLead = (leadId) => {
    //     // console.log(`Edit lead with ID: ${leadId}`);
    //     // Open modal, navigate, or perform any action
    //     console.log(`Edit lead with ID: ${leadId}`);
    //     // Pass the lead ID and other lead details via state
    //     const leadData = { id: leadId, name: "Lead Name", description: "Lead Description" }; // Example lead data
    //     navigate(`/edit-lead`, { state: leadData });
    // };
    return (
        <Router>
            <Routes>
                <Route path="/" element={<KanbanBoard />} />
                <Route path="/add-lead" element={<FormPage />} />
                 <Route path="/add-stage" element={<AddStage />} />
                <Route path="/edit-lead" element={<FormPage />} />
            </Routes>
        </Router>
    );
};

export default App;


