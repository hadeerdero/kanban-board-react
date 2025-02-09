
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import axios from "axios";

// const FormPage = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const { lead } = location.state || {};


//     const [formData, setFormData] = useState(
//         lead || { name: "", email: "", phone: "", stage: "" }
//     );
//     const [stages, setStages] = useState([]); // State to hold the stages list

//     // Fetch stages from the backend
//     useEffect(() => {
//         const fetchStages = async () => {
//             try {
//                  axios.defaults.baseURL = 'http://127.0.0.1:8000';
//                 const response = await axios.get("/api/stages/");
//                 setStages(response.data); // Assuming response.data is an array of stage objects
//                 if (!formData.stage && response.data.length > 0) {
//                     setFormData((prevData) => ({
//                         ...prevData,
//                         stage: response.data[0].id, // Set default stage if not already set
//                     }));
//                 }
//             } catch (error) {
//                 console.error("Error fetching stages:", error);
//             }
//         };

//         fetchStages();
//     }, [formData.stage]);

//     const handleChange = (e) => {
//         const { name, value } = e.target;
//         setFormData({ ...formData, [name]: value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();

//         try {
//             if (lead) {
//                 await axios.put(`/api/leads/${lead.id}/`, formData);
//             } else {
//                 await axios.post("/api/leads/", formData);
//             }
//             navigate("/");
//         } catch (error) {
//             console.error("Error submitting form:", error);
//         }
//     };

//     return (
//         <div>
         
//             <h1>{lead ? "Edit Lead" : "Add Lead"}</h1>
//             <form onSubmit={handleSubmit}>
//                 <input
//                     type="text"
//                     name="name"
//                     placeholder="Name"
//                     value={formData.name}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="email"
//                     name="email"
//                     placeholder="Email"
//                     value={formData.email}
//                     onChange={handleChange}
//                     required
//                 />
//                 <input
//                     type="tel"
//                     name="phone"
//                     placeholder="Phone"
//                     value={formData.phone}
//                     onChange={handleChange}
//                     required
//                 />
//                 <select
//                     name="stage"
//                     value={formData.stage}
//                     onChange={handleChange}
//                     required
//                 >
//                     <option value="" disabled>
//                         Select Stage
//                     </option>
//                     {stages.map((stage) => (
//                         <option key={stage.id} value={stage.id}>
//                             {stage.name}
//                         </option>
//                     ))}
//                 </select>
//                 <button type="submit">{lead ? "Update" : "Add"} Lead</button>
//             </form>
//         </div>
//     );
// };

// export default FormPage;



import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const FormPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { lead } = location.state || {};

    const [formData, setFormData] = useState(
        lead || { name: "", email: "", phone: "", stage: "" }
    );
    const [stages, setStages] = useState([]); // State to hold the stages list
    const socketRef = useRef(null); // WebSocket reference

    // Fetch stages from the backend
    useEffect(() => {
        const fetchStages = async () => {
            try {
                axios.defaults.baseURL = "http://127.0.0.1:8000";
                const response = await axios.get("/api/stages/");
                setStages(response.data); // Assuming response.data is an array of stage objects
                if (!formData.stage && response.data.length > 0) {
                    setFormData((prevData) => ({
                        ...prevData,
                        stage: response.data[0].id, // Set default stage if not already set
                    }));
                }
            } catch (error) {
                console.error("Error fetching stages:", error);
            }
        };

        fetchStages();
    }, [formData.stage]);

    // WebSocket setup
    useEffect(() => {
        const wsUrl = lead
            ? `ws://127.0.0.1:8000/ws/kanban/${lead.id}/`
            : `ws://127.0.0.1:8000/ws/kanban/`;

        socketRef.current = new WebSocket(wsUrl);

        socketRef.current.onopen = () => {
            console.log("WebSocket connected");
        };

        socketRef.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.lead_id === lead?.id) {
                // Update the form with the new stage if relevant
                setFormData((prev) => ({
                    ...prev,
                    stage: data.new_stage_id,
                }));
            }
        };

        socketRef.current.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        socketRef.current.onclose = () => {
            console.log("WebSocket closed");
        };

        return () => {
            if (socketRef.current) {
                socketRef.current.close();
            }
        };
    }, [lead]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (lead) {
                await axios.put(`/api/leads/${lead.id}/`, formData);
            } else {
                await axios.post("/api/leads/", formData);
            }
            navigate("/");
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };

    return (
        <div>
            <h1>{lead ? "Edit Lead" : "Add Lead"}</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
                <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                />
                <select
                    name="stage"
                    value={formData.stage}
                    onChange={handleChange}
                    required
                >
                    <option value="" disabled>
                        Select Stage
                    </option>
                    {stages.map((stage) => (
                        <option key={stage.id} value={stage.id}>
                            {stage.name}
                        </option>
                    ))}
                </select>
                <button type="submit">{lead ? "Update" : "Add"} Lead</button>
            </form>
        </div>
    );
};

export default FormPage;


