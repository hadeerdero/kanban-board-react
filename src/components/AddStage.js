import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddStage = () => {
    const [stageName, setStageName] = useState("");
    const navigate = useNavigate();

    const handleAddStage = async () => {
        if (!stageName.trim()) {
            alert("Stage name is required!");
            return;
        }

        try {
            axios.defaults.baseURL = 'http://127.0.0.1:8000';
            await axios.post("/api/stages/", { name: stageName });
            alert("Stage added successfully!");
            navigate("/");
        } catch (error) {
            console.error("Error adding stage:", error);
            alert("Failed to add stage.");
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Add Stage</h1>
            <div>
                <input
                    type="text"
                    placeholder="Stage Name"
                    value={stageName}
                    onChange={(e) => setStageName(e.target.value)}
                    style={{ padding: "10px", width: "300px" }}
                />
                <button
                    onClick={handleAddStage}
                    style={{
                        marginLeft: "10px",
                        padding: "10px 20px",
                        backgroundColor: "blue",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Add Stage
                </button>
            </div>
        </div>
    );
};

export default AddStage;
